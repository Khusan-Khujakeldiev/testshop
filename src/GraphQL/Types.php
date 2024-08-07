<?php

namespace App\GraphQL;

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
                'quantity' => Type::int()
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

    public static function mutation(Connection $db) {
        return self::$mutation ?: (self::$mutation = new ObjectType([
            'name' => 'Mutation',
            'fields' => [
                'createOrder' => [
                    'type' => self::order(),
                    'args' => [
                        'productId' => Type::nonNull(Type::string()),
                        'quantity' => Type::nonNull(Type::int())
                    ],
                    'resolve' => function ($root, $args) use ($db) {
                        $sql = "INSERT INTO orders (product_id, quantity) VALUES (?, ?)";
                        $stmt = $db->prepare($sql);
                        $stmt->executeStatement([$args['productId'], $args['quantity']]);

                        $orderId = $db->lastInsertId();

                        $sql = "SELECT * FROM orders WHERE id = ?";
                        $stmt = $db->prepare($sql);
                        $result = $stmt->executeQuery([$orderId]);
                        return $result->fetchAssociative();
                    }
                ]
            ]
        ]));
    }
}
?>
