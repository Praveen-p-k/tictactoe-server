import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Game, GameSchema } from './schemas/game.schema';
import { GameGateway } from './game.gateway';
import { ClientRepository } from './repository/client.repository';
import {
  ConnectedClient,
  ConnectedClientSchema,
} from './schemas/client.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Game.name, schema: GameSchema },
      { name: ConnectedClient.name, schema: ConnectedClientSchema },
    ]),
  ],
  controllers: [GameController],
  providers: [GameService, GameGateway, ClientRepository],
})
export class GameModule {}
