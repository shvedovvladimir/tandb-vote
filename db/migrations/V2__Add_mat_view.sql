drop trigger if exists tg_vote_for_item_before_update ON vote_for_item;
DROP function if exists before_update_vote_for_item();

CREATE MATERIALIZED VIEW if not exists production.result_item_position as
	select distinct v1.*, (select count(votes) + 1 from (
		select votes from production.vote_for_item where votes > v1.votes group by votes
	)as vp) as position
	from production.vote_for_item as v1;

ALTER TABLE production.result_item_position owner to postgres_app;
 
CREATE unique INDEX if not exists result_item_position_vote_for_item_id_idx
  ON production.result_item_position (vote_for_item_id);
 
CREATE FUNCTION before_update_vote_for_item() RETURNS trigger AS $before_update_vote_for_item$
    begin
	    if (new.votes <> old.votes) then 
			REFRESH MATERIALIZED VIEW production.result_item_position;
			RETURN NEW;
		end if;
	
		RETURN NEW;
	end
$before_update_vote_for_item$ LANGUAGE plpgsql;

CREATE TRIGGER tg_vote_for_item_before_update
BEFORE UPDATE ON vote_for_item
FOR EACH row EXECUTE PROCEDURE before_update_vote_for_item();