<?php
// public/index.php

header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' http://localhost:8080");

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRFToken");

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../vendor/autoload.php';
use Dotenv\Dotenv;
use Doctrine\DBAL\DriverManager;
use App\Controller\GraphQLController;
use FastRoute\RouteCollector;
use FastRoute\Dispatcher;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Database connection parameters
$connectionParams = [
    'dbname' => $_ENV['DB_DATABASE'],
    'user' => $_ENV['DB_USERNAME'],
    'password' => $_ENV['DB_PASSWORD'],
    'host' => $_ENV['DB_HOST'],
    'driver' => 'pdo_mysql',
];

// Create database connection
$conn = DriverManager::getConnection($connectionParams);

$dispatcher = FastRoute\simpleDispatcher(function(RouteCollector $r) use ($conn) {
    $r->addRoute('POST', '/graphql', [new GraphQLController($conn), 'handle']);
    // Add other routes if necessary
});

$httpMethod = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

// Dispatch the request
$routeInfo = $dispatcher->dispatch($httpMethod, $uri);

switch ($routeInfo[0]) {
    case Dispatcher::NOT_FOUND:
        // Not found
        http_response_code(404);
        echo "404 Not Found";
        break;
    case Dispatcher::METHOD_NOT_ALLOWED:
        // Method not allowed
        $allowedMethods = $routeInfo[1];
        http_response_code(405);
        echo "405 Method Not Allowed";
        break;
    case Dispatcher::FOUND:
        // Found
        $handler = $routeInfo[1];
        $vars = $routeInfo[2];
        call_user_func($handler, $vars);
        break;
}
?>
