import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import type { Request } from 'express';

import { AuthGuard } from 'src/_shared/auth/auth.guard';
import { ApiCommonErrors } from 'src/_shared/decorators/returnSwagger';
import { UserService } from './user.service';
import { CriarNovoFuncionarioZodDto } from './dto/criarNovoFuncionario.dto';
import { CriarFuncionariosEmMassaZodDto } from './dto/criarFuncionariosEmMassa.dto';
import { ListarFuncionariosPorCentroZodDto } from './dto/user';
import { ResponseInfoMeZodDto } from './dto/responseInfoMe';
import type { ResponseInfoMeZodDto as ResponseInfoMeZodDtoT } from './dto/responseInfoMe';
import type { ListarFuncionariosPorCentroZodDto as ListarFuncionariosPorCentroZodDtoT } from './dto/user';
import type { CriarNovoFuncionarioZodDto as CriarNovoFuncionarioZodDtoT } from './dto/criarNovoFuncionario.dto';
import type { CriarFuncionariosEmMassaZodDto as CriarFuncionariosEmMassaZodDtoT } from './dto/criarFuncionariosEmMassa.dto';
import { CriarFuncionarioAdmZodDto as CriarFuncionarioAdmZodDto } from './dto/criarFuncionarioAdm.dto';
import { AtribuirCentroAFuncionarioZodDto } from './dto/atribuirCentroAFuncionario.dto';

@ApiTags('usuario')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
@Controller('api/usuario')
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Retorna minha info', operationId: 'minhaInfo' })
  @ApiCommonErrors()
  @Get('minha-info')
  @ZodResponse({ status: 200, type: ResponseInfoMeZodDto })
  async minhaInfo(@Req() req: Request): Promise<ResponseInfoMeZodDtoT> {
    const accountId = (req as unknown as { accountId: string }).accountId;
    return this.userService.minhaInfo(accountId);
  }

  @ApiOperation({
    summary: 'Cria um novo funcionário',
    operationId: 'criarFuncionarioAdm',
  })
  @ApiBody({
    description: 'Dados do funcionário',
    type: CriarFuncionarioAdmZodDto,
  })
  @ZodResponse({ status: 200, type: CriarNovoFuncionarioZodDto })
  @ApiCommonErrors()
  @Post('criar-funcionario-adm')
  async criarFuncionarioAdm(
    @Body() command: CriarFuncionarioAdmZodDto,
    @Req() req: Request,
  ) {
    return this.userService.criarFuncionarioAdm(command, req['accessToken']);
  }

  @ApiOperation({
    summary: 'Cria um novo funcionário',
    operationId: 'criarNovoFuncionario',
  })
  @ApiBody({
    description: 'Dados do funcionario e centro',
    type: CriarNovoFuncionarioZodDto,
  })
  @ZodResponse({ status: 200, type: CriarNovoFuncionarioZodDto })
  @ApiCommonErrors()
  @Post('criar-novo-funcionario')
  async criarNovoFuncionario(@Body() command: CriarNovoFuncionarioZodDtoT) {
    console.log({ command });
    return this.userService.criarNovoFuncionario(command);
  }

  @ApiOperation({
    summary: 'Cria funcionários em massa',
    operationId: 'criarFuncionariosEmMassa',
  })
  @ApiResponse({
    status: 200,
    description: 'Funcionários criados com sucesso',
  })
  @ApiBody({
    description: 'Dados do centro e arquivo',
    type: CriarFuncionariosEmMassaZodDto,
  })
  @Post('criar-funcionarios-em-massa')
  async criarFuncionariosEmMassa(
    @Body() command: CriarFuncionariosEmMassaZodDtoT,
  ) {
    return this.userService.criarFuncionariosEmMassa(command);
  }

  @ApiOperation({
    summary: 'Atribuir funcionario ao centro',
    operationId: 'atribuirCentroAFuncionario',
  })
  @ApiBody({
    description: 'Dados do funcionario e centro',
    type: AtribuirCentroAFuncionarioZodDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Centro atribuido com sucesso',
  })
  @ApiCommonErrors()
  @Post('atribuir-funcionario-ao-centro')
  async atribuirCentroAFuncionario(
    @Body() command: AtribuirCentroAFuncionarioZodDto,
  ) {
    return this.userService.atribuirCentroAFuncionario(command);
  }

  @ApiOperation({
    summary: 'Remover funcionario do centro',
    operationId: 'removerFuncionarioDoCentro',
  })
  @ApiResponse({
    status: 200,
    description: 'Centro removido com sucesso',
  })
  @ApiCommonErrors()
  @Post('remover-funcionario-do-centro/:userId/:centerId')
  async removerFuncionarioDoCentro(
    @Param('userId') userId: string,
    @Param('centerId') centerId: string,
  ) {
    return this.userService.removerFuncionarioDoCentro(userId, centerId);
  }

  @ApiOperation({
    summary: 'Lista funcionarios por centro',
    operationId: 'listarFuncionariosPorCentro',
  })
  @ZodResponse({ status: 200, type: ListarFuncionariosPorCentroZodDto })
  @ApiCommonErrors()
  @Get('listar-funcionarios-por-centro/:centerId')
  async listarFuncionariosPorCentro(
    @Param('centerId') centerId: string,
  ): Promise<ListarFuncionariosPorCentroZodDtoT> {
    return this.userService.listarFuncionariosPorCentro(centerId);
  }

  @ApiOperation({ summary: 'Deleta um usuario', operationId: 'deletarUsuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario deletado com sucesso',
  })
  @ApiCommonErrors()
  @Delete('deletar-usuario/:userId/:centerId')
  async deletarUsuario(
    @Param('userId') userId: string,
    @Param('centerId') centerId: string,
  ) {
    return this.userService.deletarUsuario(userId, centerId);
  }
}
