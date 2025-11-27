<?php
include_once __DIR__ . "/../config/db.php";

$name = $_POST['name'] ?? '';
$dept = $_POST['department'] ?? '';
$email= $_POST['email'] ?? '';
$phone= $_POST['phone'] ?? '';

$stmt = $conn->prepare("INSERT INTO Student (Name, Department, Email, Phone) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $name, $dept, $email, $phone);

if ($stmt->execute()) {
    echo json_encode(["status"=>"success","id"=>$conn->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(["status"=>"error","message"=>$stmt->error]);
}
$stmt->close();
