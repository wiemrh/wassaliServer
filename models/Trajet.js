var mongoose = require('mongoose');
var { Trajet } = require('./Trajet');

var Trajet = mongoose.model('Trajet', {

idUser: {
    type: String,
  }, 
 
adresseDepart: {
    type: String,
    required: true
  },
adresseArrive: {
    type: String,
  },
dateAller: {
    type: String,
    required: true
  },
dateRetour: {
      type: String,
    },
description: {
      type: String,
    },
formatMaxDeColis:{
    type: String,
    required: true
},
moyenDeTransport:{
    type: String
}

});

module.exports = { Trajet }