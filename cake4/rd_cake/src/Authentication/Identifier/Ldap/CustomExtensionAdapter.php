<?php

namespace App\Authentication\Identifier\Ldap;

use ArrayObject;
use Cake\ORM\Locator\LocatorAwareTrait;
use Authentication\Identifier\Ldap\ExtensionAdapter as BaseExtensionAdapter;

class CustomExtensionAdapter extends BaseExtensionAdapter {

    // Use the LocatorAwareTrait to get access to the table locator
    use LocatorAwareTrait;
    
    protected $username_prefix = 'ldap_';

  /*  public function authenticate($username, $password) {
        // Modify this function to fix the issue
        return parent::authenticate($username, $password);
    }*/


    //We create a connect_new function instead of connect in oreder to allow the last parameter (optional) to be tls flag
    public function connect_new(string $host, int $port, array $options,bool $tls): void {

        $this->_setErrorHandler();
        $proto = 'ldap';
        
        if($tls == true){
            $proto = 'ldaps';
        }
        $connect_string = $proto.'://'.$host.':'.$port;
        
        $resource = ldap_connect($connect_string);
        if ($resource === false) {
            throw new RuntimeException('Unable to connect to LDAP server.');
        }
      /*  if (isset($options['tls']) && $options['tls']) {
            //convert the connection to TLS
            if (!ldap_start_tls($resource)) {
                throw new RuntimeException('Starting TLS failed on connection to LDAP server.');
            }
        }*/
        unset($options['tls']); //don't pass through to PHP LDAP functions
        $this->_connection = $resource;
        $this->_unsetErrorHandler();

        foreach ($options as $option => $value) {
            $this->setOption($option, $value);
        }
    }
    
     
    public function advbind(string $username , string $password , array $cfg )
    {
       
        $admin_dn       = $cfg['admin_dn'];
        $admin_pw       = $cfg['admin_pw'];
        $base_dn        = $cfg['base_dn'];
        $filter         = $cfg['filter'];
        $search_filter  = sprintf($filter, ldap_escape($username, '', LDAP_ESCAPE_FILTER));
        
        $this->_setErrorHandler();
        // Bind as admin to perform search
        $admin_bind_result  = ldap_bind($this->getConnection(), $admin_dn, $admin_pw);
        $this->_unsetErrorHandler();            
                
        if ($admin_bind_result) {
            //echo "Admin bind successful\n";

            // Perform search for user data
            $this->_setErrorHandler();
            $search_result = ldap_search($this->getConnection(), $base_dn, $search_filter);
            $this->_unsetErrorHandler();

            // Check if search was successful
            if ($search_result) {
                //echo "Search successful\n";

                // Retrieve user data from search result
                $this->_setErrorHandler();
                $user_data = ldap_get_entries($this->getConnection(), $search_result);
                $this->_unsetErrorHandler();
                //print_r($user_data);
                if(!isset($user_data[0])){
                    return null;
                }

                // Formulate DN for user bind
                $user_dn = $user_data[0]['dn'];

                // Bind as user
                $this->_setErrorHandler();
                $user_bind_result = ldap_bind($this->getConnection(), $user_dn, $password);
                $this->_unsetErrorHandler();

                // Check if user bind was successful
                if ($user_bind_result) {
                //    echo "User bind successful\n";
                    $db_user = $this->_findOrmUser($username);
                    if($db_user){
                        return $db_user;
                    }else{
                        return $this->_addOrmUser($username);
                    }
                } else {
                  //  echo "User bind failed: " . ldap_error($this->getConnection()) . "\n";
                }
            } else {
              //  echo "Search failed: " . ldap_error($ldap_conn) . "\n";
            }
        } else {
          //  echo "Admin bind failed: " . ldap_error($this->getConnection()) . "\n";
        }
        return null;
    }
    
    private function _findOrmUser($username)
    {
        // Retrieve the Users table instance
        $usersTable = $this->getTableLocator()->get('Users');
        
        $username = $this->username_prefix.$username;

        // Example: Query the Users table
        $user = $usersTable->find()
            ->where(['username' => $username])
            ->first();       
        return $user;    
    }
    
    private function _addOrmUser($username)
    {
        // Retrieve the Users table instance
        $usersTable = $this->getTableLocator()->get('Users');      
        $username   = $this->username_prefix.$username;       
        $userData   = [
            'username'      => $username,
            'password'      => bin2hex(random_bytes(8)), // Generates a 16-character hex string,
            'language_id'   => 4,
            'country_id'    => 4,
            'token'         => '',
            'group_id'      => 9
        ];
        
        $user       = $usersTable->newEntity($userData);

        // Step 3: Save the entity
        if ($usersTable->save($user)) {
            // Success: Return the saved user entity
            return $user;
        } else {
            // Failure: Handle validation errors or other issues
            throw new \RuntimeException('Unable to save user.');
        }
    }
    

}
