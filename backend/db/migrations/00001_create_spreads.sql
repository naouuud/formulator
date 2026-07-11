-- +goose Up
CREATE TABLE spreads (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL DEFAULT '',
    version INTEGER NOT NULL DEFAULT 0 CHECK (version >= 0),
    ectm INTEGER,
    pages JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX spreads_last_modified_at_idx ON spreads (last_modified_at DESC);

-- +goose Down
DROP TABLE IF EXISTS spreads;
