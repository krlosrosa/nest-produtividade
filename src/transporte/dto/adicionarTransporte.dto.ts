import { ApiProperty } from '@nestjs/swagger';
import { Processo, Turno } from 'src/produtividade/enums/produtividade.enums';

export class AddTransportDTO {
  @ApiProperty({
    description: 'ID do centro',
    example: 'center-123',
  })
  centerId: string;

  @ApiProperty({
    description: 'Turno do transporte',
    example: 'turno-123',
  })
  turno: Turno;
  dataExpedicao: Date;

  @ApiProperty({
    description: 'Tipo de transporte',
    example: 'transporte-123',
  })
  tipo: string;

  @ApiProperty({
    description: 'Transportes',
    example: 'transporte-123',
  })
  transports: TransportInfo[];
}

export class TransportInfo {
  @ApiProperty({
    description: 'ID do transporte',
    example: 'transporte-123',
  })
  transporteId: string;

  @ApiProperty({
    description: 'Nome da rota',
    example: 'rota-123',
  })
  nomeRota?: string;

  @ApiProperty({
    description: 'Nome da transportadora',
    example: 'transportadora-123',
  })
  nomeTransportadora?: string;

  @ApiProperty({
    description: 'Placa do transporte',
    example: 'transporte-123',
  })
  placa?: string;

  @ApiProperty({
    description: 'Paletes',
    example: 'palete-123',
  })
  paletes: PaleteInput[];
}

export class PaleteInput {
  @ApiProperty({
    description: 'ID da palete',
    example: 'palete-123',
  })
  id: string;

  @ApiProperty({
    description: 'Empresa',
    example: 'empresa-123',
  })
  empresa: string;

  @ApiProperty({
    description: 'Quantidade de caixas',
    example: 10,
  })
  quantidadeCaixas: number;

  @ApiProperty({
    description: 'Quantidade de unidades',
    example: 10,
  })
  quantidadeUnidades: number;

  @ApiProperty({
    description: 'Quantidade de paletes',
    example: 10,
  })
  quantidadePaletes: number;

  @ApiProperty({
    description: 'Endereço visitado',
    example: 10,
  })
  enderecoVisitado: number;

  @ApiProperty({
    description: 'Tipo de processo',
    example: 'processo-123',
  })
  tipoProcesso: Processo;
}
