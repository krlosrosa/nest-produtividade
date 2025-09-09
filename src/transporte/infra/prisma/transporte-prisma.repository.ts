import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/_shared/infra/prisma/prisma.service';
import { getStartAndEndOfDay } from 'src/_shared/utils/getStartAndEndOfDay';
import { InputPaleteInfraDto } from 'src/transporte/domain/dtos/inputPalete.dto';
import { InputTransportDto } from 'src/transporte/domain/dtos/inputTransport.dto';
import { ITransporteRepository } from 'src/transporte/domain/repositories/ITransporte.repository';
import { TransporteResponseDto } from 'src/transporte/dto/transporte.dto';
import { StatusTransporte } from 'src/transporte/enums/transport.enum';
import { removeDuplicadosPorId } from 'src/utils/removerDuplicadas';

@Injectable()
export class TransportePrismaRepository implements ITransporteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async adicionarTransporte(transporte: InputTransportDto[]): Promise<void> {
    await this.prisma.$transaction(
      async (tx) => {
        await tx.transporte.createMany({
          data: transporte,
        });
      },
      {
        timeout: 100000,
      },
    );
  }

  async adicionarPaletesSeparacao(
    paletes: InputPaleteInfraDto[],
  ): Promise<void> {
    const transporteUnicos = removeDuplicadosPorId(paletes);
    const historicoInput = transporteUnicos.map((item) => ({
      tipoImpressao: item.tipoProcesso,
      impressoPorId: item.criadoPorId,
      impressoEm: new Date(),
      transporteId: item.transporteId,
    }));

    await this.prisma.$transaction(
      async (tx) => {
        await tx.palete.createMany({
          data: paletes,
        });
        await tx.historicoImpressaoMapa.createMany({
          data: historicoInput,
        });
      },
      {
        timeout: 100000,
      },
    );
  }

  async listarTransportes(ids: string[]): Promise<string[]> {
    const transportes = await this.prisma.transporte.findMany({
      where: {
        numeroTransporte: { in: ids },
      },
    });

    return transportes.map((transporte) => transporte.numeroTransporte);
  }

  async getTransportesByIds(ids: string[]): Promise<TransporteResponseDto[]> {
    const idArray = Array.isArray(ids) ? ids : [ids]; // Garante que é sempre um array
    const transportes = await this.prisma.transporte.findMany({
      where: {
        numeroTransporte: { in: idArray },
      },
      include: {
        historicoImpressaoMapa: true,
      },
    });

    return transportes.map((transporte) => ({
      numeroTransporte: transporte.numeroTransporte,
      status: transporte.status as StatusTransporte,
      nomeRota: transporte.nomeRota,
      nomeTransportadora: transporte.nomeTransportadora,
      placa: transporte.placa,
      cadastradoPorId: transporte.cadastradoPorId,
      prioridade: transporte.prioridade,
      obs: transporte.obs ?? '',
      qtdImpressaoCarregamento: transporte.historicoImpressaoMapa.filter(
        (item) => item.tipoImpressao === 'CARREGAMENTO',
      ).length,
      qtdImpressaoSeparacao: transporte.historicoImpressaoMapa.filter(
        (item) => item.tipoImpressao === 'SEPARACAO',
      ).length,
    }));
  }

  async buscarTransportePorData(
    data: string,
  ): Promise<TransporteResponseDto[]> {
    const dataFormatada = new Date(data);
    const { startOfDay, endOfDay } = getStartAndEndOfDay(dataFormatada);
    const transportes = await this.prisma.transporte.findMany({
      where: {
        dataExpedicao: { gte: startOfDay, lte: endOfDay },
      },
      include: {
        historicoImpressaoMapa: true,
        cortesMercadoria: true,
      },
    });

    return transportes.map((transporte) => ({
      numeroTransporte: transporte.numeroTransporte,
      status: transporte.status as StatusTransporte,
      nomeRota: transporte.nomeRota,
      nomeTransportadora: transporte.nomeTransportadora,
      placa: transporte.placa,
      cadastradoPorId: transporte.cadastradoPorId,
      prioridade: transporte.prioridade,
      obs: transporte.obs ?? '',
      temCortes: transporte.cortesMercadoria.length > 0,
      qtdImpressaoCarregamento: transporte.historicoImpressaoMapa.filter(
        (item) => item.tipoImpressao === 'CARREGAMENTO',
      ).length,
      qtdImpressaoSeparacao: transporte.historicoImpressaoMapa.filter(
        (item) => item.tipoImpressao === 'SEPARACAO',
      ).length,
    }));
  }
}
