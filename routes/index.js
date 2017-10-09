var express = require('express');
var router = express.Router();
var crypto=require('../utils/hash-salt');
var _ = require('lodash');
var multer  = require('multer');
var queries = require('../utils/queries');



//multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/upload_images/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname  )
  }
});
var upload = multer({ storage: storage })



/* GET Routes*/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', function(req, res, next) {
   res.render('signup');
});

router.get('/admin', function(req, res, next) {
  queries.adminProfile(res);
});

router.get('/logout', function(req, res, next) {
 
  req.session.destroy(function(err) {
    if(err) {
        console.log(err);
    } else {
        res.redirect('/');
    }
});
  
});


router.get('/profile', function(req, res, next) {

   var profile={
     name:req.session.uname,
     email:req.session.email,
     id:req.session.Id,
     image:req.session.image
   }
   console.log(profile);

   res.send(JSON.stringify(profile));
});

//post routes
router.post('/login/editProfile',function(req,res){
  console.log(req.body);
      if(req.body.delete){
        var user=''+req.body.delete;
        queries.deleteData(user).then((result)=>{
          console.log('user deleted:',result.affectedRows);
         queries.adminProfile(res); 
          //res.send('successfullt deleted');
         // res.redirect('/'); 
        })
      }else 
          {
            res.render('editProfile',{name:req.body.name});
          }         
      })

router.post('/signup',upload.any(),(req,res)=>{
 // console.log(req.files);
       if (!req.files)
        return res.status(400).send('No files were uploaded.');
        var file = req.files[0].filename;
       var user={
                  image:file,
                  name:req.body.name,
                  email:req.body.email,
                  password:req.body.psw
                };
      
     queries.insertData(user).then((results)=>{
      console.log('inserted id:'+results.insertId);    
      res.redirect('/');  
     })           
});


router.post('/editProfile',(req,res)=>{
       console.log(req.body);

      // res.send(req.body);
       var  body=_.pick(req.body,["email","password"]);      
        var name=''+req.body.name;
        queries.updateData(name,body).then((result2)=>{
          queries.readData(name).then((result2)=>{
             
           // session.email=result2[0].email;
            res.send('User updated');
           // res.render('profile',{image:result2[0].image,name:result2[0].name,email:result2[0].email});
          });        
        // console.log(result2);
        });     
       
})

router.post('/login',(req,res)=>{ 
  console.log(req.body) ;
   
       var name=''+req.body.uname;
       queries.readData(name).then((result)=>{
       // console.log(result);
          if(result.length>0){
              if(crypto.validate(result[0].password,result[0].salt,req.body.psw)){
                console.log('password success'); 
                req.session.email=result[0].email;
                req.session.uname=result[0].name;
                req.session.Id=result[0].user_id;
                req.session.image=result[0].image;
              //  req.session.storage = new Date();
                    if(req.body.uname=='admin'){  
                       
                      res.send({
                        status:true,
                        name:'admin',
                        url:'/admin'
                      });               
                    // queries.adminProfile(res);            
                    }else 
                          {
                            
                            res.send({
                              status:true,
                              url:'/'
                            });
                            // res.cookie('access_token',result[0].token, {httpOnly: true}).status(301).render('profile',{image:result[0].image,name:result[0].name,email:result[0].email});
                         // res.render('profile',{image:result[0].image,name:result[0].name,email:result[0].email});
                          }      
              }else
                    {
                      console.log('password did not match');
                      res.send({
                          status:false,                  
                          message:"Email and password does not match"
                        });
                      }
              }else
                  {
                      console.log('register first');
                      res.send({
                        status:false,
                      message:"User does not exits"
                      });
                    }
    });     
     
})
module.exports = router;
