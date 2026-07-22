package api

import (
	"encoding/json"
	"formulator/backend/internal/store/db"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

type SnapMetaDataDto struct {
	ID          string     `json:"id"`
	SpreadID    string     `json:"spreadId"`
	Edition     int32      `json:"edition"`
	Title       string     `json:"title"`
	Status      string     `json:"status"`
	PublishedAt *time.Time `json:"publishedAt"`
	ClosedAt    *time.Time `json:"closedAt"`
}

type SnapDto struct {
	ID            string          `json:"id"`
	SpreadID      string          `json:"spreadId"`
	SpreadVersion int32           `json:"spreadVersion"`
	Edition       int32           `json:"edition"`
	Schema        json.RawMessage `json:"schema"`
	Status        string          `json:"status"`
	PublishedAt   *time.Time      `json:"publishedAt"`
	ClosedAt      *time.Time      `json:"closedAt"`
}

func snapMetaDataDtoFromFields(
	id, spreadID pgtype.UUID,
	schema json.RawMessage,
	edition int32,
	status string,
	publishedAt, closedAt pgtype.Timestamptz,
) (SnapMetaDataDto, error) {
	var parsed struct {
		Title string `json:"title"`
	}
	err := json.Unmarshal(schema, &parsed)
	if err != nil {
		return SnapMetaDataDto{}, err
	}

	return SnapMetaDataDto{
		ID:          uuidToString(id),
		SpreadID:    uuidToString(spreadID),
		Edition:     edition,
		Title:       parsed.Title,
		Status:      status,
		PublishedAt: timestamptzToPtr(publishedAt),
		ClosedAt:    timestamptzToPtr(closedAt),
	}, nil
}

func SnapMetaDataDtoFromRow(row db.ListSnapMetaDataRow) (SnapMetaDataDto, error) {
	return snapMetaDataDtoFromFields(row.ID, row.SpreadID, row.Schema, row.Edition, row.Status, row.PublishedAt, row.ClosedAt)
}

func SnapMetaDataDtoFromBySpreadIdRow(row db.ListSnapMetaDataBySpreadIdRow) (SnapMetaDataDto, error) {
	return snapMetaDataDtoFromFields(row.ID, row.SpreadID, row.Schema, row.Edition, row.Status, row.PublishedAt, row.ClosedAt)
}

func SnapDtoFromRow(row db.Snap) SnapDto {
	return SnapDto{
		ID:            uuidToString(row.ID),
		SpreadID:      uuidToString(row.SpreadID),
		SpreadVersion: row.SpreadVersion,
		Edition:       row.Edition,
		Schema:        append(json.RawMessage(nil), row.Schema...),
		Status:        row.Status,
		PublishedAt:   timestamptzToPtr(row.PublishedAt),
		ClosedAt:      timestamptzToPtr(row.ClosedAt),
	}
}
