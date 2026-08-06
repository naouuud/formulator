package httpapi

import (
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5/pgtype"

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

	r.Route("/spills", func(r chi.Router) {
		r.Get("/", s.handleListSpills)
		r.Post("/", s.handleCreateSpill)
		r.Route("/{id}", func(r chi.Router) {
			r.Delete("/", s.handleDeleteSpill)
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
	var req struct {
		SpreadTitle string `json:"spreadTitle"`
		ID          string `json:"id"`
	}
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apperrors.InvalidRequestBody())
		return
	}

	spreadTitle := strings.TrimSpace(req.SpreadTitle)
	if spreadTitle == "" {
		writeJSON(w, http.StatusBadRequest, apperrors.InvalidRequestBodyDetail("spreadTitle is required."))
		return
	}

	count, err := s.store.GetCountBySpreadTitle(r.Context(), spreadTitle)
	if err != nil {
		s.logger.Error("create spread", "error", err)
		writeJSON(w, http.StatusInternalServerError, apperrors.InternalError())
		return
	}

	if count > 0 {
		writeJSON(w, http.StatusConflict, apperrors.ProblemDetail{
			Status: http.StatusConflict,
			Title:  "Conflict",
			Detail: "duplicate spread title.",
			Code:   apperrors.CodeConflict,
		})
		return
	}

	if req.ID == "" {
		spread, err := s.store.CreateSpread(r.Context(), spreadTitle)
		if err != nil {
			s.logger.Error("create spread", "error", err)
			writeJSON(w, http.StatusInternalServerError, apperrors.InternalError())
			return
		}

		writeJSON(w, http.StatusCreated, spread)
		return
	}

	parsedID, err := api.ParseUUID(req.ID)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apperrors.InvalidRequestBodyDetail("id must be a valid UUID."))
		return
	}

	spread, err := s.store.CreateSpreadWithId(r.Context(), spreadTitle, parsedID)
	if err != nil {
		if errors.Is(err, store.ErrDuplicateSpreadID) {
			writeJSON(w, http.StatusConflict, apperrors.ProblemDetail{
				Status: http.StatusConflict,
				Title:  "Conflict",
				Detail: "duplicate id",
				Code:   apperrors.CodeConflict,
			})
			return
		}
		s.logger.Error("create spread", "error", err)
		writeJSON(w, http.StatusInternalServerError, apperrors.InternalError())
		return
	}

	writeJSON(w, http.StatusCreated, spread)
}

func (s *Server) handleGetSpread(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	parsedID := checkUUID(w, id, "id")
	if !parsedID.Valid {
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

	spreadTitle := strings.TrimSpace(spread.SpreadTitle)
	if spreadTitle == "" {
		writeJSON(w, http.StatusBadRequest, apperrors.InvalidRequestBodyDetail("spreadTitle is required."))
		return
	}
	spread.SpreadTitle = spreadTitle

	parsedID, err := api.ParseUUID(spread.ID)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apperrors.InvalidRequestBodyDetail("id must be a valid UUID."))
		return
	}

	count, err := s.store.GetCountBySpreadTitleExcludingId(r.Context(), spreadTitle, parsedID)
	if err != nil {
		s.logger.Error("update spread", "error", err, "id", id)
		writeJSON(w, http.StatusInternalServerError, apperrors.InternalError())
		return
	}
	if count > 0 {
		writeJSON(w, http.StatusConflict, apperrors.ProblemDetail{
			Status: http.StatusConflict,
			Title:  "Conflict",
			Detail: "duplicate spread title.",
			Code:   apperrors.CodeConflict,
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
			writeJSON(w, http.StatusInternalServerError, apperrors.InternalError())
		}
		return
	}

	writeJSON(w, http.StatusOK, updated)
}

