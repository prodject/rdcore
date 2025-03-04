<?php

namespace App\Controller;
use App\Controller\AppController;

use Cake\Core\Configure;
use Cake\Core\Configure\Engine\PhpConfig;

use Cake\Utility\Inflector;

class PasspointProfilesController extends AppController{
  
    protected $main_model   = 'PasspointProfiles';
  
    public function initialize():void{  
        parent::initialize();
        $this->loadModel('PasspointProfiles');
        $this->loadModel('PasspointEapMethods'); 
        $this->loadModel('EapMethods'); 
        $this->loadModel('PasspointNetworkTypes');
        $this->loadModel('PasspointVenueTypes');  
        $this->loadModel('PasspointDomains');
        $this->loadModel('PasspointNaiRealms');
        $this->loadModel('PasspointRcois');
        $this->loadModel('PasspointCellNetworks');
        $this->loadModel('PasspointNaiRealmPasspointEapMethods');
          
        $this->loadComponent('Aa');
        $this->loadComponent('GridButtonsFlat');
        $this->loadComponent('CommonQueryFlat', [ 
            'model'     => 'PasspointProfiles',
            'sort_by'   => 'name'
        ]); 
             
        $this->loadComponent('JsonErrors'); 
        $this->loadComponent('TimeCalculations');  
        $this->loadComponent('Formatter'); 
        $this->Authentication->allowUnauthenticated([ 'eapMethods','networkTypes','venueTypes']);         
    }
    
    public function eapMethods(){
    
        $eapMethods = $this->EapMethods->find()->where(['EapMethods.active' => 1])->select(['id', 'name'])->all();       
         $this->set([
            'items'     => $eapMethods,
            'success'   => true
        ]);
        $this->viewBuilder()->setOption('serialize', true);      
    }
    
    public function networkTypes(){
    
        $passpointNetworkTypes = $this->PasspointNetworkTypes->find()->where(['PasspointNetworkTypes.active' => 1])->select(['id', 'name'])->all();       
         $this->set([
            'items'     => $passpointNetworkTypes,
            'success'   => true
        ]);
        $this->viewBuilder()->setOption('serialize', true);      
    }
    
     public function venueTypes(){
    
        $passpointVenueTypes = $this->PasspointVenueTypes->find()->where(['PasspointVenueTypes.active' => 1])->select(['id', 'name'])->all();       
         $this->set([
            'items'     => $passpointVenueTypes,
            'success'   => true
        ]);
        $this->viewBuilder()->setOption('serialize', true);      
    }
    
    public function index(){
    
    	$req_q    	= $this->request->getQuery(); 
        $cloud_id 	= $req_q['cloud_id'];             
        $query 		= $this->{$this->main_model}->find();
        
        $this->CommonQueryFlat->build_cloud_query($query,$cloud_id,[]);
 
        $limit  = 50;
        $page   = 1;
        $offset = 0;
        if(isset($req_q['limit'])){
            $limit  = $req_q['limit'];
            $page   = $req_q['page'];
            $offset = $req_q['start'];
        }
        
        $query->page($page);
        $query->limit($limit);
        $query->offset($offset);

        $total  = $query->count();       
        $q_r    = $query->all();
        $items  = [];

        foreach($q_r as $i){
                       
            $row       = [];
            $fields    = $this->{$this->main_model}->getSchema()->columns();
            foreach($fields as $field){
                $row["$field"]= $i->{"$field"};
                
                if($field == 'created'){
                    $row['created_in_words'] = $this->TimeCalculations->time_elapsed_string($i->{"$field"});
                }
                if($field == 'modified'){
                    $row['modified_in_words'] = $this->TimeCalculations->time_elapsed_string($i->{"$field"});
                }
            }        
			$row['update']			= true;
			$row['delete']			= true; 
            array_push($items,$row);      
        }
       
        $this->set(array(
            'items'         => $items,
            'success'       => true,
            'totalCount'    => $total
        ));
        $this->viewBuilder()->setOption('serialize', true); 
    }
   
