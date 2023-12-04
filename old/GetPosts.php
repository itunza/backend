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
include_once './Post.php';
 
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
    $post = new Post($db);

    $result = $post->read();
        
    if($result){
        $response = array(
            "status" => 'success',
            "data" => $result->fetch_all(MYSQLI_ASSOC)
        );

        $code = 200;
    } else {
        $response = array(
            "status" => 'fail',
            "message" => 'Something went wrong. Please try again'
        );

        $code = 400;
    }
}

$db->close();
 
// set response code - 200 OK 400 BAD
http_response_code($code);

// show message data in json format
echo json_encode($response);