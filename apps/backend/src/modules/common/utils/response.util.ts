/**
 * Response utility functions
 * Helper functions to create standardized responses
 */

export class ResponseUtil {
  /**
   * Create a success response with custom message
   */
  static success<T>(data: T, message: string, statusCode = 200) {
    return {
      statusCode,
      message,
      data,
    };
  }

  /**
   * Create a paginated success response
   */
  static paginated<T>(
    items: T[],
    total: number,
    page: number,
    limit: number,
    message: string,
  ) {
    return {
      statusCode: 200,
      message,
      data: {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Create a created response (201)
   */
  static created<T>(data: T, message: string) {
    return {
      statusCode: 201,
      message,
      data,
    };
  }

  /**
   * Create a no content response (204)
   */
  static noContent(message: string) {
    return {
      statusCode: 204,
      message,
      data: null,
    };
  }
}
