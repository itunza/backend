<?php
class Database{
 
    // specify your own database credentials
    private $host = "40.112.49.201";
    private $db_name = "absa_app";
    // private $username = "absawezesha_test";
    // private $password = "r6r5bb!!r6r5bb!!";
    private $username = "absa_app";
    private $password = "VxY7nZGzHWQRgKJJ";
    public $conn;
 
    // get the database connection
    public function getConnection(){
 
        $this->conn = null;
 
        try{
            $this->conn = new mysqli($this->host, $this->username, $this->password, $this->db_name);
 
            return $this->conn;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
}