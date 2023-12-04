const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sequelize = require("sequelize");
const Op = sequelize.Op;

const Category = require("../../models").Category;

const {
    cleanPhone,
    createError,
    validateCategoryInput,
    isEmpty,
    validateId
} = require("../validation");

const {
    keys
} = require("../../config");

module.exports = {
    findById(id, result) {
        if (id > 0) {
            Category.findOne({
                    attributes: [
                        "id",
                        "category_name",
                        "category_type",
                        "category_parent"
                    ],
                    where: {
                        id: id
                    }
                })
                .then(category => {
                    if (category) {
                        result(null, category);
                    } else {
                        let err = {
                            error: "Category does not exist"
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
    findCategory(where, result) {
        Category.findOne({
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
    saveCategory(category, personnelId, result) {
        const {
            errors,
            isValid
        } = validateCategoryInput(category);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            this.findCategory({
                    category_name: category.name,
                    category_type: category.type
                },
                (err, cat) => {
                    if (err) {
                        const customError = createError(err);
                        result(customError, null);
                    } else {

                        if (cat) {
                            const customError = createError({
                                category: "Category already exist"
                            });
                            result(customError, null);
                        } else {
                            Category.create({
                                    category_name: category.name,
                                    category_type: category.type,
                                    category_parent: category.parent,
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
                    }
                }
            );
        }
    },
    getAllCategories(
        page,
        limit,
        order,
        ordermethod,
        name,
        type,
        parent,
        result
    ) {
        let where = {};

        if (!isEmpty(name)) {
            where["category_name"] = {
                [Op.like]: "%" + name + "%"
            };
        }
        if (!isEmpty(type)) {
            where["category_type"] = type;
        }
        if (!isEmpty(parent)) {
            where["category_parent"] = parent;
        }

        Category.findAll({
                attributes: [
                    ["category_name", "name"],
                    ["category_type", "type"],
                    ["category_parent", "parent_id"],
                    [sequelize.col("parent_category.category_name"), "parent_name"],
                    "id"
                ],
                offset: page * limit,
                limit: limit,
                raw: true,
                where: where,
                order: [
                    [order, ordermethod]
                ],
                include: [{
                    model: Category,
                    as: "parent_category",
                    attributes: [],
                    required: false
                }]
            })
            .then(category => {
                this.countCategory(where, (err, total) => {
                    if (err) {
                        result(err, null);
                    } else {
                        result(null, {
                            rows: total,
                            items: category
                        });
                    }
                });
            })
            .catch(err => {
                result(err, null);
            });
    },
    countCategory(where, result) {
        Category.count({
                where: where
            })
            .then(total => {
                result(null, total);
            })
            .catch(error => {
                result(error, null);
            });
    },
    updateCategory(categoryId, category, personnelId, result) {
        const {
            errors,
            isValid
        } = validateCategoryInput(category);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            this.findCategory({
                    category_name: category.name,
                    category_type: category.type,
                    category_parent: category.parent
                },
                (err, cat) => {
                    if (err) {
                        const customError = createError(err);
                        result(customError, null);
                    } else {
                        if (cat) {
                            const customError = createError({
                                category: "Category already exist"
                            });
                            result(customError, null);
                        } else {
                            Category.findByPk(categoryId)
                                .then(fetchedCategory => {
                                    //console.log(fetchedCategory)
                                    if (fetchedCategory) {
                                        Category.update({
                                                category_name: category.name,
                                                category_type: category.type,
                                                category_parent: category.parent,
                                                updated_at: new Date(),
                                                modified_by: personnelId
                                            }, {
                                                where: {
                                                    id: categoryId
                                                }
                                            })
                                            .then(updatedCategory => {
                                                result(null, {
                                                    message: "Success"
                                                });
                                            })
                                            .catch(err => {
                                                result(err, null);
                                            });
                                    } else {
                                        const customError = createError({
                                            id: "Category does not exist"
                                        });
                                        result(customError, null);
                                    }
                                })
                                .catch(err => {
                                    result(err, null);
                                });
                        }
                    }
                }
            );
        }
    },
    deleteCategory(categoryId, result) {
        Category.findByPk(categoryId)
            .then(category => {
                if (category) {
                    Category.destroy({
                            where: {
                                id: categoryId
                            }
                        })
                        .then(removedCategory => {
                            result(null, {
                                message: "Success"
                            });
                        })
                        .catch(err => {
                            result(err, null);
                        });
                } else {
                    const customError = createError({
                        id: "Category does not exist"
                    });
                    result(customError, null);
                }
            })
            .catch(err => {
                const customError = createError(err);
                result(customError, null);
            });
    },
    exportCategories(result) {
        Category.findAll({
                attributes: [
                    ["category_name", "name"],
                    ["category_type", "type"],
                    ["category_parent", "parent_id"],
                    [sequelize.col("parent_category.category_name"), "parent_name"],
                    "id"
                ],
                include: [{
                    model: Category,
                    as: "parent_category",
                    required: true,
                    attributes: [],
                    required: false
                }],
                raw: true
            })
            .then(category => {
                result(null, category);
            })
            .catch(err => {
                result(err, null);
            });
    }
};