var connection=require('./promisedb');
var crypto=require('./hash-salt');
var _ = require('lodash');

//insert query
function insertData(user){
    Object.assign(user, crypto.createHash(user.password));
   return  connection.query(` INSERT INTO users SET image='${user.image}',name='${user.name}',email='${user.email}xy',password='${user.password}',salt='${user.salt}';`);

}

//read query
function readData(user){
     return    connection.query(`SELECT * FROM users  WHERE name like '${user}'`);
};

//delete query
function deleteData (user){
    return connection.query(`DELETE  FROM  users WHERE  name LIKE '${user}';`);
}

//update query
function updateData(user,data){
    return connection.query(`SELECT * FROM users  WHERE name like '${user}'`).then((res)=>{
        if(data.password.length>0 && data.email.length>0){
            Object.assign(data, crypto.createHash(data.password));
            Object.assign(res[0], data);
            return   connection.query(`UPDATE  users SET email='${res[0].email}', password='${res[0].password}',salt='${res[0].salt}'  WHERE name like '${user}'`);
    
         }else if(data.password.length>0){
             data=_.pick(data,["password"]);
            Object.assign(data, crypto.createHash(data.password));
            Object.assign(res[0], data);
            return   connection.query(`UPDATE  users SET  password='${res[0].password}',salt='${res[0].salt}'  WHERE name like '${user}'`);
    
         }else{
            Object.assign(res[0], data);    
             return   connection.query(`UPDATE  users SET email='${res[0].email}'  WHERE name like '${user}'`);
         }
        
 });
}


//admin login function
function adminProfile(res){
  
       connection.query(`SELECT * FROM users ;`).then((results)=>{
           // console.log(results);    
            console.log('total users:',results.length);  
            if(results.length == 0){
                res.redirect('/'); 
            }             
            var html= `<!DOCTYPE html>
            <html>
              <head>
                <title>Profiles</title>
                
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
                <!-- jQuery library -->
                    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
            
                    <!-- Latest compiled JavaScript -->
                    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
                <link rel='stylesheet' href='/stylesheets/style.css' />
              </head>
              <body>
              <a href="#" id="myLink">Admin</a> <br />  <a href="/"><span class="icon-trash"></span> Logout</a>
                `;
                
                        for (var i=0 ;i<results.length;i++) {
                            var item=results[i];
                            //console.log(results[i]);
                            html += `<br><br>
                            <div class="container-fluid well span6">
                            <div class="row-fluid">
                                <div class="span2" >
                                  <div class="container-fluid well span6">
                                     <div class="row-fluid">            
                                           <div class="span8">
                                                <h6>User: ${item.name}</h6>
                                                <h6>Email: ${item.email}</h6>                
                                            </div>
                            
                                            <div class="span2">                                  
                                                <form id="Modify" method="post" action="/login/editProfile"  >
                                                <button id="button_1" value="${item.name}" name="name">Modify</button>
                                                </form>
                                                <form id="delete" method="post" action="/login/editProfile"  >
                                                <button id="button_1" value="${item.name}" name="delete">Delete</button>
                                                </form>
                                            </div>
                                     </div>
                                 </div>
                               </div>
                             </div>
                                 </div>`                 
                          };
            html +=`  
                        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
                        <script>
                                
                            $(document).ready(function() {
                            
                                $("#Modify").submit(function() {
                                    e.preventDefault();
                                    $.ajax({
                                    type: "POST",
                                    url: "/login/editProfile",
                                    data:  $(this).serialize(),
                                    success: function(response) {
                                        // callback code here
                                       /* $("#myLink").click(function() {
                                            window.location.reload();
                                        });*/
                                    }
                                    })
    
                                    $("#delete").submit(function() {
                                        e.preventDefault();
                                        $.ajax({
                                        type: "POST",
                                        url: "/login/editProfile",
                                        data:  $(this).serialize(),
                                        success: function(response) {
    
                                            alert(response);
                                            // callback code here
                                            $("#myLink").click(function() {
                                                window.location.reload();
                                            });
                                        }
                                        })
                    
                                })
                                })
                            
                        
                        </script>
                        
                    </body>
                    </html>
                    `;
                        
          res.send(html);  
       })
    }
    

module.exports = {readData,updateData,deleteData,insertData,adminProfile};