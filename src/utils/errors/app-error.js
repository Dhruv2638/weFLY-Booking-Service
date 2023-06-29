class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.explnation = message;
    }
}

module.exports = {
    AppError
}