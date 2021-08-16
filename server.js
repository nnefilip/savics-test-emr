var express = require("express");
var app = express();
// import of the sqlite db
var db = require("./db.sqlite");

var HTTP_PORT = 8484;
app.listen(HTTP_PORT, () => {
    console.log("Server is running on port %PORT%".replace("%PORT%", HTTP_PORT));
});

app.get("/", (req, res, next) => {
    res.json({"message":"OK"});
});

app.use(function (req, res) {
    res.status(404);
});

app.get("/api/emr/patients", (req, res, next) => {
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