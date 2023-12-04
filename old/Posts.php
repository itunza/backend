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
include_once './Firebase.php';
 
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

    // Get post data
    // $data = json_decode(file_get_contents("php://input"));

    // var_dump($_POST['brid']);

    if(isset($_POST['title']) && isset($_POST['content'])){
        
        $title = $_POST['title'];
        $content = $_POST['content'];
        $date = $_POST['date'];
        $brid = $_POST['brid'];
    
        // save message
        $result = $post->create($title, $content, $date, $brid);
        
        if($result){
            $firebase = new Firebase();

            $fcm = $firebase->send($title, $content);
            if($fcm["code"] == false){
                $response = array(
                    "status" => 'fail',
                    "message" => $fcm["message"]
                );
        
                $code = 400;
            } else {
                $response = array(
                    "status" => 'success',
                    "message" => 'Message saved successfully'
                );
            }
    
            $code = 200;
        } else {
            $response = array(
                "status" => 'fail',
                "message" => 'Something went wrong. Please try again'
            );
    
            $code = 400;
        }
    } else {
        
        $response = array(
            "status" => 'fail',
            "message" => "Title and content are required"
        );
    
        $code = 400;
    }
}

$db->close();
 
// set response code - 200 OK 400 BAD
http_response_code($code);

// show message data in json format
echo json_encode($response);