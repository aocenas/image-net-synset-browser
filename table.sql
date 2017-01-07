CREATE TABLE IF NOT EXISTS "image_net" (
    wnid text PRIMARY KEY,
    name text not null,
    label text not null,
    size integer
);

CREATE INDEX ON image_net USING GIN (to_tsvector('english', name));
CREATE INDEX ON image_net USING GIN (to_tsvector('english', label));
