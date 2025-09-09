import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CriarNovoCentroSchema = z.object({
  centerId: z.string(),
  description: z.string(),
  state: z.string(),
  cluster: z.string({
    error: 'cluster é obrigatório',
  }),
});

export class CriarNovoCentroZodDto extends createZodDto(
  CriarNovoCentroSchema,
) {}
