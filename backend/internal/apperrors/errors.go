package apperrors

import "strconv"

const (
	CodeSpreadNotFound  = "SPREAD_NOT_FOUND"
	CodeSnapNotFound    = "SNAP_NOT_FOUND"
	CodeVersionConflict = "VERSION_CONFLICT"
	CodeInvalidRequest  = "INVALID_REQUEST"
	CodeInternalError   = "INTERNAL_ERROR"
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

func InternalError() ProblemDetail {
	return ProblemDetail{
		Status: 500,
		Title:  "Internal server error",
		Code:   CodeInternalError,
	}
}

func InvalidRequestBody() ProblemDetail {
	return ProblemDetail{
		Status: 400,
		Title:  "Invalid request body",
		Code:   CodeInvalidRequest,
	}
}

func InvalidRequestBodyDetail(detail string) ProblemDetail {
	return ProblemDetail{
		Status: 400,
		Title:  "Invalid request body",
		Detail: detail,
		Code:   CodeInvalidRequest,
	}
}

func InvalidUUID(field string) ProblemDetail {
	return InvalidRequestBodyDetail(field + " must be a valid UUID.")
}

func SpreadIdRequired() ProblemDetail {
	return InvalidRequestBodyDetail("spreadId is required.")
}

func SpreadIdMismatch() ProblemDetail {
	return ProblemDetail{
		Status: 400,
		Title:  "Spread id in path and body must match",
		Code:   CodeInvalidRequest,
	}
}

func SpreadNotFound(id string) ProblemDetail {
	return ProblemDetail{
		Status: 404,
		Title:  "Spread not found",
		Detail: "No spread exists with id " + id + ".",
		Code:   CodeSpreadNotFound,
	}
}

func SnapNotFound(id string) ProblemDetail {
	return ProblemDetail{
		Status: 404,
		Title:  "Snap not found",
		Detail: "No snap exists with id " + id + ".",
		Code:   CodeSnapNotFound,
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
