/**
 * Declartion of variables
 */
///////////////////////////////////////////////////////////////
const express = require('express');
const path = require('path');
const fs = require('fs');
const bp = require('body-parser');
const urlcp = bp.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 });
const mongoose = require('mongoose');
const formidable = require('formidable');
const port = process.env.PORT || 8080;
const User = require('./controller/user');
const db = require('./config/DBConfig');
//////////////////////////////////////////////////////////////

// const master = express(); 
// const domain = "riurs.dev"

/**
 * Initialization of (Express) Server Class
 */
const app = express();
//app.use(express.static(path.join(__dirname, 'public')));
//app.use(vhost)

mongoose.connect(`${db.dbHost}://${db.dbURL}:${db.dbPORT}/${db.dbName}`, () => {
    console.log(`Connect to ${db.dbName}`);
});

///////////////////////////////////////////////////////////////
/**
 * Set Server middleware
 */
app.use(express.static(path.join(__dirname, 'public')));
app.use(bp.json({ limit: "50mb" }));
app.use(urlcp);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
///////////////////////////////////////////////////////////////

const members = [
    "Mikhail Shaw",
    "Wembley Williams",
    "Monesh Davis",
    "Orane Wellington"
]

app.get('/', function(req, res, next) {
    res.render('index');
});

app.post('/search', (req, res, next) => {
    console.log(JSON.stringify(req.body));
    let text = req.body.data.toLowerCase();
    let member = "None"
    if (!text.empty && text != " ") {
        for (x = 0; x < members.length; x++) {
            let temp = members[x].toLowerCase();
            if (temp.includes(text)) {
                member = members[x];
                break;
            }
        }
    }

    res.render('search', { result: member });
});


app.get('/search/:data', (req, res, next) => {
    console.log(JSON.stringify(req.body));
    let text = req.params.data.toLowerCase();
    let member = "None"
    if (!text.empty && text != " ") {
        for (x = 0; x < members.length; x++) {
            let temp = members[x].toLowerCase();
            if (temp.includes(text)) {
                member = members[x];
                break;
            }
        }
    }

    res.render('search', { result: member });
});
app.post('/searchDrop', (req, res, next) => {
    console.log(JSON.stringify(req.body));
    let text = req.body.data.toLowerCase();
    let member = [];
    if (!text == member && text != " " && !text.empty) {
        for (x = 0; x < members.length; x++) {
            let temp = members[x].toLowerCase();
            if (temp.includes(text)) {

                member.push(members[x]);
            }
        }
    }

    res.json({ result: member })

})


app.get('/login', (req, res, next) => {
    res.render('login');
});

app.get('/register', (req, res, next) => {
    res.render('register');
});

app.get('/dashboard', (req, res, next) => {
    res.render('dashboard');
});

app.post('/login', (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        User.getUser(fields, res);
    });
});

app.post('/register', (req, res) => {
    console.log(`Request Body: ${JSON.stringify(req.body)}`);
    const form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        /*console.log(`Body: ${JSON.stringify(fields)}\nFiles: ${JSON.stringify(files)}`);
        res.json({ body: fields, files: files });*/
        User.addUser(fields, files, res);
    });
});


app.listen(port, function() {
    console.log("Server listening to: " + port);
});