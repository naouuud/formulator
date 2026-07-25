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

var ErrNotFound = errors.New("not found")
var ErrDuplicateSpreadID = errors.New("duplicate spreadID")

type Store struct {
	pool    *pgxpool.Pool
	queries *db.Queries
}

func New(pool *pgxpool.Pool) *Store {
	return &Store{pool: pool, queries: db.New(pool)}
}

func (s *Store) ListSpreadMetaData(ctx context.Context) ([]api.SpreadMetaDataDto, error) {
	rows, err := s.queries.ListSpreadMetaData(ctx)
	if err != nil {
		return nil, err
	}

	result := make([]api.SpreadMetaDataDto, 0, len(rows))
	for _, row := range rows {
		metaDataRow, err := api.SpreadMetaDataDtoFromRow(row)
		if err != nil {
			return nil, err
		}
		result = append(result, metaDataRow)
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

	return api.SpreadDtoFromRow(row), nil
}

func (s *Store) CreateSpread(ctx context.Context) (api.SpreadDto, error) {
	schema, err := api.DefaultSchemaJSON()
	if err != nil {
		return api.SpreadDto{}, err
	}

	now := time.Now().UTC()
	id := uuid.New()
	row, err := s.queries.CreateSpread(ctx, db.CreateSpreadParams{
		ID:             pgtype.UUID{Bytes: id, Valid: true},
		Version:        0,
		Ectm:           pgtype.Int4{},
		Schema:         schema,
		CreatedAt:      api.TimeToPgTimestamptz(now),
		LastModifiedAt: api.TimeToPgTimestamptz(now),
	})
	if err != nil {
		return api.SpreadDto{}, err
	}

	return api.SpreadDtoFromRow(row), nil
}

func (s *Store) CreateSpreadWithId(ctx context.Context, id pgtype.UUID) (api.SpreadDto, error) {
	schema, err := api.DefaultSchemaJSON()
	if err != nil {
		return api.SpreadDto{}, err
	}

  if _, err := s.queries.GetSpread(ctx, id); err == nil {
    return api.SpreadDto{}, ErrDuplicateSpreadID
	} else if !errors.Is(err, pgx.ErrNoRows) {
    return api.SpreadDto{}, err
  }

	now := time.Now().UTC()
	row, err := s.queries.CreateSpread(ctx, db.CreateSpreadParams{
		ID:             id,
		Version:        0,
		Ectm:           pgtype.Int4{},
		Schema:         schema,
		CreatedAt:      api.TimeToPgTimestamptz(now),
		LastModifiedAt: api.TimeToPgTimestamptz(now),
	})
	if err != nil {
		return api.SpreadDto{}, err
	}

	return api.SpreadDtoFromRow(row), nil
}

func (s *Store) UpdateSpread(ctx context.Context, spread api.SpreadDto) (api.SpreadDto, error) {
	id, err := api.ParseUUID(spread.ID)
	if err != nil {
		return api.SpreadDto{}, err
	}

	if len(spread.Schema) == 0 || !json.Valid(spread.Schema) {
		return api.SpreadDto{}, errors.New("schema must be valid JSON")
	}

	row, err := s.queries.UpdateSpread(ctx, db.UpdateSpreadParams{
		ID:      id,
		Ectm:    api.Int32ToPgInt4(spread.Ectm),
		Schema:  spread.Schema,
		Version: spread.Version,
	})
	if err == nil {
		return api.SpreadDtoFromRow(row), nil
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
	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)

	if _, err := qtx.NullSpreadId(ctx, id); err != nil {
		return err
	}

	rows, err := qtx.DeleteSpread(ctx, id)
	if err != nil {
		return err
	}

	if rows == 0 {
		return ErrNotFound
	}

	return tx.Commit(ctx)
}

func (s *Store) ListSnapMetaData(ctx context.Context) ([]api.SnapMetaDataDto, error) {
	rows, err := s.queries.ListSnapMetaData(ctx)
	if err != nil {
		return nil, err
	}

	result := make([]api.SnapMetaDataDto, 0, len(rows))
	for _, row := range rows {
		metaDataRow, err := api.SnapMetaDataDtoFromRow(row)
		if err != nil {
			return nil, err
		}
		result = append(result, metaDataRow)
	}

	return result, nil
}

func (s *Store) ListSnapMetaDataBySpreadId(ctx context.Context, spreadID pgtype.UUID) ([]api.SnapMetaDataDto, error) {
	rows, err := s.queries.ListSnapMetaDataBySpreadId(ctx, spreadID)
	if err != nil {
		return nil, err
	}

	result := make([]api.SnapMetaDataDto, 0, len(rows))
	for _, row := range rows {
		metaDataRow, err := api.SnapMetaDataDtoFromBySpreadIdRow(row)
		if err != nil {
			return nil, err
		}
		result = append(result, metaDataRow)
	}

	return result, nil
}

func (s *Store) GetSnap(ctx context.Context, id pgtype.UUID) (api.SnapDto, error) {
	row, err := s.queries.GetSnap(ctx, id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return api.SnapDto{}, ErrNotFound
		}
		return api.SnapDto{}, err
	}

	return api.SnapDtoFromGetSnapRow(row), nil
}

