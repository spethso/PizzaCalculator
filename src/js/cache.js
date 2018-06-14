window.addEventListener('load', () => {
    $('#team_creation_form')
        .submit(() => {
            window.localStorage.clear();
            console.log("Local storage has been cleared")
        });

    // Add GDPR footer
    $.ajax({
        url: './application/gdpr',
        success: (res) => {
            $('#gdpr-footer')
                .html(res)
        },
        method: "GET",
    })
})