<?php
include_once __DIR__ . "/../config/db.php";
$name = $_POST['name'] ?? '';
$email= $_POST['email'] ?? '';
$phone= $_POST['phone'] ?? '';
$stmt = $conn->prepare("INSERT INTO Admin (Name, Email, Phone) VALUES (?, ?, ?)");
$stmt->bind_param("sss",$name,$email,$phone);
if ($stmt->execute()) echo json_encode(["status"=>"success","id"=>$conn->insert_id]);
else { http_response_code(500); echo json_encode(["status"=>"error","message"=>$stmt->error]); }
$stmt->close();
include_once "../auth/auth_check.php";
auth_check("admin");