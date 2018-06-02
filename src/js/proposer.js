function getTeamname(){
    const parameters = retrieveGetParameters();
    return parameters["teamname"];
}

function getPossibleIngredients(){
    let responseJSON;

    $.ajax({
        url: './pizzas/ingredients',
        success: (data) => {
            responseJSON = JSON.parse(data)
        },
        async: false
    })
    return responseJSON.sort((a, b) => {
         if (a.toLowerCase() < b.toLowerCase()) return -1;
         if (a.toLowerCase() > b.toLowerCase()) return 1;
         return 0;
    });
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
        .addClass("checkbox")
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
        sweetAlert("Fehler", "Bitte wähle maximal 4 Zutaten aus!", "error");
        return;
    } else if (proposedIngredients.length === 0){
        proposedIngredients.push('Margherita')
    } else if (proposedIngredients.length === 3){
        swal({
                title: "Sind Sie sicher?",
                text: "Eine Pizza mit 3 Zutaten kostet genauso viel, wie eine mit 4 Zutaten.\n" +
                "Möchten Sie auf eine gratis Zutat verzichten?",
                type: "warning",
                showCancelButton: true,
                cancelButtonText: "Nein",
                confirmButtonText: "Ja",
                confirmButtonColor: '#449d44',
                cancelButtonColor: '#d33',
                confirmButtonClass: 'btn btn-success',
                cancelButtonClass: 'btn btn-danger',
            }).then(() => {
                postPizzaSuggestion(proposedIngredients)
            },
            (dismiss) => {
                //do nothing
        });
        return;
    }
    postPizzaSuggestion(proposedIngredients)
}

function postPizzaSuggestion(proposedIngredients){
    $.ajax({
        url: './pizzas/suggestions',
        method: "POST",
        data: {
            teamname: getTeamname(),
            ingredients: proposedIngredients
        },
        success: () => {
            console.log("Your ingredients have been proposed.")
            window.location.reload(true);
        }
    })
}

window.addEventListener('load', () => {
    addCheckboxesToForm()
})
