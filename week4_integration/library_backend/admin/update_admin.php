<?php
include_once __DIR__ . "/../config/db.php";
$id = $_POST['id'] ?? null;
$name = $_POST['name'] ?? '';
$email= $_POST['email'] ?? '';
$phone= $_POST['phone'] ?? '';
if (!$id) { http_response_code(400); echo json_encode(["status"=>"error","message"=>"Missing id"]); exit; }
$stmt = $conn->prepare("UPDATE Admin SET Name=?, Email=?, Phone=? WHERE AdminID=?");
$stmt->bind_param("sssi",$name,$email,$phone,$id);
if ($stmt->execute()) echo json_encode(["status"=>"success","affected"=>$stmt->affected_rows]);
else { http_response_code(500); echo json_encode(["status"=>"error","message"=>$stmt->error]); }
$stmt->close();
