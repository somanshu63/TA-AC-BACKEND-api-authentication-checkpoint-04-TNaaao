var jwt = require('jsonwebtoken');

module.exports = {
    verifyToken: async (req, res, next) => {
        var token = req.headers.authorization;
        try {
            if(token){
                var payload = await jwt.verify(token, process.env.SECRET);
                req.user = payload;
                next();
            }
        } catch (error) {
            next(error);
        }
    },
    verifyAdmin: async (req, res, next) => {
        var token = req.headers.authorization;
        try {
            if(token){
                var payload = await jwt.verify(token, process.env.SECRET);
                if(payload.isAdmin){
                    req.user = payload;
                    next();
                }else{
                    return res.status(400).json({error: 'you are not admin'})
                }
            }
        } catch (error) {
            next(error);
        }
    },
    optional: async (req, res, next) => {
        var token = req.headers.authorization;
        try {
            if(token){
                var payload = await jwt.verify(token, process.env.SECRET);
                req.user = payload;
                next();
            }else{
                req.user = null;
                next();
            }
        } catch (error) {
            next(error);
        }
    }
}