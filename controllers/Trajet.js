const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var { Trajet } = require('../models/Trajet');

//post
router.post('/', (req, res) => {
    
    var trajet = new Trajet({

        idUser: req.body.idUser ,
        adresseDepart: req.body.adresseDepart,
        adresseArrive: req.body.adresseArrive,
        dateAller: req.body.dateAller,
        dateRetour: req.body.dateRetour,
        description: req.body.description,
        formatMaxDeColis: req.body.formatMaxDeColis,
        moyenDeTransport : req.body.moyenDeTransport
       
    });
    trajet.save((err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Trajet Save :' + JSON.stringify(err, undefined, 2)); }
    });
});

//get all
router.get('/', (eq, res) => {
    Trajet.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving trajet :' + JSON.stringify(err, undefined, 2)); }
    });
});

//update
router.put('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var trajet = {
        idUser: req.body.idUser ,
        adresseDepart: req.body.adresseDepart,
        adresseArrive: req.body.adresseArrive,
        dateAller: req.body.dateAller,
        dateRetour: req.body.dateRetour,
        description: req.body.description,
        formatMaxDeColis: req.body.formatMaxDeColis,
        moyenDeTransport : req.body.moyenDeTransport
        
    };
    Trajet.findByIdAndUpdate(req.params.id, { $set: trajet }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in trajet Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

//get all trajet by user id
router.get("/alltrajetUser/:idUser", (req, res, next) => {
    Trajet.find({idUser: req.params.idUser }).then(trajets => {
      res.status(200).json({
        message: "Trajets récupérés avec succès!!",
        Trajets: trajets
      });
    });
  });

  // GET Trajet By Id
router.get("/:id", (req, res, next) => {
    Trajet.findById(req.params.id).then(pay => {
      if (pay) {
        res.status(200).json(pay);
      } else {
        res.status(404).json({ message: "Trajet n'a pas été trouvé!" });
      }
    });
  });

  // DELETE trajet By Id
router.delete("/:id", (req, res, next) => {
    Trajet.deleteOne({ _id: req.params.id }).then(result => {
   //   console.log(result);
      res.status(200).json({ message: "Trajet a été supprimé avec succés!" });
    });
  });
  


module.exports = router;