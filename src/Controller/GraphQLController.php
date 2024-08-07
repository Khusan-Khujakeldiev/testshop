<?php

namespace App\Controller;

use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Schema;
use Doctrine\DBAL\Connection;
use App\GraphQL\Types;
use GraphQL\Type\SchemaConfig;
use RuntimeException;
use Throwable;

class GraphQLController {
    private $db;

    public function __construct(Connection $dbConnection) {
        $this->db = $dbConnection;
    }

    public function handle() {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");

        try {
            // Define the schema
            $schema = new Schema(
                (new SchemaConfig())
                    ->setQuery(Types::query($this->db))
                    ->setMutation(Types::mutation($this->db))
            );

            // Get the raw input
            $rawInput = file_get_contents('php://input');
            if ($rawInput === false) {
                throw new RuntimeException('Failed to get php://input');
            }

            // Decode the input
            $input = json_decode($rawInput, true);
            if (!$input) {
                throw new RuntimeException('Failed to decode JSON input');
            }

            $query = $input['query'];
            $variableValues = $input['variables'] ?? null;

            // Execute the query
            $rootValue = [];
            $context = ['db' => $this->db];
            $result = GraphQLBase::executeQuery($schema, $query, $rootValue, $context, $variableValues);
            $output = $result->toArray();
        } catch (Throwable $e) {
            // Detailed error logging for debugging
            error_log($e->getMessage());
            error_log($e->getTraceAsString());

            $output = [
                'error' => [
                    'message' => $e->getMessage(),
                ],
            ];
        }

        // Return the result as JSON
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($output);
    }
}
?>
