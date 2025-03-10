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
    
    private function _add_new_data($add_data, $entity){
            $bool_flag = true;
            $new_id = $entity->id;
            $filtered_data = preg_grep('/^(domain_add_|domain_edit_)\d+$/', array_keys($add_data));
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
            $filtered_data = preg_grep('/^(nai_realm_add_|nai_realm_edit_)\d+$/', array_keys($add_data));
            foreach ($filtered_data as $key){
            	preg_match('/^nai_realm_(add|edit)_(\d+)$/',$key, $matches);
                $nai_realm_data = [
                    'passpoint_profile_id'  => $new_id,
                    'name'                  => $add_data['nai_realm_'.$matches[1].'_'.$matches[2]]
                ];
                $entPpNaiRealm  = $this->PasspointNaiRealms->newEntity($nai_realm_data); //Create a new entity
                $bool_flag      = $this->PasspointNaiRealms->save($entPpNaiRealm) and $bool_flag; //Save this entity
                if(!$bool_flag){
                    break;
                }else{
                    //See if there are any eap_method_nai_realm_<number>[] items
                    $n_id = $entPpNaiRealm->id;
                    if(isset($add_data["eap_methods_nai_realm_".$matches[1].'_'.$matches[2]])){
                        foreach ($add_data["eap_methods_nai_realm_".$matches[1].'_'.$matches[2]] as $value) { 
                            if($value){
                                $realm_eap_data = [
                                    'passpoint_nai_realm_id' => $n_id,
                                    'passpoint_eap_method_id'=> $value
                                ];                       
                                $entRealmEap = $this->PasspointNaiRealmPasspointEapMethods->newEntity($realm_eap_data); //Create a new entity
                                $this->PasspointNaiRealmPasspointEapMethods->save($entRealmEap);
                            }
                        }                    
                    }                
                }
            }
            $filtered_data = preg_grep('/^(rcoi_name_add_|rcoi_name_edit_)\d+$/', array_keys($add_data));
            foreach ($filtered_data as $key){
            
                preg_match('/^rcoi_name_(add|edit)_(\d+)$/',$key, $matches);                         
                $rcoi_data = [
                    'passpoint_profile_id'  => $new_id,
                    'name'                  => $add_data[$key],
                    'rcoi_id'               => $add_data['rcoi_id_'.$matches[1].'_'.$matches[2]]
                ];
                $entPpRcoi  = $this->PasspointRcois->newEntity($rcoi_data); //Create a new entity
                $bool_flag  = $this->PasspointRcois->save($entPpRcoi) and $bool_flag; //Save this entity
                if(!$bool_flag){
                    break;
                }
            }
            $filtered_data = preg_grep('/^(cell_network_name_add_|cell_network_name_edit_)\d+$/', array_keys($add_data));
            foreach ($filtered_data as $key){
            	preg_match('/^cell_network_name_(add|edit)_(\d+)$/',$key, $matches);
                $cell_network_data = [
                    'passpoint_profile_id'  => $new_id,
                    'name'                  => $add_data[$key],
                    'mcc'		    => $add_data['cell_network_mcc_'.$matches[1].'_'.$matches[2]],
                    'mnc'		    => $add_data['cell_network_mnc_'.$matches[1].'_'.$matches[2]]
                ];
                $entPpCellNetwork    = $this->PasspointCellNetworks->newEntity($cell_network_data); //Create a new entity
                $bool_flag      = $this->PasspointCellNetworks->save($entPpCellNetwork) and $bool_flag; //Save this entity
                if(!$bool_flag){
                    break;
                }
            }
            return $bool_flag;
    }
    
    private function _add(){
        $req_d	    = $this->request->getData();
        $add_data   = $req_d;
        unset($add_data['id']);  
        $entity = $this->{$this->main_model}->newEntity($add_data);
        if ($this->{$this->main_model}->save($entity)){
        
            $bool_flag = $this->_add_new_data($add_data, $entity);
            
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
    
    public function view(){
    
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }        
        $req_d	= $this->request->getQuery();
       
        $data = [];
        if(isset($req_d['profile_id'])){
       
            $passpointProfile = $this->PasspointProfiles->find()
                ->where(['PasspointProfiles.id' => $req_d['profile_id']])
                ->contain(['PasspointDomains','PasspointNaiRealms'=> ['PasspointNaiRealmPasspointEapMethods'],'PasspointRcois','PasspointCellNetworks'])
                ->first();
                
            if($passpointProfile){
            
                if(isset($passpointProfile->passpoint_nai_realms)){
                    foreach($passpointProfile->passpoint_nai_realms as $passpointNiaRealm){
                        $items = [];
                        if(isset($passpointNiaRealm->passpoint_nai_realm_passpoint_eap_methods)){                            
                            foreach($passpointNiaRealm->passpoint_nai_realm_passpoint_eap_methods as $item){                                
                                $items[] = $item->passpoint_eap_method_id;
                            }                    
                        }
                        unset($passpointNiaRealm->passpoint_nai_realm_passpoint_eap_methods);
                        $passpointNiaRealm->eap_methods = $items;
                    }
                }            
                $data = $passpointProfile;
            }
        }
       
       $this->set([
            'data'      => $data,
            'success'   => true
        ]);
       
       $this->viewBuilder()->setOption('serialize', true);          
    }
    
    public function edit(){
    
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }        
        $this->_edit(); 
        $this->viewBuilder()->setOption('serialize', true);          
    }
        
    private function _edit() {   
    	$req_d	= $this->request->getData();  	
        $entity = $this->{$this->main_model}->get($req_d['id']);
        $this->{$this->main_model}->patchEntity($entity, $req_d);
        if ($this->{$this->main_model}->save($entity)){
            //-- With edit we also have to use deleteAll() to delete all the ['PasspointDomains','PasspointNaiRealms','PasspointRcois', 'PasspointCellNetworks'];
            //-- loop that array and call deleteAll() --
            //https://book.cakephp.org/4/en/orm/deleting-data.html#bulk-deletes
            //$this>{"$loop_item")->deleteAll(["loop_item"." passpoint_profile_id" =>$entity]);
            
            //Then call the new function to add (funtion that works with add or edit)  
            
            $items = ['PasspointDomains','PasspointNaiRealms','PasspointRcois', 'PasspointCellNetworks'];
            foreach ($items as $item) {
                $this->{"$item"}->deleteAll(["passpoint_profile_id" =>$entity->id]);
            }
            
            $bool_flag = $this->_add_new_data($req_d, $entity);
                      
        	if($bool_flag){
                $this->set([
                    'success' => true
                ]);
            } else {
                $message = __('Domain item could not be created');
                $this->JsonErrors->errorMessage($message);
            }
            
        }else {
            $message = __('Could not update item');
            $this->JsonErrors->entityErros($entity,$message);
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

