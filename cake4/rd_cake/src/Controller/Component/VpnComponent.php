<?php

namespace App\Controller\Component;

use Cake\Controller\Component;
use Cake\ORM\TableRegistry;

class VpnComponent extends Component {

    protected $ipsec    = 1;
    protected $ovpn     = 1;
    protected $zerot    = 1;
    protected $wg       = 1;

	public function initialize(array $config):void{
        $this->ApVpnConnections = TableRegistry::get('ApVpnConnections');
    }
    
    public function NetworkForAp($ap_id){
    
        $vpnConnections = $this->ApVpnConnections->find()->where(['ApVpnConnections.ap_id' => $ap_id])->all();
        $network = [];  
        foreach($vpnConnections as $vpnConnection){
            if($vpnConnection->vpn_type === 'wg'){                
                $network = array_merge($network,$this->_makeWireguard($vpnConnection));           
            }     
        }    	 	  
    	return $network;
    }
    
    
    private function _makeWireguard($vpnConnection){
    /*
   config interface 'wg01'
	    option proto 'wireguard'
	    option private_key 'sN2buzXTz0ebysgQG73Mqk+ftbRwO6K5UHbBUpf480U='
	    list addresses '10.5.0.4/32'
	    list addresses 'fd00:12::4/64'

    config wireguard_wg01
	    option description 'Imported peer configuration'
	    option public_key 'hxwdhRA4JqtmF1Jz1tc8C6cFUh8aUzRHBkJ1tuQQEmU='
	    list allowed_ips '0.0.0.0/0'
	    list allowed_ips '::/0'
	    option persistent_keepalive '25'
	    option endpoint_host '164.160.89.129'
	    option endpoint_port '51820'
    */       
        $ifname     = 'wg0'.$this->wg;
        $conf_name  = 'wireguard_'.$ifname;
        $wg_addresses = explode(",", $vpnConnection->wg_address);
    
        $ret_wg = [
            [
                'interface' => $ifname,
                'options'   => [
                    'proto'         => 'wireguard',
                    'private_key'   => $vpnConnection->wg_private_key,
                ],
                'lists'     => [
                    'addresses' => $wg_addresses
                ],
            ],
            [
                $conf_name  => $conf_name,
                'options'   => [
                    'description'   => 'id_'.$vpnConnection->id.'_name_'.$vpnConnection->name,
                    'public_key'    => $vpnConnection->wg_public_key,
                    'persistent_keepalive' => 25,
                    'endpoint_host' => $vpnConnection->wg_endpoint,
                    'endpoint_port' => $vpnConnection->wg_port

                ],
                'lists'     => [
                    'allowed_ips' => [
                        '0.0.0.0/0',
                        '::/0'
                    ]
                ],
            ]
        ];
        
        $this->wg = $this->wg+1; //increment the wireguard items        
        return $ret_wg;   
    }
    
    

}
