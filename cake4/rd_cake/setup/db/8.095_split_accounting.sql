drop procedure if exists split_accounting;


delimiter //
create procedure split_accounting()
begin


if not exists (select * from information_schema.columns
    where table_name = 'radacct_history' and table_schema = 'rd') then

    CREATE TABLE radacct_history LIKE radacct;
    INSERT INTO radacct_history SELECT * FROM radacct;

end if;

end//

delimiter ;
call split_accounting;


DELIMITER //

--We added to the trigger in 8.090_add_radacct_triggers.sql the action where if acctstoptime changes from NULL to a date it will be written into the radacct_history table

SET GLOBAL event_scheduler = ON;

CREATE EVENT IF NOT EXISTS cleanup_radacct
ON SCHEDULE EVERY 1 HOUR
STARTS '2025-01-09 00:00:00'
DO
BEGIN
    DELETE FROM radacct
    WHERE acctstoptime IS NOT NULL;
END//
