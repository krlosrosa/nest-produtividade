import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PaleteEntity } from 'src/produtividade/domain/entities/palete.entity';
import { type IPaleteRepository } from 'src/produtividade/domain/repositories/IPaleteRepository';
import { type IProdutividadeRepository } from 'src/produtividade/domain/repositories/IProdutividadeRepository';
import {
  StatusPalete,
  TipoProcesso,
} from 'src/produtividade/enums/produtividade.enums';
import { type IUserRepository } from 'src/user/domain/repositories/IUserRepository';

export type InitiatePickingCommand = {
  cadastradoPorId: string;
  funcionarioId: string;
  paletesIds: string[];
  centerId: string;
  processo: TipoProcesso;
  inicio: Date;
  obs?: string;
};

@Injectable()
export class IniciarProdutividadeUsecase {
  private readonly logger = new Logger(IniciarProdutividadeUsecase.name);
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IPaleteRepository')
    private readonly paleteRepository: IPaleteRepository,
    @Inject('IProdutividadeRepository')
    private readonly produtividadeRepository: IProdutividadeRepository,
  ) {}
  async execute(command: InitiatePickingCommand): Promise<string> {
    const funcionario = await this.userRepository.buscarPorId(
      command.cadastradoPorId,
      command.centerId,
    );
    const paletes = await this.paleteRepository.findByIds(command.paletesIds);
    this.validarPaletes(paletes, command.paletesIds);

    if (!funcionario) {
      this.logger.warn('Funcionário não encontrado.', { command });
      throw new BadRequestException('Funcionário não encontrado.');
    }

    /*
    ifconst demanda = await this.userRepository.buscarPorIdEAssociadoADemanda(
      command.cadastradoPorId,
      command.centerId,
    );

     (demanda) {
      this.logger.warn('Funcionário já está em uma demanda ativa.', {
        demanda,
        command,
      });
      throw new BadRequestException(
        `Funcionário já está em uma demanda ativa. Demanda ID: ${demanda.id}`,
      );
    }
    */
    await this.produtividadeRepository.create(
      {
        inicio: command.inicio,
        processo: paletes[0].processo,
        funcionarioId: command.funcionarioId,
        paletesIds: command.paletesIds,
        centerId: command.centerId,
        turno: funcionario.turno,
        obs: command.obs,
      },
      command.cadastradoPorId,
    );
    return Promise.resolve('OK');
  }

  private validarPaletes(paletes: PaleteEntity[], idsEsperados: string[]) {
    if (paletes.length !== idsEsperados.length) {
      this.logger.warn('Palete não encontrada.', {
        paletes,
        idsEsperados,
      });
      throw new BadRequestException(
        `Palete não encontrada. IDs: ${idsEsperados.join(', ')}`,
      );
    }

    for (const palete of paletes) {
      if (palete.status !== StatusPalete.NAO_INICIADO) {
        this.logger.warn('Palete já iniciada.', { palete });
        throw new BadRequestException(
          `Palete já iniciada. Palete ID: ${palete.id}`,
        );
      }
    }
  }
}
