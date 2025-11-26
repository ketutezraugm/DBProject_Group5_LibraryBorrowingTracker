<?php
include_once __DIR__ . "/../config/db.php";

$q = isset($_GET['q']) ? trim($_GET['q']) : '';

if ($q === '') {
    $res = $conn->query("SELECT * FROM Admin");
    $rows = [];
    while ($r = $res->fetch_assoc()) $rows[] = $r;
    echo json_encode($rows);
    exit;
}

$like = "%{$q}%";
$stmt = $conn->prepare("SELECT * FROM Admin WHERE Name LIKE ? OR Email LIKE ?");
$stmt->bind_param("ss", $like, $like);
$stmt->execute();
$res = $stmt->get_result();
$rows = [];
while ($r = $res->fetch_assoc()) $rows[] = $r;
$stmt->close();

echo json_encode($rows);
