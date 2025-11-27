<?php
header("Content-Type: application/json");
include_once "../config/db.php";

$search = $_GET['q'] ?? "";

if ($search === "") {
    $sql = "SELECT * FROM Admin ORDER BY AdminID DESC";
    $result = $conn->query($sql);
    echo json_encode($result->fetch_all(MYSQLI_ASSOC));
    exit;
}

$search = "%{$search}%";

$stmt = $conn->prepare("
    SELECT * FROM Admin
    WHERE Name LIKE ?
       OR Email LIKE ?
       OR Phone LIKE ?
       OR AdminID LIKE ?
    ORDER BY AdminID DESC
");
$stmt->bind_param("ssss", $search, $search, $search, $search);
$stmt->execute();
echo json_encode($stmt->get_result()->fetch_all(MYSQLI_ASSOC));
exit;