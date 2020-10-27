/**
 * EasyshipError is the base error from which all other more specific Easyship errors derive.
 * Specifically for errors returned from Easyship's REST API.
 */
class EasyshipError extends Error {
  constructor(raw = {}) {
    super(raw.message);
    this.type = this.constructor.name;
    this.code = raw.code;
    this.detail = raw.detail;
    this.path = raw.path;
    this.statusCode = raw.statusCode;
  }

  /**
   * Helper factory which takes raw stripe errors and outputs wrapping instances
   */
  static generate(rawEasyshipError) {
    switch (rawEasyshipError.type) {
      case 'invalid_request_error':
        return new EasyshipInvalidRequestError(rawEasyshipError);
      case 'api_error':
        return new EasyshipAPIError(rawEasyshipError);
      case 'authentication_error':
        return new EasyshipAuthenticationError(rawEasyshipError);
      case 'rate_limit_error':
        return new EasyshipRateLimitError(rawEasyshipError);
      default:
        return new Error('Generic', 'Unknown Error');
    }
  }
}

// Specific Easyship Error types:

/**
 * InvalidRequestError is raised when a request is initiated with invalid
 * parameters.
 */
class EasyshipInvalidRequestError extends EasyshipError {}

/**
 * APIError is a generic error that may be raised in cases where none of the
 * other named errors cover the problem. It could also be raised in the case
 * that a new error has been introduced in the API, but this version of the
 * Node.JS SDK doesn't know how to handle it.
 */
class EasyshipAPIError extends EasyshipError {}

/**
 * AuthenticationError is raised when invalid credentials are used to connect
 * to Easyship's servers.
 */
class EasyshipAuthenticationError extends EasyshipError {}

/**
 * PermissionError is raised in cases where access was attempted on a resource
 * that wasn't allowed.
 */
class EasyshipNotFoundError extends EasyshipError {}

/**
 * RateLimitError is raised in cases where an account is putting too much load
 * on Easyship's API servers (usually by performing too many requests). Please
 * back off on request rate.
 */
class EasyshipRateLimitError extends EasyshipError {}

/**
 * EasyshipConnectionError is raised in the event that the SDK can't connect to
 * Easyship's servers. That can be for a variety of different reasons from a
 * downed network to a bad TLS certificate.
 */
class EasyshipConnectionError extends EasyshipError {}

module.exports.generate = EasyshipError.generate;
module.exports.EasyshipError = EasyshipError;
module.exports.EasyshipInvalidRequestError = EasyshipInvalidRequestError;
module.exports.EasyshipAPIError = EasyshipAPIError;
module.exports.EasyshipAuthenticationError = EasyshipAuthenticationError;
module.exports.EasyshipNotFoundError = EasyshipNotFoundError;
module.exports.EasyshipRateLimitError = EasyshipRateLimitError;
module.exports.EasyshipConnectionError = EasyshipConnectionError;
