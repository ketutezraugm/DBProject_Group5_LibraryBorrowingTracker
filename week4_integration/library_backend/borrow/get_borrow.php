<?php
include_once __DIR__ . "/../config/db.php";

$sql = "SELECT b.*, bk.Title, s.Name as StudentName
        FROM Borrow b
        LEFT JOIN Book bk ON b.BookID = bk.BookID
        LEFT JOIN Student s ON b.MemberID = s.MemberID
        ORDER BY b.BorrowDate DESC";
$res = $conn->query($sql);
$data = [];
while ($r = $res->fetch_assoc()) $data[] = $r;
echo json_encode($data);
