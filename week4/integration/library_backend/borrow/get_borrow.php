<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "library_db");

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

$sql = "SELECT * FROM borrow";
$result = $conn->query($sql);

$borrow_list = [];

while ($row = $result->fetch_assoc()) {
    $borrow_list[] = $row;
}

echo json_encode($borrow_list);
?>
