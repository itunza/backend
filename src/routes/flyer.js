const express = require("express");
const router = express.Router();
const fs = require("fs");

//  @route  GET uploaded file
//  @desc   Upload save
//  @access public
router.get("/:name", (req, res) => {
  const name = req.params.name;

  fs.readFile("./flyers/" + name, (err, data) => {
    if (err) {
      res.status(400).json({
        error: {
          upload: err.message,
        },
      });
    } else {
      res.writeHead(200);
      res.end(data);
    }
  });
});

module.exports = router;