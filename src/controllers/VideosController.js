const sequelize = require("sequelize");
const Op = sequelize.Op;

const Video = require("../../models").Video;
const Category = require("../../models").Category;

const {
    cleanPhone,
    createError,
    validateVideoInput,
    isEmpty,
    validateId
} = require("../validation");

const {
    keys
} = require("../../config");

module.exports = {
    findById(id, result) {
        if (id > 0) {
            Video.findOne({
                    attributes: [
                        "id",
                        "category_id",
                        "video_name",
                        "video_link"
                    ],
                    where: {
                        id: id
                    }
                })
                .then(video => {
                    if (video) {
                        result(null, video);
                    } else {
                        let err = {
                            error: "Video does not exist"
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
    findVideo(where, result) {
        Video.findOne({
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
    saveVideo(video, personnelId, result) {
        const {
            errors,
            isValid
        } = validateVideoInput(video);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            this.findVideo({
                    video_name: video.name,
                    video_link: video.link,
                    category_id: video.category
                },
                (err, cat) => {
                    if (err) {
                        const customError = createError(err);
                        result(customError, null);
                    } else {

                        if (cat) {
                            const customError = createError({
                                video: "Video already exist"
                            });
                            result(customError, null);
                        } else {
                            Video.create({
                                    category_id: video.category,
                                    video_name: video.name,
                                    video_link: video.link,
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
    getAllVideos(
        page,
        limit,
        order,
        ordermethod,
        name,
        category,
        result
    ) {
        let where = {};

        if (!isEmpty(name)) {
            where["video_name"] = {
                [Op.like]: "%" + name + "%"
            };
        }
        if (!isEmpty(category)) {
            where["category_id"] = category;
        }

        Video.findAll({
                attributes: [
                    ["video_name", "name"],
                    ["video_link", "link"],
                    [sequelize.col("video_category.category_name"), "category_name"],
                    "id",
                    "category_id"
                ],
                include: [{
                    model: Category,
                    as: "video_category",
                    required: true,
                    attributes: [],
                    required: false
                }],
                offset: page * limit,
                limit: limit,
                raw: true,
                where: where,
                order: [
                    [order, ordermethod]
                ]
            })
            .then(video => {
                this.countVideo(where, (err, total) => {
                    if (err) {
                        result(err, null);
                    } else {
                        result(null, {
                            rows: total,
                            items: video
                        });
                    }
                });
            })
            .catch(err => {
                result(err, null);
            });
    },
    countVideo(where, result) {
        Video.count({
                where: where
            })
            .then(total => {
                result(null, total);
            })
            .catch(error => {
                result(error, null);
            });
    },
    updateVideo(videoId, video, personnelId, result) {
        const {
            errors,
            isValid
        } = validateVideoInput(video);
        if (!isValid) {
            const customError = createError(errors);
            result(customError, null);
        } else {
            this.findVideo({
                    video_name: video.name,
                    category_id: video.category
                },
                (err, cat) => {
                    if (err) {
                        const customError = createError(err);
                        result(customError, null);
                    } else {
                        if (cat) {
                            const customError = createError({
                                video: "Video already exist"
                            });
                            result(customError, null);
                        } else {
                            Video.findByPk(videoId)
                                .then(fetchedVideo => {
                                    if (fetchedVideo) {
                                        Video.update({
                                                category_id: video.category,
                                                video_name: video.name,
                                                video_link: video.link,
                                                updated_at: new Date(),
                                                modified_by: personnelId
                                            }, {
                                                where: {
                                                    id: videoId
                                                }
                                            })
                                            .then(updatedVideo => {
                                                result(null, {
                                                    message: "Success"
                                                });
                                            })
                                            .catch(err => {
                                                result(err, null);
                                            });
                                    } else {
                                        const customError = createError({
                                            id: "Video does not exist"
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
    deleteVideo(videoId, result) {
        Video.findByPk(videoId)
            .then(video => {
                if (video) {
                    Video.destroy({
                            where: {
                                id: videoId
                            }
                        })
                        .then(removedVideo => {
                            result(null, {
                                message: "Success"
                            });
                        })
                        .catch(err => {
                            result(err, null);
                        });
                } else {
                    const customError = createError({
                        id: "Video does not exist"
                    });
                    result(customError, null);
                }
            })
            .catch(err => {
                const customError = createError(err);
                result(customError, null);
            });
    },
    exportVideos(result) {
        Video.findAll({
                attributes: [
                    ["video_name", "name"],
                    ["video_link", "link"],
                    [sequelize.col("video_category.category_name"), "category_name"],
                    "id",
                    "category_id"
                ],
                include: [{
                    model: Category,
                    as: "video_category",
                    required: true,
                    attributes: [],
                    required: false
                }],
                raw: true
            })
            .then(video => {
                result(null, video);
            })
            .catch(err => {
                result(err, null);
            });
    }
};