var mongoose = require('mongoose');
var { Reviews } = require('./Reviews');
var moment = require('moment');
var Reviews = mongoose.model('Reviews', {

idUserProp: {
    type: String,
  }, 

idUserANote: {
    type: String,

  }, 

comment: {
    type: String,

  }, 
 
note: {
    type: String,
 
  },
dateDeC: {
    type: String ,
    default: moment().format('llll') 
}

});

module.exports = { Reviews }