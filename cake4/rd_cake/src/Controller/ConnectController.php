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
            'register', 'authenticate', 'branding','checkToken', 'changePassword',
            'android',
            'apple',
            'linux',
            'windows'
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
    
    public function android(){  
    
        $data = $this->request->getQuery();
        if(isset($data['token'])){
            $user = $this->PermanentUsers->find()
            ->where(['token' => $data['token']])
            ->contain([
                'Radchecks' => function ($q) {
                    return $q->where(['Radchecks.attribute' => 'Cleartext-Password']);
                },
                'Realms.RealmPasspointProfiles'
            ])
            ->first();

            if($user){
                $passwordRadcheck = $user->radchecks[0] ?? null;
                if($passwordRadcheck){
                    if($user->real_realm->realm_passpoint_profile){
                       $profile = $user->real_realm->realm_passpoint_profile;                    
                       return $this->_doAndroid($profile,$passwordRadcheck->username,$passwordRadcheck->value);                    
                    }
                }
            }     
        }  
    } 
    
    public function apple(){
    
    }
    
    public function linux(){
    
    }
    
    public function windows(){
    
    }
     
    private function _doAndroid($profile,$username,$password){
    
        //Some variables
        $ca         = $profile->ca_cert;
        $friendly   = $profile->name;
        $realm      = 'mesh-manager.com';
        $username   = $username;
        $pwd_64     = base64_encode($password);        
        $inner      = 'MS-CHAP-V2';         
        if($profie->eap_method == 'ttls_pap'){
            $inner = 'PAP';
        }
             
        $response   = $this->response;
        $response   = $response->withHeader('Content-Transfer-Encoding', 'base64');
        $response   = $response->withType('application/x-wifi-config');        
        $home_sp    = <<<EOD
<MgmtTree xmlns="syncml:dmddf1.2">
  <VerDTD>1.2</VerDTD>
  <Node>
    <NodeName>PerProviderSubscription</NodeName>
    <RTProperties>
      <Type>
        <DDFName>urn:wfa:mo:hotspot2dot0-perprovidersubscription:1.0</DDFName>
      </Type>
    </RTProperties>
    <Node>
      <NodeName>i001</NodeName>
      <Node>
        <NodeName>HomeSP</NodeName>
        <Node>
          <NodeName>FriendlyName</NodeName>
          <Value>$friendly</Value>
        </Node>
        <Node>
          <NodeName>FQDN</NodeName>
          <Value>$realm</Value>
        </Node>
      </Node>
      <Node>
        <NodeName>Credential</NodeName>
        <Node>
          <NodeName>Realm</NodeName>
          <Value>$realm</Value>
        </Node>
        <Node>
          <NodeName>UsernamePassword</NodeName>
          <Node>
            <NodeName>Username</NodeName>
            <Value>$username</Value>
          </Node>
          <Node>
            <NodeName>Password</NodeName>
            <Value>$pwd_64</Value>
          </Node>
          <Node>
            <NodeName>EAPMethod</NodeName>
            <Node>
              <NodeName>EAPType</NodeName>
              <Value>21</Value>
            </Node>
            <Node>
              <NodeName>InnerMethod</NodeName>
              <Value>MS-CHAP-V2</Value>
            </Node>
          </Node>
        </Node>
      </Node>
    </Node>
  </Node>
</MgmtTree> 
EOD;  
        $home_sp_64 = base64_encode($home_sp);  
        $ca_64      = base64_encode($ca);             
        $home_sp_ca = <<<EOD
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="XXXXboundary"
Content-Transfer-Encoding: base64

--XXXXboundary
Content-Type: application/x-x509-ca-cert
Content-Transfer-Encoding: base64

$ca_64

--XXXXboundary
Content-Type: application/x-passpoint-profile
Content-Transfer-Encoding: base64

$home_sp_64

--XXXXboundary--
EOD;       
                
        $response = $response->withStringBody(base64_encode($home_sp_ca));
        return $response;   
    }
      
}
