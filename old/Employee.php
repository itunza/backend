<?php
class Employee{
 
    // database connection and table name
    private $conn;
    private $table_name = "sales_rep";
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    // read employee
    function read($adb){
    
        // select all query
        $query = "SELECT
                    *
                FROM
                    " . $this->table_name . " e
                WHERE
                    e.brid LIKE '%" . $adb . "%'
                ||
                    e.ab_number LIKE '%" . $adb . "%'";
    
        // run query statement
        $stmt = $this->conn->query($query);

        if(!$stmt){
            return $this->conn->error;
        }
    
        return $stmt;
    }

    // save OTP
    function save($otp, $id){
    
        // select all query
        $query = "UPDATE
                    " . $this->table_name . " e
                SET
                    e.otp = '" . $otp . "'
                WHERE
                    e.id = " . $id;
    
        // run query statement
        $stmt = $this->conn->query($query);

        if(!$stmt){
            return $this->conn->error;
        }
    
        return $stmt;
    }

    // check OTP
    function checkOtp($otp, $phone){
    
        // select all query
        $query = "SELECT
                *
            FROM
                " . $this->table_name . " e
            WHERE
                e.phone_no = '" . $phone . "'
                e.otp = '" . $otp . "'";
    
        // run query statement
        $stmt = $this->conn->query($query);

        if(!$stmt){
            return $this->conn->error;
        }
    
        return $stmt;
    }
}