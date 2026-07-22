-- name: ListSpreadMetaData :many
SELECT
    id,
    schema,
    created_at,
    last_modified_at
FROM spreads
ORDER BY last_modified_at DESC;

-- name: GetSpread :one
SELECT
    id,
    version,
    ectm,
    schema,
    created_at,
    last_modified_at
FROM spreads
WHERE id = $1;

-- name: CreateSpread :one
INSERT INTO spreads (
    id,
    version,
    ectm,
    schema,
    created_at,
    last_modified_at
) VALUES (
    $1, $2, $3, $4, $5, $6
)
RETURNING
    id,
    version,
    ectm,
    schema,
    created_at,
    last_modified_at;

-- name: UpdateSpread :one
UPDATE spreads
SET
    ectm = $2,
    schema = $3,
    version = version + 1,
    last_modified_at = NOW()
WHERE id = $1 AND version = $4
RETURNING
    id,
    version,
    ectm,
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
