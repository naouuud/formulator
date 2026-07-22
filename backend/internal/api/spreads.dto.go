package api

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"

	"formulator/backend/internal/store/db"
)

type SpreadMetaDataDto struct {
	ID             string     `json:"id"`
	Title          string     `json:"title"`
	CreatedAt      *time.Time `json:"createdAt"`
	LastModifiedAt *time.Time `json:"lastModifiedAt"`
}

type SpreadDto struct {
	ID             string          `json:"id"`
	Version        int32           `json:"version"`
	Ectm           *int32          `json:"ectm"`
	Schema         json.RawMessage `json:"schema"`
	CreatedAt      *time.Time      `json:"createdAt"`
	LastModifiedAt *time.Time      `json:"lastModifiedAt"`
}

func SpreadMetaDataDtoFromRow(row db.ListSpreadMetaDataRow) (SpreadMetaDataDto, error) {
	var schema struct {
		Title string `json:"title"`
	}
	err := json.Unmarshal(row.Schema, &schema)
	if err != nil {
		return SpreadMetaDataDto{}, err
	}

	return SpreadMetaDataDto{
		ID:             uuidToString(row.ID),
		Title:          schema.Title,
		CreatedAt:      timestamptzToPtr(row.CreatedAt),
		LastModifiedAt: timestamptzToPtr(row.LastModifiedAt),
	}, nil
}

func SpreadDtoFromRow(row db.Spread) SpreadDto {
	return SpreadDto{
		ID:             uuidToString(row.ID),
		Version:        row.Version,
		Ectm:           int4ToPtr(row.Ectm),
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
