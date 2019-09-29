const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

const talentSchema = mongoose.Schema({
  
    nom: {
        type: String,
        required: true
    }, 

    prenom: {
        type: String,
        required: true
    },

    dateDeNaissance: {
        type: String ,
        // required: true
    },

    sexe: {
        type: String,
        // required: true
    },

    adresse: {
        type: String,
        // required: true
    },

    telephone: {
        type: Number,
        // required: true
    },

    email: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
 
    username: {
        type: String,
        unique: true,
        required: true
    }, 

    password: {
        type: String,
        // required: true
    },

 

    

});

talentSchema.plugin(uniqueValidator);

const Talent = module.exports = mongoose.model('user', talentSchema);

talentSchema.pre("save", function(next) {
        var talent = this
    
        if (!talent.isModified('password')) return callback()
        bcrypt.genSalt(10, function(err, salt) {
          if (err) return next(err)
          bcrypt.hash(talent.password, salt, function(err, hash) {
            if (err) return next(err)
            talent.password = hash 
              const currentDate = new Date
              talent.updated_at = currentDate
              next()
          })
        }) 
    
      })


talentSchema.path('email').validate((val) => {
        emailRegex =
         /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(val);
    }, 'Invalid e-mail.');


    // to Register the talent
module.exports.addTalent = function (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

// Find the talent by ID
module.exports.getTalentById = function (id, callback) {
    Talent.findById(id, callback);
}

// Find the talent by Its username
module.exports.getTalentByUsername = function (username, callback) {
    const query = {
        username: username
    }
    Talent.findOne(query, callback);
}
 
// Compare Password
module.exports.comparePassword = function (password, hash, callback) {
    bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
        
    });
}  


