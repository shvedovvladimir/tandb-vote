CREATE SEQUENCE vote_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

CREATE SEQUENCE vote_for_item_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

create table if not exists vote (
	vote_id bigint NOT NULL PRIMARY KEY DEFAULT nextval('vote_id_seq'::regclass),
    access_key_id bigint NOT NULL,
	vote_for_item_id bigint NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone
);

create table if not exists vote_for_item (
	vote_for_item_id bigint NOT NULL PRIMARY KEY DEFAULT nextval('vote_for_item_id_seq'::regclass),
    item_name text NOT NULL,
	item_meta jsonb,
	votes bigint,
	position: int,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone
);

create index if not exists i__btree__vote_vote_id_idx
	on vote (vote_id);

create index if not exists i__btree__vote_access_key_id_idx
	on vote (access_key_id);

create index if not exists i__btree__vote_vote_id_access_key_id_idx
	on vote (vote_id, access_key_id);

create index if not exists i__btree__vote_for_item_item_name_idx
	on vote_for_item (item_name);

create index if not exists i__btree__vote_deleted_at_idx
	on vote (deleted_at);

create index if not exists i__btree__vote_for_item_deleted_at_idx
	on vote_for_item (deleted_at);
