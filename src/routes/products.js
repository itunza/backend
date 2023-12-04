const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
    ProductsController
} = require("../controllers");

//  @route  POST products
//  @desc   Products save
//  @access private
router.post(
    "/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        ProductsController.saveProduct(
            req.body,
            req.user.id,
            (err, products) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(products);
                }
            }
        );
    }
);

//  @route  GET products
//  @desc   Products list all
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
        const order = req.query.hasOwnProperty("order") ? req.query.order : "product_name";
        const ordermethod = req.query.hasOwnProperty("ordermethod") ? req.query.ordermethod : "ASC";
        const name = req.query.hasOwnProperty("name") ? req.query.name : "";
        const category = req.query.hasOwnProperty("category") ? req.query.category : "";
        const parent = req.query.hasOwnProperty("parent") ? req.query.parent : "";

        ProductsController.getAllProducts(
            page,
            limit,
            order,
            ordermethod,
            name,
            category,
            parent,
            (err, products) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(products);
                }
            }
        );
    }
);

//  @route  PATCH products
//  @desc   Patch a products
//  @access private
router.patch(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const productId = req.params.id;

        if (productId > 0) {
            ProductsController.updateProduct(
                productId,
                req.body,
                req.user.id,
                (err, products) => {
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        res.status(200).json(products);
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

//  @route  DELETE products
//  @desc   Delete a products
//  @access private
router.delete(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const productsId = req.params.id;
        if (productsId > 0) {
            ProductsController.deleteProduct(productsId, (err, products) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(products);
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

//  @route  GET products
//  @desc   Products list all
//  @access private
router.get("/all", (req, res) => {
    ProductsController.exportProducts((err, products) => {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(200).json(products);
        }
    });
});

module.exports = router;