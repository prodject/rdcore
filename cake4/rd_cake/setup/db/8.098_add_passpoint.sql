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
        `passpoint_network_type_id` int(11) DEFAULT NULL,
        `passpoint_venue_type_id` int(11) DEFAULT NULL,
        `created` datetime NOT NULL,
        `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

end if;

if not exists (select * from information_schema.columns
    where table_name = 'passpoint_domains' and table_schema = 'rd') then
     CREATE TABLE `passpoint_domains` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `passpoint_profile_id` int(11) DEFAULT NULL, 
        `name` char(100) NOT NULL,           
        `created` datetime NOT NULL,
        `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

end if;


if not exists (select * from information_schema.columns
    where table_name = 'passpoint_nai_realms' and table_schema = 'rd') then
     CREATE TABLE `passpoint_nai_realms` (
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
    where table_name = 'passpoint_eap_methods' and table_schema = 'rd') then
     CREATE TABLE `passpoint_eap_methods` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `name` varchar(25) NOT NULL,
        `short_name` varchar(25) NOT NULL,
        `hostapd_string` varchar(25) NOT NULL,
        `active` tinyint(1) NOT NULL DEFAULT 1,            
        `created` datetime NOT NULL,
        `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
    INSERT INTO `passpoint_eap_methods` VALUES (1,'EAP-TLS','eap_tls', '13[5:6]',1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(2,'EAP-TTLS/PAP','eap_ttls_pap', '21[2:1][5:7]',1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(3,'EAP-TTLS/MSCHAP2','eap_ttls_mschap2', '21[2:4][5:7]',1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(4,'PEAP','peap', '25[2:4][5:7]',1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(5,'EAP-SIM','eap_sim', '18[5:1]',1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(6,'EAP-USIM','eap_usim', '18[5:2]',1,'2025-01-01 00:00:00','2025-01-01 00:00:00');
 

end if;


if not exists (select * from information_schema.columns
    where table_name = 'passpoint_nai_realm_passpoint_eap_methods' and table_schema = 'rd') then
     CREATE TABLE `passpoint_nai_realm_eap_methods` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `passpoint_nai_realm_id` int(11) DEFAULT NULL, 
        `passpoint_eap_method_id` int(11) DEFAULT NULL,          
        `created` datetime NOT NULL,
        `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
     
end if;

if not exists (select * from information_schema.columns
    where table_name = 'passpoint_rcois' and table_schema = 'rd') then
     CREATE TABLE `passpoint_rcois` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `passpoint_profile_id` int(11) DEFAULT NULL, 
        `name` char(100) NOT NULL,
        `rcoi_id` char(100) NOT NULL,          
        `created` datetime NOT NULL,
        `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

end if;

if not exists (select * from information_schema.columns
    where table_name = 'passpoint_cell_networks' and table_schema = 'rd') then
     CREATE TABLE `passpoint_cell_networks` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `passpoint_profile_id` int(11) DEFAULT NULL, 
        `name` char(100) NOT NULL,
        `mcc` int(6) DEFAULT NULL, 
        `mnc` int(6) DEFAULT NULL,         
        `created` datetime NOT NULL,
        `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

end if;


if not exists (select * from information_schema.columns
    where table_name = 'passpoint_network_types' and table_schema = 'rd') then
     CREATE TABLE `passpoint_network_types` (
        `id` int(11) NOT NULL,
        `name` varchar(40) NOT NULL,
        `active` tinyint(1) NOT NULL DEFAULT 1,            
        `created` datetime NOT NULL,
        `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    

    INSERT INTO `passpoint_network_types` VALUES (0,'Private network',1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(1,'Private network with guest access',1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(2,'Chargeable public network',1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(3,'Free public network',1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(4,'Personal device network',1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(5,'Emergency services only network',1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(14,'Test or experimental',1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(15,'Wildcard',1,'2025-01-01 00:00:00','2025-01-01 00:00:00');
  
end if;  
    
if not exists (select * from information_schema.columns
    where table_name = 'passpoint_venue_types' and table_schema = 'rd') then
     CREATE TABLE `passpoint_venue_types` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `name` varchar(100) NOT NULL DEFAULT 'Unspecified',
        `venue_group` int(4) DEFAULT 0,
        `venue_type` int(4) DEFAULT 0,
        `active` tinyint(1) NOT NULL DEFAULT 1,            
        `created` datetime NOT NULL,
        `modified` datetime NOT NULL,
      PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
     INSERT INTO `passpoint_venue_types` VALUES (1,'Unspecified',0,0,1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(2,'Unspecified Assembly',1,0,1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(3,'Arena',1,1,1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(4,'Stadium',1,2,1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(5,'Passenger Terminal e.g., airport, bus, ferry, train station',1,3,1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(6,'Amphitheater',1,4,1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(7,'Amusement Park',1,5,1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(8,'Place of Worship',1,6,1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(9,'Convention Center',1,6,1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(10,'Convention Center',1,7,1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(11,'Library',1,8,1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(12,'Museum',1,9,1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(13,'Restaurant',1,10,1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(14,'Theater',1,11,1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(15,'Bar',1,12,1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(16,'Coffee Shop',1,13,1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(17,'Zoo or Aquarium',1,14,1,'2025-01-01 00:00:00','2025-01-01 00:00:00'),(18,'Emergency Coordination Center',1,15,1,'2025-01-01 00:00:00','2025-01-01 00:00:00');


end if;

end//

delimiter ;

call add_passpoint;
