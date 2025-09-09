import { Injectable } from '@nestjs/common';
import { IIdentityUserRepository } from '../domain/repositories/IIdentityUser.repository';
import { CriarFuncionarioAdmZodDto } from '../dto/criarFuncionarioAdm.dto';

@Injectable()
export class KeycloakService implements IIdentityUserRepository {
  private kcAdminClient: any;

  constructor() {}

  private async getClient(): Promise<any> {
    if (!this.kcAdminClient) {
      const { default: KcAdminClient } = await import(
        '@keycloak/keycloak-admin-client'
      );
      this.kcAdminClient = new KcAdminClient({
        baseUrl: 'https://keycloak.ragde.app',
        realmName: 'lilo',
      });
    }
    return this.kcAdminClient;
  }

  async addUser(
    user: CriarFuncionarioAdmZodDto,
    accessToken: string,
  ): Promise<string> {
    const kcAdminClient = await this.getClient();
    console.log({ keycloakUser: user, accessToken });
    kcAdminClient.setAccessToken(accessToken);
    const userCreated = await kcAdminClient.users.create({
      username: user.id,
      enabled: true,
      firstName: user.primeiroNome,
      lastName: user.ultimoNome,
      credentials: [
        {
          type: 'password',
          value: user.credencial,
          temporary: true,
        },
      ],
    });
    console.log(userCreated);
    return userCreated.id as string;
  }
}
