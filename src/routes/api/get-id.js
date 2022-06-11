// src/routes/api/get-id.js
const logger = require('../../logger');
const { Fragment } = require('../../model/fragment');
const { createErrorResponse } = require('../../response');

module.exports = async(req, res) => {
  let {id} = req.params;
  logger.info({id}, `Handling Get ID request`);

  try {
    const fragment = await Fragment.byId(req.user, id);
    logger.debug({ fragment }, `Metadata returns after querying db`);

    // If the id includes an optional extension (e.g., .txt or .png), 
    if(id.includes('.')) {
      //the server attempts to convert the fragment to the type associated with that extension.

      // If the extension used represents an unknown or unsupported type, 
      //or if the fragment cannot be converted to this type, return HTTP 415
    }
    // Otherwise the successful response returns the raw fragment data 
    //using the type specified when created (e.g., text/plain or image/png) as its Content-Type.
    const result = await fragment.getData();
    res.setHeader('content-type', fragment.type);
    return res.status(200).send(result);
  }
  catch (err) {
    logger.error(`Error getting fragment metadata ${err}`);
    return res.status(404).json(createErrorResponse(404, 'Error getting fragment metadata'));
  }

  
}
