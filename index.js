var express = require('express')
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://swi:swi@cluster0.knjrz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
var app = express()


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
app.set("views engine", "ejs")
app.get('/',function(req,res){
   res.render('reg.ejs')
})
app.post('/',function(req,res){
    res.send(req.body.user+
        req.body.age+
        req.body.pass+
        "Insertd"
        )
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            var myobj = { name: req.body.user, age: req.body.age, password: req.body.pass ,opt: "0"};
            dbo.collection("login").insertOne(myobj, function(err, res) {
              if (err) throw err;
              console.log("1 document inserted");
              db.close();
            });
          });
})
app.get('/log',function(req,res){
    res.render('log.ejs')
})
app.post('/log',function(req,res){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mydb");
        var query = { name:req.body.user, password:req.body.pass };
        dbo.collection("login").find(query).toArray(function(err, result) {
          if (err) throw res.send("no");
          console.log(result.name);
          res.send(result)
          db.close();
        });
      });
      // MongoClient.connect(url, function(err, db) {
      //   if (err) throw err;
      //   var dbo = db.db("mydb");
      //   dbo.collection("login").findOne({}, function(err, result) {
      //     if (err) throw err;
      //     res.send(result.name+result.age);
      //     db.close();
      //   });
      // });
})
app.get('/mail',function(req,res){
  res.send("hi");
})
var nodemailer = require('nodemailer');
app.get('/rand',function(req,res){
  const s=(Math.floor(100000 + Math.random() * 900000));
  console.log(s)
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'swithinasir@gmail.com',
      pass: 'Sinola123'
    }
  });
  
  var mailOptions = {
    from: 'swithinasir@gmail.com',
    to: 'swithinasir@gmail.com',
    subject: 'Sending Email using Node.js',
    html: "<h1>"+s+"</h1>"
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var myquery = { opt: "0" };
  var newvalues = {$set: {opt: s} };
  dbo.collection("login").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    db.close();
  });
});

res.send("code generated")
})
app.get('/fetch',function(req,res){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("login").findOne({}, function(err, result) {
      if (err) throw err;
      res.send(result.name+result.age);
      db.close();
    });
  });
})
app.listen(9000)