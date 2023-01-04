(() => {
    console.log("Joining...")
    let [, place] = window.location.href.match(/games\/(\d+)\//)
    Roblox.GameLauncher.joinMultiplayerGame(place)
})()