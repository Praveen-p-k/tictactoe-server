import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ConnectedClient,
  ConnectedClientDocument,
} from 'src/game/schemas/client.schema';

export class ClientRepository {
  constructor(
    @InjectModel(ConnectedClient.name)
    private clientModel: Model<ConnectedClientDocument>,
  ) {}

  async create(client: ConnectedClient): Promise<ConnectedClient> {
    const createdclient = new this.clientModel(client);
    return createdclient.save();
  }

  async delete(clientID: string): Promise<void> {
    await this.clientModel.deleteOne({ clientID });
  }
}
