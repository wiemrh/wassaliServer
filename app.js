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
    
    app.use(cors({origin: 'http://localhost:4200'})); 
    app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(bodyParser.json());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(bodyParser.urlencoded({'extended':'false'}));
    mongoose.Promise = global.Promise;


    const checkUserType = function (req, res, next) {
    const userType = req.originalUrl.split('/')[2];


    require('./config/passport')(userType, passport);
    next();
};
 
app.use(checkUserType); 

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
