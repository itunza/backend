const sequelize = require("sequelize");
const Op = sequelize.Op;

const Message = require("../../models").Message;

const {
    cleanPhone,
    createError,
    validateMessageInput,
    isEmpty,
    validateId
} = require("../validation");

const {
    keys
} = require("../../config");

module.exports = {
    findById(id, result) {
        if (id > 0) {
            Message.findOne({
                    attributes: [
                        "id",
                        "message_title",
                        "message_content"
                    ],
                    where: {
                        id: id
                    }
                })
                .then(message => {
                    if (message) {
                        result(null, message);
                    } else {
                        let err = {
                            error: "Message does not exist"
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
    findMessage(where, result) {
        Message.findOne({
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
    saveMessage(message, personnelId, result) {
        const {
            errors,
            isValid
        } = validateMessageInput(message);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            this.findMessage({
                    message_title: message.title,
                    message_content: message.content
                },
                (err, cat) => {
                    if (err) {
                        const customError = createError(err);
                        result(customError, null);
                    } else {

                        if (cat) {
                            const customError = createError({
                                message: "Message already exist"
                            });
                            result(customError, null);
                        } else {
                            Message.create({
                                    message_title: message.title,
                                    message_content: message.content,
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
    getAllMessages(
        page,
        limit,
        order,
        ordermethod,
        title,
        result
    ) {
        let where = {};

        if (!isEmpty(title)) {
            where["message_title"] = {
                [Op.like]: "%" + title + "%"
            };
        }

        Message.findAll({
                attributes: [
                    ["message_title", "title"],
                    ["message_content", "content"],
                    ["created_at", "created"],
                    "id"
                ],
                offset: page * limit,
                limit: limit,
                raw: true,
                where: where,
                order: [
                    [order, ordermethod]
                ]
            })
            .then(message => {
                this.countMessage(where, (err, total) => {
                    if (err) {
                        result(err, null);
                    } else {
                        result(null, {
                            rows: total,
                            items: message
                        });
                    }
                });
            })
            .catch(err => {
                result(err, null);
            });
    },
    countMessage(where, result) {
        Message.count({
                where: where
            })
            .then(total => {
                result(null, total);
            })
            .catch(error => {
                result(error, null);
            });
    },
    updateMessage(messageId, message, personnelId, result) {
        const {
            errors,
            isValid
        } = validateMessageInput(message);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            this.findMessage({
                    message_title: message.title,
                    message_content: message.content
                },
                (err, cat) => {
                    if (err) {
                        const customError = createError(err);
                        result(customError, null);
                    } else {
                        if (cat) {
                            const customError = createError({
                                message: "Message already exist"
                            });
                            result(customError, null);
                        } else {
                            Message.findByPk(messageId)
                                .then(fetchedMessage => {
                                    if (fetchedMessage) {
                                        Message.update({
                                                message_title: message.title,
                                                message_content: message.content,
                                                updated_at: new Date(),
                                                modified_by: personnelId
                                            }, {
                                                where: {
                                                    id: messageId
                                                }
                                            })
                                            .then(updatedMessage => {
                                                result(null, {
                                                    message: "Success"
                                                });
                                            })
                                            .catch(err => {
                                                result(err, null);
                                            });
                                    } else {
                                        const customError = createError({
                                            id: "Message does not exist"
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
    deleteMessage(messageId, result) {
        Message.findByPk(messageId)
            .then(message => {
                if (message) {
                    Message.destroy({
                            where: {
                                id: messageId
                            }
                        })
                        .then(removedMessage => {
                            result(null, {
                                message: "Success"
                            });
                        })
                        .catch(err => {
                            result(err, null);
                        });
                } else {
                    const customError = createError({
                        id: "Message does not exist"
                    });
                    result(customError, null);
                }
            })
            .catch(err => {
                const customError = createError(err);
                result(customError, null);
            });
    },
    exportMessages(result) {
        Message.findAll({
                attributes: [
                    ["message_title", "title"],
                    ["message_content", "content"],
                    ["created_at", "created"],
                    "id"
                ],
                raw: true
            })
            .then(message => {
                result(null, message);
            })
            .catch(err => {
                result(err, null);
            });
    }
};