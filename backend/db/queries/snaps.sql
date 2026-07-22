-- name: ListSnapMetaData :many
SELECT
    id,
    spread_id,
    schema,
    edition,
    status,
    published_at,
    closed_at
FROM snaps
ORDER BY published_at DESC;

-- name: ListSnapMetaDataBySpreadId :many
SELECT
    id,
    spread_id,
    schema,
    edition,
    status,
    published_at,
    closed_at
FROM snaps
WHERE spread_id = $1
ORDER BY edition DESC;

-- name: GetSnap :one
SELECT
    id,
    spread_id,
    spread_version,
    edition,
    schema,
    status,
    published_at,
    closed_at
FROM snaps
WHERE id = $1;

-- name: CreateSnap :one
INSERT INTO snaps (
    id,
    spread_id,
    spread_version,
    edition,
    schema,
    published_at
) VALUES (
    $1, $2, $3, $4, $5, $6
)
RETURNING
    id,
    spread_id,
    spread_version,
    edition,
    schema,
    status,
    published_at,
    closed_at;

-- name: DeleteSnap :execrows
DELETE FROM snaps
WHERE id = $1;

-- name: LatestEdition :one
SELECT
    edition
FROM snaps
WHERE spread_id = $1
ORDER BY edition DESC
LIMIT 1;

