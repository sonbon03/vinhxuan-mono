import { ApiProperty } from '@nestjs/swagger';

/**
 * Standard API Response DTO
 * All API responses should follow this structure
 */
export class ResponseDto<T = any> {
  @ApiProperty({ example: 200, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: 'Operation successful', description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Response data' })
  data: T;

  constructor(statusCode: number, message: string, data: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  /**
   * Create a success response
   */
  static success<T>(data: T, message = 'Operation successful', statusCode = 200): ResponseDto<T> {
    return new ResponseDto(statusCode, message, data);
  }

  /**
   * Create a paginated response
   */
  static paginated<T>(
    items: T[],
    total: number,
    page: number,
    limit: number,
    message = 'Data retrieved successfully',
  ): ResponseDto<{ items: T[]; total: number; page: number; limit: number }> {
    return new ResponseDto(200, message, { items, total, page, limit });
  }
}
