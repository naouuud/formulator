-- name: ListSpreadMetaData :many
SELECT
    id,
    title,
    created_at,
    last_modified_at
FROM spreads
ORDER BY last_modified_at DESC;

-- name: GetSpread :one
SELECT
    id,
    title,
    version,
    ectm,
    pages,
    created_at,
    last_modified_at
FROM spreads
WHERE id = $1;

-- name: CreateSpread :one
INSERT INTO spreads (
    id,
    title,
    version,
    ectm,
    pages,
    created_at,
    last_modified_at
) VALUES (
    $1, $2, $3, $4, $5, $6, $7
)
RETURNING
    id,
    title,
    version,
    ectm,
    pages,
    created_at,
    last_modified_at;

-- name: UpdateSpread :one
UPDATE spreads
SET
    title = $2,
    ectm = $3,
    pages = $4,
    version = version + 1,
    last_modified_at = NOW()
WHERE id = $1 AND version = $5
RETURNING
    id,
    title,
    version,
    ectm,
    pages,
    created_at,
    last_modified_at;

-- name: GetSpreadVersion :one
SELECT version
FROM spreads
WHERE id = $1;

-- name: DeleteSpread :execrows
DELETE FROM spreads
WHERE id = $1;
