import { CriarFuncionarioAdmZodDto } from 'src/user/dto/criarFuncionarioAdm.dto';

export interface IIdentityUserRepository {
  addUser(
    command: CriarFuncionarioAdmZodDto,
    accessToken: string,
  ): Promise<string>;
}
