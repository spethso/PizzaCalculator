window.addEventListener('load', () => {
    $('#team_creation_form')
        .submit(() => {
            window.localStorage.clear();
            console.log("Local storage has been cleared")
        })
})