-- name: ListSnapMetaData :many
SELECT
    id,
    spread_id,
    spread_version,
    schema,
    edition,
    published_at
FROM snaps
WHERE closed_at IS NULL
ORDER BY published_at DESC;

-- name: ListSnapMetaDataBySpreadId :many
SELECT
    id,
    spread_id,
    spread_version,
    schema,
    edition,
    published_at
FROM snaps
WHERE spread_id = $1
AND closed_at IS NULL
ORDER BY edition DESC;

-- name: GetSnap :one
SELECT
    id,
    spread_id,
    spread_version,
    edition,
    schema,
    published_at
FROM snaps
WHERE id = $1
AND closed_at IS NULL;

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
    published_at;

-- name: DeleteSnap :execrows
UPDATE snaps
SET closed_at = NOW()
WHERE id = $1
AND closed_at IS NULL;

-- name: LatestEdition :one
SELECT
    edition
FROM snaps
WHERE spread_id = $1
ORDER BY edition DESC
LIMIT 1;

-- name: NullSpreadData :execrows
UPDATE snaps
SET spread_id = NULL,
    spread_version = NULL,
    edition = NULL
WHERE spread_id = $1;
