import { Request } from 'express';

export interface AppContext {
    req: Request;
    payload?: { userId: number };
}
