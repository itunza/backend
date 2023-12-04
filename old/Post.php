<?php
class Post{
 
    // database connection and table name
    private $conn;
    private $table_name = "post";
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    // save message
    function create($title, $content, $date, $brid){
    
        // select all query
        $query = "INSERT INTO
                    " . $this->table_name . "
                    (post_title, post_content, post_date, created_by, sales_rep_id)
                VALUES
                    ('" . $this->conn->real_escape_string($title) . "', '" . $this->conn->real_escape_string($content) . "', '" . $this->conn->real_escape_string($date) . "', '" . $this->conn->real_escape_string($brid) . "', (SELECT id FROM sales_rep WHERE brid = '" . $this->conn->real_escape_string($brid) . "' OR ab_number = '" . $this->conn->real_escape_string($brid) . "'))";
    
        // run query statement
        $stmt = $this->conn->query($query);

        if(!$stmt){
            return $this->conn->error;
        }
    
        return $stmt;
    }

    // read employee
    function read(){
    
        // select all query
        $query = "SELECT
                    *
                FROM
                    " . $this->table_name . " e
                ORDER BY
                   post_date DESC";
    
        // run query statement
        $stmt = $this->conn->query($query);

        if(!$stmt){
            return $this->conn->error;
        }
    
        return $stmt;
    }
}