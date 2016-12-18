CREATE TABLE items (
    id integer NOT NULL,
    name text,
    shop_id integer,
    cat_id integer,
    url text,
    watch boolean DEFAULT false
);