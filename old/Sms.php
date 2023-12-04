<?php

class Sms {
 
  // private $username = "absa_wezesha_api_user";
  // private $password = "CfkE+E2gc#";
  // private $source = 'AbsaBank'; // AbsaBank
  private $username = "kmuoka@izoneafrica.net";
  private $password = "r6r5bb!!";
  private $source = 'AbsaBank'; // AbsaBank
  private $connectorRule = 146;
  public $destination;
  public $message;
  public $clientSMSID;

  function send($to, $msg) {
    
    $fields = array(
      "username" => $this->username,
      "password" => $this->password,
      'source' => $this->source,
      'connectorRule' => $this->connectorRule,
      'destination' => $this->cleanPhone($to),
      'message' => $msg,
      'clientSMSID' => 'izsms' . strtotime("now")
    );
      
    $postData = http_build_query($fields);
    
    $curl = curl_init();
    
    curl_setopt_array($curl, array(
      CURLOPT_URL => "https://ting.cellulant.co.ke:9001/hub/channels/api/responses/SingleSMSAPI.php",
      CURLOPT_RETURNTRANSFER => true,
      // CURLOPT_ENCODING => "",
      // CURLOPT_MAXREDIRS => 10,
      // CURLOPT_TIMEOUT => 0,
      // CURLOPT_FOLLOWLOCATION => true,
      // CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      // CURLOPT_CUSTOMREQUEST => "POST",
      CURLOPT_POSTFIELDS => $postData,
      // CURLOPT_HTTPHEADER => array(
      //   "Content-Type: application/x-www-form-urlencoded"
      // ),
    ));
    $information = curl_getinfo($curl);
    
    $response = curl_exec($curl);

    // var_dump($information);

    echo $response;

    $response = json_decode($response);
    
    curl_close($curl);

    if (isset($response->success)) {
      
      if ($response->success && $response->stat_code == 1) {
        return $result = array(
          "code" => true,
          "message" => $response->stat_description
        );
      } else {
        return $result = array(
          "code" => false,
          "message" => "SMS Error: " . (($response->stat_description) ? $response->stat_description : ($response->REASON) ? $response->REASON : "Unable to send SMS")
        );
      }
    } else {
      return $result = array(
        "code" => false,
        "message" => "SMS Error: " . (($response->stat_description) ? $response->stat_description : ($response->REASON) ? $response->REASON : "Unable to send SMS")
      );
    }
  }

  private function cleanPhone($phone) {
    if ($phone[0] == '7') {
      $phone = "254" . $phone;
    } else if ($phone[0] == '0') {
      $phone = "254" . substr($phone, 1);
    } else if ($phone[0] == '+') {
      $phone = substr($phone, 1);
    }
    return $phone;
  }
}
