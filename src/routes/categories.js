const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
    CategoriesController
} = require("../controllers");

//  @route  POST categories
//  @desc   Categories save
//  @access private
router.post(
    "/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        CategoriesController.saveCategory(
            req.body,
            req.user.id,
            (err, categories) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(categories);
                }
            }
        );
    }
);

//  @route  GET categories
//  @desc   Categories list all
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
        const order = req.query.hasOwnProperty("order") ? req.query.order : "category_name";
        const ordermethod = req.query.hasOwnProperty("ordermethod") ? req.query.ordermethod : "ASC";
        const name = req.query.hasOwnProperty("name") ? req.query.name : "";
        const type = req.query.hasOwnProperty("type") ? req.query.type : "";
        const parent = req.query.hasOwnProperty("parent") ? req.query.parent : "";

        CategoriesController.getAllCategories(
            page,
            limit,
            order,
            ordermethod,
            name,
            type,
            parent,
            (err, categories) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(categories);
                }
            }
        );
    }
);

//  @route  PATCH categories
//  @desc   Patch a categories
//  @access private
router.patch(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const categoriesId = req.params.id;

        if (categoriesId > 0) {
            CategoriesController.updateCategory(
                categoriesId,
                req.body,
                req.user.id,
                (err, categories) => {
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        res.status(200).json(categories);
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

//  @route  DELETE categories
//  @desc   Delete a categories
//  @access private
router.delete(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const categoriesId = req.params.id;
        if (categoriesId > 0) {
            CategoriesController.deleteCategory(categoriesId, (err, categories) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(categories);
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

//  @route  GET categories
//  @desc   Categories list all
//  @access private
router.get("/all", (req, res) => {
    CategoriesController.exportCategories((err, categories) => {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(200).json(categories);
        }
    });
});

module.exports = router;