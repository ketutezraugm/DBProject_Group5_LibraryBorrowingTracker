<?php
header("Content-Type: application/json");
include_once "../config/db.php";

$search = $_GET['q'] ?? "";

if ($search === "") {
    $sql = "SELECT * FROM Category ORDER BY CategoryID DESC";
    $result = $conn->query($sql);
    echo json_encode($result->fetch_all(MYSQLI_ASSOC));
    exit;
}

$search = "%{$search}%";

$stmt = $conn->prepare("
    SELECT * FROM Category
    WHERE CategoryName LIKE ?
       OR CategoryID LIKE ?
    ORDER BY CategoryID DESC
");
$stmt->bind_param("ss", $search, $search);
$stmt->execute();
echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
exit;