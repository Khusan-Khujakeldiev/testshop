<?php

namespace App\GraphQL;

use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Doctrine\DBAL\Connection;

class Types {
    private static $product;
    private static $category;
    private static $price;
    private static $order;
    private static $attributeValue;
    private static $attribute;
    private static $image;
    private static $query;
    private static $mutation;
    private static $createOrderInput;

    public static function product() {
        return self::$product ?: (self::$product = new ObjectType([
            'name' => 'Product',
            'fields' => [
                'id' => Type::nonNull(Type::string()),
                'name' => Type::string(),
                'description' => Type::string(),
                'in_stock' => Type::boolean(),
                'brand' => Type::string(),
                'category' => [
                    'type' => self::category(),
                    'resolve' => function ($product, $args, $context) {
                        $db = $context['db'];
                        $sql = "SELECT * FROM categories WHERE id = ?";
                        $stmt = $db->prepare($sql);
                        $result = $stmt->executeQuery([$product['category_id']]);
                        return $result->fetchAssociative();
                    }
                ],
                'price' => [
                    'type' => Type::listOf(self::price()),
                    'resolve' => function ($product, $args, $context) {
                        $db = $context['db'];
                        $sql = "SELECT * FROM prices WHERE product_id = ?";
                        $stmt = $db->prepare($sql);
                        $result = $stmt->executeQuery([$product['id']]);
                        return $result->fetchAllAssociative();
                    }
                ],
                'attributes' => [
                    'type' => Type::listOf(self::attributeValue()),
                    'resolve' => function ($product, $args, $context) {
                        $db = $context['db'];
                        $sql = "SELECT av.* FROM attribute_values av
                                JOIN product_attributes pa ON av.id = pa.attribute_value_id
                                WHERE pa.product_id = ?";
                        $stmt = $db->prepare($sql);
                        $result = $stmt->executeQuery([$product['id']]);
                        return $result->fetchAllAssociative();
                    }
                ],
                'images' => [
                    'type' => Type::listOf(self::image()),
                    'resolve' => function ($product, $args, $context) {
                        $db = $context['db'];
                        $sql = "SELECT * FROM product_images WHERE product_id = ?";
                        $stmt = $db->prepare($sql);
                        $result = $stmt->executeQuery([$product['id']]);
                        return $result->fetchAllAssociative();
                    }
                ]
            ]
        ]));
    }

    public static function category() {
        return self::$category ?: (self::$category = new ObjectType([
            'name' => 'Category',
            'fields' => [
                'id' => Type::nonNull(Type::int()),
                'name' => Type::string()
            ]
        ]));
    }

    public static function price() {
        return self::$price ?: (self::$price = new ObjectType([
            'name' => 'Price',
            'fields' => [
                'amount' => Type::float(),
                'currency_label' => Type::string(),
                'currency_symbol' => Type::string()
            ]
        ]));
    }

    public static function order() {
        return self::$order ?: (self::$order = new ObjectType([
            'name' => 'Order',
            'fields' => [
                'id' => Type::nonNull(Type::int()),
                'product' => self::product(),
                'productName' => Type::string(),
                'quantity' => Type::int(),
                'createdAt' => Type::string(),
            ]
        ]));
    }

    public static function attributeValue() {
        return self::$attributeValue ?: (self::$attributeValue = new ObjectType([
            'name' => 'AttributeValue',
            'fields' => [
                'id' => Type::nonNull(Type::string()),
                'attribute_id' => Type::string(),
                'display_value' => Type::string(),
                'value' => Type::string(),
                'attribute' => [
                    'type' => self::attribute(),
                    'resolve' => function ($attributeValue, $args, $context) {
                        $db = $context['db'];
                        $sql = "SELECT * FROM attributes WHERE id = ?";
                        $stmt = $db->prepare($sql);
                        $result = $stmt->executeQuery([$attributeValue['attribute_id']]);
                        return $result->fetchAssociative();
                    }
                ]
            ]
        ]));
    }

    public static function attribute() {
        return self::$attribute ?: (self::$attribute = new ObjectType([
            'name' => 'Attribute',
            'fields' => [
                'id' => Type::nonNull(Type::string()),
                'name' => Type::string(),
                'type' => Type::string()
            ]
        ]));
    }

