package api

import (
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

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

func uuidToStringPtr(value pgtype.UUID) *string {
	if !value.Valid {
		return nil
	}

	id, err := uuid.FromBytes(value.Bytes[:])
	if err != nil {
		return nil
	}

	s := id.String()
	return &s
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

func TimePtrToPgTimestamptzDefaultNow(value *time.Time) pgtype.Timestamptz {
	if value == nil {
		return pgtype.Timestamptz{Time: time.Now(), Valid: true}
	}
	return pgtype.Timestamptz{Time: *value, Valid: true}
}
