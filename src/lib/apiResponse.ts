import { NextResponse } from 'next/server';

export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

export type ApiResponse<T = unknown> =
  | {
      success: true;
      message?: string;
      data: T;
      statusCode: number;
    }
  | {
      success: false;
      error: ApiError;
      statusCode: number;
    };

export function successResponse<T>(data: T, message = 'OK', statusCode = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      statusCode,
    },
    { status: statusCode }
  );
}

export function errorResponse(
  code: string,
  message: string,
  statusCode = 500,
  details?: unknown
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details === undefined ? {} : { details }),
      },
      statusCode,
    },
    { status: statusCode }
  );
}
