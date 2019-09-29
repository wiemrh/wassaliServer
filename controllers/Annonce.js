const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var { Annonce } = require('../models/Annonce');

//post
router.post('/', (req, res) => {
    
    var annonce = new Annonce({


    idUser: req.body.idUser ,
    type:  req.body.type ,
    taille: req.body.taille ,
    adresseDepart: req.body.adresseDepart ,
    dateLimite: req.body.dateLimite ,
    adresseArrive: req.body.adresseArrive ,
    description: req.body.description 

       
    });
    annonce.save((err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in annonce Save :' + JSON.stringify(err, undefined, 2)); }
    });
});

//get all
router.get('/', (eq, res) => {
    Annonce.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving annonce :' + JSON.stringify(err, undefined, 2)); }
    });
});

//update
router.put('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var annonce = {
      idUser: req.body.idUser ,
      type:  req.body.type ,
      taille: req.body.taille ,
      adresseDepart: req.body.adresseDepart ,
      dateLimite: req.body.dateLimite ,
      adresseArrive: req.body.adresseArrive ,
      description: req.body.description        
    };
    Annonce.findByIdAndUpdate(req.params.id, { $set: annonce }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in annonce Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

//get all Annonce by user id
router.get("/allAnnonceUser/:idUser", (req, res, next) => {
    Annonce.find({idUser: req.params.idUser }).then(annonces => {
      res.status(200).json({
        message: "Annonces récupérés avec succès!!",
        Annonces: annonces
      });
    });
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