export type ApiSuccessResponse<TData = unknown> = {
  success: true;
  message?: string;
  data: TData;
  statusCode: number;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  statusCode: number;
  message?: string;
};

export const successResponse = <TData = unknown>(
  data: TData,
  message: string | undefined,
  statusCode: number
): ApiSuccessResponse<TData> => {
  return {
    success: true,
    message,
    data,
    statusCode,
  };
};

export const errorResponse = (
  code: string,
  message: string,
  statusCode: number,
  details?: unknown
): ApiErrorResponse => {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
    statusCode,
  };
};

