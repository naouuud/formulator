package api

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"

	"formulator/backend/internal/store/db"
)

type SpreadMetaDataDto struct {
	ID             string     `json:"id"`
	SpreadTitle    string     `json:"spreadTitle"`
	CreatedAt      *time.Time `json:"createdAt"`
	LastModifiedAt *time.Time `json:"lastModifiedAt"`
}

type SpreadDto struct {
	ID             string          `json:"id"`
	SpreadTitle    string          `json:"spreadTitle"`
	Version        int32           `json:"version"`
	Schema         json.RawMessage `json:"schema"`
	CreatedAt      *time.Time      `json:"createdAt"`
	LastModifiedAt *time.Time      `json:"lastModifiedAt"`
}

func SpreadMetaDataDtoFromRow(row db.ListSpreadMetaDataRow) (SpreadMetaDataDto, error) {
	return SpreadMetaDataDto{
		ID:             uuidToString(row.ID),
		SpreadTitle:    row.SpreadTitle,
		CreatedAt:      timestamptzToPtr(row.CreatedAt),
		LastModifiedAt: timestamptzToPtr(row.LastModifiedAt),
	}, nil
}

func SpreadDtoFromRow(row db.Spread) SpreadDto {
	return SpreadDto{
		ID:             uuidToString(row.ID),
		SpreadTitle:    row.SpreadTitle,
		Version:        row.Version,
		Schema:         append(json.RawMessage(nil), row.Schema...),
		CreatedAt:      timestamptzToPtr(row.CreatedAt),
		LastModifiedAt: timestamptzToPtr(row.LastModifiedAt),
	}
}

func DefaultSchemaJSON() (json.RawMessage, error) {
	type Page struct {
		ID       string        `json:"id"`
		Title    string        `json:"title"`
		Elements []interface{} `json:"elements"`
	}
	type Schema struct {
		Title string `json:"title"`
		Pages []Page `json:"pages"`
	}
	page := Page{
		ID:       uuid.New().String(),
		Title:    "",
		Elements: []interface{}{},
	}
	schema := Schema{
		Title: "",
		Pages: []Page{page},
	}
	raw, err := json.Marshal(schema)
	if err != nil {
		return nil, err
	}
	return raw, nil
}
