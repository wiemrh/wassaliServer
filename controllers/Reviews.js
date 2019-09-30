const express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var { Reviews } = require('../models/Reviews');

//post
router.post('/', (req, res) => {
    
    var reviews = new Reviews({

    idUserProp: req.body.idUserProp ,
    idUserANote: req.body.idUserANote ,
    comment: req.body.comment ,
    note: req.body.note 
    
    });
    reviews.save((err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in reviews Save :' + JSON.stringify(err, undefined, 2)); }
    });
});

//get all Reviews
router.get('/', (eq, res) => {
    Reviews.find((err, docs) => {
        if (!err) { res.send(docs); }
        else { console.log('Error in Retriving Reviews :' + JSON.stringify(err, undefined, 2)); }
    });
});

//update 
router.put('/:id', (req, res) => {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`No record with given id : ${req.params.id}`);

    var reviews = {

  
        comment: req.body.comment ,
        note: req.body.note 
              
    };
    Reviews.findByIdAndUpdate(req.params.id, { $set: reviews }, { new: true }, (err, doc) => {
        if (!err) { res.send(doc); }
        else { console.log('Error in Reviews Update :' + JSON.stringify(err, undefined, 2)); }
    });
});

//get all Reviews by userANote id
router.get("/allReviewsUser/:idUserANote", (req, res, next) => {
    Reviews.find({idUserANote: req.params.idUserANote }).then(reviews => {
      res.status(200).json({
        message: "Reviews récupérés avec succès!!",
        Reviews: reviews
      });
    });
  });


  //get all Reviews by userProp id
router.get("/allReviewsUser/:idUserProp", (req, res, next) => {
    Reviews.find({idUserProp: req.params.idUserProp }).then(reviews => {
      res.status(200).json({
        message: "Reviews récupérés avec succès!!",
        Reviews: reviews
      });
    });
  });

  // GET Reviews By Id
router.get("/:id", (req, res, next) => {
    Reviews.findById(req.params.id).then(pay => {
      if (pay) {
        res.status(200).json(pay);
      } else {
        res.status(404).json({ message: "Reviews n'a pas été trouvé!" });
      }
    });
  });

  // DELETE Reviews By Id
router.delete("/:id", (req, res, next) => {
    Reviews.deleteOne({ _id: req.params.id }).then(result => {
   //   console.log(result);
      res.status(200).json({ message: "Reviews a été supprimé avec succés!" });
    });
  });
  


module.exports = router;