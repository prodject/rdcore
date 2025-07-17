<?php

namespace App\Controller;
use App\Controller\AppController;

use Cake\Core\Configure;
use Cake\Core\Configure\Engine\PhpConfig;

use Cake\Utility\Inflector;

class RealmPasspointProfilesController extends AppController{
  
    protected $main_model   = 'RealmPasspointProfiles';
  
    public function initialize():void{  
        parent::initialize();
        $this->loadModel('RealmPasspointProfiles');                  
        $this->loadComponent('JsonErrors');     
    }
    
    public function view(){    
        $user = $this->_ap_right_check();
        if (!$user) {
            return;
        }
        
        $req_q      = $this->request->getQuery(); //q_data is the query data
        
        $realm_id   = $req_q['realm_id'];
        
        $entity = $this->{$this->main_model}->find()->where(['RealmPasspointProfiles.realm_id' => $realm_id])->first();
        $data   = [];
        if($entity){
            $data = $entity;
        }                
        $this->set([
            'data'      => $data,
            'success'   => true
        ]);
        $this->viewBuilder()->setOption('serialize', true); 
    } 
    
    public function save(){
        $user = $this->_ap_right_check();
        if (!$user) {
            return;
        }
       
        if ($this->request->is('post')) {         
        	$req_d	    = $this->request->getData();
        	$realm_id   = $req_d['realm_id'];
        	
        	$entity = $this->{$this->main_model}->find()->where(['RealmPasspointProfiles.realm_id' => $realm_id])->first();
        	if($entity){
        	    $this->{$this->main_model}->patchEntity($entity, $req_d);    	           	
        	}else{       	
        	    $entity = $this->{$this->main_model}->newEntity($req_d);       	
        	}
        	
        	if ($this->{$this->main_model}->save($entity)) {
                $this->set([
                    'success' => true
                ]);
                $this->viewBuilder()->setOption('serialize', true);
            } else {
                $message = __('Could not update item');
                $this->JsonErrors->entityErros($entity,$message);
            }       	
        }
    }
  
}
