package api

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"

	"formulator/backend/internal/store/db"
)

type SpreadMetaDataDto struct {
	ID             string     `json:"id"`
	Title          string     `json:"title"`
	CreatedAt      *time.Time `json:"createdAt"`
	LastModifiedAt *time.Time `json:"lastModifiedAt"`
}

type SpreadDto struct {
	SpreadMetaDataDto
	Version int32           `json:"version"`
	Ectm    *int32          `json:"ectm"`
	Pages   json.RawMessage `json:"pages"`
}

func SpreadMetaDataFromRow(row db.ListSpreadMetaDataRow) SpreadMetaDataDto {
	return SpreadMetaDataDto{
		ID:             uuidToString(row.ID),
		Title:          row.Title,
		CreatedAt:      timestamptzToPtr(row.CreatedAt),
		LastModifiedAt: timestamptzToPtr(row.LastModifiedAt),
	}
}

func SpreadFromRow(row db.Spread) SpreadDto {
	return SpreadDto{
		SpreadMetaDataDto: SpreadMetaDataDto{
			ID:             uuidToString(row.ID),
			Title:          row.Title,
			CreatedAt:      timestamptzToPtr(row.CreatedAt),
			LastModifiedAt: timestamptzToPtr(row.LastModifiedAt),
		},
		Version: row.Version,
		Ectm:    int4ToPtr(row.Ectm),
		Pages:   append(json.RawMessage(nil), row.Pages...),
	}
}

func DefaultPagesJSON() (json.RawMessage, error) {
	page := struct {
		ID       string        `json:"id"`
		Title    string        `json:"title"`
		Elements []interface{} `json:"elements"`
	}{
		ID:       uuid.New().String(),
		Title:    "",
		Elements: []interface{}{},
	}

	raw, err := json.Marshal([]interface{}{page})
	if err != nil {
		return nil, err
	}

	return raw, nil
}

func uuidToString(value pgtype.UUID) string {
	if !value.Valid {
		return ""
	}

	id, err := uuid.FromBytes(value.Bytes[:])
	if err != nil {
		return ""
	}

	return id.String()
}

func timestamptzToPtr(value pgtype.Timestamptz) *time.Time {
	if !value.Valid {
		return nil
	}

	t := value.Time
	return &t
}

func int4ToPtr(value pgtype.Int4) *int32 {
	if !value.Valid {
		return nil
	}

	v := value.Int32
	return &v
}

func ParseUUID(id string) (pgtype.UUID, error) {
	parsed, err := uuid.Parse(id)
	if err != nil {
		return pgtype.UUID{}, err
	}

	return pgtype.UUID{Bytes: parsed, Valid: true}, nil
}

func Int32ToPgInt4(value *int32) pgtype.Int4 {
	if value == nil {
		return pgtype.Int4{}
	}

	return pgtype.Int4{Int32: *value, Valid: true}
}

func TimeToPgTimestamptz(value time.Time) pgtype.Timestamptz {
	return pgtype.Timestamptz{Time: value, Valid: true}
}
