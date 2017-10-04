var connection=require('../utils/mysql');


function adminProfile(res){

   connection.query(`SELECT * FROM users ;`,function(error,results){
    if (error) {
        console.log(error.message);
    } else {
      //  console.log(results);    
        console.log(results.length);  
        
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
                                            <button id="button_1" value="${item.name}" name="modify">Modify</button>
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
                                        // callback code here
                                       /* $("#myLink").click(function() {
                                            window.location.reload();
                                        });*/
                                    }
                                    })
                
                            })
                            })
                        
                    
                    </script>
                    
                </body>
                </html>
                `;
                    
      res.send(html);  
    }
   })
}

module.exports = adminProfile;