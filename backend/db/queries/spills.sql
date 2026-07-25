-- name: ListSpillMetaDataBySnapId :many
SELECT
    id,
    snap_id,
    first_name,
    last_name,
    email,
    created_at,
    last_modified_at,
    completed_at,
    sent_at,
    expired_at
FROM spills
WHERE snap_id = $1
ORDER BY last_modified_at DESC;

-- name: CreateSpill :one
INSERT INTO spills(
    id,
    snap_id,
    first_name,
    last_name,
    email,
    r_schema
) VALUES (
    $1, $2, $3, $4, $5, $6
)
RETURNING
    id,
    snap_id,
    first_name,
    last_name,
    email,
    created_at,
    last_modified_at,
    completed_at,
    sent_at,
    expired_at;

-- name: DeleteSpill :execrows
DELETE FROM spills
WHERE id = $1;
