<?php
include_once __DIR__ . "/../config/db.php";

$q = isset($_GET['q']) ? trim($_GET['q']) : '';

if ($q === '') {
    $res = $conn->query("SELECT * FROM Category");
    $rows = [];
    while ($r = $res->fetch_assoc()) $rows[] = $r;
    echo json_encode($rows);
    exit;
}

$like = "%{$q}%";
$stmt = $conn->prepare("SELECT * FROM Category WHERE CategoryName LIKE ?");
$stmt->bind_param("s", $like);
$stmt->execute();
$res = $stmt->get_result();
$rows = [];
while ($r = $res->fetch_assoc()) $rows[] = $r;
$stmt->close();

echo json_encode($rows);
