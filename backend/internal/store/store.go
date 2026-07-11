package store

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"

	"formulator/backend/internal/api"
	"formulator/backend/internal/store/db"
)

var ErrNotFound = errors.New("spread not found")

type Store struct {
	queries *db.Queries
}

func New(pool *pgxpool.Pool) *Store {
	return &Store{queries: db.New(pool)}
}

func (s *Store) ListSpreadMetaData(ctx context.Context) ([]api.SpreadMetaDataDto, error) {
	rows, err := s.queries.ListSpreadMetaData(ctx)
	if err != nil {
		return nil, err
	}

	result := make([]api.SpreadMetaDataDto, 0, len(rows))
	for _, row := range rows {
		result = append(result, api.SpreadMetaDataFromRow(row))
	}

	return result, nil
}

func (s *Store) GetSpread(ctx context.Context, id pgtype.UUID) (api.SpreadDto, error) {
	row, err := s.queries.GetSpread(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return api.SpreadDto{}, ErrNotFound
		}

		return api.SpreadDto{}, err
	}

	return api.SpreadFromRow(row), nil
}

func (s *Store) CreateSpread(ctx context.Context) (api.SpreadDto, error) {
	pages, err := api.DefaultPagesJSON()
	if err != nil {
		return api.SpreadDto{}, err
	}

	now := time.Now().UTC()
	id := uuid.New()

	row, err := s.queries.CreateSpread(ctx, db.CreateSpreadParams{
		ID:             pgtype.UUID{Bytes: id, Valid: true},
		Title:          "",
		Version:        0,
		Ectm:           pgtype.Int4{},
		Pages:          pages,
		CreatedAt:      api.TimeToPgTimestamptz(now),
		LastModifiedAt: api.TimeToPgTimestamptz(now),
	})
	if err != nil {
		return api.SpreadDto{}, err
	}

	return api.SpreadFromRow(row), nil
}

func (s *Store) UpdateSpread(ctx context.Context, spread api.SpreadDto) (api.SpreadDto, error) {
	id, err := api.ParseUUID(spread.ID)
	if err != nil {
		return api.SpreadDto{}, err
	}

	if len(spread.Pages) == 0 || !json.Valid(spread.Pages) {
		return api.SpreadDto{}, errors.New("pages must be valid JSON")
	}

	row, err := s.queries.UpdateSpread(ctx, db.UpdateSpreadParams{
		ID:      id,
		Title:   spread.Title,
		Ectm:    api.Int32ToPgInt4(spread.Ectm),
		Pages:   spread.Pages,
		Version: spread.Version,
	})
	if err == nil {
		return api.SpreadFromRow(row), nil
	}

	if !errors.Is(err, pgx.ErrNoRows) {
		return api.SpreadDto{}, err
	}

	currentVersion, err := s.queries.GetSpreadVersion(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return api.SpreadDto{}, ErrNotFound
		}

		return api.SpreadDto{}, err
	}

	return api.SpreadDto{}, &VersionConflictError{
		ExpectedVersion: spread.Version,
		ActualVersion:   currentVersion,
	}
}

func (s *Store) DeleteSpread(ctx context.Context, id pgtype.UUID) error {
	rows, err := s.queries.DeleteSpread(ctx, id)
	if err != nil {
		return err
	}

	if rows == 0 {
		return ErrNotFound
	}

	return nil
}

type VersionConflictError struct {
	ExpectedVersion int32
	ActualVersion   int32
}

func (e *VersionConflictError) Error() string {
	return "version conflict"
}