import { Inject, Injectable } from '@nestjs/common';
import { type ICenterRepository } from 'src/centro/domain/repositories/center.respository';

@Injectable()
export class DefinirConfiguracaoImpressaoUsecase {
  constructor(
    @Inject('ICenterRepository')
    private readonly centerRepository: ICenterRepository,
  ) {}
  async execute(command: DefinirConfiguracaoImpressaoDto): Promise<boolean> {
    return this.centerRepository.definirConfiguracaoImpressao(command);
  }
}

export interface DefinirConfiguracaoImpressaoDto {
  atribuidoPorId: string | null;
  centerId: string;
  tipoImpressao: 'TRANSPORTE' | 'CLIENTE';
  quebraPalete: boolean;
  tipoQuebra: 'LINHAS' | 'PERCENTUAL' | null;
  valorQuebra: number | null;
  separarPaleteFull: boolean;
  separarUnidades: boolean;
  exibirInfoCabecalho: boolean;
  segregarFifo: string[];
  ordemColunas: string[];
  dataMaximaPercentual: number | null;
  dataMinimaPercentual: number | null;
}
