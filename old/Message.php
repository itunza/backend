<?php
class Message{
 
    // database connection and table name
    private $conn;
    private $table_name = "message";
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    // save message
    function create($description, $brid){
    
        // select all query
        $query = "INSERT INTO
                    " . $this->table_name . "
                    (message_description, brid)
                VALUES
                    ('" . $this->conn->real_escape_string($description) . "', '" . $this->conn->real_escape_string($brid) . "')";
    
        // run query statement
        $stmt = $this->conn->query($query);

        if(!$stmt){
            return $this->conn->error;
        }
    
        return $stmt;
    }
}