const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var { Annonce } = require('../models/Annonce');
const multer = require("multer");
var fs = require('fs');



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

//http://localhost:3000/api/annonces?idUser=wiem&type=vetement&taille=L&adresseDepart=monastir&dateLimite=22/10/2019&adresseArrive=Tunis&description=this is a description

router.post('',  async function(req, res) {

 
  
// const url = req.protocol + "://" + req.get("host"); 
//   var extt = req.file.mimetype ; 
//   const ext = MIME_TYPE_MAP[extt];
//   var nom = 'image'+ Date.now()  +'.' + ext;
//    fs.rename('./imageWasalli/'+req.file.filename, './imageWasalli/'+nom, (err) => {
  
//     if (err) throw err;
  
//     console.log('Rename complete!');
  
//   });

      var annonce = new Annonce({


    idUser: req.query.idUser ,
    type:  req.query.type ,
    taille: req.query.taille ,
    adresseDepart: req.query.adresseDepart ,
    dateLimite: req.query.dateLimite ,
    adresseArrive: req.query.adresseArrive ,
    description: req.query.description ,
    sortedDate : req.query.dateLimite
   // imageAnnnonce : url + "/imageWasalli/" + nom 

       
    });


    annonce.save((err, doc) => {
        if (!err) {
          // res.send(doc);
          return res.json({
            success: true,
            message: "Colis registration is successful."
        });
        
        }
        else { 
          return res.json({
            success: false,
            message: "Colis registration is failed."
        });

           }
    });
});





//get all

router.get('/', (req, res, next) => {

  Annonce.find({sortedDate:{ $gte: new Date()}  }).sort({'sortedDate': -1}).then(docs => {
    res.status(200).json({
      message: " Annonce fetched successfully!",
      Annonce: docs
    });
  });
});




//update
router.put('/:id',
multer({ storage: storage }).single("imageAnnnonce"),
async function(req, res, next) {
  
 var oldimageAnnonce = new Annonce ();
 oldimageAnnonce =  await Annonce.findById({_id:req.params.id}).exec();


var str = oldimageAnnonce["imageAnnnonce"];
var nom = str.substring(35,str.lenght);
var str2  = str.replace("http://localhost:3000",".");
console.log("str2:  " , str2) ;

  fs.unlink(str2, (err) => {
    if (err) {
      console.error(err)
      return
    }
  });
 
let imageAnnnonce = req.body.imageAnnnonce;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imageAnnnonce = url + "/imageWasalli/" + nom
  }

  fs.rename('./imageWasalli/'+req.file.filename, './imageWasalli/'+nom, (err) => {

    if (err) throw err;
  
    //console.log('Rename complete!');
  
  });
    var annonce = {
      idUser: req.body.idUser ,
      type:  req.body.type ,
      taille: req.body.taille ,
      adresseDepart: req.body.adresseDepart ,
      dateLimite: req.body.dateLimite ,
      adresseArrive: req.body.adresseArrive ,
      description: req.body.description  ,
      imageAnnnonce: imageAnnnonce       
    };
    Annonce.findByIdAndUpdate(req.params.id, { $set: annonce }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { 
          console.log('Error in annonce Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

//get all Annonce by user id
router.get("/allAnnonceUser/:idUser", (req, res, next) => {
    Annonce.find({idUser: req.params.idUser }).then(annonces => {

      res.status(200).json({
        message: "Annonces récupérés avec succès!!",
        Annonces: annonces
      });
    }
    
    
    );
  });

  // GET annonce By Id
router.get("/:id", (req, res, next) => {
    Annonce.findById(req.params.id).then(pay => {
      if (pay) {
        res.status(200).json(pay);
      } else {
        res.status(404).json({ message: "Annonce n'a pas été trouvé!" });
      }
    });
  });

  // DELETE annonce By Id
router.delete("/:id", (req, res, next) => {
    Annonce.deleteOne({ _id: req.params.id }).then(result => {
   //   console.log(result);
      res.status(200).json({ message: "Annonce a été supprimé avec succés!" });
    });
  });
  


module.exports = router;