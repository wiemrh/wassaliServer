const express = require('express');
const mongoose =  require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport'); 
const path = require('path');
const PORT = process.env.PORT || 3000;
const session = require('express-session');
 

var sess; 
const config = require('./config/db');
mongoose.set('useCreateIndex', true);

mongoose.connect(config.db, {
        useNewUrlParser: true
    })
    .then(() => {
        console.log(' Connecté à la base de donnés ' + config.db);
    }).catch(err => {
        console.log(err);
    });

    const app = express();
 //    app.use(cors({origin: 'http://localhost:4200'})); 
 app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
    app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(bodyParser.json());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(bodyParser.urlencoded({'extended':'false'}));
    mongoose.Promise = global.Promise;



 


const users = require('./controllers/User');
const trajets = require('./controllers/Trajet');
const annonces = require('./controllers/Annonce');
const reviews = require('./controllers/Reviews');

app.use("/imageWasalli", express.static("imageWasalli"));



app.use('/api/users', users);
app.use('/api/trajets', trajets);
app.use('/api/annonces', annonces);
app.use('/api/reviews', reviews);





app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
