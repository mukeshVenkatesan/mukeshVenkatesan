const MongoClient=require('mongodb').MongoClient
const dotenv=require('dotenv')
dotenv.config()
const uri=`mongodb+srv://MukiV:${process.env.MONGO_PASSWORD}@crmproject.ds5pb.mongodb.net/crmdb?retryWrites=true&w=majority`
const client=new MongoClient(uri);
const express = require('express')
const app=express();
const bodyParser=require('body-parser')
const http=require('http').Server(app)

client.connect(err=>{if(err) throw err;})

app.engine('pug',require('pug').__express)
app.set('views','.')
app.set('view engine','pug')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
http.listen(5000,(err)=>{
    if(err) throw err;
    console.log("Port listening:"+http.address().port)
})

app.get('/', function(req, res) {

    res.sendFile('/index.html',{root:'.'})
})
app.get('/create', function(req, res) {
    res.sendFile('/create.html',{root:'.'})
})
app.post('/create',function(req, res) {
    client.connect(err=>{

        if(err) throw err;
        const customers2=client.db("crmdb").collection("customers2")
        const customer={
            name:req.body.name,
            address:req.body.address,
            telephone:req.body.telephone,
            notes:req.body.note
        }
        customers2.insertOne(customer,(err,res)=>{
            if(err) throw err;
            console.log("1 document inserted")
            
        })
    
    })
    res.send("Customer created")
})
app.get('/get',function(req,res){
    res.sendFile('/get.html',{root:'.'})
})
app.get('/get-client',function(req,res){
    client.connect(err=>{
        
        client.db("crmdb").collection("customers2").findOne({name:req.query.name},function(err,result){
            if(err) throw err;
            res.render('update',{
                oldname:result.name,
                oldaddress:result.address,
                oldtelephone:result.telephone,
                oldnote:result.note,
                name:result.name,
                address:result.address,
                telephone:result.telephone,
                note:result.notes
            })
        })
    })
})

app.post('/update', function(req, res) {
    client.connect(err => {
      if (err) throw err;
      let query = { name: req.body.oldname};
      console.log(req.body.oldaddress+req.body.address)

      let newvalues = { $set: {name: req.body.name, address: req.body.address, telephone: req.body.telephone, note: req.body.note } };
      client.db("crmdb").collection("customers2").updateOne(query, newvalues, function(err, result) {
          if (err) throw err;
          console.log("1 document updated");
          res.render('update', {message: 'Customer updated!', oldname: req.body.name, oldaddress: req.body.address, oldtelephone: req.body.telephone, oldnote: req.body.note, name: req.body.name, address: req.body.address, telephone: req.body.telephone, note: req.body.note});
        });
    });
  })

  app.post('/delete',function(req,res){
      client.connect(err=>{
          if(err) throw err;
          let query={name:req.body.name}
          console.log(query);
          client.db("crmdb").collection("customers2").deleteOne(query,function(err,obj){
              if(err) throw err
              console.log(obj)
              res.send(`Customer ${req.body.name} deleted`)
          })
      })
  })