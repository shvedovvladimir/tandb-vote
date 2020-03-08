drop trigger if exists tg_vote_for_item_before_insert;
drop trigger if exists tg_vote_for_item_before_update;

delimiter $$
CREATE TRIGGER tg_vote_for_item_before_insert
BEFORE INSERT ON vote_for_item
FOR EACH ROW
begin
	DECLARE last_position INT;
	select position INTO last_position from vote_for_item where votes = 1;

	IF last_position <= 0 THEN
		select count(position) INTO last_position from vote_for_item group by position;
	END IF;

	SET NEW.position = last_position + 1;
end $$

CREATE TRIGGER tg_vote_for_item_before_update
BEFORE UPDATE ON vote_for_item
FOR EACH ROW
begin
	DECLARE last_position INT;
	select position INTO last_position from vote_for_item where votes = NEW.votes;

	IF last_position <= 0 THEN
		select count(position) INTO last_position from vote_for_item where votes < NEW.votes group by position;
	END IF;

	SET NEW.position = last_position - 1;
end $$
delimiter ;