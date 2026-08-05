package api

import (
	"encoding/json"
	"formulator/backend/internal/store/db"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

type SnapMetaDataDto struct {
	ID            string     `json:"id"`
	SpreadID      *string    `json:"spreadId"`
	SpreadVersion int32      `json:"spreadVersion"`
	Edition       int32      `json:"edition"`
	Title         string     `json:"title"`
	PublishedAt   *time.Time `json:"publishedAt"`
}

type SnapDto struct {
	ID            string          `json:"id"`
	SpreadID      *string         `json:"spreadId"`
	SpreadVersion int32           `json:"spreadVersion"`
	Edition       int32           `json:"edition"`
	Schema        json.RawMessage `json:"schema"`
	PublishedAt   *time.Time      `json:"publishedAt"`
}

func snapMetaDataDtoFromFields(
	id, spreadID pgtype.UUID,
	schema json.RawMessage,
	spreadVersion, edition int32,
	publishedAt pgtype.Timestamptz,
) (SnapMetaDataDto, error) {
	var parsed struct {
		Title string `json:"title"`
	}
	err := json.Unmarshal(schema, &parsed)
	if err != nil {
		return SnapMetaDataDto{}, err
	}

	return SnapMetaDataDto{
		ID:            uuidToString(id),
		SpreadID:      uuidToStringPtr(spreadID),
		SpreadVersion: spreadVersion,
		Edition:       edition,
		Title:         parsed.Title,
		PublishedAt:   timestamptzToPtr(publishedAt),
	}, nil
}

func SnapMetaDataDtoFromRow(row db.ListSnapMetaDataRow) (SnapMetaDataDto, error) {
	return snapMetaDataDtoFromFields(row.ID, row.SpreadID, row.Schema, row.SpreadVersion, row.Edition, row.PublishedAt)
}

func SnapMetaDataDtoFromBySpreadIdRow(row db.ListSnapMetaDataBySpreadIdRow) (SnapMetaDataDto, error) {
	return snapMetaDataDtoFromFields(row.ID, row.SpreadID, row.Schema, row.SpreadVersion, row.Edition, row.PublishedAt)
}

func snapDtoFromFields(
	ID, spreadID pgtype.UUID, spreadVersion, edition int32, schema json.RawMessage, publishedAt pgtype.Timestamptz) SnapDto {
	return SnapDto{
		ID:            uuidToString(ID),
		SpreadID:      uuidToStringPtr(spreadID),
		SpreadVersion: spreadVersion,
		Edition:       edition,
		Schema:        append(json.RawMessage(nil), schema...),
		PublishedAt:   timestamptzToPtr(publishedAt),
	}
}

func SnapDtoFromGetSnapRow(row db.GetSnapRow) SnapDto {
	return snapDtoFromFields(row.ID, row.SpreadID, row.SpreadVersion, row.Edition, row.Schema, row.PublishedAt)
}

func SnapDtoFromCreateSnapRow(row db.CreateSnapRow) SnapDto {
	return snapDtoFromFields(row.ID, row.SpreadID, row.SpreadVersion, row.Edition, row.Schema, row.PublishedAt)
}
