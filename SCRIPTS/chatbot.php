<?php
/*
		This php script is used as a proxy to talk to ChatScript server since ChatScript only works over TCP socket and
		our technology stack does not permit a way to directly communicate with it.

		This can be done away with if we move to a better technology stack on the client side. But for now, this is a workaround
*/

$action = $_GET['action'];
$pc = new ChatBot();
$pc->route($action);

//This is used to navigate the site(other than deal related stuff).
class ChatBot {

    // route us to the appropriate class method for this action
    public function route($action) {
        switch($action) {
            case 'request':
                $this->request();
                break;
            default:
                exit();
        }
    }

    public function request() {
        $host = "localhost";  //  CHATSCRIPT SERVER IP ADDRESS GOES HERE
        $port = 1024;     // <<<<<<< portnumber if different from 1024
        $bot  = "Maria";  // <<<<<<< desired botname, or "" for default bot
        $null = "\x00";
        $msg = $_GET['message'];
        $user = $_GET['user'];

        $message = $user.$null.$bot.$null.$msg.$null;
        error_reporting(E_ERROR | E_PARSE);
        if(!$fp=fsockopen($host,$port,$errstr,$errno,30)){
            //trigger_error('Error opening socket',E_USER_ERROR);
            $json = array("response" => null, "error" => 'Could not connect to ChatScript server.');

            header('Content-Type: application/json');
            header("Access-Control-Allow-Origin: *");
            echo json_encode($json);
            return;
        }

        // write message to socket server
        fputs($fp,$message);
        // get server response
        $ret=fgets($fp,65535);
        // close socket connection
        fclose($fp);

        $json = array("response" => $ret, "error" => null);
        header('Content-Type: application/json');
        header("Access-Control-Allow-Origin: *");
        echo json_encode($json);
    }
}
