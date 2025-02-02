import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game } from './schemas/game.schema';

@Injectable()
export class GameService {
  constructor(@InjectModel(Game.name) private gameModel: Model<Game>) {}

  async createGame(playerX: string, playerO: string): Promise<Game> {
    const newGame = new this.gameModel({
      playerX,
      playerO,
      board: Array(9).fill(null),
      currentPlayer: playerX,
      isComplete: false,
      winner: null,
    });
    return newGame.save();
  }

  async getGameById(id: string): Promise<Game> {
    return this.gameModel.findById(id).exec();
  }

  async updateGame(id: string, updateData: Partial<Game>): Promise<Game> {
    return this.gameModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }
}
