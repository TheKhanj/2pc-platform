import { Injectable } from '@nestjs/common';

import { Storage } from './storage';

@Injectable()
export class SessionStorage extends Storage {}
