
function badRequest(err, req, res, next) {
    res.status(400).json({ error: 'sorry Bad Request' });
}

function unauthorized(req, res, next) {
    const error = new Error('Unauthorized');
    res.status(401);
    next(error);
}


function forbidden(req, res, next) {
    const error = new Error('Forbidden');
    res.status(403);
    next(error);
}
 
function notFound(req, res, next) {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

function internalServerError(err, req, res, next) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
}
 

function notAcceptable(err, req, res, next) {
    res.status(406).json({ error: 'Not Acceptable' });
}

export default {
    notFound,
    unauthorized,
    internalServerError,
    forbidden,
    badRequest,
    notAcceptable,
};