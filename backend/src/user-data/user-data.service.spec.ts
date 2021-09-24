import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as mongoose from 'mongoose';
import { connection, Model, Query } from 'mongoose';
import { AppModule } from '../app.module';
import { UserData, UserDataDto } from './schemas/user-data.schema';
import { UserDataService } from './user-data.service';

describe('UserDataService', () => {
  const USER_ID = '12345';

  let moduleFixture: TestingModule;
  let service: UserDataService;
  let userDataModel: Model<UserData>;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = moduleFixture.get<UserDataService>(UserDataService);
    userDataModel = moduleFixture.get<Model<UserData>>(
      getModelToken(UserData.name),
    );
    setup();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await mongoose.connection.close();
    await connection.close();
    await moduleFixture.close();
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  it('should save', async () => {
    const dto = createUserDataDto();
    const res = await service.save(USER_ID, dto);
    expect(res).toEqual(dto);
    expect(userDataModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: USER_ID },
      expect.any(mongoose.Document),
      {
        upsert: true,
        projection: { _id: false },
      },
    );
  });

  it('should fail to save', async () => {
    (userDataModel.findOneAndUpdate as jest.Mock).mockReturnValue(
      createNullQuery(),
    );
    const resp = await service.save(USER_ID, createUserDataDto());
    expect(resp).toBeNull();
  });

  it('should find one', async () => {
    const resp = await service.findOne(USER_ID);
    expect(resp).toEqual(createUserDataDto());
    expect(userDataModel.findOne).toHaveBeenCalledWith(
      { _id: USER_ID },
      { _id: false },
    );
  });

  it('should fail to find one', async () => {
    (userDataModel.findOne as jest.Mock).mockReturnValue(createNullQuery());
    const resp = await service.findOne(USER_ID);
    expect(resp).toBeNull();
  });

  function setup(): void {
    jest
      .spyOn(userDataModel, 'findOneAndUpdate')
      .mockReturnValue(createUserDataQuery());
    jest.spyOn(userDataModel, 'findOne').mockReturnValue(createUserDataQuery());
  }

  function createUserDataDto(): UserDataDto {
    return {
      groups: [],
      items: [],
    };
  }

  function createQuery(value: any): Query<any, any, any> {
    return { exec: jest.fn().mockResolvedValue(value) } as unknown as Query<
      any,
      any,
      any
    >;
  }

  function createUserDataQuery(): Query<any, any, any> {
    return createQuery(createUserDataDto());
  }

  function createNullQuery(): Query<any, any, any> {
    return createQuery(null);
  }
});
