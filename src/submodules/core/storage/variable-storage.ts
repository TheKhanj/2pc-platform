import { Injectable } from '@nestjs/common';

import { AsyncStorage } from './async-storage';

@Injectable()
export class VariableStorage extends AsyncStorage {}
