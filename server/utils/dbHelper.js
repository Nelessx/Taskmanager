import { Op } from "sequelize";

export const createSearchQuery = (searchTerm, fields) => {
  if (!searchTerm) return {};

  const searchConditions = fields.map((field) => ({
    [field]: { [Op.iLike]: `%${searchTerm}%` },
  }));

  return { [Op.or]: searchConditions };
};

export const handleDatabaseError = (error) => {
  let statusCode = 500;
  let message = "Database error occurred";

  if (error.name === "SequelizeValidationError") {
    statusCode = 400;
    message = error.errors[0].message;
  } else if (error.name === "SequelizeUniqueConstraintError") {
    statusCode = 409;
    message = "Record already exists";
  }

  return {
    statusCode,
    message,
    error: error.name,
    details: error.errors,
  };
};

export const paginationOptions = (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return {
    limit: parseInt(limit),
    offset: parseInt(offset),
  };
};
