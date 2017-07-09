function retrieveGetParameters() {
    let parameters = {}
    window.location.search
        .substring(1)                                       //Remove '?' at beginning
        .split('&')                                         //Split key-value pairs
        .map((currentElement) => {                          //Fill parameters object with key-value pairs
            const key = currentElement.split('=')[0];
            const value = currentElement.split('=')[1];
            parameters[key] = value;
        })
    return parameters;
}

function getTeamname() {
    const parameters = retrieveGetParameters();
    return parameters["teamname"];
}

function updateTeamname() {
    $('h1')
        .text(getTeamname())
    $('#teamname_input')
        .val(getTeamname());
    $('#teamname_for_selector')
        .val(getTeamname());
}

function getAllSuggestions() {
    let suggestions;
    $.ajax({
        url: '/pizzas/suggestions/?teamname=' + getTeamname(),
        success: (res) => {
            suggestions = JSON.parse(res);
        },
        method: "GET",
        async: false
    })
    return suggestions
}

function vote(value, id) {
    const voteObject = {
        teamname: getTeamname(),
        id: id,
        vote: value
    };
    $.ajax({
        url: '/pizzas/suggestions/vote',
        data: voteObject,
        success: () => {
            console.log("Your vote has been sent to the server.")
            window.location.reload(true);
        },
        method: "POST"
    })
}

function voteHandler(event) {
    const storage = window.localStorage;
    const $eventTarget = event.target;
    const suggestionID = $(event.target).parent().parent().parent().parent().parent().parent().parent().attr('suggestion-id');
    if ($($eventTarget).hasClass('btn-success')
        && storage.getItem('voted_for_suggestion_id_' + suggestionID) !== 'positive') {
        //Send & save positive vote
        if (storage.getItem('voted_for_suggestion_id_' + suggestionID) === 'negative') {
            storage.setItem('voted_for_suggestion_id_' + suggestionID, 'neutral');
        } else {
            storage.setItem('voted_for_suggestion_id_' + suggestionID, 'positive');
        }
        vote(1, suggestionID);
    } else if ($($eventTarget).hasClass('btn-danger')
        && storage.getItem('voted_for_suggestion_id_' + suggestionID) !== 'negative') {
        //Send & save negative vote
        if (storage.getItem('voted_for_suggestion_id_' + suggestionID) === 'positive') {
            storage.setItem('voted_for_suggestion_id_' + suggestionID, 'neutral');
        } else {
            storage.setItem('voted_for_suggestion_id_' + suggestionID, 'negative');
        }
        vote(-1, suggestionID);
    }
}

/**
 * Generate DOM structure for a pizza topping suggestion
 * @param id suggestion ID assigned by the backend for this suggestion
 * @param headingText text to be displayed in header of the suggestion
 * @param voteCount number of votes this suggestion has already received
 * @param success {boolean} whether this topping is currently successful and will be chose
 * @param ingredients list of ingredients used as pizza topping suggestion
 * @returns {*|jQuery}
 */
function generateSuggestionPanel(id, headingText, voteCount, success, ingredients) {
    const ingredientsList = ingredients
        .concat((new Array(4 - ingredients.length)).fill("-"))
        .reduce((acc, val) => {
            return acc + val + "<br>"
        }, "")
    const $headingRow = $('<div></div>')
        .addClass('row');
    const $h4 = $('<h4></h4>')
    const $panelHeadingText = $('<div></div>')
        .addClass('col-sm-6');
    const $panelHeadingVote = $('<div align="right"></div>')
        .addClass('col-sm-6')
    const $elementGroup = $('<div></div>')
        .addClass('element-group')

                                const $posButton = $('<button></button>')
                                    .attr('type', 'button')
                                    .addClass('btn btn-success btn-xs')
                                    .text('+')
                                    .click(voteHandler)
                                const $voteCount = $('<span></span>')
                                    .addClass('label label-default label-sm')
                                    .text(voteCount)
                                const $negButton = $('<button></button>')
                                    .attr('type', 'button')
                                    .addClass('btn btn-danger btn-xs')
                                    .text('-')
                                    .click(voteHandler)

                            const $voteComponent = $($elementGroup)
                                .append($posButton)
                                .append($voteCount)
                                .append($negButton)

                        const $voteColumn = $($panelHeadingVote)
                            .append($voteComponent)

                        const $headingTextColumn = $($panelHeadingText)
                            .text(headingText)

                    const $header = $($h4)
                        .append($headingTextColumn)
                        .append($voteColumn)

                const $completeHeadingRow = $($headingRow)
                    .append($header)

            const $panelHeading = $('<div></div>')
                .addClass('panel-heading')
                .append($completeHeadingRow)

            const $panelBody = $('<div></div>')
                .addClass('panel-body')
                .html(ingredientsList.slice(0, -4))

        const $panel = $('<div></div>')
            .addClass('panel ' + ((success) ? 'panel-success' : 'panel-danger'))
            .append($panelHeading)
            .append($panelBody)

    const $panelColumn = $('<div></div>')
        .addClass('col-sm-4')
        .attr('suggestion-id', id)
        .append($panel)

    return $panelColumn;
}

