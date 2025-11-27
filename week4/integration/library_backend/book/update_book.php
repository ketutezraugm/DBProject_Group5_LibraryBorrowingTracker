<?php
include_once __DIR__ . "/../config/db.php";

$id     = $_POST['id']     ?? null;
$title  = $_POST['title']  ?? '';
$author = $_POST['author'] ?? '';
$isbn   = $_POST['isbn']   ?? '';
$year   = $_POST['year']   ?? null;
$status = $_POST['status'] ?? 'available';
$admin  = $_POST['admin']  ?? null;
$cat    = $_POST['category'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["status"=>"error","message"=>"Missing id"]);
    exit;
}

$stmt = $conn->prepare("UPDATE Book SET Title=?, Author=?, ISBN=?, PublicationYear=?, Status=?, AdminID=?, CategoryID=? WHERE BookID=?");
$stmt->bind_param("sssisiii", $title, $author, $isbn, $year, $status, $admin, $cat, $id);

if ($stmt->execute()) {
    echo json_encode(["status"=>"success","affected"=>$stmt->affected_rows]);
} else {
    http_response_code(500);
    echo json_encode(["status"=>"error","message"=>$stmt->error]);
}
$stmt->close();
