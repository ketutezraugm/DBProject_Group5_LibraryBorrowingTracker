<?php
include_once __DIR__ . "/../config/db.php";

$sql = "SELECT * FROM Book";
$res = $conn->query($sql);

$rows = [];
while ($r = $res->fetch_assoc()) $rows[] = $r;

echo json_encode($rows);
