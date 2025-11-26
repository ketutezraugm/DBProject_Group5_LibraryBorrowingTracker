<?php
include_once __DIR__ . "/../config/db.php";

$q = isset($_GET['q']) ? trim($_GET['q']) : '';

$base = "SELECT b.*, bk.Title, s.Name as StudentName
         FROM Borrow b
         LEFT JOIN Book bk ON b.BookID = bk.BookID
         LEFT JOIN Student s ON b.MemberID = s.MemberID";

if ($q === '') {
    $sql = $base . " ORDER BY b.BorrowDate DESC";
    $res = $conn->query($sql);
    $rows = [];
    while ($r = $res->fetch_assoc()) $rows[] = $r;
    echo json_encode($rows);
    exit;
}

$like = "%{$q}%";
$stmt = $conn->prepare($base . " WHERE bk.Title LIKE ? OR s.Name LIKE ? OR b.BorrowDate LIKE ? ORDER BY b.BorrowDate DESC");
$stmt->bind_param("sss", $like, $like, $like);
$stmt->execute();
$res = $stmt->get_result();
$rows = [];
while ($r = $res->fetch_assoc()) $rows[] = $r;
$stmt->close();

echo json_encode($rows);