function getAmount() {
    let amount;
    $.ajax({
        url: '/pizzas/amount/?teamname=' + getTeamname(),
        success: (res) => {
            amount = JSON.parse(res);
        },
        method: "GET",
        async: false
    })
    return (amount) ? amount.amount : 0;
}

function getTeamdata() {
    let data;
    $.ajax({
        url: '/teams/data/?teamname=' + getTeamname(),
        success: (res) => {
            data = JSON.parse(res);
        },
        method: "GET",
        async: false
    })
    return data
}

window.addEventListener('load', () => {
    updateTeamname();

    // multiplied by two, because here we work with half pizzas
    let amount = getAmount() * 2;

    let teamdata = getTeamdata();
    document.getElementById("count").value = teamdata.teamsize.number;

    if (teamdata.teamsize.type != null) {
        document.getElementById("type").value = teamdata.teamsize.type;
    }

    let suggestions = getAllSuggestions() || [];
    suggestions.sort(function (a, b) { return (a.vote > b.vote) ? -1 : ((a.vote < b.vote) ? 1 : 0); });
    suggestions.forEach(function (element, index) {

        let success = false;
        if (index < amount) {
            success = true;
        }

        $('#panelContainer')
            .append(generateSuggestionPanel(element.id, "Vorschlag " + element.id, element.vote, success, element.ingredients));
    });
});

function getTemplates(){
    let templates;
    $.ajax({
        url: '/pizzas/templates/?teamname=' + getTeamname(),
        success: (res) => {
            templates = JSON.parse(res);
        },
        method: "GET",
        async: false
    })
    return templates
}

function post(event){
    let templates = getTemplates();
    let id = event.target.id.substring(4,5);
    $.ajax({
        url: '/pizzas/suggestions',
        method: "POST",
        data: {
            teamname: getTeamname(),
            ingredients: templates[id].ingredients
        },
        success: () => {
            console.log("Your ingredients have been proposed.")
            window.location.reload(true);
        }
    })

    console.log(event.target);
    
}

function showTemplates() {

    templates = getTemplates();
    
    const buttonConcat = $('<div></div>')
    templates.forEach(function(element, index) {
        const ingredientsString = element.ingredients.reduce((acc, val) => {
               return acc + val + ", "
            }, "")
            .slice(0, -2);

        const lb = $('<label><b> ' + element.name + ': </b></label>');
        const ingr = $('<label><small>' + ingredientsString + '</small></label>')
        const btn = $('<button id="btn-' + index + '">/button>')
            .attr('type', 'button')
            .addClass('btn btn-success btn-xs')
            .text('auswählen')

        const btnPara = $('<p></p>')
        btnPara
            .append($('<br/>'))
            .append(lb)
            .append($('<br/>'))
            .append(ingr)
            .append($('<br/>'))
            .append(btn)
            .append($('<br/>'))
            
        buttonConcat.append(btnPara);
    });

    var buttonsAsString = $(buttonConcat).prop('outerHTML');

    swal({
        title: "Vorlagen",
        text: buttonsAsString,
        showCancelButton: true,
        showConfirmButton: false,
        html: buttonsAsString
    });
    
    templates.forEach(function(element, index) {
        document.getElementById("btn-"+index).addEventListener("click", post);
    });
}

function createPizzaBox(ingredientsLeft, ingredientsRight){
    let leftSideText = ingredientsLeft.ingredients
        .reduce((acc, val) => {
            return acc + val + "<br>"
        }, "")
        .slice(0, -4);
    let rightSideText = ingredientsRight.ingredients
        .reduce((acc, val) => {
            return acc + val + "<br>"
        }, "")
        .slice(0, -4);

    let $leftBox = $('<div>')
        .css('border-width', '5px')
        .css('border-color', 'black')
        .css('border-style', 'solid')
        .css('float', 'left')
        .css('padding', '5%')
        .css('width', '50%')
        .html(leftSideText);
    let $rightBox = $('<div>')
        .css('border-width', '5px')
        .css('border-color', 'black')
        .css('border-style', 'solid')
        .css('float', 'right')
        .css('padding', '5%')
        .css('width', '50%')
        .html(rightSideText);
    return $('<div>')
        .addClass('row')
        .css('margin', '5%')
        .append($leftBox)
        .append($rightBox)
}

function showOrderView(){
    const suggestions = getAllSuggestions();
    const boxes = []
    let $pageContent = $('<div>');

    if(suggestions.length % 2 !== 0){
        swal({
            title: "Ungerade Anzahl an Vorschlägen",
            text: "Eine Pizza hat nur eine belegte Seite!",
            type: "warning"
        })
        return;
    }

    for(let i = 0; i < suggestions.length; i += 2){
        boxes.push(createPizzaBox(suggestions[i], suggestions[i+1]));
    }

    for(let $box of boxes){
        $pageContent = $($pageContent)
            .append($($box))
    }

    swal({
        title: "Bestellansicht",
        html: $($pageContent)
    })
}