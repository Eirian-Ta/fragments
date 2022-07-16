const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async function (req, res) {
  const { id } = req.params;
  logger.info({ id }, `Handling Get Fragment Info request `);
  let fragment;
  try {
    fragment = await Fragment.byId(req.user, id);
    logger.debug({ fragment }, `Metadata returns after querying db`);
    return res.status(200).json(createSuccessResponse({ fragment: fragment }));
  } 
  catch (err) {
    logger.error(`Error getting fragment metadata ${err}`);
    return res.status(404).json(createErrorResponse(404, 'Error getting fragment metadata'));
  }
};
