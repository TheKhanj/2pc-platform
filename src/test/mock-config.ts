import mongoose from 'mongoose';
import {
  Config,
  ConfigStatus,
  ConfigType,
  HttpResource,
  State,
} from '../submodules/core/types/transaction-declaration';

export const mockHttpResource: HttpResource = {
  type: 'http',
  method: 'GET',
  url: 'RANDOM_URL',
  body: 'BODY',
  headers: {
    header1: 'HEADER_1_VALUE',
  },
  params: {
    param1: 'PARAM_1_VALUE',
  },
  queries: {
    query1: 'QUERY_1_VALUE',
  },
};

export const mockState: State = {
  name: 'state1',
  result: 'DOES_NOT_MATTER',
  type: 'task', // Does not matter either,
  resources: {
    start: mockHttpResource,
    commit: mockHttpResource,
    rollback: mockHttpResource,
  },
};

export const mockConfig: Config = {
  id: new mongoose.Types.ObjectId(),
  name: 'TRANSACTION_NAME',
  status: ConfigStatus.ACTIVE,
  type: ConfigType.SEQUENTIAL,
  variables: {
    var1: '123',
    var2: 123,
    var3: '$asdf',
    var4: '$$asdf',
    var5: '$$GLOBAL',
  },
  states: [mockState],
};