    public function add(){
    
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }        
        $this->_add(); 
        $this->viewBuilder()->setOption('serialize', true);          
    }
    
    private function _add(){
        $req_d	    = $this->request->getData();
        $add_data   = $req_d;
        unset($add_data['id']);  
        $entity = $this->{$this->main_model}->newEntity($add_data);
        if ($this->{$this->main_model}->save($entity)){
            $bool_flag = true;
            $new_id = $entity->id;
            $filtered_data = preg_grep('/^domain_add_\d+$/', array_keys($add_data));
            foreach ($filtered_data as $key){
                $domain_data = [
                    'passpoint_profile_id'  => $new_id,
                    'name'                  => $add_data[$key]
                ];
                $entPpDomain    = $this->PasspointDomains->newEntity($domain_data); //Create a new entity
                $bool_flag      = $this->PasspointDomains->save($entPpDomain) and $bool_flag; //Save this entity
                if(!$bool_flag){
                    break;
                }
            }
            $filtered_data = preg_grep('/^nai_realm_add_\d+$/', array_keys($add_data));
            foreach ($filtered_data as $key){
            
                $number = str_replace("nai_realm_add_","",$key);//Get the number
                $nai_realm_data = [
                    'passpoint_profile_id'  => $new_id,
                    'name'                  => $add_data[$key]
                ];
                $entPpNaiRealm  = $this->PasspointNaiRealms->newEntity($nai_realm_data); //Create a new entity
                $bool_flag      = $this->PasspointNaiRealms->save($entPpNaiRealm) and $bool_flag; //Save this entity
                if(!$bool_flag){
                    break;
                }else{
                    //See if there are any eap_method_nai_realm_<number>[] items
                    $new_id = $entPpNaiRealm->id;
                    if(isset($add_data["eap_methods_nai_realm_add_".$number])){
                        foreach ($add_data["eap_methods_nai_realm_add_".$number] as $value) { 
                            if($value){
                                $realm_eap_data = [
                                    'passpoint_nai_realm_id' => $new_id,
                                    'passpoint_eap_method_id'=> $value
                                ];                       
                                $entRealmEap = $this->PasspointNaiRealmPasspointEapMethods->newEntity($realm_eap_data); //Create a new entity
                                $this->PasspointNaiRealmPasspointEapMethods->save($entRealmEap);
                            }
                        }                    
                    }                
                }
            }
            $filtered_data = preg_grep('/^rcoi_name_add_\d+$/', array_keys($add_data));
            foreach ($filtered_data as $key){
            
                $number = str_replace("rcoi_name_add_","",$key);//Get the number                              
                $rcoi_data = [
                    'passpoint_profile_id'  => $new_id,
                    'name'                  => $add_data[$key],
                    'rcoi_id'               => $add_data['rcoi_id_add_'.$number]
                ];
                $entPpRcoi  = $this->PasspointRcois->newEntity($rcoi_data); //Create a new entity
                $bool_flag  = $this->PasspointRcois->save($entPpRcoi) and $bool_flag; //Save this entity
                if(!$bool_flag){
                    break;
                }
            }
            $filtered_data = preg_grep('/^cell_network_name_add_\d+$/', array_keys($add_data));
            foreach ($filtered_data as $key){
            	$number = str_replace("cell_network_name_add_","",$key); 
                $cell_network_data = [
                    'passpoint_profile_id'  => $new_id,
                    'name'                  => $add_data[$key],
                    'mcc'		    => $add_data['cell_network_mcc_add_'.$number],
                    'mnc'		    => $add_data['cell_network_mnc_add_'.$number]
                ];
                $entPpCellNetwork    = $this->PasspointCellNetworks->newEntity($cell_network_data); //Create a new entity
                $bool_flag      = $this->PasspointCellNetworks->save($entPpCellNetwork) and $bool_flag; //Save this entity
                if(!$bool_flag){
                    break;
                }
            }
            
            if($bool_flag){
                $this->set([
                    'success' => true
                ]);
            } else {
                $message = __('Domain item could not be created');
                $this->JsonErrors->errorMessage($message);
            }
        } else {
            $message = __('Could not update item');
            $this->JsonErrors->entityErros($entity,$message);
        } 
    }
    
    public function edit(){ 
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $this->_addOrEdit('edit'); 
    }
     
    private function _addOrEdit($type= 'add') {
    
    	$req_d	= $this->request->getData();  	
       
        if($type == 'add'){ 
            //Unset the ID in the request data (if the call has it though it should not include an ID) 02-Jun-2022
            $this->_add();
        }
       
        if($type == 'edit'){
            $entity = $this->{$this->main_model}->get($req_d['id']);
            $this->{$this->main_model}->patchEntity($entity, $req_d);
        }
              
	}
	
    public function menuForGrid(){
      
        $menu = $this->GridButtonsFlat->returnButtons(false,'FirewallApps'); 
        $this->set(array(
            'items'         => $menu,
            'success'       => true
        ));
        $this->viewBuilder()->setOption('serialize', true); 
    }
    
    public function delete() {
		if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        $req_d		= $this->request->getData();

        $user_id   = $user['id'];
        $fail_flag = false;

	    if(isset($req_d['id'])){   //Single item delete     
            $entity     = $this->{$this->main_model}->get($req_d['id']);              
           	$this->{$this->main_model}->delete($entity);
        }else{                          //Assume multiple item delete
            foreach($req_d as $d){
                $entity     = $this->{$this->main_model}->get($d['id']);                
              	$this->{$this->main_model}->delete($entity);
            }
        }

        if($fail_flag == true){
            $this->set(array(
                'success'   => false,
                'message'   => __('Could not delete some items'),
            ));
            $this->viewBuilder()->setOption('serialize', true); 
        }else{
            $this->set(array(
                'success' => true
            ));
            $this->viewBuilder()->setOption('serialize', true); 
        }
	}
}

