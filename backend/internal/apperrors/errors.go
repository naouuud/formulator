package apperrors

import "strconv"

const (
	CodeSpreadNotFound   = "SPREAD_NOT_FOUND"
	CodeVersionConflict  = "VERSION_CONFLICT"
)

type ProblemDetail struct {
	Status int    `json:"status"`
	Title  string `json:"title"`
	Detail string `json:"detail,omitempty"`
	Code   string `json:"code"`
}

type VersionConflictDetail struct {
	ProblemDetail
	ExpectedVersion int32 `json:"expectedVersion"`
	ActualVersion   int32 `json:"actualVersion"`
}

func SpreadNotFound(id string) ProblemDetail {
	return ProblemDetail{
		Status: 404,
		Title:  "Spread not found",
		Detail: "No spread exists with id " + id + ".",
		Code:   CodeSpreadNotFound,
	}
}

func VersionConflict(expectedVersion, actualVersion int32) VersionConflictDetail {
	return VersionConflictDetail{
		ProblemDetail: ProblemDetail{
			Status: 409,
			Title:  "Version conflict",
			Detail: formatVersionConflictDetail(expectedVersion, actualVersion),
			Code:   CodeVersionConflict,
		},
		ExpectedVersion: expectedVersion,
		ActualVersion:   actualVersion,
	}
}

func formatVersionConflictDetail(expectedVersion, actualVersion int32) string {
	return "Expected version " + strconv.FormatInt(int64(expectedVersion), 10) + " but found " + strconv.FormatInt(int64(actualVersion), 10) + "."
}
