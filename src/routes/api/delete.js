// src/routes/api/delete.js

const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
var { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  const { id } = req.params;
  logger.info({ id }, `Handling Delete request `);
  try {
    await Fragment.delete(req.user, id);
    return res.status(200).json(createSuccessResponse());
  } catch (err) {
    logger.error({ err }, `Error while handling delete request ${id}`);
    return res.status(404).json(createErrorResponse(404, 'Error while handling delete request'));
  }
};
