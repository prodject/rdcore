<?php

namespace App\Controller;
use App\Controller\AppController;

use Cake\Core\Configure;
use Cake\Core\Configure\Engine\PhpConfig;

use Cake\Utility\Inflector;
use Cake\I18n\FrozenTime;

class VpnConnectionsController extends AppController{

    protected $main_model  = 'ApVpnConnections';
         
    public function initialize():void{  
        parent::initialize();
        $this->loadModel('ApVpnConnections'); 
        $this->loadModel('WireguardInstances'); 
        $this->loadComponent('Aa');
        $this->loadComponent('GridButtonsFlat');         
        $this->loadComponent('JsonErrors'); 
        $this->loadComponent('TimeCalculations');
       // $this->Authentication->allowUnauthenticated([]);              
    }
         
	public function apIndex(){
	
		$user = $this->_ap_right_check();
        if (!$user) {
            return;
        }
        
    	$req_q  = $this->request->getQuery(); //q_data is the query data
        $ap_id  = $req_q['ap_id'];
        $query 	= $this->ApVpnConnections->find()
                    ->where(['ApVpnConnections.ap_id' => $ap_id]);  

        $total  = $query->count();       
        $q_r    = $query->all();
        $items  = [];

        foreach($q_r as $i){		
			$i->modified_in_words= $this->TimeCalculations->time_elapsed_string($i->modified);
			$i->created_in_words = $this->TimeCalculations->time_elapsed_string($i->created);	
            array_push($items,$i);
        }
        
        $data = [
            'ap_id'         => $ap_id,
            'connections'   => $items       
        ];
        
        $this->set([
            'data'          => $data,
            'success'       => true,
            'totalCount'    => $total,
            'metaData'		=> [
            	'count'	    => $total
            ]
        ]);
        $this->viewBuilder()->setOption('serialize', true);
    }
    
    public function apSave(){
	
		$user = $this->_ap_right_check();
        if (!$user) {
            return;
        } 
        
        $req_d		= $this->request->getData();
        $ap_id      = $this->request->getData('ap_id');
        
        [$meta, $createRows, $updateRows] = $this->splitFlatRows($req_d);
                
        // --- (1) DELETE missing ---
        $submittedIds = array_map('intval', array_keys($updateRows));

        $existingIds = $this->ApVpnConnections->find()
            ->select(['id'])
            ->where(['ap_id' => $ap_id])
            ->enableHydration(false)
            ->all()
            ->extract('id')
            ->toList();

        $toDelete = array_values(array_diff($existingIds, $submittedIds));
        if (!empty($toDelete)) {
            $deleted = $this->ApVpnConnections->deleteAll([
                'ap_id' => $ap_id,
                'id IN' => $toDelete,
            ]);
        }
                
        foreach($createRows as $item){
        
            $item['ap_id']  = $ap_id;
            $form_id        = $item['form_id'];
            $entity         = $this->ApVpnConnections->newEntity($item);
            
            if (!$this->ApVpnConnections->save($entity)) {           
                $message    = 'Error';           
                $errors     = $entity->getErrors();
                $a          = [];
                foreach(array_keys($errors) as $field){
                    $detail_string = '';
                    $error_detail =  $errors[$field];
                    foreach(array_keys($error_detail) as $error){
                        $detail_string = $detail_string." ".$error_detail[$error];   
                    }
                    $add_field      = '0'.$form_id.'_'.$field;
                    $a[$add_field]  = $detail_string;
                }                
                $this->set([
                    'errors'    => $a,
                    'success'   => false,
                    'message'   => __('Could not create item'),
                ]);
                $this->viewBuilder()->setOption('serialize', true);
                return;
            }                 
        }
        
        foreach($updateRows as $item){
        
            $item['ap_id']  = $ap_id;
            $id             = $item['form_id'];          
            $form_id        = $item['form_id'];
            $entity         = $this->ApVpnConnections->find()->where(['ApVpnConnections.id' => $id])->first();          
            if($entity){
                $this->ApVpnConnections->patchEntity($entity,$item);
                if (!$this->ApVpnConnections->save($entity)) {           
                    $message    = 'Error';           
                    $errors     = $entity->getErrors();
                    $a          = [];
                    foreach(array_keys($errors) as $field){
                        $detail_string = '';
                        $error_detail =  $errors[$field];
                        foreach(array_keys($error_detail) as $error){
                            $detail_string = $detail_string." ".$error_detail[$error];   
                        }
                        $add_field      = $form_id.'_'.$field;
                        $a[$add_field]  = $detail_string;
                    }                
                    $this->set([
                        'errors'    => $a,
                        'success'   => false,
                        'message'   => __('Could not create item'),
                    ]);
                    $this->viewBuilder()->setOption('serialize', true);
                    return;
                }            
            }                              
        }
              	       
        $this->set(
            [
                'data'     => [$meta, $createRows, $updateRows],
                'success'  => true
            ]
        );
        $this->viewBuilder()->setOption('serialize', true);
    }
 
    
    // --- Parse: split flat keys into meta/new/update ---
    private function splitFlatRows(array $data): array{

        $createByIdx = [];  // '1' => [fields...] from 01_, 02_, etc.
        $updateById  = [];  // '148' => [fields...] from 148_, 57_, etc.
        $other       = [];  // ap_id, token, cloud_id, ...

        foreach ($data as $key => $value) {
        
            if (!preg_match('/^(\d+)_(.+)$/', $key, $m)) {
                $other[$key] = $value;
                continue;
            }
            [, $num, $field] = $m;

            // you can skip empties if you want:
            // if ($value === '' || $value === null) continue;

            if ($num[0] === '0') {
                $idx = (int)$num; // '02' -> 2
                $createByIdx[$idx][$field]      = $value;
                $createByIdx[$idx]['form_id']   = $idx;
            } else {
                $id = (int)$num;  // existing DB id
                $updateById[$id][$field]        = $value;
                $updateById[$id]['form_id']     = $id;
            }
        }
        
        ksort($createByIdx, SORT_NUMERIC);
        $create = array_values($createByIdx);
        return [$other, $create, $updateById];
    } 
}

?>
