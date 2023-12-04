const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
    VideosController
} = require("../controllers");

//  @route  POST videos
//  @desc   Videos save
//  @access private
router.post(
    "/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        VideosController.saveVideo(
            req.body,
            req.user.id,
            (err, videos) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(videos);
                }
            }
        );
    }
);

//  @route  GET videos
//  @desc   Videos list all
//  @access private
router.get(
    "/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 0;
        const limit =
            parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
        const order = req.query.hasOwnProperty("order") ? req.query.order : "video_name";
        const ordermethod = req.query.hasOwnProperty("ordermethod") ? req.query.ordermethod : "ASC";
        const name = req.query.hasOwnProperty("name") ? req.query.name : "";
        const category = req.query.hasOwnProperty("category") ? req.query.category : "";

        VideosController.getAllVideos(
            page,
            limit,
            order,
            ordermethod,
            name,
            category,
            (err, videos) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(videos);
                }
            }
        );
    }
);

//  @route  PATCH videos
//  @desc   Patch a videos
//  @access private
router.patch(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const videoId = req.params.id;

        if (videoId > 0) {
            VideosController.updateVideo(
                videoId,
                req.body,
                req.user.id,
                (err, videos) => {
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        res.status(200).json(videos);
                    }
                }
            );
        } else {
            res.status(400).json({
                error: {
                    id: "No id provided"
                }
            });
        }
    }
);

//  @route  DELETE videos
//  @desc   Delete a videos
//  @access private
router.delete(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const videosId = req.params.id;
        if (videosId > 0) {
            VideosController.deleteVideo(videosId, (err, videos) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(videos);
                }
            });
        } else {
            res.status(400).json({
                error: {
                    id: "No id provided"
                }
            });
        }
    }
);

//  @route  GET videos
//  @desc   Videos list all
//  @access private
router.get("/all", (req, res) => {
    VideosController.exportVideos((err, videos) => {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(200).json(videos);
        }
    });
});

module.exports = router;