var express = require('express');
var app = express();
var nodemailer = require('nodemailer');
var MemoryStore = require('connect').session.MemoryStore;


var account_manager = require('./lib/account_manager')

// Import the data layer
var mongoose = require('mongoose');
var config = {
    mail: require('./config/mail')
};

// Import the accounts
var Account = require('./models/Account')(config, mongoose, nodemailer);

app.configure(function(){
    app.set('view engine', 'jade');
    app.use(express.static(__dirname + '/public'));
    app.use(express.limit('1mb'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session(
    {
        secret: "X123SA24SA", 
        store: new MemoryStore()
    }));
    mongoose.connection.on('open', function (ref) {
        console.log('Connected to mongo server.');
    });
    mongoose.connection.on('error', function (err) {
        console.log('Could not connect to mongo server!');
        console.log(err);
    });
    mongoose.connect('mongodb://localhost/nodebackbone');
    
});

app.get('/',function(req, res){
    res.render('index.jade');
});
app.post('/login', function(req, res){
    console.log('Login Request');
    var email = req.param('email',null);
    var password = req.param('password',null);
    
    if(null == email || email.length < 1 || null == password || password.length <1){
        res.send(400);
        return;
    }
    
    Account.login(email, password, function(success){
        if( !success){
            res.send(401);
            return;
        } 
        console.log('login was successful');
        req.session.loggedIn = true;
        res.send(200);
    });
});

app.post('/register', function(req, res){
   
    var firstName = req.param('firstName', '');
    var lastName = req.param('lastName', '');
    var email = req.param('email', null);
    var password = req.param('password', null);
   
    if(null == email || email.length < 1 || null == password || password.length < 1){
        res.send(400);
        return;
    }
    
    Account.register(email, password, firstName, lastName);
    res.send(200);
   
});

app.get('/account/authenticated', function(req, res){
    if( req.session.loggedIn){
        res.send(200);
    } else{
        res.send(401);
        
    }
});

app.post('/forgotpassword', function(req, res){
    var hostname = req.header.host;
    var resetPasswordUrl = 'http://'+hostname+'/resetPassword';
    var email = req.param('email',null);
    if(null == email || email.length < 1){
        res.send(400);
        return;
    }
   
    Account.forgotPassword(email, resetPasswordUrl, function(success){
        if(success){
            console.log("Sending reset mail");
            res.send(200);
        } else{
            // Username or password not found
            res.send(400);
        }
    });
});

app.get('/resetPassword', function(req,res){
    var accountId = req.param('account', null);
    res.render('resetPassword.jade', {
        locals: {
            accountId: accountId
        }
    })
});

app.post('/resetPassword', function(req, res){
  account_manager.resetPassword(req, res);
});

app.listen(8080);
