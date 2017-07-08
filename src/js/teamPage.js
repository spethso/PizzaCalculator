function retrieveGetParameters(){
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

function getTeamname(){
    const parameters = retrieveGetParameters();
    return parameters["teamname"];
}

function updateTeamname(){
    $('h1')
        .text(getTeamname())
    $('#teamname_input')
        .val(getTeamname());
    $('#teamname_for_selector')
        .val(getTeamname());
}

window.addEventListener('load', () => {
    updateTeamname()
})
