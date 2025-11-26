<?php
include_once __DIR__ . "/../config/db.php";

$q = isset($_GET['q']) ? trim($_GET['q']) : '';

if ($q === '') {
    $res = $conn->query("SELECT * FROM Student");
    $rows = [];
    while ($r = $res->fetch_assoc()) $rows[] = $r;
    echo json_encode($rows);
    exit;
}

$like = "%{$q}%";
$stmt = $conn->prepare("SELECT * FROM Student WHERE Name LIKE ? OR Department LIKE ? OR Email LIKE ?");
$stmt->bind_param("sss", $like, $like, $like);
$stmt->execute();
$res = $stmt->get_result();
$rows = [];
while ($r = $res->fetch_assoc()) $rows[] = $r;
$stmt->close();

echo json_encode($rows);
