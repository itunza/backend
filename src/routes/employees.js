const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
    EmployeesController
} = require("../controllers");

//  @route  POST employees
//  @desc   Employees save
//  @access private
router.post(
    "/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        EmployeesController.saveEmployee(
            req.body,
            req.user.id,
            (err, employees) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(employees);
                }
            }
        );
    }
);

//  @route  GET employees
//  @desc   Employees list all
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
        const order = req.query.hasOwnProperty("order") ? req.query.order : "employee_fname";
        const ordermethod = req.query.hasOwnProperty("ordermethod") ? req.query.ordermethod : "ASC";
        const fname = req.query.hasOwnProperty("fname") ? req.query.fname : "";
        const lname = req.query.hasOwnProperty("lname") ? req.query.lname : "";

        EmployeesController.getAllEmployees(
            page,
            limit,
            order,
            ordermethod,
            fname,
            lname,
            (err, employees) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(employees);
                }
            }
        );
    }
);

//  @route  PATCH employees
//  @desc   Patch a employees
//  @access private
router.patch(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const employeeId = req.params.id;

        if (employeeId > 0) {
            EmployeesController.updateEmployee(
                employeeId,
                req.body,
                req.user.id,
                (err, employees) => {
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        res.status(200).json(employees);
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

//  @route  DELETE employees
//  @desc   Delete a employees
//  @access private
router.delete(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const employeesId = req.params.id;
        if (employeesId > 0) {
            EmployeesController.deleteEmployee(employeesId, (err, employees) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(employees);
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

//  @route  GET employees
//  @desc   Employees list all
//  @access private
router.get("/all", (req, res) => {
    EmployeesController.exportEmployees((err, employees) => {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(200).json(employees);
        }
    });
});

//  @route  POST employees/verify
//  @desc   Employee verification
//  @access public
router.post("/verify", (req, res) => {
    EmployeesController.verifyEmployee(
        req.body,
        (err, employees) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(employees);
            }
        }
    );
});

//  @route  POST employees/login
//  @desc   Employee login
//  @access public
router.post("/login", (req, res) => {
    EmployeesController.loginEmployee(
        req.body,
        (err, employees) => {
            if (err) {
                res.status(400).json(err);
            } else {
                res.status(200).json(employees);
            }
        }
    );
});

module.exports = router;