// src/routes/api/get.js

const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
 module.exports = async (req, res) => {
  // TODO
  logger.info(`Handling Get request`);
  logger.debug({req});
  const expand = !!req.query.expand;
  logger.debug({expand}, 'Print Expand value');
  try {
    let fragments = await Fragment.byUser(req.user, expand);
    logger.debug({ fragments }, `Getting fragments byUser`, );
    return res.status(200).json(createSuccessResponse({ fragments: fragments }));
  }
  catch (err) {
    logger.err(`Error getting fragments byUser`, { err });
    return res.status(400).json(createErrorResponse(400, err));
  }
};
