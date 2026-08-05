-- name: ListSpreadMetaData :many
SELECT
    id,
    spread_title,
    created_at,
    last_modified_at
FROM spreads
ORDER BY created_at DESC;

-- name: GetSpread :one
SELECT
    id,
    spread_title,
    version,
    schema,
    created_at,
    last_modified_at
FROM spreads
WHERE id = $1;

-- name: CreateSpread :one
INSERT INTO spreads (
    id,
    spread_title,
    schema
) VALUES (
    $1, $2, $3
)
RETURNING
    id,
    spread_title,
    version,
    schema,
    created_at,
    last_modified_at;

-- name: UpdateSpread :one
UPDATE spreads
SET
    spread_title = $2,
    schema = $3,
    version = version + 1,
    last_modified_at = NOW()
WHERE id = $1 AND version = $4
RETURNING
    id,
    spread_title,
    version,
    schema,
    created_at,
    last_modified_at;

-- name: GetSpreadVersion :one
SELECT version
FROM spreads
WHERE id = $1;

-- name: DeleteSpread :execrows
DELETE FROM spreads
WHERE id = $1;

-- name: GetCountBySpreadTitle :one
SELECT
COUNT(*)
FROM spreads
WHERE spread_title = $1;

-- name: GetCountBySpreadTitleExcludingId :one
SELECT
COUNT(*)
FROM spreads
WHERE spread_title = $1
AND id <> $2;
