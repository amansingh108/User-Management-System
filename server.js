const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080

//parse request to body-parser
app.use(bodyparser.urlencoded({ extended : true }));


dotenv.config({path : './views/config.env'});


//log request
app.use(morgan('tiny'));

// mongoddb connection
const connectDB = require('./server/database/connection');
connectDB();


// set view engin
app.set("view engine", "ejs");

// load assets
app.use('/css', express.static(path.resolve(__dirname, "assets/css")));
app.use('/img', express.static(path.resolve(__dirname, "assets/img")));
app.use('/js', express.static(path.resolve(__dirname, "assets/js")));

// routes
const axios = require('axios');
app.get('/',(req, res)=>{
    //Make a get request to the api/users
    axios.get('http://localhost:8080/api/users')
     .then((response)=>{
        //  console.log(response);
         res.render("index", {users : response.data});
     })
     .catch((err)=>{
         res.send(err);
     })
});


app.get('/adduser',(req, res)=>{
    res.render('adduser.ejs');
});

app.get('/updateuser',(req, res)=>{
    axios.get('http://localhost:8080/api/users',{params:{id:req.query.id}})
     .then((userdata)=>{
         res.render("updateuser",{user : userdata.data})
     })
     .catch(err=>{
         res.send(err);
     })
});

app.get('/deleteuser',(req, res)=>{
    axios.get('http://localhost:8080/api/users',{params:{id:req.query.id}})
     .then((userdata)=>{
         res.render("delete",{user : userdata.data})
     })
     .catch(err=>{
         res.send(err);
     })
});

// API 
// contoller file
const controller = require('./server/controller/control');

// methodOverrideing for put and delete method on post method
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.post('/api/users', controller.create);
app.get('/api/users', controller.find);
app.put('/api/users/:id', controller.update);
app.delete('/api/users/:id', controller.delete);


// listening on PORT
app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});