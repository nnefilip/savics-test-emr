var express = require("express");
var app = express();
// import of the sqlite db script
var db = require("./database");
var bodyParser = require("body-parser");

var HTTP_PORT = 8484;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(HTTP_PORT, () => {
    console.log("Server is running on port %PORT%".replace("%PORT%", HTTP_PORT));
});

app.get("/", (req, res, next) => {
    console.log("Working URL");
    res.json({"message":"OK"});
});

app.get("/api/1.0/emr", (req, res, next) => {
    var sql = "SELECT * from patients";
    var params = [];
    db.all(sql, params, (error, rows) => {
        if (error) {
            res.status(400).json({"error": error.message});
            return;
        }
        res.json({
            "message":"success",
            "nbrows": rows.length,
            "data": rows
        });
    });
});

app.post("/api/1.0/emr", (req, res, next) => {
    var errors = [];
    if (!req.body.firstname) {
        errors.push("You have to define a firstname");
    }
    if (!req.body.lastname) {
        errors.push("You have to define a lastname");
    }
    if (!req.body.gender) {
        errors.push("You have to define a gender");
    }
    if (!req.body.age) {
        errors.push("You have to define an age");
    }
    if (!req.body.city) {
        errors.push("You have to define a city");
    }
    if (!req.body.country) {
        errors.push("You have to define a country");
    }
    if (!req.body.diabetic) {
        errors.push("You have to define a diabetic status");
    }
    if (errors.length) {
        res.status(400).json({"error":errors.join(",")});
        return;
    }

    var data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        gender: req.body.gender,
        age: req.body.age,
        city: req.body.city,
        country: req.body.country,
        diabetic: req.body.diabetic
    }

    var sql = 'INSERT INTO patients(firstname, lastname, gender, age, city, country, diabetic) VALUES(?, ?, ?, ?, ?, ?, ?)';
    var params = [data.firstname, data.lastname, data.gender, data.age, data.city, data.country, data.diabetic];
    db.run(sql, params, function (error, result) {
        if (error) {
            res.status(400).json({"error": error.message});
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "patientId": this.lastID
        })
    });
})

app.use(function (req, res) {
    res.status(404);
});

