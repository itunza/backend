<?php

class Firebase {
  function send($title, $content) {
    
    $fields = array(
      "data" => array(
          "title" => $title,
          "content" => $content
      ),
      "to" => "/topics/allDevices"
    );
    
    $postData = json_encode($fields);
    
    $curl = curl_init();
    
    curl_setopt_array($curl, array(
      CURLOPT_URL => "https://fcm.googleapis.com/fcm/send",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => "",
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "POST",
      CURLOPT_POSTFIELDS => $postData,
      CURLOPT_HTTPHEADER => array(
        "Content-Type: application/json",
        "Authorization: key=AAAAXTsC6HY:APA91bG_Bq2mR6qyJokRFmiNXXGdX6dhiOqHyX0RQF0wcZ7KWZXJBhzDstEdIKYEAgD-sYtfkZsEMDIif-v415XkCFQINERqsyLwIGSQYb8_PsNKBohofyCsLW-TrsZg1jQdRHspPvLZ"
      ),
    ));
    
    $response = curl_exec($curl);

    // var_dump($response); die();

    $response = json_decode($response);
    
    curl_close($curl);

    if(isset($response->message_id)){
        return $result = array(
            "code" => true
          );
    } else {
        return $result = array(
          "code" => false,
          "message" => "Unable to send push notification"
        );
    }
  }
}
