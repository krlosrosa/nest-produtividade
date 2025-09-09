import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { createZodDto, ZodResponse } from 'nestjs-zod';
import { z } from 'zod';

interface ErrorResponse {
  status: number;
  description: string;
  type?: Type<any>;
}

const resultDto = createZodDto(z.string());

export function ApiCommonErrors(errors?: ErrorResponse[]) {
  // erros padrão caso nenhum seja passado
  const defaultErrors: any[] = [
    ZodResponse({ status: 400, description: 'Bad Request', type: resultDto }),
    ZodResponse({ status: 401, description: 'Unauthorized', type: resultDto }),
    ZodResponse({ status: 403, description: 'Forbidden', type: resultDto }),
    ZodResponse({ status: 404, description: 'Not Found', type: resultDto }),
    ZodResponse({
      status: 500,
      description: 'Internal Server Error',
      type: resultDto,
    }),
  ];

  const errorList = errors ?? defaultErrors;

  return applyDecorators(
    ...errorList.map((error) => {
      if (error.type) {
        // Se quiser modelar o schema do erro com DTO
        return ApiResponse({
          status: error.status,
          description: error.description,
          schema: { $ref: getSchemaPath(error.type) },
        });
      }
      return ApiResponse({
        status: error.status,
        description: error.description,
      });
    }),
  );
}
