import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConnectedClientDocument = ConnectedClient & Document;

@Schema({ timestamps: true })
export class ConnectedClient {
  @Prop({ required: true, index: true })
  clientID: string;
}

export const ConnectedClientSchema =
  SchemaFactory.createForClass(ConnectedClient);
