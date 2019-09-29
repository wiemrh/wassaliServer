const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;

var { Trajet } = require('../models/Trajet');


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




router.get('/', (eq, res) => {
    Trajet.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving trajet :' + JSON.stringify(err, undefined, 2)); }
    });
});



module.exports = router;