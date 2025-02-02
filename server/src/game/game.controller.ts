import { Controller, Post, Get, Param, Put, Body } from '@nestjs/common';
import { GameService } from './game.service';
import { Game } from './schemas/game.schema';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async createGame(
    @Body('playerX') playerX: string,
    @Body('playerO') playerO: string,
  ): Promise<Game> {
    return this.gameService.createGame(playerX, playerO);
  }

  @Get(':id')
  async getGameById(@Param('id') id: string): Promise<Game> {
    return this.gameService.getGameById(id);
  }

  @Put(':id')
  async updateGame(
    @Param('id') id: string,
    @Body() updateData: Partial<Game>,
  ): Promise<Game> {
    return this.gameService.updateGame(id, updateData);
  }
}
