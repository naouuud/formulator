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
ORDER BY created_at DESC;

-- name: CreateSpill :one
INSERT INTO spills(
    id,
    snap_id,
    first_name,
    last_name,
    email,
    r_schema,
    sent_at
) VALUES (
    $1, $2, $3, $4, $5, $6, $7
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

-- name: GetSpill :one
SELECT
    *
FROM spills
WHERE id = $1;

-- name: GetSpillWithSnapSchema :one
SELECT
    sp.id,
    sp.snap_id,
    sp.first_name,
    sp.last_name,
    sp.email,
    sp.r_schema,
    sp.created_at,
    sp.last_modified_at,
    sp.completed_at,
    sp.sent_at,
    sp.expired_at,
    sn.schema AS snap_schema
FROM spills sp
LEFT JOIN snaps sn ON sn.id = sp.snap_id
WHERE sp.id = $1;

-- name: UpdateSpill :one
UPDATE spills
SET
    r_schema = $2,
    last_modified_at = NOW(),
    completed_at = NOW()
WHERE id = $1
  AND completed_at IS NULL
  AND (expired_at IS NULL OR expired_at > NOW())
RETURNING
    id,
    snap_id,
    first_name,
    last_name,
    email,
    r_schema,
    created_at,
    last_modified_at,
    completed_at,
    sent_at,
    expired_at;

