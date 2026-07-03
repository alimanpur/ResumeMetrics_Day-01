class ApiResponse {
  constructor(statusCode, message, data = null, meta = null) {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }

  static success(message = 'Success', data = null, meta = null) {
    return new ApiResponse(200, message, data, meta);
  }

  static created(message = 'Created', data = null, meta = null) {
    return new ApiResponse(201, message, data, meta);
  }

  static accepted(message = 'Accepted', data = null) {
    return new ApiResponse(202, message, data);
  }

  static noContent(message = 'No Content') {
    return new ApiResponse(204, message);
  }
}

module.exports = ApiResponse;