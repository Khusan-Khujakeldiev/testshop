<?php
namespace App\GraphQL;

use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Doctrine\DBAL\Connection;

class Types extends BaseType {
    private $product;
    private $category;
    private $price;
    private $order;
    private $attributeValue;
    private $attribute;
    private $image;
    private $query;
    private $mutation;
    private $createOrderInput;

    public function __construct(Connection $db) {
        parent::__construct($db); // Вызов конструктора базового класса
    }

    private function product() {
        return $this->product ?: ($this->product = new ObjectType([
            'name' => 'Product',
            'fields' => [
                'id' => Type::nonNull(Type::string()),
                'name' => Type::string(),
                'description' => Type::string(),
                'in_stock' => Type::boolean(),
                'brand' => Type::string(),
                'category' => [
                    'type' => $this->category(),
                    'resolve' => function ($product, $args) {
                        $sql = "SELECT * FROM categories WHERE id = ?";
                        return $this->resolveAssociative($sql, $product['category_id']);
                    }
                ],
                'price' => [
                    'type' => Type::listOf($this->price()),
                    'resolve' => function ($product, $args) {
                        $sql = "SELECT * FROM prices WHERE product_id = ?";
                        return $this->resolveAllAssociative($sql, $product['id']);
                    }
                ],
                'attributes' => [
                    'type' => Type::listOf($this->attributeValue()),
                    'resolve' => function ($product, $args) {
                        $sql = "SELECT av.* FROM attribute_values av
                                JOIN product_attributes pa ON av.id = pa.attribute_value_id
                                WHERE pa.product_id = ?";
                        return $this->resolveAllAssociative($sql, $product['id']);
                    }
                ],
                'images' => [
                    'type' => Type::listOf($this->image()),
                    'resolve' => function ($product, $args) {
                        $sql = "SELECT * FROM product_images WHERE product_id = ?";
                        return $this->resolveAllAssociative($sql, $product['id']);
                    }
                ]
            ]
        ]));
    }

    private function category() {
        return $this->category ?: ($this->category = new ObjectType([
            'name' => 'Category',
            'fields' => [
                'id' => Type::nonNull(Type::int()),
                'name' => Type::string()
            ]
        ]));
    }

    private function price() {
        return $this->price ?: ($this->price = new ObjectType([
            'name' => 'Price',
            'fields' => [
                'amount' => Type::float(),
                'currency_label' => Type::string(),
                'currency_symbol' => Type::string()
            ]
        ]));
    }

    private function attributeValue() {
        return $this->attributeValue ?: ($this->attributeValue = new ObjectType([
            'name' => 'AttributeValue',
            'fields' => [
                'id' => Type::nonNull(Type::string()),
                'attribute_id' => Type::string(),
                'display_value' => Type::string(),
                'value' => Type::string(),
                'attribute' => [
                    'type' => $this->attribute(),
                    'resolve' => function ($attributeValue, $args) {
                        $sql = "SELECT * FROM attributes WHERE id = ?";
                        return $this->resolveAssociative($sql, $attributeValue['attribute_id']);
                    }
                ]
            ]
        ]));
    }

    private function attribute() {
        return $this->attribute ?: ($this->attribute = new ObjectType([
            'name' => 'Attribute',
            'fields' => [
                'id' => Type::nonNull(Type::string()),
                'name' => Type::string(),
                'type' => Type::string()
            ]
        ]));
    }

    private function image() {
        return $this->image ?: ($this->image = new ObjectType([
            'name' => 'Image',
            'fields' => [
                'product_id' => Type::nonNull(Type::string()),
                'image_url' => Type::string()
            ]
        ]));
    }

    private function order() {
        return $this->order ?: ($this->order = new ObjectType([
            'name' => 'Order',
            'fields' => [
                'id' => Type::nonNull(Type::int()),
                'product' => $this->product(),
                'productName' => Type::string(),
                'quantity' => Type::int(),
                'createdAt' => Type::string(),
            ]
        ]));
    }

    public function query() {
        return $this->query ?: ($this->query = new ObjectType([
            'name' => 'Query',
            'fields' => [
                'product' => [
                    'type' => $this->product(),
                    'args' => [
                        'id' => Type::nonNull(Type::string())
                    ],
                    'resolve' => function ($root, $args) {
                        $sql = "SELECT * FROM products WHERE id = ?";
                        return $this->resolveAssociative($sql, $args['id']);
                    }
                ],
                'products' => [
                    'type' => Type::listOf($this->product()),
                    'resolve' => function () {
                        $sql = "SELECT * FROM products";
                        return $this->resolveAllAssociative($sql,[]);
                    }
                ],
                'category' => [
                    'type' => $this->category(),
                    'args' => [
                        'id' => Type::nonNull(Type::int())
                    ],
                    'resolve' => function ($root, $args) {
                        $sql = "SELECT * FROM categories WHERE id = ?";
                        return $this->resolveAssociative($sql, $args['id']);
                    }
                ],
                'categories' => [
                    'type' => Type::listOf($this->category()),
                    'resolve' => function () {
                        $sql = "SELECT * FROM categories";
                        return $this->resolveAllAssociative($sql,[] );
                    }
                ]
            ]
        ]));
    }

    private function createOrderInput() {
        return $this->createOrderInput ?: ($this->createOrderInput = new InputObjectType([
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

    public function mutation() {
        return $this->mutation ?: ($this->mutation = new ObjectType([
            'name' => 'Mutation',
            'fields' => [
                'createOrder' => [
                    'type' => $this->order(),
                    'args' => [
                        'input' => Type::nonNull($this->createOrderInput()),
                    ],
                    'resolve' => function ($root, $args) {
                        $input = $args['input'];

                        $sql = "INSERT INTO orders (product_id, product_name, quantity, created_at) VALUES (?, ?, ?, NOW())";
                        $stmt = $this->db->prepare($sql);
                        $stmt->executeStatement([$input['productId'], $input['productName'], $input['quantity']]);

                        $orderId = $this->db->lastInsertId();

                        if (!empty($input['attributes'])) {
                            foreach ($input['attributes'] as $attribute) {
                                $sql = "INSERT INTO order_attributes (order_id, attribute_name, attribute_value) VALUES (?, ?, ?)";
                                $stmt = $this->db->prepare($sql);
                                $stmt->executeStatement([$orderId, $attribute['name'], $attribute['value']]);
                            }
                        }

                        $sql = "SELECT * FROM orders WHERE id = ?";
                        $orderData = $this->resolveAssociative($sql, $orderId);

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


