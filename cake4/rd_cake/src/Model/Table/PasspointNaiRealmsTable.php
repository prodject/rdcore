<?php

namespace App\Model\Table;

use Cake\ORM\Table;

class PasspointNaiRealmsTable extends Table {

    public function initialize(array $config):void{  
        $this->addBehavior('Timestamp'); 
        $this->hasMany('PasspointNaiRealmPasspointEapMethods',['dependent' => true]);     
    }      
}

