<?php
header("Content-Type: application/json");
include_once "../config/db.php";

$search = $_GET['q'] ?? "";

// If no search → return all
if ($search === "") {
    $sql = "SELECT * FROM Book ORDER BY BookID DESC";
    $result = $conn->query($sql);
    echo json_encode($result->fetch_all(MYSQLI_ASSOC));
    exit;
}

// If searching → use LIKE
$search = "%{$search}%";

$stmt = $conn->prepare("
    SELECT * FROM Book 
    WHERE Title LIKE ? 
       OR Author LIKE ?
       OR ISBN LIKE ?
       OR Status LIKE ?
 ORDER BY BookID DESC
");

$stmt->bind_param("ssss", $search, $search, $search, $search);
$stmt->execute();
$data = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

echo json_encode($data);
exit;