CREATE TABLE items (
    "id" serial,
    "name" text,
    "price" int,
    "old_price" int,
    "url" text,
    "pic" text,
    "cat_id" int,
    "shop_id" int,
    "watch" boolean DEFAULT false,
    PRIMARY KEY ("id")
);
