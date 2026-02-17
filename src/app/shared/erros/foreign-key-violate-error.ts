export class ForeignKeyViolateError extends Error {
    override name = 'ForeignKeyViolateError';

    constructor(message: string = 'O registro está sendo usado e não pode ser excluído.') {
        super(message);
        Object.setPrototypeOf(this, ForeignKeyViolateError.prototype);
    }
}