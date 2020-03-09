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

create table if not exists vote_for_item (
	vote_for_item_id bigint NOT NULL PRIMARY KEY DEFAULT nextval('vote_for_item_id_seq'::regclass),
    item_name text NOT NULL unique,
	item_meta jsonb,
	votes bigint,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone
);

create table if not exists access_key_vote_item (
    access_key_id bigint NOT NULL,
	vote_for_item_id bigint NOT NULL REFERENCES vote_for_item(vote_for_item_id) ON DELETE CASCADE,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
	CONSTRAINT PK_access_key_vote_item PRIMARY KEY (access_key_id, vote_for_item_id)
);

create table if not exists vote_history (
	vote_id bigint NOT NULL PRIMARY KEY DEFAULT nextval('vote_id_seq'::regclass),
    access_key_id bigint NOT NULL,
	vote_for_item_id bigint NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
	CONSTRAINT FK_vote_history
    FOREIGN KEY (access_key_id, vote_for_item_id) 
    REFERENCES access_key_vote_item(access_key_id, vote_for_item_id) ON DELETE CASCADE
);

create index if not exists i__btree__access_key_vote_item_access_key_id_idx
	on access_key_vote_item (access_key_id)
	where (deleted_at IS NULL);

create index if not exists i__btree__access_key_vote_item_vote_for_item_id_access_key_id_idx
	on access_key_vote_item (vote_for_item_id, access_key_id)
	where (deleted_at IS NULL);

create index if not exists i__btree__vote_history_vote_id_idx
	on vote_history (vote_id)
	where (deleted_at IS NULL);

create index if not exists i__btree__vote_history_access_key_id_idx
	on vote_history (access_key_id)
	where (deleted_at IS NULL);

create index if not exists i__btree__vote_history_vote_for_item_id_access_key_id_idx
	on vote_history (vote_for_item_id, access_key_id)
	where (deleted_at IS NULL);

create index if not exists i__btree__vote_for_item_item_name_idx
	on vote_for_item (item_name)
	where (deleted_at IS NULL);

create index if not exists i__btree__vote_for_item_deleted_at_idx
	on vote_for_item (deleted_at)
	where (deleted_at IS NULL);
