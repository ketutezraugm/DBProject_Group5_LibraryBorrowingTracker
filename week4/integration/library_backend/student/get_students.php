<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "library_db");

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

$sql = "SELECT * FROM students";
$result = $conn->query($sql);

$students = [];

while ($row = $result->fetch_assoc()) {
    $students[] = $row;
}

echo json_encode($students);
?>
