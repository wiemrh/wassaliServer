const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/db');
const session = require('express-session');
const nodemailer = require('nodemailer');

const app = express();
app.use(session({secret: 'tsunamit',saveUninitialized: true,
cookie:{maxAge:10},resave: true}));

var sess;  




router.post('/register', (req, res) => {
    let newUser = new User({

                nom: req.body.nom,  
                prenom: req.body.prenom,
                dateDeNaissance: req.body.dateDeNaissance,
                sexe: req.body.sexe,
                adresse: req.body.adresse,
                telephone: req.body.telephone,
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
              
            });

            User.addTalent(newUser, (err, user) => {
        if (err) {
            let message = "";
            if (err.errors.username) message = "Username is already taken. ";
            if (err.errors.email) message += "Email already exists.";
            return res.json({
                success: false,
                message 
            });
        } else {

            var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                  user: 'tsunamiittest@gmail.com',
                  pass: "tsunami123*"
                }
                ,
    tls: {
        rejectUnauthorized: false
    }
              });
              var mailOptions = {
                from: 'tsunamiittest@gmail.com',
                to: req.body.email,
                subject: 'Tsunami IT: Mail De Bienvenue',
                html: "<p> Bonjour   "+ (req.body.username) + ",<br> <p> Bienvenue chez notre plateforme Wasalli  <B> <br><p> Vos infomrations d'authentification sont : <br><p> Username :  " +" "+ req.body.username +"<br><p> Mot De Passe : "+" "+ req.body.password
              };
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });


            return res.json({
                success: true,
                message: "User registration is successful."
            });


        }
    });
});

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getTalentByUsername(username, (err, user
        ) => {
        if (err) throw err;
      
        if (!user) {
            return res.json({
                success: false,
                message: "user not found."
            });
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            
            if (isMatch) { 
                const userID=user._id
                const token = jwt.sign({
                    type: "talent",
                    data: {
                                                _id: user._id,
                                                nom: user.nom,
                                                prenom: user.prenom,
                                                dateDeNaissance: user.dateDeNaissance,
                                                sexe: user.sexe,
                                                adresse: user.adresse,
                                                telephone: user.telephone, 
                                                email: user.email,
                                                username: user.username,
                                                createdAt: user.createdAt,
                                                statut: user.statut,
                                                etape: user.etape,
                                                presentation: user.presentation,
                                                remarque: user.remarque,
                                                profession: user.profession,
                                                domaine: user.domaine
                    }
                }, config.secret, {
                    expiresIn: 604800 // le token exipre aprés une semaine 
                });
                
                return res.json({
                    success: true,
                    userID,
                    token: "JWT " + token
                });
          
            } else {
                    return res.json({
                    success: false,
                    message: "mot de passe erroné" 
                                
            }) ;
        
            }       
        });
    });
    
});


router.get('/',(req,res) => {
    res.send("vous devez vous connecter tt d'abord");
    console.log("vous devez vous connecter tt d'abord");
	}
);


router.get('/logout',(req,res) => {
	req.session.destroy((err) => {
		if(err) {
			return console.log(err);
		}
		res.redirect('/');
		// console.log(sess);
	});

});

// get user by id
router.get('/getUserById/:id', (req, res ) => {
   User.find( { _id: req.params.id },{_id:0,password:0},(err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Erreur  :' + JSON.stringify(err, undefined, 2)); }
    });
});

router.get('/getAllTalents', ( req, res) => {
    User.find({},{password:0} ,(err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Erreur :' + JSON.stringify(err, undefined, 2)); }
    });
});


router.put('/updateTalentById/:id',(req, res) =>{
    let _id = req.params.id;
 
    User.findById(_id)
        .then(user => {

            user.nom =req.body.nom;
            user.prenom = req.body.prenom;
            user.dateDeNaissance = req.body.dateDeNaissance;
            user.sexe = req.body.sexe;
            user.adresse = req.body.adresse;
            user.telephone = req.body.telephone;
            user.email = req.body.email;
            user.username = req.body.username;
            user.password = req.body.password;
            user.createdAt = req.body.createdAt;
            user.statut = req.body.statut;
            user.etape = req.body.etape;
            user.presentation = req.body.presentation;
            user.remarque = req.body.remarque;
            user.profession = req.body.profession;
            user.domaine = req.body.domaine;

            user.save()
                .then(post => {
                    res.send({message: 'Talent a été  modifié avec succés ', satus:'success',user: user})
                })
                .catch(err => console.log(err))
        }) 
        .catch(err => console.log(err))
 
})




router.get('/profile', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    // console.log(req.user);
    return res.json(
        req.user
    );
});

module.exports = router;






