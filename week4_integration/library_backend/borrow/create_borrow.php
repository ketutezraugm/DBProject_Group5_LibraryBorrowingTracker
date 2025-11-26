<?php
include_once __DIR__ . "/../config/db.php";

$borrowDate = $_POST['borrowDate'] ?? date('Y-m-d');
$returnDue  = $_POST['returnDue']  ?? 14;
$returnDate = $_POST['returnDate']  ?? null; // optional
$bookId     = $_POST['bookId'] ?? null;
$memberId   = $_POST['memberId'] ?? null;

if (!$bookId || !$memberId) {
    http_response_code(400);
    echo json_encode(["status"=>"error","message"=>"Missing bookId or memberId"]);
    exit;
}

// Use transaction: insert borrow + set book status to borrowed (if ReturnDate is NULL)
$conn->begin_transaction();
$stmt = $conn->prepare("INSERT INTO Borrow (BorrowDate, ReturnDueDate, ReturnDate, BookID, MemberID) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sisis", $borrowDate, $returnDue, $returnDate, $bookId, $memberId);

if (!$stmt->execute()) {
    $conn->rollback();
    http_response_code(500);
    echo json_encode(["status"=>"error","message"=>$stmt->error]);
    exit;
}

// If returnDate is NULL -> mark book as borrowed
if ($returnDate === null || $returnDate === '') {
    $up = $conn->prepare("UPDATE Book SET Status='borrowed' WHERE BookID = ?");
    $up->bind_param("i",$bookId);
    if (!$up->execute()) { $conn->rollback(); http_response_code(500); echo json_encode(["status"=>"error","message"=>$up->error]); exit; }
    $up->close();
}

$conn->commit();
echo json_encode(["status"=>"success","id"=>$conn->insert_id]);
$stmt->close();
