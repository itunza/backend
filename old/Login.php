<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// include database and object files
include_once './Database.php';
include_once './Employee.php';
include_once './Sms.php';
 
// instantiate database and product object
$database = new Database();
$db = $database->getConnection();

if (!is_object($db)) {
        
    $response = array(
        "status" => 'fail',
        "message" => $db
    );

    $code = 400;
} else {
 
    // initialize object
    $employee = new Employee($db);
    $sms = new Sms();

    // Get post data

    if(isset($_POST['number'])){
        // AB Number
        $adb = $_POST['number'];
    
        // query employee
        $result = $employee->read($adb);
    
        if(isset($result->num_rows)){
            $num = $result->num_rows;
             
            // check if more than 0 record found
            if($num > 0){
            
                $employee_name = $employee_phone = $employee_id = null;
             
                while($row = $result->fetch_assoc()) {
                    $employee_name = $row["first_name"] . " " . $row["second_name"];
                    $employee_phone = $row["phone_no"];
                    $employee_id = $row["id"];
                }
            
                // if($employee_name != null && $employee_phone != null){
                if($employee_name != null){

                    $response = array(
                        "status" => 'success',
                        "employee_name" => $employee_name
                    );
        
                    $code = 200;
                } else {
            
                    $response = array(
                        "status" => 'fail',
                        "message" => "Employee details are blank"
                    );
            
                    $code = 400;
                }
            } else {
            
                $response = array(
                    "status" => 'fail',
                    "message" => "Employee not found"
                );
            
                $code = 400;
            }
        } else {
            
            $response = array(
                "status" => 'fail',
                "message" => $result
            );
        
            $code = 400;
        }
    } else {
        
        $response = array(
            "status" => 'fail',
            "message" => "Employee number not provided"
        );
    
        $code = 400;
    }
}

$db->close();
 
// set response code - 200 OK 400 BAD
http_response_code($code);

// show employee data in json format
echo json_encode($response);