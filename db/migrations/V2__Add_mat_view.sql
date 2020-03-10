drop trigger if exists tg_vote_for_item_before_update ON vote_for_item;
DROP function if exists before_update_vote_for_item();
drop function if exists result_item_position_fn();

CREATE FUNCTION result_item_position_fn() 
RETURNS table(vote_for_item_id bigint, item_name text, item_meta jsonb, votes bigint, item_position bigint) AS $$
	declare data_groups bigint[];
	begin
		data_groups = ARRAY(
			select distinct vt.votes 
			from production.vote_for_item as vt
			where vt.votes > 0 and vt.deleted_at is null 
			group by vt.votes
		);

		return query select distinct v1.vote_for_item_id, v1.item_name, v1.item_meta, v1.votes, (
		   		select count(item) + 1 from (
					select item from unnest(data_groups) as item where v1.votes < item group by item
				) as vp
			) as position
		from production.vote_for_item as v1
		where v1.deleted_at is null;
	end
$$ LANGUAGE plpgsql;

CREATE VIEW production.result_item_position as select * from result_item_position_fn();

ALTER TABLE production.result_item_position owner to postgres_app;

create index if not exists i__btree__vote_for_item_votes_idx
	on vote_for_item (votes)
	where (deleted_at IS NULL);
