export class UnauthorizedError extends Error {
    override name = 'UnauthorizedError';

    constructor(message: string = 'Credencial inválida.') {
        super(message);
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}
