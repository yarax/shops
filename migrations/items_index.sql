CREATE UNIQUE INDEX items_compound_uniq ON items USING btree (name, url, cat_id, shop_id);