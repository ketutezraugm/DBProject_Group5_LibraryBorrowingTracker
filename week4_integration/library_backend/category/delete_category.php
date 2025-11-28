<?php
include_once __DIR__ . "/../config/db.php";
$id = $_POST['id'] ?? null;
if (!$id) { http_response_code(400); echo json_encode(["status"=>"error","message"=>"Missing id"]); exit; }
$stmt = $conn->prepare("DELETE FROM Category WHERE CategoryID = ?");
$stmt->bind_param("i",$id);
if ($stmt->execute()) echo json_encode(["status"=>"success","affected"=>$stmt->affected_rows]);
else { http_response_code(500); echo json_encode(["status"=>"error","message"=>$stmt->error]); }
$stmt->close();
