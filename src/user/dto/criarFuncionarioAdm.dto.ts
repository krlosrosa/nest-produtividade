import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CriarFuncionarioAdmSchema = z.object({
  centerId: z.string(),
  id: z.string(),
  nome: z.string(),
  primeiroNome: z.string(),
  ultimoNome: z.string(),
  credencial: z.string(),
  turno: z.string(),
});

export class CriarFuncionarioAdmZodDto extends createZodDto(
  CriarFuncionarioAdmSchema,
) {}
