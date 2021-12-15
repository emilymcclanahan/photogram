var express = require("express");
var router = express.Router();
const app = express();
//var session = require('express-session');
var passwordHash = require('password-hash');
//const fileUpload = require('express-fileupload');

var aws = require('aws-sdk')
var express = require('express')
var multer = require('multer')
var multerS3 = require('multer-s3')

var s3 = new aws.S3()

aws.config.update({
    secretAccessKey: process.env.S3_ACCESS_SECRET,
    accessKeyId: process.env.S3_ACCESS_KEY,
    region: "us-east-2",
});

function connectDatabase() {
    var mysql = require('mysql')
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'wustl_inst',
        password: 'wustl_pass',
        database: 'Creative Project'
    })
    return connection;
}

router.get("/", function(req, res, next) {
    res.send("API is working properly");
});

router.get("/checkuser", function(req, res, next) {
    //res.send(app.locals.user);
});

router.post('/register', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    //check for empties
    if (username == "" || password == "") {
        res.send("Please fill out entire form to register.");
        return false;
    }

    //check username
    var validUsername = username.match(/^[a-zA-Z0-9]+$/);
    if (validUsername == null) {
        res.send("Username is not valid. Only characters a-x, 1-10, and '-' are  acceptable.");
        return false;
    }
    
    //salt and hash password
    password = passwordHash.generate(password);

    //msql add to database
    var connection = connectDatabase();
    
    connection.connect()

    var sql = "INSERT INTO users (username, hashed_password, profimgtag, private) VALUES(?, ?, ?, ?)";

    connection.query(sql, [username,password,"Default",0], function (err, data) {
        if (err) {
            res.send('Username "' + username + '" already taken. Please try again.');
        }
        else {
            res.send('Account successfully created!');
        }
    })
    connection.end();
});

router.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    //check for empties
    if (username == "" || password == "") {
        res.send("Please fill out entire form to login.");
        return false;
    }

    //check username and password with database
    var connection = connectDatabase();
    
    connection.connect()

    var sql = "SELECT hashed_password FROM users WHERE username=?";

    connection.query(sql,[username], function (err, data) {
        if (err) {
            res.send('There was a problem. Please try again.');
        }
        else {
            //check username
            if (data[0] == null) {
                res.send('Invalid username. Please try again.');
            }
            else {
                //check password
                var pwd = Object.values(JSON.parse(JSON.stringify(data[0])))[0];;
                if (passwordHash.verify(password, pwd)) {
                    app.locals.user = username;
                    res.send('success');
                }
                else {
                    res.send('Invalid password. Please try again.');
                }
            }
        }
    })
    connection.end();
})

//https://levelup.gitconnected.com/file-upload-express-mongodb-multer-s3-7fad4dfb3789
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
    }
};

