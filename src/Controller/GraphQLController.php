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
    private $types;

    public function __construct(Connection $dbConnection) {
        $this->db = $dbConnection;
        $this->types = new Types($this->db);
    }

    public function handle() {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");

        try {
            $schema = $this->getSchema();
            $input = $this->getInputData();
            $query = $input['query'];
            $variableValues = $input['variables'] ?? null;
            $result = $this->getQuery($schema, $query, $variableValues);
            $output = $result->toArray();
        } catch (Throwable $e) {
            $this->logError($e);
            $output = $this->formatError($e);
        }

        header('Content-Type: application/json; charset=UTF-8');
        $this->returnOutput($output);
    }

    private function getSchema() {
        return new Schema(
            (new SchemaConfig())
                ->setQuery($this->types->query())
                ->setMutation($this->types->mutation())
        );
    }

    private function getInputData() {
        $rawInput = file_get_contents('php://input');
        if ($rawInput === false) {
            throw new RuntimeException('Failed to get php://input');
        }

        $input = json_decode($rawInput, true);
        if (!$input) {
            throw new RuntimeException('Failed to decode JSON input');
        }

        return $input;
    }

    private function getQuery(Schema $schema, string $query, ?array $variableValues) {
        $rootValue = [];
        $context = ['db' => $this->db];
        return GraphQLBase::executeQuery($schema, $query, $rootValue, $context, $variableValues);
    }

    private function logError(Throwable $e) {
        error_log($e->getMessage());
        error_log($e->getTraceAsString());
    }

    private function formatError(Throwable $e) {
        return [
            'error' => [
                'message' => $e->getMessage(),
            ],
        ];
    }

    private function returnOutput(array $output) {
        echo json_encode($output);
    }
}


?>