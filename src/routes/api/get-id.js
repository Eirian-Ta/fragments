// src/routes/api/get-id.js
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');
const mime = require('mime-types');

module.exports = async(req, res) => {
  let {id} = req.params;
  logger.info({id}, `Handling Get ID request`);
  let convertType; // extMimeType
  try {
    // If the id includes an optional extension (e.g., .txt or .png), 
    if(id.includes('.')) {
      //the server attempts to convert the fragment to the type associated with that extension.
      const extMimeType = mime.lookup(id);
      // If the extension used represents an unknown or unsupported type, 
      //or if the fragment cannot be converted to this type, return HTTP 415
      if (extMimeType === false) {
        logger.warn(`The ext in request is invalid`);
        return res
          .status(415)
          .json(createErrorResponse(415, `The ext in request is invalid`));
      }
      convertType = extMimeType;
      logger.debug({ convertType }, `convertType`);
      id = id.replace(/\..*/, '');
    }

    const fragment = await Fragment.byId(req.user, id);
    logger.debug({ fragment }, `Metadata returns after querying db`);

    if (!convertType || convertType == fragment.type) {
      const result = await fragment.getData();
      res.setHeader('content-type', fragment.type);
      return res.status(200).send(result);
    }
    if (!fragment.formats.includes(convertType)) {
      logger.warn(`Can not convert ${fragment.type} to the request extension`);
      return res
        .status(415)
        .json(
          createErrorResponse(415, `Can not convert ${fragment.type} to the request extension`)
        );
    }

    // Otherwise the successful response returns the raw fragment data 
    //using the type specified when created (e.g., text/plain or image/png) as its Content-Type.
    logger.info(`Converting fragment`);
    const result = await fragment.convertData(convertType);
    res.setHeader('content-type', convertType);
    return res.status(200).send(result);
  }
  catch (err) {
    logger.error(`Error getting fragment metadata ${err}`);
    return res.status(404).json(createErrorResponse(404, 'Error getting fragment metadata'));
  }  
}
