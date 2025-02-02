import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameDocument = Game & Document;

@Schema()
export class Game {
  @Prop({ required: true })
  playerX: string;

  @Prop({ required: true })
  playerO: string;

  @Prop({ type: [String], default: Array(9).fill(1) })
  board: string[];

  @Prop({ default: 'X' })
  currentPlayer: string;

  @Prop({ default: false })
  isComplete: boolean;

  @Prop({ type: String, default: null })
  winner: string;
}

export const GameSchema = SchemaFactory.createForClass(Game);
