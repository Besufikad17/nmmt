import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import { RefreshTokenService } from './refresh-token.service';

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;
  let client: Pick<ClientProxy, 'send'>;

  beforeEach(async () => {
    client = {
      send: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
        { provide: 'USER_SERVICE', useValue: client },
      ],
    }).compile();

    service = module.get<RefreshTokenService>(RefreshTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send createRefreshToken to the auth service', async () => {
    const dto = {
      refreshToken: 'refresh-token',
      userId: '3f7593bc-b13e-4a45-b432-1c50e9e33b0e',
      expiresAt: new Date(),
    };
    const refreshToken = {
      id: '43875c03-57ca-4c55-a8cd-bf834d1ae04d',
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(client, 'send').mockReturnValue(of(refreshToken));

    await expect(service.createRefreshToken(dto)).resolves.toEqual(refreshToken);
    expect(client.send).toHaveBeenCalledWith({ cmd: 'createRefreshToken' }, dto);
  });
});
