<?php
include_once __DIR__ . "/../config/db.php";

$q = isset($_GET['q']) ? trim($_GET['q']) : '';

if ($q === '') {
    $sql = "SELECT * FROM Book";
    $res = $conn->query($sql);
    $rows = [];
    while ($r = $res->fetch_assoc()) $rows[] = $r;
    echo json_encode($rows);
    exit;
}

// Prepared LIKE search (title, author, ISBN)
$like = "%{$q}%";
$stmt = $conn->prepare("SELECT * FROM Book WHERE Title LIKE ? OR Author LIKE ? OR ISBN LIKE ?");
$stmt->bind_param("sss", $like, $like, $like);
$stmt->execute();
$res = $stmt->get_result();
$rows = [];
while ($r = $res->fetch_assoc()) $rows[] = $r;
$stmt->close();

echo json_encode($rows);
