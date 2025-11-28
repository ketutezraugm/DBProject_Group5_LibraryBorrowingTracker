<?php
include_once __DIR__ . "/../config/db.php";
$res = $conn->query("SELECT * FROM Category");
$data = [];
while ($r = $res->fetch_assoc()) $data[] = $r;
echo json_encode($data);
