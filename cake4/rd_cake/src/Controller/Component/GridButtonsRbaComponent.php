<?php
//----------------------------------------------------------
//---- Author: Dirk van der Walt
//---- License: GPL v3
//---- Description: A component used to check and produce Ajax-ly called grid tooblaar items
//---- Date: 08-JUL-2025
//------------------------------------------------------------

namespace App\Controller\Component;
use Cake\Controller\Component;

use Cake\Core\Configure;
use Cake\Core\Configure\Engine\PhpConfig;

class GridButtonsRbaComponent extends Component {

    protected $components 	= ['GridButtonsBase'];
    
    public function returnButtons($role='admin',$specific = false){
    
        $crtl_name  = $this->getController()->getRequest()->getParam('controller');      
        return $this->_rbaButtonsFor($crtl_name,$role);
    }
       
    private function _rbaButtonsFor($crtl_name,$role){
    
        $crtl_name  = 'Rba'.$crtl_name;     
        $fileName   = $crtl_name.'.php'; // Replace with your config file name
        $filePath   = CONFIG . $fileName;

        if (!file_exists($filePath)) {
            return [];
        }
        
        Configure::load($crtl_name);
        $acl  = Configure::read($crtl_name);

        // Get allowed actions for the role
        $allowedActions = $acl[$role];
             
        return [
            $this->_fetchPuBasic($allowedActions),
            $this->_fetchPuCsvUpDown($allowedActions),
            $this->_fetchPuExtras($allowedActions),
        ];
                    
    }
      
    private function _fetchPuBasic($allowedActions){       

        //--*--
        
        $items = [];
        
        if (in_array('*', $allowedActions)) {       
            $items = [
                $this->GridButtonsBase->btnReloadTimer,
                $this->GridButtonsBase->btnAdd,
                $this->GridButtonsBase->btnDelete,
			    $this->GridButtonsBase->btnEdit
            ];          
        } 
        
        //--Others--
        if(in_array('index', $allowedActions)){
            array_push($items,$this->GridButtonsBase->btnReloadTimer);      
        }
        if(in_array('add', $allowedActions)){
            array_push($items,$this->GridButtonsBase->btnAdd);      
        }
        if(in_array('delete', $allowedActions)){
            array_push($items,$this->GridButtonsBase->btnDelete);      
        }
        if(in_array('viewBasicInfo', $allowedActions)){
            array_push($items,$this->GridButtonsBase->btnEdit);      
        }
                
        $menu = ['xtype' => 'buttongroup','title' => null, 'items' => $items ];
                 
        return $menu;
    }
    
    private function _fetchPuExtras($allowedActions){

         $menu = [
            'xtype' => 'buttongroup',
            'title' => null, 
            'items' => [
                [
                    'xtype'     => 'button', 
                    'glyph'     => Configure::read('icnEmail'),
                    'scale'     => $this->GridButtonsBase->scale, 
                    'itemId'    => 'email', 
                    'tooltip'   => __('e-Mail Credentials'),
                    'ui'        => $this->GridButtonsBase->btnUiMail
               ],
               $this->GridButtonsBase->btnPassword,
               $this->GridButtonsBase->btnEnable,
               $this->GridButtonsBase->btnRadius,
               $this->GridButtonsBase->btnGraph,
               $this->GridButtonsBase->btnByod,
               $this->GridButtonsBase->btnTopUp
            ]
        ];                   
        return $menu;
    }
    
    private function _fetchPuCsvUpDown($allowedActions){
    
        $menu  = null;
        $items = [];
        
        if (in_array('*', $allowedActions)) {       
            $items = [
                 [
                    'xtype'     => 'button',
                    'glyph'     => Configure::read('icnUpload'),
                    'scale'     => $this->GridButtonsBase->scale,
                    'itemId'    => 'upload',
                    'tooltip'   => __('Upload CSV list'),
                    'ui'        => 'default'
                ],
                [
                    'xtype'     => 'button',     
                    'glyph'     => Configure::read('icnCsv'), 
                    'scale'     => $this->GridButtonsBase->scale, 
                    'itemId'    => 'csv',      
                    'tooltip'   => __('Download CSV list'),
                    'ui'        => $this->GridButtonsBase->btnUiCSV
                ]                  
            ];          
        } 
        
        //--Others--
        if(in_array('import', $allowedActions)){
            array_push($items,[
                'xtype'     => 'button',
                'glyph'     => Configure::read('icnUpload'),
                'scale'     => $this->GridButtonsBase->scale,
                'itemId'    => 'upload',
                'tooltip'   => __('Upload CSV list'),
                'ui'        => 'default'
            ]);      
        }
        if(in_array('exportCsv', $allowedActions)){
            array_push($items,[
                'xtype'     => 'button',     
                'glyph'     => Configure::read('icnCsv'), 
                'scale'     => $this->GridButtonsBase->scale, 
                'itemId'    => 'csv',      
                'tooltip'   => __('Download CSV list'),
                'ui'        => $this->GridButtonsBase->btnUiCSV
            ]);      
        }
        
        if(count($items)>0){
            $menu = [
                'xtype' => 'buttongroup',
                'title' => null, 
                'width' => 110,
                'items' => $items
            ];  
        }     
        return $menu;    
    }
          
}
