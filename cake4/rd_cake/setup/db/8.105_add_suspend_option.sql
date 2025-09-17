drop procedure if exists add_suspend_option;

delimiter //
create procedure add_suspend_option()
begin

if not exists (select * from information_schema.columns
    where column_name = 'suspended' and table_name = 'aps' and table_schema = DATABASE()) then
    alter table aps add column `suspended` tinyint(1) NOT NULL DEFAULT '0';
end if;

if not exists (select * from information_schema.columns
    where column_name = 'for_suspended' and table_name = 'ap_profile_exits' and table_schema = DATABASE()) then
    alter table ap_profile_exits add column `for_suspended` tinyint(1) NOT NULL DEFAULT '0';
end if;

if not exists (select * from information_schema.columns
    where column_name = 'suspended' and table_name = 'nodes' and table_schema = DATABASE()) then
    alter table nodes add column `suspended` tinyint(1) NOT NULL DEFAULT '0';
end if;

if not exists (select * from information_schema.columns
    where column_name = 'for_suspended' and table_name = 'mesh_exits' and table_schema = DATABASE()) then
    alter table mesh_exits add column `for_suspended` tinyint(1) NOT NULL DEFAULT '0';
end if;


end//

delimiter ;
call add_suspend_option;
