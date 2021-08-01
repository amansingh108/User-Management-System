var Userdb = require('../model/model.js');

// create and save new user

exports.create = (req, res) =>{
    // validate req
    if(!req.body){
        res.status(400).send({message: "Contenst cannot be empty!"});
        return;
    }

    // new user variable
    const user = new Userdb({
        name: req.body.name,
        email:req.body.email,
        gender:req.body.gender,
        status:req.body.status
    })

    // saving user into the database
    user
     .save(user)
     .then(data=>{
        // res.send(data);
        res.redirect('/adduser');
     })
     .catch(err=>{
         res.status(500).send({
             message: err.message || "Some error occured while creating a create operation"
         })
     })
}

// retrieve and resurn all users/ single user
exports.find = (req, res)=>{

    if(req.query.id){
        const id=req.query.id;
        Userdb.findById(id)
         .then(data=>{
            if(!data){
                res.status(404).send({message: `Not found user with id=`+id})
            }else{
                res.send(data);
            }
         })
         .catch(err=>{
             res.status(500).send({message: "Error retriving user with id="+id});
         })
    }else{
        Userdb.find()
        .then(user => {
            res.send(user);
        })
        .catch(err=>{
            res.status(500).send({
                message: err.message || "Error occured while retrieving user info."
            })
        })
    }
}

// update a new idetified user
exports.update = (req, res)=>{
    // validate req
    if(!req.body){
        return res.status(400).send({message: "Data to update cannot be empty!"});
    }

    const id = req.params.id;
    Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
     .then(data =>{
         if(!data){
             res.status(404).send({message: `Cannot Update user with ${id}. May be user doesn't exist!`})
         }else{
            res.redirect('/');
         }
     })
     .catch(err=>{
         res.status(500).send({message: "Error Update user information."});
     })
}

// delete a user with specified id
exports.delete = (req, res)=>{
    const id = req.params.id;

    Userdb.findByIdAndDelete(id)
      .then(data=>{
          if(!data){
            res.status(404).send({message: `Cannot Delete user with ${id}. May be user doesn't exist!`})
          }else{
            res.redirect('/');
          }
      })
      .catch(err=>{
          res.status(500).send({
              message: "Could not delete the User with id="+id
          });
      });
}