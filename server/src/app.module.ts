import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameModule } from './game/game.module';
import { config } from 'config';

@Module({
  imports: [MongooseModule.forRoot(config.MONGODB_URL), GameModule],
})
export class AppModule {}
