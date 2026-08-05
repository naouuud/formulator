package apperrors

import (
	"strconv"
)

const (
	CodeSpreadNotFound  = "SPREAD_NOT_FOUND"
	CodeSnapNotFound    = "SNAP_NOT_FOUND"
	CodeSpillNotFound   = "SPILL_NOT_FOUND"
	CodeVersionConflict = "VERSION_CONFLICT"
	CodeInvalidRequest  = "INVALID_REQUEST"
	CodeInternalError   = "INTERNAL_ERROR"
	CodeConflict        = "CONFLICT"
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

func InvalidRequest() ProblemDetail {
	return ProblemDetail{
		Status: 400,
		Title:  "Invalid request",
		Code:   CodeInvalidRequest,
	}
}

func InvalidRequestDetail(detail string) ProblemDetail {
	return ProblemDetail{
		Status: 400,
		Title:  "Invalid request",
		Detail: detail,
		Code:   CodeInvalidRequest,
	}
}

func MissingUUID(field string) ProblemDetail {
	return InvalidRequestDetail(field + " is required.")
}

func InvalidUUID(field string) ProblemDetail {
	return InvalidRequestDetail(field + " must be a valid UUID.")
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

func SpillNotFound(id string) ProblemDetail {
	return ProblemDetail{
		Status: 404,
		Title:  "Spill not found",
		Detail: "No spill exists with id " + id + ".",
		Code:   CodeSpillNotFound,
	}
}

func SpreadIdMismatch() ProblemDetail {
	return ProblemDetail{
		Status: 400,
		Title:  "Spread id in path and body must match.",
		Code:   CodeInvalidRequest,
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
