<?php
/**
 * Created by G-edit.
 * User: dirkvanderwalt
 * Date: 13/JUL/2025
 * Time: 00:01
 */
 

namespace App\Controller;

use Cake\Auth\DefaultPasswordHasher;
use Cake\Http\Exception\UnauthorizedException;

class ConnectController extends AppController {


	protected $main_model   = 'PermanentUsers';
	
    public function initialize():void{
        parent::initialize();
        
        $this->loadModel('PermanentUsers');       
        $this->loadComponent('Aa');
        $this->loadComponent('TimeCalculations');
        $this->loadComponent('JsonErrors');         
        $this->Authentication->allowUnauthenticated([
            'register', 'authenticate', 'branding','checkToken', 'changePassword'
        ]);                  
    }
    
    public function authenticate(){

        $this->request->allowMethod(['post']);
        $data = $this->request->getData();

        $user = $this->loadModel('PermanentUsers')->find()
            ->where(['username' => $data['username']])
            ->first();

        if ($user && (new DefaultPasswordHasher())->check($data['password'], $user->password)) {        
            $data = [
                'token'     => $user->token,
                'user'      => [
                    'id'        => $user->id,
                    'username'  => $user->username,
                ]
            ];
        
            $this->set([
                'data'          => $data,
                'success'       => true
            ]);
            $this->viewBuilder()->setOption('serialize', true);
        }else{
            //throw new UnauthorizedException('Invalid credentials');
            // Authentication failed
             $this->set([
                'errors'        => ['username' => __('Confirm this name'),'password'=> __('Type the password again')],
                'success'       => false,
                'message'       => __('Authentication failed'),
            ]);
            $this->viewBuilder()->setOption('serialize', true);   
        }
    }
    
    public function checkToken(){
	
		$q_data = $this->request->getQuery();

        if((isset($q_data['token']))&&($q_data['token'] != '')){
        
            $token  = $q_data['token'];           
            $user   = $this->PermanentUsers->find()->where(['PermanentUsers.token' => $token])->first();          
            if(!$user){
                $this->set([
                    'errors'        => ['token'=>'invalid'],
                    'success'       => false
                ]);
                $this->viewBuilder()->setOption('serialize', true);
            
            }else{

                $data = $data = [
                    'token'     => $user->token,
                    'user'      => [
                        'id'        => $user->id,
                        'username'  => $user->username,
                    ]
                ];                             
                $this->set([
                    'data'          => $data,
                    'success'       => true
                ]);
                $this->viewBuilder()->setOption('serialize', true);
            }
                     
        }else{

            $this->set([
                'errors'        => ['token'=>'missing'],
                'success'       => false
            ]);
            $this->viewBuilder()->setOption('serialize', true);
        }
         
    }
    
    public function changePassword(){
        
        $this->request->allowMethod(['post']);
        $data = $this->request->getData();
        $user = $this->PermanentUsers->find()
            ->where(['token' => $data['token']])
            ->first();     
        $user->set('password',$this->request->getData('password'));
        $user->set('token',''); //Setting it ti '' will trigger a new token generation
        $this->PermanentUsers->save($user); 
        $data['token']  = $user->get('token');        
        $this->set([
            'success' => true,
            'data'    => $data
        ]);
        $this->viewBuilder()->setOption('serialize', true);
    }
           
    public function register(){
        $data = [];       	
      	$this->set([
            'data' 	    => $data,
            'success' 	=> true
        ]);
        $this->viewBuilder()->setOption('serialize', true);
    }    
}
