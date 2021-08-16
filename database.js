var sqlite = require("sqlite3").verbose()

const DBSOURCE = "db.sqlite";

let db = new sqlite.Database(DBSOURCE, (error) => {
    if (error) {
        console.log("Error : " + error.message);
        throw error;
    } else {
        console.log("connecting to the database....");
        db.run(`CREATE TABLE patients(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstname VARCHAR(70), 
            lastname VARCHAR(70), 
            gender VARCHAR(7), 
            age INTEGER DEFAULT 0, 
            city VARCHAR(100), 
            country VARCHAR(100), 
            diabetic INTEGER DEFAULT 0
        )`, (error) => {
            if (error) {
                console.log("Table patient already exists");
            } else {
                var initialisation = 'INSERT INTO patients(firstname, lastname, gender, age, city, country, diabetic) VALUES(?, ?, ?, ?, ?, ?, ?)';
                db.run(initialisation, ['', '', '', 0, '', '', '']);
                console.log("Table patient created successfully");
            }
        });
    }
});

module.exports = db;