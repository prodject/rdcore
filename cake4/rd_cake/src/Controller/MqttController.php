<?php
namespace App\Controller;
use App\Controller\AppController;
use Cake\Core\Configure;
use Cake\Core\Configure\Engine\PhpConfig;
use Cake\Utility\Inflector;

use Cake\I18n\FrozenTime;
use Cake\I18n\Time;


class MqttController extends AppController{
    

    protected $interval             = 10;
    
    public function initialize():void{  
        parent::initialize();   
    }
    
    public function startSpeedtest(){
    
        $queryData  = $this->request->getQuery();
        $req_d 		= $this->request->getData();
        
        $this->set([
            'data'      => [],
            'success'   => true
        ]);
        $this->viewBuilder()->setOption('serialize', true);      
    }
    
}
