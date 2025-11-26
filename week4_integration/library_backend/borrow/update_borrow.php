<?php
include_once __DIR__ . "/../config/db.php";

$id = $_POST['id'] ?? null;
$returnDate = $_POST['returnDate'] ?? null; // expected yyyy-mm-dd or empty to mark not returned

if (!$id) { http_response_code(400); echo json_encode(["status"=>"error","message"=>"Missing id"]); exit; }

// find borrow row first
$res = $conn->query("SELECT * FROM Borrow WHERE BorrowID = " . intval($id));
$borrow = $res->fetch_assoc();
if (!$borrow) { http_response_code(404); echo json_encode(["status"=>"error","message"=>"Borrow not found"]); exit; }

$bookId = $borrow['BookID'];

// Update borrow record
$stmt = $conn->prepare("UPDATE Borrow SET ReturnDate = ? WHERE BorrowID = ?");
$stmt->bind_param("si", $returnDate, $id);
if (!$stmt->execute()) { http_response_code(500); echo json_encode(["status"=>"error","message"=>$stmt->error]); exit; }
$stmt->close();

// If returnDate was set -> mark book available
if ($returnDate && $returnDate !== '') {
    $up = $conn->prepare("UPDATE Book SET Status='available' WHERE BookID = ?");
    $up->bind_param("i",$bookId);
    $up->execute();
    $up->close();
}

echo json_encode(["status"=>"success"]);
