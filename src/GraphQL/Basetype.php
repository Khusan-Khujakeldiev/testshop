<?php

namespace App\GraphQL;

use Doctrine\DBAL\Connection;

abstract class Basetype {
    protected $db;

    public function __construct(Connection $db) {
        $this->db = $db;
    }

    protected function resolveAssociative($sql, $queryArgs) {
        $stmt = $this->db->prepare($sql);
        $result = $stmt->executeQuery([$queryArgs]);
        return $result->fetchAssociative();
    }

    protected function resolveAllAssociative($sql, $queryArgs = null) {
        $stmt = $this->db->prepare($sql);

        if ($queryArgs !== null) {
            if (!is_array($queryArgs)) {
                $queryArgs = [$queryArgs];
            }
            $result = $stmt->executeQuery($queryArgs);
        } else {
            $result = $stmt->executeQuery();
        }

        return $result->fetchAllAssociative();
    }
}
