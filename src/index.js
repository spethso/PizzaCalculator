const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.htm");
});


function saveToFile(data, filename = "tfmap.log", exitOnWrite = false){
    let folderName = "results";
    if (!fs.existsSync(folderName)){
        fs.mkdirSync(folderName);
    }
    fs.writeFileSync('results/' + filename, data);
    console.log("The file was saved!");
    if(exitOnWrite){
        process.exit(0);
    }
}

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("REST server listening at http://%s:%s", host, port);
});