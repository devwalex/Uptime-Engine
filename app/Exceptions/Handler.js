'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
   async handle(error, { request, response }) {
    if (error.name === 'InvalidJwtToken') {
      return response.status(401).json({
        status: 'Unauthorized',
        message: 'Authorization is required to access this resource.',
        status_code: 401,
      });
    }

    if (error.name === 'ExpiredJwtToken') {
      return response.status(401).json({
        status: 'Unauthorized',
        message: 'Session Expired. Please login again.',
        status_code: 401,
      });
    }

    return response.status(error.status).send(error.message);
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report (error, { request }) {
  }
}

module.exports = ExceptionHandler
