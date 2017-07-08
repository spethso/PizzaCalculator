function getTeamname(){
    const parameters = retrieveGetParameters();
    return parameters["teamname"];
}

function getPossibleIngredients(){
    let responseJSON;

    $.ajax({
        url: '/pizzas/ingredients',
        success: (data) => {
            responseJSON = JSON.parse(data)
        },
        async: false
    })
    return responseJSON;
}

function getAllSuggestions(){
    let suggestions;
    $.ajax({
        url: '/pizzas/suggestions',
        data: {
            teamname: getTeamname()
        },
        success: (data) => {
            suggestions = JSON.parse(data);
        },
        method: "GET",
        async: false
    })
    return suggestions
}

function getCheckboxForIngredient(ingredient){
    const $inputElement = $('<input>')
        .attr('type', 'checkbox')
        .attr('id', 'checkbox' + ingredient)
        .attr('name', ingredient)
        .attr('value', ingredient)
    const $label = $('<label>')
        .attr('for', 'checkbox' + ingredient)
        .text(ingredient)
    return $('<div></div>')
        .append($inputElement)
        .append($label)
}

function addCheckboxesToForm(){
    getPossibleIngredients().forEach((currentElement) => {
        $('#selector')
            .append(getCheckboxForIngredient(currentElement))
    })
}

function submitProposal(){
    let proposedIngredients = [];
    $('#selector')
        .find("input[type='checkbox']")
        .each((index, element) => {
            if($(element).is(':checked')){
                proposedIngredients.push($(element).attr('value'))
            }
        });

    if(proposedIngredients.length > 4){
        alert('Please select at most 4 ingredients!')
    }

    $.ajax({
        url: '/pizzas/suggestions',
        method: "POST",
        data: {
            teamname: getTeamname(),
            ingredients: proposedIngredients
        },
        success: () => {
            console.log("Your ingredients have been proposed.")
        }
    })
}

window.addEventListener('load', () => {
    addCheckboxesToForm()
})