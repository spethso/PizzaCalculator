const fs = require('fs');
const http = require('http');
const HttpDispatcher = require('httpdispatcher');
const port = 5910;

var dispatcher = new HttpDispatcher();

function handleRequest(request, response){
    try{
        dispatcher.dispatch(request,response)
    } catch (err) {
        console.warn(err);
    }
}

function defineRouteHandlers(){
    dispatcher.onGet('/', function(request, response){
        response.end(result);
    });

    dispatcher.onGet('/result', function(request, response){
        response.end(result);
    });
}


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

var server = http.createServer(handleRequest);

server.listen(port, function(){
    console.log("Adding handlers for routes...")
    defineRouteHandlers();

    console.log("ML Server listening on http://localhost:%s" , port);
    console.log("\tVisit /log to retrieve all logs");
    console.log("\tVisit /result to retrieve the result");
    console.log("Starting TFMAP...")
})