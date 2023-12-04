const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
    MessagesController
} = require("../controllers");

//  @route  POST messages
//  @desc   Messages save
//  @access private
router.post(
    "/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        MessagesController.saveMessage(
            req.body,
            req.user.id,
            (err, messages) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(messages);
                }
            }
        );
    }
);

//  @route  GET messages
//  @desc   Messages list all
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
        const order = req.query.hasOwnProperty("order") ? req.query.order : "message_title";
        const ordermethod = req.query.hasOwnProperty("ordermethod") ? req.query.ordermethod : "ASC";
        const title = req.query.hasOwnProperty("title") ? req.query.title : "";

        MessagesController.getAllMessages(
            page,
            limit,
            order,
            ordermethod,
            title,
            (err, messages) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(messages);
                }
            }
        );
    }
);

//  @route  PATCH messages
//  @desc   Patch a messages
//  @access private
router.patch(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const messageId = req.params.id;

        if (messageId > 0) {
            MessagesController.updateMessage(
                messageId,
                req.body,
                req.user.id,
                (err, messages) => {
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        res.status(200).json(messages);
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

//  @route  DELETE messages
//  @desc   Delete a messages
//  @access private
router.delete(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const messagesId = req.params.id;
        if (messagesId > 0) {
            MessagesController.deleteMessage(messagesId, (err, messages) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(messages);
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

//  @route  GET messages
//  @desc   Messages list all
//  @access private
router.get("/all", (req, res) => {
    MessagesController.exportMessages((err, messages) => {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(200).json(messages);
        }
    });
});

module.exports = router;