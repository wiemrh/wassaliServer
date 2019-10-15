const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/db');
const session = require('express-session');
const nodemailer = require('nodemailer');

const multer = require("multer");
var fs = require('fs');
const app = express();
app.use(session({secret: 'tsunamit',saveUninitialized: true,
cookie:{maxAge:10},resave: true}));

var sess;  
const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg"
  };
   
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Extension de l\'image est Invalide");
      if (isValid) {
        error = null;
      }
      cb(error, "./imageWasalli/");
    },
   filename: (req,file, cb) => {
      const name = file.originalname
        .toLowerCase()
        .split(" ")
        .join("-");
      const ext = MIME_TYPE_MAP[file.mimetype];
   
      cb(null, name  );
    }
  }); 

//tested perfectlyy 

router.post('/register', multer({ storage: storage , 
    limits: {
    fileSize: 1024 * 1024 * 5
  },
  }).single("imageUser"), async function(req, res) {

 
  
const url = req.protocol + "://" + req.get("host"); 
  var extt = req.file.mimetype ; 
  const ext = MIME_TYPE_MAP[extt];
  var nom = 'image'+ Date.now()  +'.' + ext;
   fs.rename('./imageWasalli/'+req.file.filename, './imageWasalli/'+nom, (err) => {
  
    if (err) throw err;
  
    console.log('Rename complete!');
  
  });
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
                imageUser: url + "/imageWasalli/" + nom ,
              
            });

            User.addUser(newUser, (err, user) => {
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
                subject: 'Wasalli b tounsi : Mail De Bienvenue',
                html: "<p> Salut   "+ (req.body.username) + ",<br> <p> Bienvenue chez notre plateforme Wasalli  <B> <br><p> Vos infomrations d'authentification sont : <br><p> Username :  " +" "+ req.body.username +"<br><p> Mot De Passe : "+" "+ req.body.password
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

router.get('/login', (req, res) => {
  
    const username = req.query.username;
    const password = req.query.password;
    console.log(username);

    User.geUserByUsername(username, (err, user
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
                      password: user.password,
                      imageUser: user.imageUser,
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




router.put(
  "updateUserInfo/:id",
  multer({ storage: storage }).single("imageUser"),
  async function(req, res, next) {
    
   var oldimageUser = new User ();
  
   oldimageUser =  await User.findById({_id:req.params.id}).exec();

  
  var str = oldimageUser["imageUser"];
  var nom = str.substring(36,str.lenght);
  var str2  = str.replace("http://localhost:3000",".");
  console.log("str2:  " , str2) ;

    fs.unlink(str2, (err) => {
      if (err) {
        console.error(err)
        return
      }
    });
   
let imageUser = req.body.imageUser;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imageUser = url + "/imageWasalli/" + nom
    }
 
    fs.rename('./imageWasalli/'+req.file.filename, './imageWasalli/'+nom, (err) => {

      if (err) throw err;
    
      //console.log('Rename complete!');
    
    });


    const user = new User({
                _id: req.params.id,
                 nom: req.body.nom,  
                prenom: req.body.prenom,
                dateDeNaissance: req.body.dateDeNaissance,
                sexe: req.body.sexe,
                adresse: req.body.adresse,
                telephone: req.body.telephone,
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                imageUser: imageUser 
  
    });
  
    User.updateOne({ _id : req.params.id }, user ).then(result => {
      res.status(200).json({ message: "Mis à jour avec succés !" });
    });
  }
);


  // DELETE User By Id
  router.delete("/:id", (req, res, next) => {
    User.deleteOne({ _id: req.params.id }).then(result => {
   //   console.log(result);
      res.status(200).json({ message: "User a été supprimé avec succés!" });
    });
  });

module.exports = router;






