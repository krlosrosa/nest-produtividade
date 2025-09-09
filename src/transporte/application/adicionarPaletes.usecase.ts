import { Inject, Injectable } from '@nestjs/common';
import { Processo } from 'src/produtividade/enums/produtividade.enums';
import { type ITransporteRepository } from '../domain/repositories/ITransporte.repository';

@Injectable()
export class AdicionarPaletesSeparacaoUsecase {
  constructor(
    @Inject('ITransporteRepository')
    private readonly transporteRepository: ITransporteRepository,
  ) {}

  async execute(command: PaleteInput[], accountId: string): Promise<string> {
    const paletes = command.map((palete) => {
      return {
        ...palete,
        criadoPorId: accountId,
      };
    });

    await this.transporteRepository.adicionarPaletesSeparacao(paletes);
    return 'Paletes adicionadas com sucesso';
  }
}

export type PaleteInput = {
  transporteId: string;
  id: string;
  empresa: string;
  quantidadeCaixas: number;
  quantidadeUnidades: number;
  quantidadePaletes: number;
  enderecoVisitado: number;
  segmento: string;
  tipoProcesso: Processo;
};
