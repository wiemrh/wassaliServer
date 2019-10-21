var mongoose = require('mongoose');
var { Annonce } = require('./Annonce');
var moment = require('moment');
var Annonce = mongoose.model('Annonce', {

idUser: {
    type: String,
    required: true
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
    },
 dateDe: {
        type: String ,
        default: moment().format('llll') 
    }
    // imageAnnnonce: {
    //     type: String,
     
    // },

});

module.exports = { Annonce }