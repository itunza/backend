const sequelize = require("sequelize");
const Op = sequelize.Op;

const Employee = require("../../models").Employee;
const generatePin = require("../utils/generatePin");
const sendSms = require("../utils/sendSms");

const {
  cleanPhone,
  createError,
  validateEmployeeInput,
  isEmpty,
  validateId,
} = require("../validation");

const { keys } = require("../../config");

module.exports = {
  findById(id, result) {
    if (id > 0) {
      Employee.findOne({
        attributes: [
          "id",
          "employee_fname",
          "employee_lname",
          "employee_brid",
          "employee_ab_number",
        ],
        where: {
          id: id,
        },
      })
        .then((employee) => {
          if (employee) {
            result(null, employee);
          } else {
            let err = {
              error: "Employee does not exist",
            };
            result(err, null);
          }
        })
        .catch((error) => {
          result(error, null);
        });
    } else {
      let err = {
        error: "The ID is not a number",
      };
      result(err, null);
    }
  },
  findEmployee(where, result) {
    Employee.findOne({
      raw: true,
      attributes: ["*"],
      where: where,
    })
      .then((cat) => {
        return result(null, cat);
      })
      .catch((error) => {
        result(error, null);
      });
  },
  saveEmployee(employee, personnelId, result) {
    const { errors, isValid } = validateEmployeeInput(employee);
    if (!isValid) {
      const customError = createError(errors);
      result(customError, null);
    } else {
      this.findEmployee(
        {
          employee_fname: employee.fname,
          employee_lname: employee.lname,
          employee_brid: employee.brid,
          employee_ab_number: employee.ab_number,
        },
        (err, cat) => {
          if (err) {
            const customError = createError(err);
            result(customError, null);
          } else {
            if (cat) {
              const customError = createError({
                employee: "Employee already exist",
              });
              result(customError, null);
            } else {
              Employee.create({
                employee_fname: employee.fname,
                employee_lname: employee.lname,
                employee_brid: employee.brid,
                employee_ab_number: employee.ab_number,
                created_at: new Date(),
                updated_at: new Date(),
                created_by: personnelId,
                modified_by: personnelId,
              })
                .then(() => {
                  result(null, {
                    message: "Success",
                  });
                })
                .catch((err) => {
                  const customError = createError(err);
                  result(customError, null);
                });
            }
          }
        }
      );
    }
  },
  getAllEmployees(page, limit, order, ordermethod, fname, lname, result) {
    let where = {};

    if (!isEmpty(fname)) {
      where["employee_fname"] = {
        [Op.like]: "%" + fname + "%",
      };
    }
    if (!isEmpty(lname)) {
      where["employee_lname"] = {
        [Op.like]: "%" + lname + "%",
      };
    }

    Employee.findAll({
      attributes: [
        ["employee_fname", "fname"],
        ["employee_lname", "lname"],
        ["employee_brid", "brid"],
        ["employee_ab_number", "ab_number"],
        "id",
      ],
      offset: page * limit,
      limit: limit,
      raw: true,
      where: where,
      order: [[order, ordermethod]],
    })
      .then((employee) => {
        this.countEmployee(where, (err, total) => {
          if (err) {
            result(err, null);
          } else {
            result(null, {
              rows: total,
              items: employee,
            });
          }
        });
      })
      .catch((err) => {
        result(err, null);
      });
  },
  countEmployee(where, result) {
    Employee.count({
      where: where,
    })
      .then((total) => {
        result(null, total);
      })
      .catch((error) => {
        result(error, null);
      });
  },
  updateEmployee(employeeId, employee, personnelId, result) {
    const { errors, isValid } = validateEmployeeInput(employee);
    if (!isValid) {
      const customError = createError(errors);
      result(customError, null);
    } else {
      this.findEmployee(
        {
          employee_fname: employee.fname,
          employee_lname: employee.lname,
          employee_brid: employee.brid,
          employee_ab_number: employee.ab_number,
        },
        (err, cat) => {
          if (err) {
            const customError = createError(err);
            result(customError, null);
          } else {
            if (cat) {
              const customError = createError({
                employee: "Employee already exist",
              });
              result(customError, null);
            } else {
              Employee.findByPk(employeeId)
                .then((fetchedEmployee) => {
                  if (fetchedEmployee) {
                    Employee.update(
                      {
                        employee_fname: employee.fname,
                        employee_lname: employee.lname,
                        employee_brid: employee.brid,
                        employee_ab_number: employee.ab_number,
                        updated_at: new Date(),
                        modified_by: personnelId,
                      },
                      {
                        where: {
                          id: employeeId,
                        },
                      }
                    )
                      .then((updatedEmployee) => {
                        result(null, {
                          message: "Success",
                        });
                      })
                      .catch((err) => {
                        result(err, null);
                      });
                  } else {
                    const customError = createError({
                      id: "Employee does not exist",
                    });
                    result(customError, null);
                  }
                })
                .catch((err) => {
                  result(err, null);
                });
            }
          }
        }
      );
    }
  },
  deleteEmployee(employeeId, result) {
    Employee.findByPk(employeeId)
      .then((employee) => {
        if (employee) {
          Employee.destroy({
            where: {
              id: employeeId,
            },
          })
            .then((removedEmployee) => {
              result(null, {
                message: "Success",
              });
            })
            .catch((err) => {
              result(err, null);
            });
        } else {
          const customError = createError({
            id: "Employee does not exist",
          });
          result(customError, null);
        }
      })
      .catch((err) => {
        const customError = createError(err);
        result(customError, null);
      });
  },
  exportEmployees(result) {
    Employee.findAll({
      attributes: [
        ["employee_fname", "fname"],
        ["employee_lname", "lname"],
        ["employee_brid", "brid"],
        ["employee_ab_number", "ab_number"],
        "id",
      ],
      raw: true,
    })
      .then((employee) => {
        result(null, employee);
      })
      .catch((err) => {
        result(err, null);
      });
  },
  verifyEmployee(employee, result) {
    if (!employee.number) {
      result(
        {
          status: "fail",
          message: "Employee number is required",
        },
        null
      );
    } else {
      const where = {
        [Op.or]: {
          employee_brid: employee.number,
          employee_ab_number: employee.number,
        },
      };

      this.findEmployee(where, (err, cat) => {
        if (err) {
          result(
            {
              status: "fail",
              message: "Employee not found",
            },
            null
          );
        } else {
          if (cat) {
            Employee.update(
              {
                verification_date: new Date(),
              },
              {
                where,
              }
            )
              .then((updatedEmployee) => {
                result(null, {
                  status: "success",
                  employee_name: cat.employee_fname + " " + cat.employee_lname,
                });
              })
              .catch((err) => {
                result(
                  {
                    status: "fail",
                    message: err,
                  },
                  null
                );
              });
          } else {
            result(
              {
                status: "fail",
                message: "Employee not found",
              },
              null
            );
          }
        }
      });
    }
  },
  loginEmployee(employee, result) {
    if (!employee.phone || !employee.number) {
      result(
        {
          status: "fail",
          message: "Employee number is required",
        },
        null
      );
    } else {
      this.findEmployee(
        {
          [Op.or]: {
            employee_brid: employee.number,
            employee_ab_number: employee.number,
          },
        },
        (err, cat) => {
          if (err) {
            result(
              {
                status: "fail",
                message: err.message,
              },
              null
            );
          } else {
            if (cat) {
              const pin = generatePin();
              const message =
                "Welcome " +
                cat.employee_fname +
                " " +
                cat.employee_lname +
                ". Please login with your OTP " +
                pin;

              sendSms(employee.phone, message, (err, sms_result) => {
                if (err) {
                  result(
                    {
                      status: "fail",
                      message: err,
                    },
                    null
                  );
                } else {
                  if (sms_result["code"] == false) {
                    result(
                      {
                        status: "fail",
                        message: sms_result["message"],
                      },
                      null
                    );
                  } else {
                    result(null, {
                      status: "success",
                      message: pin,
                    });
                  }
                }
              });
            } else {
              result(
                {
                  status: "fail",
                  message: "Employee not found",
                },
                null
              );
            }
          }
        }
      );
    }
  },
};