func (s *Store) CreateSnap(ctx context.Context, spreadID pgtype.UUID) (api.SnapDto, error) {
	spread, err := s.queries.GetSpread(ctx, spreadID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return api.SnapDto{}, ErrNotFound
		}
		return api.SnapDto{}, err
	}

	latest, err := s.queries.LatestEdition(ctx, spreadID)
	if err != nil {
		if !errors.Is(err, pgx.ErrNoRows) {
			return api.SnapDto{}, err
		}
	}

	now := time.Now().UTC()
	id := uuid.New()

	row, err := s.queries.CreateSnap(ctx, db.CreateSnapParams{
		ID:            pgtype.UUID{Bytes: id, Valid: true},
		SpreadID:      spreadID,
		SpreadVersion: spread.Version,
		Edition:       latest + 1,
		Schema:        spread.Schema,
		PublishedAt:   api.TimeToPgTimestamptz(now),
	})
	if err != nil {
		return api.SnapDto{}, err
	}

	return api.SnapDtoFromCreateSnapRow(row), nil
}

func (s *Store) DeleteSnap(ctx context.Context, id pgtype.UUID) error {
	rows, err := s.queries.DeleteSnap(ctx, id)
	if err != nil {
		return err
	}

	if rows == 0 {
		return ErrNotFound
	}

	return nil
}

func (s *Store) ListSpillMetaData(ctx context.Context, snapID pgtype.UUID) ([]api.SpillMetaDataDto, error) {
	rows, err := s.queries.ListSpillMetaDataBySnapId(ctx, snapID)
	if err != nil {
		return nil, err
	}

	spillMetaData := make([]api.SpillMetaDataDto, 0, len(rows))
	for _, row := range rows {
		spillMetaData = append(spillMetaData, api.SpillMetaDataDtoFromList(row))
	}

	return spillMetaData, nil
}

func (s *Store) CreateSpill(ctx context.Context, snapID pgtype.UUID, email, firstName, lastName string) (api.SpillMetaDataDto, error) {
	_, err := s.queries.GetSnap(ctx, snapID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return api.SpillMetaDataDto{}, ErrNotFound
		}
		return api.SpillMetaDataDto{}, err
	}

	id := uuid.New()
  rSchema := []byte("{}")
	spill, err := s.queries.CreateSpill(ctx, db.CreateSpillParams{
		ID:        pgtype.UUID{Bytes: id, Valid: true},
		SnapID:    snapID,
		Email:     email,
		FirstName: firstName,
		LastName:  lastName,
		RSchema:   rSchema,
	})
	if err != nil {
		return api.SpillMetaDataDto{}, err
	}

	return api.SpillMetaDataDtoFromCreate(spill), nil
}

func (s *Store) DeleteSpill(ctx context.Context, spillID pgtype.UUID) error {
	rows, err := s.queries.DeleteSpill(ctx, spillID)
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
