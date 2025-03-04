<?php

namespace App\Model\Table;

use Cake\ORM\Table;

class PasspointRcoisTable extends Table {

    public function initialize(array $config):void{  
        $this->addBehavior('Timestamp');     
    }      
}

