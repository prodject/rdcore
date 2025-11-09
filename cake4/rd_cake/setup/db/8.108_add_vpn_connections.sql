drop procedure if exists add_vpn_connections;

delimiter //
create procedure add_vpn_connections()
begin

if not exists (select * from information_schema.columns
    where table_name = 'ap_vpn_connections' and table_schema = DATABASE()) then
	CREATE TABLE `ap_vpn_connections` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `ap_id` int(11) NOT NULL,
      `name` CHAR(128) NOT NULL,
      `vpn_type` enum('ipsec','ovpn','wg','zerotier') DEFAULT 'wg',
      `wg_private_key` CHAR(44) NOT NULL DEFAULT '',
      `wg_public_key` CHAR(44) NOT NULL DEFAULT '',
      `wg_address` CHAR(100) NOT NULL DEFAULT '',
      `wg_endpoint` CHAR(44) NOT NULL DEFAULT '',
      `wg_port` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
      `wg_extras` CHAR(100) NOT NULL DEFAULT '',
      `created` datetime NOT NULL,
      `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3;

end if;

if not exists (select * from information_schema.columns
    where table_name = 'node_vpn_connections' and table_schema = DATABASE()) then
	CREATE TABLE `node_vpn_connections` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `node_id` int(11) NOT NULL,
      `name` CHAR(128) NOT NULL,
      `wg_private_key` CHAR(44) NOT NULL DEFAULT '',
      `wg_public_key` CHAR(44) NOT NULL DEFAULT '',
      `wg_address` CHAR(100) NOT NULL DEFAULT '',
      `wg_endpoint` CHAR(44) NOT NULL DEFAULT '',
      `wg_port` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
      `wg_extras` CHAR(100) NOT NULL DEFAULT '',
      `created` datetime NOT NULL,
      `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3;

end if;

end//

delimiter ;
call add_vpn_connections;
