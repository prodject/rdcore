<?php
namespace App\Controller;
use App\Controller\AppController;
use Cake\Core\Configure;
use Cake\Core\Configure\Engine\PhpConfig;
use Cake\Utility\Inflector;

use Cake\I18n\FrozenTime;
use Cake\I18n\Time;
use Cake\Http\Client;


class IperfTestsController extends AppController{
    
    protected	$node_action_add    = 'http://127.0.0.1/cake4/rd_cake/node-actions/add.json';
    protected	$ap_action_add      = 'http://127.0.0.1/cake4/rd_cake/ap-actions/add.json';
    protected   $server_list        = [
            ['id'   => 1, 'name'    => '192.168.8.176' ],
            ['id'   => 2, 'name'    => '164.160.89.129']  
        ];
    
    public function initialize():void{     
        $this->loadModel('Aps');
        $this->loadModel('Nodes');
        parent::initialize();   
    }
    
    public function iperfServerList(){
         $this->set([
            'items'     => $this->server_list,
            'success'   => true
        ]);
        $this->viewBuilder()->setOption('serialize', true);
    }
    
    public function iperfDefaults(){
    
        $defaults = [
            'server'    => 1, //ID FROM SERVER LIST
            'port'      => 5201,
            'protocol'  => 'tcp',
            'duration'  => 1, //1-60
            'streams'   => 1, //1-16
            'ping'      => true      
        ];
           
        $this->set([
            'data'     => $defaults,
            'success'  => true
        ]);
        $this->viewBuilder()->setOption('serialize', true);  
    }
    
    public function busyCheck(){
    
        $data = [
           // 'status'   => 'awaiting',
           // 'status'   => 'fetched',
            'status'   => 'replied',
        ];
                   
        $this->set([
            'data'     => $data,
            //'success'  => false,
            'success'  => true,
        ]);
        $this->viewBuilder()->setOption('serialize', true);   
    }
       
    public function startTest(){
    
        $queryData  = $this->request->getQuery();
        $req_d 		= $this->request->getData();
        
        if(isset($req_d['dev_mode'])&& ($req_d['dev_mode'] == 'ap')){
            $this->apSpeedTest($req_d['dev_id']);          
        }
        
        $this->set([
            'data'      => [],
            'success'   => true
        ]);
        $this->viewBuilder()->setOption('serialize', true);      
    }
    
    private function apSpeedTest($ap_id){  
    
        $ap         = $this->Aps->find()->where(['Aps.id' => $ap_id])->contain(['ApProfiles'])->first();       
        $queryData  = $this->request->getData();
        
        $port       = $queryData['port'];
        $protocol   = $queryData['protocol'];
        $duration   = $queryData['duration'];
        $streams    = $queryData['streams'];
        $ping       = '';
        if(isset($queryData['ping'])){
            $ping = 'ping';
        }
        
        foreach($this->server_list as $server){
            if($server['id'] == $queryData['server']){
                $srv = $server['name'];
                break;
            }
        }
           	  	
    	if($ap){ 
    	    $cloud_id  = $ap->ap_profile->cloud_id;  	
    		$command   = "/etc/MESHdesk/utils/iperf_to_rd.lua $srv $port $protocol $duration $streams $ping"; //server port protocol duration streams ping
            $a_data    = [
            	'ap_id' 	=> $ap_id,
            	'command' 	=> $command, 
            	'action'	=> 'execute_and_reply',
				'cloud_id'	=> $cloud_id,
				'token'		=> $queryData['token'],
				'sel_language'	=> '4_4'
          	];                  	
          	$http 		= new Client();
			$response 	= $http->post(
			  $this->ap_action_add,
			  json_encode($a_data),
			  ['type' => 'json']
			);   	
    	}      
    }
       
}
