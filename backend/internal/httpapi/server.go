package httpapi

import (
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

	"formulator/backend/internal/api"
	"formulator/backend/internal/apperrors"
	"formulator/backend/internal/store"
)

type Server struct {
	store      *store.Store
	corsOrigin string
	logger     *slog.Logger
}

func NewServer(store *store.Store, corsOrigin string, logger *slog.Logger) *Server {
	return &Server{
		store:      store,
		corsOrigin: corsOrigin,
		logger:     logger,
	}
}

func (s *Server) Router() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Recoverer)
	r.Use(s.corsMiddleware)

	r.Get("/healthz", s.handleHealth)

	r.Route("/spreads", func(r chi.Router) {
		r.Get("/", s.handleListSpreads)
		r.Post("/", s.handleCreateSpread)
		r.Route("/{id}", func(r chi.Router) {
			r.Get("/", s.handleGetSpread)
			r.Put("/", s.handleUpdateSpread)
			r.Delete("/", s.handleDeleteSpread)
		})
	})

	return r
}

func (s *Server) handleHealth(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (s *Server) handleListSpreads(w http.ResponseWriter, r *http.Request) {
	spreads, err := s.store.ListSpreadMetaData(r.Context())
	if err != nil {
		s.logger.Error("list spreads", "error", err)
		writeJSON(w, http.StatusInternalServerError, apperrors.ProblemDetail{
			Status: http.StatusInternalServerError,
			Title:  "Internal server error",
			Code:   "INTERNAL_ERROR",
		})
		return
	}

	writeJSON(w, http.StatusOK, spreads)
}

func (s *Server) handleCreateSpread(w http.ResponseWriter, r *http.Request) {
	if _, err := io.ReadAll(r.Body); err != nil {
		writeJSON(w, http.StatusBadRequest, apperrors.ProblemDetail{
			Status: http.StatusBadRequest,
			Title:  "Invalid request body",
			Code:   "INVALID_REQUEST",
		})
		return
	}

	spread, err := s.store.CreateSpread(r.Context())
	if err != nil {
		s.logger.Error("create spread", "error", err)
		writeJSON(w, http.StatusInternalServerError, apperrors.ProblemDetail{
			Status: http.StatusInternalServerError,
			Title:  "Internal server error",
			Code:   "INTERNAL_ERROR",
		})
		return
	}

	writeJSON(w, http.StatusCreated, spread)
}

func (s *Server) handleGetSpread(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	parsedID, err := api.ParseUUID(id)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apperrors.ProblemDetail{
			Status: http.StatusBadRequest,
			Title:  "Invalid spread id",
			Code:   "INVALID_REQUEST",
		})
		return
	}

	spread, err := s.store.GetSpread(r.Context(), parsedID)
	if err != nil {
		if errors.Is(err, store.ErrNotFound) {
			writeJSON(w, http.StatusNotFound, apperrors.SpreadNotFound(id))
			return
		}

		s.logger.Error("get spread", "error", err, "id", id)
		writeJSON(w, http.StatusInternalServerError, apperrors.ProblemDetail{
			Status: http.StatusInternalServerError,
			Title:  "Internal server error",
			Code:   "INTERNAL_ERROR",
		})
		return
	}

	writeJSON(w, http.StatusOK, spread)
}

func (s *Server) handleUpdateSpread(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var spread api.SpreadDto
	if err := json.NewDecoder(r.Body).Decode(&spread); err != nil {
		writeJSON(w, http.StatusBadRequest, apperrors.ProblemDetail{
			Status: http.StatusBadRequest,
			Title:  "Invalid request body",
			Code:   "INVALID_REQUEST",
		})
		return
	}

	if spread.ID != id {
		writeJSON(w, http.StatusBadRequest, apperrors.ProblemDetail{
			Status: http.StatusBadRequest,
			Title:  "Spread id in path and body must match",
			Code:   "INVALID_REQUEST",
		})
		return
	}

	updated, err := s.store.UpdateSpread(r.Context(), spread)
	if err != nil {
		var conflict *store.VersionConflictError
		switch {
		case errors.As(err, &conflict):
			writeJSON(w, http.StatusConflict, apperrors.VersionConflict(conflict.ExpectedVersion, conflict.ActualVersion))
		case errors.Is(err, store.ErrNotFound):
			writeJSON(w, http.StatusNotFound, apperrors.SpreadNotFound(id))
		default:
			s.logger.Error("update spread", "error", err, "id", id)
			writeJSON(w, http.StatusInternalServerError, apperrors.ProblemDetail{
				Status: http.StatusInternalServerError,
				Title:  "Internal server error",
				Code:   "INTERNAL_ERROR",
			})
		}
		return
	}

	writeJSON(w, http.StatusOK, updated)
}

func (s *Server) handleDeleteSpread(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	parsedID, err := api.ParseUUID(id)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apperrors.ProblemDetail{
			Status: http.StatusBadRequest,
			Title:  "Invalid spread id",
			Code:   "INVALID_REQUEST",
		})
		return
	}

	if err := s.store.DeleteSpread(r.Context(), parsedID); err != nil {
		if errors.Is(err, store.ErrNotFound) {
			writeJSON(w, http.StatusNotFound, apperrors.SpreadNotFound(id))
			return
		}

		s.logger.Error("delete spread", "error", err, "id", id)
		writeJSON(w, http.StatusInternalServerError, apperrors.ProblemDetail{
			Status: http.StatusInternalServerError,
			Title:  "Internal server error",
			Code:   "INTERNAL_ERROR",
		})
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", s.corsOrigin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	if payload == nil {
		return
	}

	_ = json.NewEncoder(w).Encode(payload)
}
