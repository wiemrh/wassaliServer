var mongoose = require('mongoose');
var { Annonce } = require('./Annonce');

var Annonce = mongoose.model('Annonce', {

idUser: {
    type: String,
  }, 

type: {
    type: String,
    required: true
  }, 

taille: {
    type: String,
    required: true
  }, 
 
adresseDepart: {
    type: String,
    required: true
  },
dateLimite: {
    type: String,
    required: true
  },

adresseArrive: {
    type: String,
  },

description: {
      type: String,
    }

});

module.exports = { Annonce }