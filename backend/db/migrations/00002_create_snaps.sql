-- +goose Up
CREATE TABLE snaps (
    id UUID PRIMARY KEY,
    spread_id UUID REFERENCES spreads(id),
    spread_version INTEGER NOT NULL DEFAULT 0 CHECK (spread_version >= 0),
    edition INTEGER NOT NULL DEFAULT 1 CHECK (edition >= 1),
    schema JSONB NOT NULL,
    status VARCHAR(6) NOT NULL DEFAULT 'ready',
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMPTZ DEFAULT NULL
);

-- +goose Down
DROP TABLE IF EXISTS snaps;
