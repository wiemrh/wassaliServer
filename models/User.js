const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  
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
    imageUser: {
        type: String,
     
    },

 

    

});

userSchema.plugin(uniqueValidator);

const User = module.exports = mongoose.model('user', userSchema);

userSchema.pre("save", function(next) {
        var user = this
    
        if (!user.isModified('password')) return callback()
        bcrypt.genSalt(10, function(err, salt) {
          if (err) return next(err)
          bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err)
            user.password = hash 
              const currentDate = new Date
              user.updated_at = currentDate
              next()
          })
        }) 
    
      })


      userSchema.path('email').validate((val) => {
        emailRegex =
         /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(val);
    }, 'Invalid e-mail.');


    // to Register the talent
module.exports.addUser = function (newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

// Find the User by ID
module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
}

// Find the User by Its username
module.exports.geUserByUsername = function (username, callback) {
    const query = {
        username: username
    }
    User.findOne(query, callback);
}
 
// Compare Password
module.exports.comparePassword = function (password, hash, callback) {
    bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
        
    });
}  


