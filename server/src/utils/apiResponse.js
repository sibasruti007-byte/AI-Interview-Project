class ApiResponse {
  static success(res, statusCode = 200, message = 'Request successful', data = null, meta = null) {
    const response = {
      success: true,
      message,
      data
    };
    if (meta) {
      response.meta = meta;
    }
    return res.status(statusCode).json(response);
  }

  static created(res, message = 'Resource created successfully', data = null) {
    return ApiResponse.success(res, 201, message, data);
  }

  static error(res, statusCode = 500, message = 'Something went wrong', errors = []) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors: Array.isArray(errors) ? errors : [errors]
    });
  }
}

module.exports = ApiResponse;