    public static function image() {
        return self::$image ?: (self::$image = new ObjectType([
            'name' => 'Image',
            'fields' => [
                'product_id' => Type::nonNull(Type::string()),
                'image_url' => Type::string()
            ]
        ]));
    }

    public static function query(Connection $db) {
        return self::$query ?: (self::$query = new ObjectType([
            'name' => 'Query',
            'fields' => [
                'product' => [
                    'type' => self::product(),
                    'args' => [
                        'id' => Type::nonNull(Type::string())
                    ],
                    'resolve' => function ($root, $args) use ($db) {
                        $sql = "SELECT * FROM products WHERE id = ?";
                        $stmt = $db->prepare($sql);
                        $result = $stmt->executeQuery([$args['id']]);
                        return $result->fetchAssociative();
                    }
                ],
                'products' => [
                    'type' => Type::listOf(self::product()),
                    'resolve' => function ($root, $args) use ($db) {
                        $sql = "SELECT * FROM products";
                        $stmt = $db->executeQuery($sql);
                        return $stmt->fetchAllAssociative();
                    }
                ],
                'category' => [
                    'type' => self::category(),
                    'args' => [
                        'id' => Type::nonNull(Type::int())
                    ],
                    'resolve' => function ($root, $args) use ($db) {
                        $sql = "SELECT * FROM categories WHERE id = ?";
                        $stmt = $db->prepare($sql);
                        $result = $stmt->executeQuery([$args['id']]);
                        return $result->fetchAssociative();
                    }
                ],
                'categories' => [
                    'type' => Type::listOf(self::category()),
                    'resolve' => function ($root, $args) use ($db) {
                        $sql = "SELECT * FROM categories";
                        $stmt = $db->executeQuery($sql);
                        return $stmt->fetchAllAssociative();
                    }
                ]
            ]
        ]));
    }

    public static function createOrderInput() {
        return self::$createOrderInput ?: (self::$createOrderInput = new InputObjectType([
            'name' => 'CreateOrderInput',
            'fields' => [
                'productId' => Type::nonNull(Type::string()),
                'productName' => Type::nonNull(Type::string()),
                'quantity' => Type::nonNull(Type::int()),
                'attributes' => Type::listOf(new InputObjectType([
                    'name' => 'OrderAttributeInput',
                    'fields' => [
                        'name' => Type::nonNull(Type::string()),
                        'value' => Type::nonNull(Type::string())
                    ]
                ])),
            ]
        ]));
    }

    public static function mutation(Connection $db) {
        return self::$mutation ?: (self::$mutation = new ObjectType([
            'name' => 'Mutation',
            'fields' => [
                'createOrder' => [
                    'type' => self::order(),
                    'args' => [
                        'input' => Type::nonNull(self::createOrderInput()),
                    ],
                    'resolve' => function ($root, $args) use ($db) {
                        $input = $args['input'];
    
                        // Inserting data to database table
                        $sql = "INSERT INTO orders (product_id, product_name, quantity, created_at) VALUES (?, ?, ?, NOW())";
                        $stmt = $db->prepare($sql);
                        $stmt->executeStatement([$input['productId'], $input['productName'], $input['quantity']]);
    
                        // getting id of gotten order
                        $orderId = $db->lastInsertId();
    
                        // Adding attributes and connecting to Orders tables if attributes exist
                        if (!empty($input['attributes'])) {
                            foreach ($input['attributes'] as $attribute) {
                                $sql = "INSERT INTO order_attributes (order_id, attribute_name, attribute_value) VALUES (?, ?, ?)";
                                $stmt = $db->prepare($sql);
                                $stmt->executeStatement([$orderId, $attribute['name'], $attribute['value']]);
                            }
                        }
    
                        // getting and returning orders
                        $sql = "SELECT * FROM orders WHERE id = ?";
                        $stmt = $db->prepare($sql);
                        $result = $stmt->executeQuery([$orderId]);
                        $orderData = $result->fetchAssociative();
    
                        // creating returning object
                        return [
                            'id' => $orderData['id'],
                            'product' => [
                                'id' => $orderData['product_id'],
                                'name' => $orderData['product_name'],
                            ],
                            'productName' => $orderData['product_name'],
                            'quantity' => $orderData['quantity'],
                            'createdAt' => $orderData['created_at'],
                        ];
                    }
                ]
            ]
        ]));
    }
    
}
