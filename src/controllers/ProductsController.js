const sequelize = require("sequelize");
const Op = sequelize.Op;

const Product = require("../../models").Product;
const Category = require("../../models").Category;

const {
    cleanPhone,
    createError,
    validateProductInput,
    isEmpty,
    validateId
} = require("../validation");

const {
    keys
} = require("../../config");

module.exports = {
    findById(id, result) {
        if (id > 0) {
            Product.findOne({
                    attributes: [
                        "id",
                        "category_id",
                        "product_name",
                        "product_sku",
                        "product_images",
                        "product_pdf",
                        "product_content"
                    ],
                    where: {
                        id: id
                    }
                })
                .then(product => {
                    if (product) {
                        result(null, product);
                    } else {
                        let err = {
                            error: "Product does not exist"
                        };
                        result(err, null);
                    }
                })
                .catch(error => {
                    result(error, null);
                });
        } else {
            let err = {
                error: "The ID is not a number"
            };
            result(err, null);
        }
    },
    findProduct(where, result) {
        Product.findOne({
                raw: true,
                attributes: ["*"],
                where: where
            })
            .then(cat => {
                return result(null, cat);
            })
            .catch(error => {
                result(error, null);
            });
    },
    saveProduct(product, personnelId, result) {
        const {
            errors,
            isValid
        } = validateProductInput(product);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            Product.create({
                    category_id: product.category ? product.category : null,
                    product_parent: product.parent ? product.parent : null,
                    product_name: product.name ? product.name : null,
                    product_sku: product.sku ? product.sku : null,
                    product_images: product.images ? product.images : null,
                    product_pdf: product.pdf ? product.pdf : null,
                    product_content: product.content ? product.content : null,
                    created_at: new Date(),
                    updated_at: new Date(),
                    created_by: personnelId,
                    modified_by: personnelId
                })
                .then(() => {
                    result(null, {
                        message: "Success"
                    });
                })
                .catch(err => {
                    const customError = createError(err);
                    result(customError, null);
                });
        }
    },
    getAllProducts(
        page,
        limit,
        order,
        ordermethod,
        name,
        category,
        parent,
        result
    ) {
        let where;
        if (parent > 0) {
            where = {
                product_parent: parent
            };
        } else {
            where = {
                product_parent: {
                    [Op.eq]: null
                }
            };
        }

        if (!isEmpty(name)) {
            where["product_name"] = {
                [Op.like]: "%" + name + "%"
            };
        }
        if (!isEmpty(category)) {
            where["category_id"] = category;
        }

        Product.findAll({
                attributes: [
                    ["product_name", "name"],
                    ["product_sku", "sku"],
                    ["product_images", "images"],
                    ["product_pdf", "pdf"],
                    ["product_content", "content"],
                    [sequelize.col("product_category.category_name"), "category_name"],
                    [sequelize.col("parent_product.product_name"), "parent_name"],
                    "id",
                    "category_id",
                    ["product_parent", "parent_id"]
                ],
                include: [{
                    model: Category,
                    as: "product_category",
                    required: false,
                    attributes: []
                }, {
                    model: Product,
                    as: "parent_product",
                    attributes: [],
                    required: false
                }],
                offset: page * limit,
                limit: limit,
                raw: true,
                where: where,
                order: [
                    [sequelize.col("product_category.category_name"), 'ASC'],
                    [sequelize.col("parent_product.product_name"), 'ASC'],
                    ['product_name', 'ASC'],
                ]
            })
            .then(product => {
                this.countProduct(where, (err, total) => {
                    if (err) {
                        result(err, null);
                    } else {
                        result(null, {
                            rows: total,
                            items: product
                        });
                    }
                });
            })
            .catch(err => {
                result(err, null);
            });
    },
    countProduct(where, result) {
        Product.count({
                where: where
            })
            .then(total => {
                result(null, total);
            })
            .catch(error => {
                result(error, null);
            });
    },
    updateProduct(productId, product, personnelId, result) {
        const {
            errors,
            isValid
        } = validateProductInput(product);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            Product.findByPk(productId)
                .then(fetchedProduct => {
                    //console.log(fetchedProduct)
                    if (fetchedProduct) {
                        Product.update({
                                category_id: product.category,
                                product_parent: product.parent,
                                product_name: product.name,
                                product_sku: product.sku,
                                product_images: product.images,
                                product_pdf: product.pdf,
                                product_content: product.content,
                                updated_at: new Date(),
                                modified_by: personnelId
                            }, {
                                where: {
                                    id: productId
                                }
                            })
                            .then(updatedProduct => {
                                result(null, {
                                    message: "Success"
                                });
                            })
                            .catch(err => {
                                result(err, null);
                            });
                    } else {
                        const customError = createError({
                            id: "Product does not exist"
                        });
                        result(customError, null);
                    }
                })
                .catch(err => {
                    result(err, null);
                });
        }
    },
    deleteProduct(productId, result) {
        Product.findByPk(productId)
            .then(product => {
                if (product) {
                    Product.destroy({
                            where: {
                                id: productId
                            }
                        })
                        .then(removedProduct => {
                            result(null, {
                                message: "Success"
                            });
                        })
                        .catch(err => {
                            result(err, null);
                        });
                } else {
                    const customError = createError({
                        id: "Product does not exist"
                    });
                    result(customError, null);
                }
            })
            .catch(err => {
                const customError = createError(err);
                result(customError, null);
            });
    },
    exportProducts(result) {
        Product.findAll({
                attributes: [
                    ["product_name", "name"],
                    ["product_sku", "sku"],
                    ["product_images", "images"],
                    ["product_pdf", "pdf"],
                    ["product_content", "content"],
                    [sequelize.col("product_category.category_name"), "category_name"],
                    [sequelize.col("parent_product.product_name"), "parent_name"],
                    "id",
                    "category_id",
                    ["product_parent", "parent_id"]
                ],
                include: [{
                    model: Category,
                    as: "product_category",
                    required: false,
                    attributes: []
                }, {
                    model: Product,
                    as: "parent_product",
                    attributes: [],
                    required: false
                }],
                raw: true
            })
            .then(product => {
                result(null, product);
            })
            .catch(err => {
                result(err, null);
            });
    }
};