func (s *Server) handleDeleteSpread(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	parsedID := checkUUID(w, id, "id")
	if !parsedID.Valid {
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
	parsedID := checkUUID(w, spreadID, "spreadId")
	if !parsedID.Valid {
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

	var payload struct {
		SpreadID  string `json:"spreadId"`
		SnapTitle string `json:"snapTitle"`
	}
	if err := json.Unmarshal(body, &payload); err != nil {
		writeJSON(w, http.StatusBadRequest, apperrors.InvalidRequestBody())
		return
	}

	if payload.SpreadID == "" {
		writeJSON(w, http.StatusBadRequest, apperrors.InvalidRequestBodyDetail("spreadId is required"))
		return
	}

	snapTitle := strings.TrimSpace(payload.SnapTitle)
	if snapTitle == "" {
		writeJSON(w, http.StatusBadRequest, apperrors.InvalidRequestBodyDetail("snapTitle is required"))
		return
	}

	parsedID, err := api.ParseUUID(payload.SpreadID)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apperrors.InvalidRequestBodyDetail("spreadId must be a valid UUID"))
		return
	}

	snap, err := s.store.CreateSnap(r.Context(), parsedID, snapTitle)
	if err != nil {
		if errors.Is(err, store.ErrNotFound) {
			writeJSON(w, http.StatusNotFound, apperrors.SpreadNotFound(payload.SpreadID))
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
	parsedID := checkUUID(w, id, "id")
	if !parsedID.Valid {
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
	parsedID := checkUUID(w, id, "id")
	if !parsedID.Valid {
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

func (s *Server) handleListSpills(w http.ResponseWriter, r *http.Request) {
	snapID := r.URL.Query().Get("snapId")
	parsedID := checkUUID(w, snapID, "snapId")
	if !parsedID.Valid {
		return
	}

	spills, err := s.store.ListSpillMetaData(r.Context(), parsedID)
	if err != nil {
		s.logger.Error("list spills", "error", err)
		writeJSON(w, http.StatusInternalServerError, apperrors.InternalError())
		return
	}

	writeJSON(w, http.StatusOK, spills)
}

type CreateSpillRequest struct {
	SnapID    string     `json:"snapId"`
	Email     string     `json:"email"`
	FirstName string     `json:"firstName"`
	LastName  string     `json:"lastName"`
	SentAt    *time.Time `json:"sentAt"`
}

func (s *Server) handleCreateSpill(w http.ResponseWriter, r *http.Request) {
	body, err := io.ReadAll(r.Body)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apperrors.InvalidRequestBody())
		return
	}
	var req CreateSpillRequest
	if err := json.Unmarshal(body, &req); err != nil {
		writeJSON(w, http.StatusBadRequest, apperrors.InvalidRequestBody())
		return
	}
	if req.SnapID == "" || req.Email == "" {
		writeJSON(w, http.StatusBadRequest, apperrors.InvalidRequestBodyDetail("snapId and email are required"))
		return
	}
	parsedID, err := api.ParseUUID(req.SnapID)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apperrors.InvalidRequestBodyDetail("snapId must be a valid UUID"))
		return
	}
	sentAt := api.TimePtrToPgTimestamptzDefaultNow(req.SentAt)

	spill, err := s.store.CreateSpill(r.Context(), parsedID, req.Email, req.FirstName, req.LastName, sentAt)
	if err != nil {
		if errors.Is(err, store.ErrNotFound) {
			writeJSON(w, http.StatusNotFound, apperrors.SnapNotFound(req.SnapID))
			return
		}
		s.logger.Error("create spill", "error", err)
		writeJSON(w, http.StatusInternalServerError, apperrors.InternalError())
		return
	}

	writeJSON(w, http.StatusCreated, spill)
}

func (s *Server) handleDeleteSpill(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	parsedID := checkUUID(w, id, "id")
	if !parsedID.Valid {
		return
	}

	if err := s.store.DeleteSpill(r.Context(), parsedID); err != nil {
		if errors.Is(err, store.ErrNotFound) {
			writeJSON(w, http.StatusNotFound, apperrors.SpillNotFound(id))
			return
		}
		s.logger.Error("delete spill", "error", err)
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

func checkUUID(w http.ResponseWriter, id string, field string) (parsedID pgtype.UUID) {
	if id == "" {
		writeJSON(w, http.StatusBadRequest, apperrors.MissingUUID(field))
		return
	}
	parsedID, err := api.ParseUUID(id)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, apperrors.InvalidUUID(field))
	}
	return
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	if payload == nil {
		return
	}

	_ = json.NewEncoder(w).Encode(payload)
}
