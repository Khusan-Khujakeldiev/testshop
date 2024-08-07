<?php
// src/Controller/MutationType.php

// namespace App\Controller;

// use GraphQL\Type\Definition\ObjectType;
// use GraphQL\Type\Definition\Type;
// use Doctrine\DBAL\Connection;

// class MutationType extends ObjectType {
//     public function __construct(Connection $db) {
//         parent::__construct([
//             'name' => 'Mutation',
//             'fields' => [
//                 'createOrder' => [
//                     'type' => Types::order(),
//                     'args' => [
//                         'productId' => Type::nonNull(Type::string()),
//                         'quantity' => Type::nonNull(Type::int())
//                     ],
//                     'resolve' => function ($root, $args) use ($db) {
//                         $sql = "INSERT INTO orders (product_id, quantity) VALUES (?, ?)";
//                         $stmt = $db->prepare($sql);
//                         $stmt->executeStatement([$args['productId'], $args['quantity']]);

//                         $orderId = $db->lastInsertId();

//                         $sql = "SELECT * FROM orders WHERE id = ?";
//                         $stmt = $db->prepare($sql);
//                         $result = $stmt->executeQuery([$orderId]);
//                         return $result->fetchAssociative();
//                     }
//                 ]
//             ]
//         ]);
//     }
// }
