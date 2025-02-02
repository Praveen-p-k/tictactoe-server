import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { Game } from './schemas/game.schema';
import { ClientRepository } from './repository/client.repository';

@WebSocketGateway({ cors: true })
export class GameGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly gameService: GameService,
    private readonly clientRepository: ClientRepository,
  ) {}

  async handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
    await this.clientRepository.create({ clientID: client.id });
    console.log('Client inserted');
  }

  async handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    await this.clientRepository.delete(client.id);
    console.log('Client deleted');
  }

  @SubscribeMessage('joinGame')
  async handleJoinGame(
    @MessageBody() data: { gameId: string; player: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    console.log('new client connnected', client.id);
    const game = await this.gameService.getGameById(data.gameId);
    this.server.to(data.gameId).emit('gameUpdate', game);
  }

  @SubscribeMessage('makeMove')
  async handleMakeMove(
    @MessageBody() data: { gameId: string; index: number },
  ): Promise<void> {
    const game = await this.gameService.getGameById(data.gameId);
    if (!game.isComplete && game.board[data.index] === null) {
      game.board[data.index] = game.currentPlayer;
      game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
      game.isComplete = this.checkWinner(game);
      await this.gameService.updateGame(data.gameId, game);
      this.server.to(data.gameId).emit('gameUpdate', game);
    }
  }

  checkWinner(game: Game): boolean {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (
        game.board[a] &&
        game.board[a] === game.board[b] &&
        game.board[a] === game.board[c]
      ) {
        game.winner = game.board[a];
        return true;
      }
    }

    return game.board.every((cell) => cell !== null);
  }
}
