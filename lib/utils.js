export const request = (method, params, id, options = {}) => {
  if (typeof(method) !== 'string')
    throw `${method} must be a string.`;

  const request = {
    method
  };

  if (typeof(options.version) === 'undefined' || options.version !== 1)
    request.jsonrpc = '2.0';

  if (params) {
    if (typeof(params) !== 'object' && !Array.isArray(params))
      throw `${params} must be an object, array or omitted.`;

    request.params = params;
  }

  if(typeof(id) === 'undefined') {
    var generator = typeof(options.generator) === 'function' ? options.generator : Utils.generateId;
    request.id = generator(request, options);
  } else {
    request.id = id;
  }

  return request;
}

/**
 *  Generates a random UUID
 *  @return {String}
 */
export const generateId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  };
