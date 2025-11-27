<?php
session_start();
header("Content-Type: application/json");
include_once __DIR__ . "/../config/db.php";

$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if (!$email || !$password) {
    echo json_encode([
        "status" => "error",
        "message" => "Email and password required"
    ]);
    exit;
}

/* ---------------------- CHECK ADMIN ---------------------- */
$stmt = $conn->prepare("SELECT AdminID AS ID, Name, Email, PasswordHash FROM Admin WHERE Email = ? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$admin = $stmt->get_result()->fetch_assoc();

if ($admin && password_verify($password, $admin['PasswordHash'])) {
    session_regenerate_id(true);
    $_SESSION['user_id'] = $admin['ID'];
    $_SESSION['role'] = "admin";
    $_SESSION['name'] = $admin['Name'];

    echo json_encode([
        "status" => "success",
        "role" => "admin"
    ]);
    exit;
}

/* ---------------------- CHECK STUDENT ---------------------- */
$stmt = $conn->prepare("SELECT MemberID AS ID, Name, Email, PasswordHash FROM Student WHERE Email = ? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$student = $stmt->get_result()->fetch_assoc();

if ($student && password_verify($password, $student['PasswordHash'])) {
    session_regenerate_id(true);
    $_SESSION['user_id'] = $student['ID'];
    $_SESSION['role'] = "student";
    $_SESSION['name'] = $student['Name'];

    echo json_encode([
        "status" => "success",
        "role" => "student"
    ]);
    exit;
}

/* ---------------------- INVALID CREDENTIALS ---------------------- */
echo json_encode([
    "status" => "error",
    "message" => "Invalid email or password."
]);
exit;