var upload = multer({
    fileFilter,
    storage: multerS3({
        s3: s3,
        bucket: 'creativeproject-475030-464202',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
})

router.post('/newpost', upload.single("file"), function(req, res) {
    var imgkey = req.file.key;
    var url = "https://creativeproject-475030-464202.s3.amazonaws.com/" + imgkey;

    res.send(url); //for the img tag
});

router.post('/newpostdatabase', upload.single("file"), function(req, res) {
    //msql add to database
    var connection = connectDatabase();
    
    connection.connect()

    var sql = "INSERT INTO post (username, imgtag, caption) VALUES(?, ?, ?)";

    connection.query(sql, [req.body.username, req.body.imgtag, req.body.caption], function (err, data) {
        if (err) {
            res.send('Username "' + req.body.username + '" already taken. Please try again.');
        }
        else {
            res.send('Account successfully created!');
        }
    })
    connection.end();
});

router.get("/displayposts", function(req, res, next) {
    var connection = connectDatabase();
    
    connection.connect()

    var sql = "SELECT * FROM post INNER JOIN users ON post.username = users.username ORDER BY id DESC";

    connection.query(sql, function (err, data) {
        if (err) {
            console.log('error');
        }
        else {
            var array = JSON.stringify(data);
            res.send(array);
        }
    })
    connection.end();
});

router.post("/displayprofileposts", function(req, res, next) {
    var connection = connectDatabase();
    
    connection.connect()

    var sql = "SELECT * FROM post INNER JOIN users ON post.username = users.username WHERE post.username=? ORDER BY id DESC";

    connection.query(sql, [req.body.clickedusername], function (err, data) {
        if (err) {
            console.log('error');
        }
        else {
            var array = JSON.stringify(data);
            res.send(array);
        }
    })
    connection.end();
});

router.post("/profile", function(req, res, next) {
    var connection = connectDatabase();
    
    connection.connect()

    var sql = "SELECT * FROM users WHERE username=?";

    connection.query(sql, [req.body.clickedusername], function (err, data) {
        if (err) {
            console.log('error');
            res.send("error");
        }
        else {
            var array = JSON.stringify(data[0]);
            res.send(array);
        }
    })
    connection.end();
});

router.post("/edit", function(req, res, next) {
    var private = 0;
    if (req.body.private) {
        private = 1;
    }

    var connection = connectDatabase();
    
    connection.connect()

    var sql = "UPDATE users SET name = ?, bio = ?, profimgtag = ?, private = ? WHERE username = ?";

    connection.query(sql, [req.body.name, req.body.bio, req.body.profimgtag, private, req.body.username], function (err, data) {
        if (err) {
            res.send('error');
        }
        else {
            res.send('success');
        }
    })
    connection.end();
});

router.post("/displaycomments", function(req, res, next) {
    var id = req.body.id;
    var connection = connectDatabase();
    
    connection.connect()

    var sql = "SELECT * FROM comments WHERE post_id=?";

    connection.query(sql, [id], function (err, data) {
        if (err) {
            console.log('error');
        }
        else {
            var array = JSON.stringify(data);
            res.send(array);
        }
    })
    connection.end();
});

router.post("/postcomment", function(req, res, next) {
    var comment = req.body.input;
    var comment_username = req.body.username;
    var post_id = req.body.id;

    var connection = connectDatabase();
    
    connection.connect()

    var sql = "INSERT INTO comments (comment_username, comment, post_id) VALUES(?, ?, ?)";

    connection.query(sql, [comment_username, comment, post_id], function (err, results) {
        if (err) {
            console.log("error");
        }
        else {
            var result = results.insertId;
            res.send(result + "");
        }
    })
    connection.end();
});

router.post("/deletecomment", function(req, res, next) {
    var comment_id = req.body.id;

    var connection = connectDatabase();
    
    connection.connect()

    var sql = "DELETE FROM comments WHERE comment_id = ?";

    connection.query(sql, [comment_id], function (err, results) {
        if (err) {
            res.send("error");
        }
        else {
            res.send("success");
        }
    })
    connection.end();
});

router.post("/deletepost", function(req, res) {
    var id = req.body.id;

    //deleting comments
    var connection = connectDatabase();
    connection.connect();

    var sql = "DELETE FROM comments WHERE post_id = ?";

    connection.query(sql, [id])
    connection.end();

    //delete likes
    var connection1 = connectDatabase();
    connection1.connect();

    var sql1 = "DELETE FROM likes WHERE post_id = ?";

    connection1.query(sql1, [id]);

    connection1.end();

    //deleting post
    var connection2 = connectDatabase();
    connection2.connect();

    var sql2 = "DELETE FROM post WHERE id = ?";

    connection2.query(sql2, [id], function (err) {
        if (err) {
            res.send("error");
        }
        else {
            res.send("success");
        }
    })
    connection2.end();
});

router.post("/deleteaccount", function(req, res) {
    var username = req.body.username;

    //deleting comments that this user posted
    var connection = connectDatabase();
    connection.connect();

    var sql = "DELETE FROM comments WHERE comment_username = ?";

    connection.query(sql, [username]);
    connection.end();

    //deleting comments on this user's post
    var connection2 = connectDatabase();
    connection2.connect();

    var sql2 = "DELETE comments FROM comments INNER JOIN post ON post.id = comments.post_id WHERE post.username = ?";

    connection2.query(sql2, [username]);
    connection2.end();

    //delete likes from this user's post
    var connection1 = connectDatabase();
    connection1.connect();

    var sql1 = "DELETE likes FROM likes INNER JOIN post ON post.id = likes.post_id WHERE post.username = ?";

    connection1.query(sql1, [username]);
    connection1.end();

    //delete this user's likes on other users' posts
    var connection5 = connectDatabase();
    connection5.connect();

    var sql5 = "DELETE FROM likes WHERE liker_username = ?";

    connection5.query(sql5, [username]);
    connection5.end();


    //deleting posts
    var connection3 = connectDatabase();
    connection3.connect();

    var sql3 = "DELETE FROM post WHERE username = ?";

    connection3.query(sql3, [username])
    connection3.end();

    //deleting user
    var connection4 = connectDatabase();
    connection4.connect();

    var sql4 = "DELETE FROM users WHERE username = ?";

    connection4.query(sql4, [username], function (err) {
        if (err) {
            res.send("error");
        }
        else {
            res.send("success");
        }
    })
    connection4.end();
});

router.post("/likepost", function(req, res, next) {
    var liker_username = req.body.username;
    var post_id = req.body.id;
    

    var connection = connectDatabase();
    
    connection.connect()

    var sql = "INSERT INTO likes (post_id, liker_username) VALUES(?, ?)";

    connection.query(sql, [post_id, liker_username], function (err, results) {
        if (err) {
            console.log("error");
        }
        else {
            res.send("success");
        }
    })
    connection.end();
});

router.post("/displaylike", function(req, res, next) {
    var post_id = req.body.id;
    
    var connection = connectDatabase();
    
    connection.connect();

    var sql = "SELECT * FROM likes WHERE post_id=?";

    connection.query(sql, [post_id], function (err, data) {
        if (err) {
            console.log("error");
        }
        else {
            var array = JSON.stringify(data);
            res.send(array);
        }
    })
    connection.end();
});


module.exports = router;
