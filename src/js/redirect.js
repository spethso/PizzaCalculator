function goToTeamPage(event){
    const teamname = $('#goToTeam')
        .val()

    window.location.href = './teams?teamname=' + teamname;
}
