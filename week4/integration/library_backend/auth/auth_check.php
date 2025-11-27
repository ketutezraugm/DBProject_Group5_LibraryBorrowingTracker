<?php
// /library_backend/auth/auth_check.php
// include this at the very top of any protected PHP endpoint or page
if (session_status() === PHP_SESSION_NONE) session_start();

function auth_check($role = null) {
    if (empty($_SESSION['user_id'])) {
        // not logged in -> redirect to login page (browser)
        header("Location: /library_frontend/auth/login.html");
        exit;
    }
    if ($role !== null && $_SESSION['role'] !== $role) {
        // unauthorized
        http_response_code(403);
        echo json_encode(["status"=>"error","message"=>"Forbidden"]);
        exit;
    }
}
?>
