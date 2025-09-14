// Placeholder for a global error handler
module.exports = function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
};