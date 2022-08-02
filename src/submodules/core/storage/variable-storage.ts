import { Injectable } from '@nestjs/common';

import { Storage } from './storage';

@Injectable()
export class VariableStorage extends Storage {}
