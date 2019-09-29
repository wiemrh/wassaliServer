const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const config = require('../config/db');


module.exports = (userType, passport) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
      
        if (userType == 'users') {
            User.getTalentById(jwt_payload.data._id, (err, user) => {
                if (err) return done(err, false);
                if (user) {
                    return done(null, user);
                } else{}
                
                return done(null, false);
            });
        }
        
    }));
}