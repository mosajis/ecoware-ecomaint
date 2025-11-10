import { Elysia } from "elysia";
import { Prisma } from "orm/generated/prisma";

type ErrorResponse = {
  statusCode: number;
  message: string;
  code?: string;
  details?: any;
};

export const pluginErrorHandler = (app: Elysia) =>
  app.onError(({ error, set }: any) => {
    let response: ErrorResponse = {
      statusCode: 500,
      message: "Unexpected error occurred",
      code: error.code,
      details: error.meta,
    };

    // Prisma unique constraint
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        response = {
          statusCode: 409,
          message: "Unique constraint failed",
          code: error.code,
          details: error.meta,
        };
      }
    }

    // Prisma validation errors, etc.
    else if (error instanceof Prisma.PrismaClientValidationError) {
      response = {
        statusCode: 400,
        message: "Validation error",
        details: error.message,
      };
    }

    // JSON parse error (مثل query.filter)
    else if (error instanceof SyntaxError && error.message.includes("JSON")) {
      response = {
        statusCode: 400,
        message: "Invalid JSON format",
        details: error.message,
      };
    }

    // custom Error
    else if (error instanceof Error) {
      response = {
        statusCode: 400,
        message: error.message,
      };
    }

    set.status = response.statusCode;
    return response;
  });
