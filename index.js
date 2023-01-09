//Modul http wird hiermit eingebunden
const http = require('http');
const fs = require('fs');
const db = require('./databaseConnection');
var vname;
//const { userInfo } = require('os');


db.execute('SELECT * FROM mitarbeiter').then(result => {
    console.log(result);
}).catch(err => console.log(err)); //wenn Fehler auftretten schreib es in die console  


const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method; //GET (Standard zum Lesen von Daten)  POST (Zum Schicken Daten an Website und lege etwas neu an). PUT (Man kann sachen Updaten), DELET (Mit dem Befehl kann man sachen löschen) = CRUD (Create, Read, Update, Delete)

    //Routing
    if (url === "/") {   //Wenn die URL so "localhost3000/" aussieht kommt man auf die Main Seite  
        res.setHeader("key", "value");
        res.setHeader("Content-Type", "text/html");
        res.write('<html><body>');
        res.write('<h1>Main</h1>');
        res.write('<h1><form action= "/login" method="post"><input type="text" name="Username"/><button type="submit"> Login </form></h1>');
        res.write('</body></html>');
        res.end();
        return;
    }
    //Buffern

    if (url === "/login") {
        //Das ist mein Buffer
        const reqBody = [];
        
        //Wenn bei dem Request daten empfangen(ein Chunk da die Datei gesplittel in Junks wurde) dann mache bitte ... 
        req.on('data', (chunk) => {

            reqBody.push(chunk);

        });
        req.on('end', () => {

            const parsed = Buffer.concat(reqBody).toString();
           // console.log(parsed);
            const altvname = parsed.split('=')[1];
            fs.writeFile(altvname + '.txt', parsed, err => {
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            })
        });
       
        const parsed = Buffer.concat(reqBody).toString();
            console.log("const parsed für die INTO", parsed);
            const vname = parsed.split('=')[1];
        db.execute('INSERT INTO mitarbeiter (vorname) VALUES (?)', [vname])
            .then(result => {
                
                console.log("Fehler beim Insert:");
                console.log(result);
            }).catch(err => console.log(err)); //wenn Fehler auftretten schreib es in die console  

        /*
         res.setHeader("key", "value");
         res.setHeader("Content-Type", "text/html");
         res.write('<html>');
         res.write('<body><h1>Login Seite noch im Aufbau...</h1></body>');
         res.write('</html>');
         res.end();
         return;
         */
    }


    /* Wenn die URL nicht so aussieht: "localhost3000/" kommt man auf die 404 Error Seite 
    res.setHeader("key", "value");
    res.setHeader("Content-Type", "text/html");
    res.write('<html>');
    res.write('<body><h1>404 Error</h1></body>');
    res.write('</html>');
    res.end();
    */


});

//Server hört auf Port 3000
server.listen(3000);
console.log("Server läuft http://localhost:3000");