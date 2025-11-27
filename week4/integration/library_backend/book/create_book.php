<?php
include_once __DIR__ . "/../config/db.php";

$title  = $_POST['title']  ?? '';
$author = $_POST['author'] ?? '';
$isbn   = $_POST['isbn']   ?? '';
$year   = $_POST['year']   ?? null;
$status = $_POST['status'] ?? 'available';
$admin  = $_POST['admin']  ?? null;
$cat    = $_POST['category'] ?? null;

$stmt = $conn->prepare("INSERT INTO Book (Title, Author, ISBN, PublicationYear, Status, AdminID, CategoryID)
                        VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssiii", $title, $author, $isbn, $year, $status, $admin, $cat);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "id" => $conn->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}
$stmt->close();
