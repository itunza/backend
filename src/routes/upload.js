const express = require("express");
const router = express.Router();
const passport = require("passport");
const fs = require('fs');

//  @route  POST upload
//  @desc   Upload save
//  @access private
router.post(
    "/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        if (req.files) {

            const file = req.files.file;
            const fileName = file.name;

            file.mv("./uploads/" + fileName, (err) => {
                if (err) {
                    res.status(400).json({
                        error: {
                            upload: err.message
                        }
                    });
                } else {
                    res.status(200).json({
                        message: "Success"
                    });
                }
            })

        } else {
            res.status(400).json({
                error: {
                    upload: "Please select a file to upload"
                }
            });
        }
    }
);

//  @route  GET upload
//  @desc   Upload save
//  @access private
router.get(
    "/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        fs.readdir('./uploads/', (err, files) => {
            if (err) {
                res.status(400).json({
                    error: {
                        upload: err.message
                    }
                });
            } else {
                res.status(200).json({
                    files: files
                });
            }
        });
    }
);

//  @route  GET uploaded file
//  @desc   Upload save
//  @access public
router.get("/file/:name", (req, res) => {
    const name = req.params.name;

    fs.readFile('./uploads/' + name, (err, data) => {
        if (err) {
            res.status(400).json({
                error: {
                    upload: err.message
                }
            });
        } else {
            res.writeHead(200);
            res.end(data);
        }
    });
});

//  @route  DELETE uploaded file
//  @desc   Upload save
//  @access private
router.delete(
    "/:name",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const name = req.params.name;

        fs.unlink('./uploads/' + name, (err) => {
            if (err) {
                res.status(400).json({
                    error: {
                        upload: err.message
                    }
                });
            } else {
                res.status(200).json({
                    message: "Success"
                });
            }
        });
    });

module.exports = router;