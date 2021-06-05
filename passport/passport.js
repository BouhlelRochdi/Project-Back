const passport = require('passport');
const company = require('../models/companySchema');
const BearerStrategy = require('passport-http-bearer').Strategy;
const jwt = require('jsonwebtoken');


passport.use(new BearerStrategy( // il faut crée une strategie 
    (token, done) => {
       try{
        const decoded = jwt.verify(token, 'key'); // verifier si le token est le mm ou nn avec la key key deja attribuer a la creation
        // decoded is the same as tokenData const [have id and email as attribut]
        company.findById(decoded.id, (err, company) => { // find company by id "decoded.id" contient les token data envoyer dans login.js
            //log(decoded) nous renvoie les champs voulu envoyer lors de creation du jeton (on a envoyer l'id et email "voir authlogin.js")
            if (err) { return done(err); }
            if (!company) { return done(null, false); }
            return done(null, company, { scope: 'all' });
        });
       }catch(error){
        return done(null, false);
       }
    }
));