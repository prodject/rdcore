drop procedure if exists add_passpoint;

delimiter //
create procedure add_passpoint()
begin

if not exists (select * from information_schema.columns
    where table_name = 'passpoint_profiles' and table_schema = 'rd') then
     CREATE TABLE `passpoint_profiles` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `name` char(64) NOT NULL,
        `cloud_id` int(11) DEFAULT NULL,
        `created` datetime NOT NULL,
        `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

end if;


if not exists (select * from information_schema.columns
    where table_name = 'nai_realms' and table_schema = 'rd') then
     CREATE TABLE `nai_realms` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `passpoint_profile_id` int(11) DEFAULT NULL, 
        `encoding` tinyint(1) NOT NULL DEFAULT 0,
        `name` char(64) NOT NULL,           
        `created` datetime NOT NULL,
        `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

end if;

if not exists (select * from information_schema.columns
    where table_name = 'eap_methods' and table_schema = 'rd') then
     CREATE TABLE `eap_methods` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `name` varchar(25) NOT NULL,
        `short_name` varchar(25) NOT NULL,
        `hostapd_string` varchar(25) NOT NULL,
        `active` tinyint(1) NOT NULL DEFAULT 1,            
        `created` datetime NOT NULL,
        `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    

    INSERT INTO `eap_methods` VALUES (1,'EAP-TLS','eap_tls', '13[5:6]',1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(2,'EAP-TTLS/PAP','eap_ttls_pap', '21[2:1][5:7]',1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(3,'EAP-TTLS/MSCHAP2','eap_ttls_mschap2', '21[2:4][5:7]',1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(4,'PEAP','peap', '25[2:4][5:7]',1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(5,'EAP-SIM','eap_sim', '18[5:1]',1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(6,'EAP-USIM','eap_usim', '18[5:2]',1,'2025-01-01 00:00:00','2025-01-01 00:00:00');
 

end if;


if not exists (select * from information_schema.columns
    where table_name = 'nai_realm_eap_methods' and table_schema = 'rd') then
     CREATE TABLE `nai_realm_eap_methods` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `nai_realm_id` int(11) DEFAULT NULL, 
        `eap_method_id` int(11) DEFAULT NULL,          
        `created` datetime NOT NULL,
        `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
     
end if;


end//

delimiter ;

call add_passpoint;
