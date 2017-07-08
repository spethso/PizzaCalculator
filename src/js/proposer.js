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

window.addEventListener('load', () => {
    addCheckboxesToForm()
})