<?php

// namespace App\Controller;

// use GraphQL\Type\Definition\ObjectType;
// use GraphQL\Type\Definition\Type;
// use Doctrine\DBAL\Connection;

// class QueryType extends ObjectType {
//     public function __construct(Connection $db) {
//         parent::__construct([
//             'name' => 'Query',
//             'fields' => [
//                 'product' => [
//                     'type' => Types::product(),
//                     'args' => [
//                         'id' => Type::nonNull(Type::string())
//                     ],
//                     'resolve' => function ($root, $args) use ($db) {
//                         $sql = "SELECT * FROM products WHERE id = ?";
//                         $stmt = $db->prepare($sql);
//                         $result = $stmt->executeQuery([$args['id']]);
//                         return $result->fetchAssociative();
//                     }
//                 ],
//                 'products' => [
//                     'type' => Type::listOf(Types::product()),
//                     'resolve' => function ($root, $args) use ($db) {
//                         $sql = "SELECT * FROM products";
//                         $stmt = $db->executeQuery($sql);
//                         return $stmt->fetchAllAssociative();
//                     }
//                 ],
//                 'category' => [
//                     'type' => Types::category(),
//                     'args' => [
//                         'id' => Type::nonNull(Type::int())
//                     ],
//                     'resolve' => function ($root, $args) use ($db) {
//                         $sql = "SELECT * FROM categories WHERE id = ?";
//                         $stmt = $db->prepare($sql);
//                         $result = $stmt->executeQuery([$args['id']]);
//                         return $result->fetchAssociative();
//                     }
//                 ],
//                 'categories' => [
//                     'type' => Type::listOf(Types::category()),
//                     'resolve' => function ($root, $args) use ($db) {
//                         $sql = "SELECT * FROM categories";
//                         $stmt = $db->executeQuery($sql);
//                         return $stmt->fetchAllAssociative();
//                     }
//                 ]
//             ]
//         ]);
//     }
// }
