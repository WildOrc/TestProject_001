export class ApiError extends Error {
    constructor(
        readonly message: string,
        readonly status: number,
        readonly data?: {
            exception?: any,
            payload?: any
        }

    ) {
        super(message);
    }
}