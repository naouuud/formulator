package api

import (
	"formulator/backend/internal/store/db"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

type SpillMetaDataDto struct {
	ID             string     `json:"id"`
	SnapID         string     `json:"snapId"`
	FirstName      string     `json:"firstName"`
	LastName       string     `json:"lastName"`
	Email          string     `json:"email"`
	CreatedAt      *time.Time `json:"createdAt"`
	LastModifiedAt *time.Time `json:"lastModifiedAt"`
	CompletedAt    *time.Time `json:"completedAt"`
	SentAt         *time.Time `json:"sentAt"`
	ExpiredAt      *time.Time `json:"expiredAt"`
}

func SpillMetaDataDtoFromCreate(row db.CreateSpillRow) SpillMetaDataDto {
	return spillMetaDataDtoFromFields(row.ID, row.SnapID, row.FirstName, row.LastName, row.Email, row.CreatedAt, row.LastModifiedAt, row.CompletedAt, row.SentAt, row.ExpiredAt)
}

func SpillMetaDataDtoFromList(row db.ListSpillMetaDataBySnapIdRow) SpillMetaDataDto {
	return spillMetaDataDtoFromFields(row.ID, row.SnapID, row.FirstName, row.LastName, row.Email, row.CreatedAt, row.LastModifiedAt, row.CompletedAt, row.SentAt, row.ExpiredAt)
}

func spillMetaDataDtoFromFields(
	ID, snapID pgtype.UUID,
	firstName, lastName, email string,
	createdAt, lastModifiedAt, completedAt, sentAt, expiredAt pgtype.Timestamptz,
) SpillMetaDataDto {
	return SpillMetaDataDto{
		ID:             uuidToString(ID),
		SnapID:         uuidToString(snapID),
		FirstName:      firstName,
		LastName:       lastName,
		Email:          email,
		CreatedAt:      timestamptzToPtr(createdAt),
		LastModifiedAt: timestamptzToPtr(lastModifiedAt),
		CompletedAt:    timestamptzToPtr(completedAt),
		SentAt:         timestamptzToPtr(sentAt),
		ExpiredAt:      timestamptzToPtr(expiredAt),
	}
}
