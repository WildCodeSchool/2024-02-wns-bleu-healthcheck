import { AuthChecker } from 'type-graphql';
import { AppContext } from '../types/AppContext';
import jwt from 'jsonwebtoken';

export const authChecker: AuthChecker<AppContext> = ({ context }) => {
    const authHeader = context.req.headers['authorization'];
    if (!authHeader) {
        throw new Error('Not authenticated');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new Error('Not authenticated');
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        context.payload = payload;
    } catch (err) {
        throw new Error('Not authenticated');
    }

    return true; // or implement role-based logic if needed
};
