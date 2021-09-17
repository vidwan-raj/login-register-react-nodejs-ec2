const bcrypt = require ('bcrypt');


class Router{
    constructor(app,db){
        this.login(app,db);
        this.logout(app,db)  ;
        this.isLoggedIn(app,db);
        this.Register(app,db);
    }

    login(app,db) {
        app.post('/login' , (req, res) => {
            let username = req.body.username;
            let password = req.body.password;

             username  = username.toLowerCase();

             if(username.length > 12 || password.length > 12){
                 res.json({
                     success :false,
                     msg : 'An error occured, Please try again'
                 })
                 return;
             }

             let cols = [username];
             db.query('SELECT * FROM user WHERE username = ? LIMIT 1', cols , (err, data, fields) => {
                   if(err){
                       res.json({
                           success : false,
                            msg : 'An error occured, please try again'
                       })
                       return;
                   }
                   console.log(data);
                   //found the user with username
                   if(data && data.length ===1 ){
                        bcrypt.compare(password,data[0].password, (bcryptErr, verified)=>{
                            if(verified){
                                req.session.userID = data[0].id;
                                res.json({
                                    success:true,
                                    username : data[0].username
                                })
                                return;
                            }
                            else{
                                res.json({
                                    success :false,
                                    msg: 'Invalid Password'
                                })

                            }
                        });
                   }else {
                       res.json({
                           success:false,
                            msg : 'user not found, please try again'
                       })
                   }
             });
        });

    }

    Register(app, db){
        app.post('/Register', (req, res) => {
            let username = req.body.username;
            let password = bcrypt.hashSync(req.body.password,9);
            let firstName = req.body.firstName;
            let lastName = req.body.lastName;
            let email = req.body.lastName;
            username = username.toLowerCase();
            let cols = [username, password , firstName,  email, lastName];
            let query = 'INSERT INTO user(username, password , firstName, email, lastName ) values (?,?,?,?,?)';

            db.query(query, cols, (err, data, fields) => {
                if(err){
                    res.json({
                        success : false,
                         msg : 'An error occured, please try again'
                    })
                    return;
                }

                res.json({
                    success: true,
                    msg : 'Registered Succesfully' 
                })
          
            });
        })
    }

    logout(app,db){
           app.post('/logout' , (req, res) => {
                if(req.session.userID){
                    req.session.destroy();
                    res.json({
                        success:true
                    })
                    return true;
                }else{
                    res.json({
                        success:false
                    })
                    return false;
                }

           })

    }

    isLoggedIn(app,db){
        app.post('/isLoggedIn',(req,res) =>{
            if(req.session.userID){
                let cols = [req.session.userID];
                db.query('SELECT * from user WHERE id = ? LIMIT 1 ', cols, (err, data, fields) =>{
                    if(data && data.length ===1 ){
                        res.json({
                            success : true,
                            username : data[0].username
                        })
                        return true;
                    }else {
                        res.json({
                            success :false
                        })
                    }
                })
            }else{
                res.json({
                    success: false
                })
            }
        })
    }
}

module.exports = Router;