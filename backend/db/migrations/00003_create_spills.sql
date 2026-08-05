-- +goose Up
CREATE TABLE spills (
  id UUID PRIMARY KEY,
  snap_id UUID REFERENCES snaps(id) NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  r_schema JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_modified_at TIMESTAMPTZ DEFAULT NULL,
  completed_at TIMESTAMPTZ DEFAULT NULL,
  sent_at TIMESTAMPTZ NOT NULL,
  expired_at TIMESTAMPTZ DEFAULT NULL
);

-- +goose DOWN
DROP TABLE IF EXISTS spills;
