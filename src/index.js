/*
* Simple Pizza Calculator
* ------------------------
* Author: Sandro Speth
* Author: Matthias Hermann
* Author: Heiko Geppert
*/

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
app.use(bodyParser.urlencoded({ extended: true }));
const HashMap = require('hashmap');
const dirname = fs.realpathSync('./');
const timeoutInMS = 28800000;

var teams = new HashMap();
var team_suggestions = new HashMap();
var ingredients = JSON.parse(fs.readFileSync(__dirname + '/data/ingredients.json', 'utf8'));
var templates = JSON.parse(fs.readFileSync(__dirname + '/data/templates.json', 'utf8'));

// build api endpoint for getting js files
fs.readdirSync(dirname + '/src/js').forEach(file => {
    app.get('/js/' + file, function (req, res) {
        res.status(200).sendFile(dirname + '/src/js/' + file);
    });
});

// build api endpoint for getting bootstrap files
fs.readdirSync(dirname + '/node_modules/bootstrap/dist').forEach(folder => {
    fs.readdirSync(dirname + '/node_modules/bootstrap/dist/' + folder).forEach(file => {
        app.get('/bootstrap/' + folder + '/' + file, function (req, res) {
            res.status(200).sendFile(dirname + '/node_modules/bootstrap/dist/' + folder + '/' + file);
        })
    });
});

// build api endpoint for getting sweetalert files
fs.readdirSync(dirname + '/node_modules/sweetalert2/dist').forEach(file => {
    app.get('/swal/' + file, function (req, res) {
        res.status(200).sendFile(dirname + '/node_modules/sweetalert2/dist/' + file);
    })
});

app.get('/', function (req, res) {
    res.status(200).sendFile(__dirname + "/index.htm");
});

app.get('/teams', function (req, res) {
    let teamname = req.query.teamname;
    if (teamname != undefined && teams.has(teamname)) {
        res.status(200).sendFile(__dirname + "/teamPage.html");
    } else {
        res.redirect(302, '/');
    }

});

app.get('/pizzas/amount', function (req, res) {
    let teamname = req.query.teamname;
    if (teamname != undefined && teams.has(teamname)) {
        let amount = {
            amount: teams.get(teamname).pizza_count
        };
        res.status(200).end(JSON.stringify(amount));
    } else {
        res.redirect(303, '/');
    }
});

app.get('/pizzas/ingredients', function (req, res) {
    res.status(200).end(JSON.stringify(ingredients));
});

app.get('/pizzas/templates', function (req, res) {
    res.status(200).end(JSON.stringify(templates));
});

app.get('/pizzas/suggestions', function (req, res) {
    let teamname = req.query.teamname;
    if (teamname != undefined && team_suggestions.has(teamname)) {
        let suggestions = team_suggestions.get(teamname);
        res.status(200).end(JSON.stringify(suggestions));
    } else {
        res.redirect(303, '/');
    }
});

app.get('/teams/data', function (req, res) {
    let teamname = req.query.teamname;
    if (teamname != undefined && teams.has(teamname)) {
        res.status(200).end(JSON.stringify(teams.get(teamname)));
    } else {
        res.redirect(303, '/');
    }
});

app.post('/teams/create', function (req, res) {
    let teamname = req.body.teamname;
    if (teamname != undefined && !teams.has(teamname) && !team_suggestions.has(teamname)) {
        console.log('Creating team ' + teamname);
        let data = {
            teamsize: {
                number: 0,
                type: null
            },
            pizza_count: 0
        };
        teams.set(teamname, data);
        team_suggestions.set(teamname, []);
        setTimeout(callback => {
            teams.remove(teamname);
            team_suggestions.remove(teamname);
        }, timeoutInMS);
        res.status(200).sendFile(__dirname + '/js/teamPage.js');
        res.redirect(303, '/teams/?teamname=' + teamname);
    } else {
        console.log('Creating Team: Failure because of undefined teamname!');
        res.status(420).send('<html><body>' +
            '<h1>Team already exists</h1>' +
            '<script>' +
            '   window.setTimeout(() => {' +
            '       window.location.href = "/"' +
            '}, 2000)' +
            '</script>' +
            '</body></html>');
    }
});

app.post('/teams/teamsize', function (req, res) {
    let count = parseInt(req.body.count);
    let type = req.body.type;
    let teamname = req.body.teamname;
    if (count != NaN && type != undefined && teamname != undefined) {
        console.log('Update team size for team ' + teamname);
        let pizza_count = computeNumberOfPizzas(count, type);
        let data = {
            teamsize: {
                number: count,
                type: type
            },
            pizza_count: pizza_count
        };
        teams.set(teamname, data);
        res.redirect(302, '/teams/?teamname=' + teamname);
        res.status(200).end(JSON.stringify({ teamname: teamname, data: data }));
    } else {
        console.log('Update team size failed');
        res.redirect(303, '/');
    }
});

app.post('/pizzas/suggestions', function (req, res) {
    let teamname = req.body.teamname;
    let ingredients = req.body.ingredients;
    if (teamname != undefined && team_suggestions.has(teamname)) {
        console.log('Add suggestion for team ' + teamname);
        let suggestion = {
            id: team_suggestions.get(teamname).length,
            ingredients: ingredients,
            vote: 0
        };
        team_suggestions.get(teamname).push(suggestion);
        res.end(JSON.stringify(suggestion));
    } else {
        console.log('Failed to add suggestion');
        res.redirect(303, '/');
    }
});

app.post('/pizzas/suggestions/vote', function (req, res) {
    let teamname = req.body.teamname;
    let suggestion_id = parseInt(req.body.id);
    let vote = parseInt(req.body.vote);
    if (teamname != undefined && suggestion_id != NaN && vote != NaN && team_suggestions.has(teamname)) {
        console.log('Update vote vor suggestion');
        vote = Math.sign(vote);
        team_suggestions.get(teamname)[suggestion_id].vote += vote;
        res.sendStatus(200);
    } else {
        console.log('Update voting failed');
        res.redirect(303, '/');
    }
});

app.post('/pizzas/templates', function (req, res) {
    let template = req.body.template;
    if (template != undefined) {
        templates.push(template);
        fs.writeFileSync(__dirname + '/data/templates.json', templates, 'utf8');
        res.sendStatus(200);
    } else {
        res.sendStatus(420);
    }
});

function computeNumberOfPizzas(count, type) {
    if (type == 'Personen') {
        let number = count * 4;
        return Math.ceil(number / 16);
    } else if (type == 'Pizzastuecke') {
        return Math.ceil(count / 16);
    } else {
        return 0;
    }
};

let port = 8081

if(process.env.PORT != null) {
  let envPort = parseInt(process.env.PORT);
  if(! (isNaN(envPort) || envPort < 1 || envPort > 65535)) {
    console.log("Found valid environment variable PORT. Setting port to %i", envPort);
    port = envPort;
  } else {
    console.log("The value \"%s\" is not a valid port. Falling back to 8081.", process.env.PORT);
  }
} else {
  console.log("Environment variable PORT not set. Using default port 8081.");
}

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("REST server listening at http://%s:%s", host, port);
});
