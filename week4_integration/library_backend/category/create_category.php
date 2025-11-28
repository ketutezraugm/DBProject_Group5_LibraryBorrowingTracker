<?php
include_once __DIR__ . "/../config/db.php";
$name = $_POST['CategoryName'] ?? '';
$stmt = $conn->prepare("INSERT INTO Category (CategoryName) VALUES (?)");
$stmt->bind_param("s",$name);
if ($stmt->execute()) echo json_encode(["status"=>"success","id"=>$conn->insert_id]);
else { http_response_code(500); echo json_encode(["status"=>"error","message"=>$stmt->error]); }
$stmt->close();
