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

	r.Route("/snaps", func(r chi.Router) {
		r.Get("/", s.handleListSnaps)
		r.Post("/", s.handleCreateSnap)
		r.Route("/{id}", func(r chi.Router) {
			r.Get("/", s.handleGetSnap)
			r.Delete("/", s.handleDeleteSnap)
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
		writeJSON(w, http.StatusInternalServerError, apperrors.InternalError())
		return
	}

	writeJSON(w, http.StatusOK, spreads)
}

func (s *Server) handleCreateSpread(w http.ResponseWriter, r *http.Request) {
	if _, err := io.ReadAll(r.Body); err != nil {
		writeJSON(w, http.StatusBadRequest, apperrors.InvalidRequestBody())
		return
	}

	spread, err := s.store.CreateSpread(r.Context())
	if err != nil {
		s.logger.Error("create spread", "error", err)
		writeJSON(w, http.StatusInternalServerError, apperrors.InternalError())
		return
	}

	writeJSON(w, http.StatusCreated, spread)
}

func (s *Server) handleGetSpread(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	parsedID, err := api.ParseUUID(id)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apperrors.InvalidUUID("id"))
		return
	}

	spread, err := s.store.GetSpread(r.Context(), parsedID)
	if err != nil {
		if errors.Is(err, store.ErrNotFound) {
			writeJSON(w, http.StatusNotFound, apperrors.SpreadNotFound(id))
			return
		}

		s.logger.Error("get spread", "error", err, "id", id)
		writeJSON(w, http.StatusInternalServerError, apperrors.InternalError())
		return
	}

	writeJSON(w, http.StatusOK, spread)
}

func (s *Server) handleUpdateSpread(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var spread api.SpreadDto
	if err := json.NewDecoder(r.Body).Decode(&spread); err != nil {
		writeJSON(w, http.StatusBadRequest, apperrors.InvalidRequestBody())
		return
	}

	if spread.ID != id {
		writeJSON(w, http.StatusBadRequest, apperrors.SpreadIdMismatch())
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
			writeJSON(w, http.StatusInternalServerError, apperrors.InternalError())
		}
		return
	}

	writeJSON(w, http.StatusOK, updated)
}

func (s *Server) handleDeleteSpread(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	parsedID, err := api.ParseUUID(id)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apperrors.InvalidUUID("id"))
		return
	}

	if err := s.store.DeleteSpread(r.Context(), parsedID); err != nil {
		if errors.Is(err, store.ErrNotFound) {
			writeJSON(w, http.StatusNotFound, apperrors.SpreadNotFound(id))
			return
		}

		s.logger.Error("delete spread", "error", err, "id", id)
		writeJSON(w, http.StatusInternalServerError, apperrors.InternalError())
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (s *Server) handleListSnaps(w http.ResponseWriter, r *http.Request) {
	hasSpreadID := r.URL.Query().Has("spreadId")
	if !hasSpreadID {
		metaDataList, err := s.store.ListSnapMetaData(r.Context())
		if err != nil {
			s.logger.Error("list snaps", "error", err)
			writeJSON(w, http.StatusInternalServerError, apperrors.InternalError())
			return
		}
		writeJSON(w, http.StatusOK, metaDataList)
		return
	}
	spreadID := r.URL.Query().Get("spreadId")
	if len(spreadID) == 0 {
		writeJSON(w, http.StatusBadRequest, apperrors.SpreadIdRequired())
		return
	}
	parsedID, err := api.ParseUUID(spreadID)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apperrors.InvalidUUID("spreadId"))
		return
	}
	metaDataList, err := s.store.ListSnapMetaDataBySpreadId(r.Context(), parsedID)
	if err != nil {
		s.logger.Error("list snaps", "error", err)
		writeJSON(w, http.StatusInternalServerError, apperrors.InternalError())
		return
	}

	writeJSON(w, http.StatusOK, metaDataList)
}

func (s *Server) handleCreateSnap(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apperrors.InvalidRequestBody())
		return
	}

	var req struct {
		SpreadID string `json:"spreadId"`
	}
	if err := json.Unmarshal(body, &req); err != nil {
		writeJSON(w, http.StatusBadRequest, apperrors.InvalidRequestBody())
		return
	}

	if req.SpreadID == "" {
		writeJSON(w, http.StatusBadRequest, apperrors.SpreadIdRequired())
		return
	}

	parsedID, err := api.ParseUUID(req.SpreadID)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apperrors.InvalidUUID("spreadId"))
		return
	}

	snap, err := s.store.CreateSnap(r.Context(), parsedID)
	if err != nil {
		if errors.Is(err, store.ErrNotFound) {
			writeJSON(w, http.StatusNotFound, apperrors.SpreadNotFound(req.SpreadID))
			return
		}
		s.logger.Error("create snap", "error", err)
		writeJSON(w, http.StatusInternalServerError, apperrors.InternalError())
		return
	}

	writeJSON(w, http.StatusCreated, snap)
}

func (s *Server) handleGetSnap(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	parsedID, err := api.ParseUUID(id)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apperrors.InvalidUUID("id"))
		return
	}

	snap, err := s.store.GetSnap(r.Context(), parsedID)
	if err != nil {
		if errors.Is(err, store.ErrNotFound) {
			writeJSON(w, http.StatusNotFound, apperrors.SnapNotFound(id))
			return
		}

		s.logger.Error("get snap", "error", err, "id", id)
		writeJSON(w, http.StatusInternalServerError, apperrors.InternalError())
		return
	}

	writeJSON(w, http.StatusOK, snap)
}

func (s *Server) handleDeleteSnap(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	parsedID, err := api.ParseUUID(id)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apperrors.InvalidUUID("id"))
		return
	}

	if err := s.store.DeleteSnap(r.Context(), parsedID); err != nil {
		if errors.Is(err, store.ErrNotFound) {
			writeJSON(w, http.StatusNotFound, apperrors.SnapNotFound(id))
			return
		}

		s.logger.Error("delete snap", "error", err, "id", id)
		writeJSON(w, http.StatusInternalServerError, apperrors.InternalError())
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
