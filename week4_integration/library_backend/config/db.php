<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = "localhost";
$user = "root";
$pass = "";
$db   = "DB_proj_library_system";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "DB connection failed: " . $conn->connect_error]);
    exit;
}
?>
