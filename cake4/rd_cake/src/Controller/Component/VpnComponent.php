<?php

namespace App\Controller\Component;

use Cake\Controller\Component;
use Cake\ORM\TableRegistry;

class VpnComponent extends Component {

    protected $ipsec    = 1;
    protected $ovpn     = 1;
    protected $zerot    = 1;
    protected $wg       = 1;
    protected $metaVpn  = [];
    protected $vpnDetail= [];

	public function initialize(array $config):void{
        $this->ApVpnConnections = TableRegistry::get('ApVpnConnections');
    }
    
    public function NetworkForAp($ap_id){
    
        $vpnConnections = $this->ApVpnConnections->find()->where(['ApVpnConnections.ap_id' => $ap_id])->all();
        $network    = [];
        foreach($vpnConnections as $vpnConnection){
            if($vpnConnection->vpn_type === 'wg'){                
                $network = array_merge($network,$this->_makeWireguard($vpnConnection));           
            }
            if($vpnConnection->vpn_type === 'ovpn'){                
                $network = array_merge($network,$this->_makeOpenvpn($vpnConnection));           
            }      
        }    	 	  
    	return [ $network, $this->metaVpn, $this->vpnDetail ];
    }
    
    
    private function _makeOpenvpn($vpnConnection){
    
        $ifname   = 'ovpn0'.$this->ovpn;
        $ret_ovpn = [
            [
                'interface' => $ifname,
                'options'   => [
                    'proto'     => 'none',
                    'ifname'    => $ifname
                
                ]  
            ]
        ];
        
        $this->metaVpn[] = [
            'id'        => $vpnConnection->id,
            'interface' => $ifname,
            'type'      => $vpnConnection->vpn_type,
            'stats'     => true,
            'routing'   => [
                'exit_points' => [
                ],
                'macs'  => [
                ]
            ]   
        ];
        
        $this->ovpn = $this->ovpn+1; //increment the OpenVPN items 
        
        $config_file = $this->_makeOpenvpnConfig($vpnConnection,$ifname);
        
        if(array_key_exists('ovpn',$this->vpnDetail)){          
            array_push($this->vpnDetail,[ 'name' => $ifname, 'config' => $config_file ]);            
        }else{
            $this->vpnDetail['ovpn'] = [[ 'name' => $ifname, 'config' => $config_file ]];   
        }            
        return $ret_ovpn; 
    }
    
    private function _makeOpenvpnConfig($vpnConnection,$ifname){
    
        $ca     = $vpnConnection->ovpn_ca;
        $cert   = $vpnConnection->ovpn_cert;
        $key    = $vpnConnection->ovpn_key;
        $srv    = $vpnConnection->ovpn_server;
        $port   = $vpnConnection->ovpn_port;
 
$config = <<<EOT
client
dev $ifname
dev-type tun
proto udp
remote $srv $port

# Retry settings
resolv-retry infinite
nobind

persist-key
persist-tun

# Modern data channel ciphers (matches a typical modern server)
data-ciphers AES-256-GCM:CHACHA20-POLY1305
data-ciphers-fallback AES-256-GCM

remote-cert-eku "TLS Web Server Authentication"

verb 3

<ca>
$ca
</ca>
<cert>
$cert
</cert>
<key>
$key
</key>

EOT;

        return $config;
          
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
        
        $this->metaVpn[] = [
            'id'        => $vpnConnection->id,
            'interface' => $ifname,
            'type'      => $vpnConnection->vpn_type,
            'stats'     => true,
            'routing'   => [
                'exit_points' => [
                ],
                'macs'  => [
                ]
            ]   
        ];
        
        $this->wg = $this->wg+1; //increment the wireguard items        
        return $ret_wg;   
    }
}
