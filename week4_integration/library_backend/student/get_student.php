<?php
include_once __DIR__ . "/../config/db.php";

$res = $conn->query("SELECT * FROM Student");
$list = [];
while ($r = $res->fetch_assoc()) $list[] = $r;
echo json_encode($list);
