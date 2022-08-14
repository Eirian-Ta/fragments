// src/routes/api/put.js

const { Fragment } = require('../../model/fragment');
var { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');
const contentType = require('content-type');

module.exports = async (req, res) => {
  const { id } = req.params;
  logger.info({ id }, `Handling put request with id: `);
  const reqBody = req.body;
  logger.debug({reqBody} ,`Put request body`);
  if (!Buffer.isBuffer(reqBody)) {
    logger.warn('req.body is not a Buffer');
    return res.status(415).json(createErrorResponse(415, "req.body is not a Buffer"));
  }
  try {
    let fragment = await Fragment.byId(req.user, id);
    logger.info({ fragment }, `fragment meta data returned`);
    const { type } = contentType.parse(req);
    if (type != fragment.mimeType) {
      logger.warn({ type },"The Content-Type of the request does not match the existing fragment's type");
      return res.status(400).json(createErrorResponse(400,"The Content-Type of the request does not match the existing fragment's type"));
    }
    //await fragment.save(); // write metadata
    await fragment.setData(req.body); // write raw data
    const fullURL = process.env.API_URL + req.originalUrl;
    res.set('Location', `${fullURL}/${fragment.id}`);
    return res.status(201).json(createSuccessResponse({ fragment }));
  } 
  catch (err) {
    logger.error({ err }, 'Error updating fragment');
    return res.status(404).json(createErrorResponse(404, err));
  }
};
