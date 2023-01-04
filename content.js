(() => {
    let xtoken = ""

    async function login(username, password, token, id) {
        let d = await fetch("https://auth.roblox.com/v2/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-csrf-token": xtoken,
                "cookie": ''
            },
            credentials: "include",
            body: JSON.stringify({
                captchaId: id,
                captchaToken: token,
                ctype: "Username",
                cvalue: username,
                password: password
            })
        })
        if (d.headers.get("x-csrf-token")) {
            xtoken = d.headers.get("x-csrf-token")
        }
        return { src: d, json: await d.json()}
    }

    (async () => {
        $(".dialog")?.remove()
        $("#rbx-body").append(`
        <div role="dialog" class="dialog">
            <div class="fade modal-backdrop in"></div>
                <div role="dialog" tabindex="-1" class="fade modal-modern modal-modern-challenge-captcha in modal" style="display: block;">
                    <div class="modal-dialog">
                        <div class="modal-content" role="document">
                            <div id="sizeChange" class="modal-body">
                                <button type="button" class="challenge-captcha-close-button">
                                    <span class="icon-close"></span>
                                </button>
                                <div class="challenge-captcha-body" id="challenge-captcha-element">
                                    <div id="MainMiddle">
                                        <p>Loading...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`)
        
        $(".challenge-captcha-close-button").click(async () => {
            $(".dialog").remove()
        })

        $("#MainMiddle").html(`
        <div id="game-details-play-button-container" class="game-details-play-button-container" style="padding: 15px">
            <button id="play2" type="button" class="btn-full-width btn-primary-md btn-min-width">
                <span class="icon-nav-profile" style="background-position: 0px -168px;"></span>
                Launch Game + Login
            </button>
        </div>
        <div id="game-details-play-button-container" class="game-details-play-button-container" style="padding: 15px;">
            <button id="altmanager" type="button" class="btn-full-width btn-primary-md btn-min-width" style="background-color: orange; border-color: orange;">
                <span class="icon-settings"></span>
                Alt manager
            </button>
        </div>
        `)

        let storagedData = await chrome.storage.local.get()
        if (!storagedData.accounts) storagedData.accounts = []

        function save(object) {
            chrome.storage.local.set(object)
        }
        // save({accounts: []})

        async function refrash() {
            for (let i = 0; i < storagedData.accounts.length; i++) {
                const data = storagedData.accounts[i];
                if (!data || !data.image) continue

                $("#AltsDisplay").append(`
                <div class="border-bottom" style="display: flex; align-items: center; padding: 10px">
                    <div>
                        <span class="avatar avatar-headshot-sm player-avatar" style="display: block; width: 60px; height: 60px">
                            <span class="thumbnail-2d-container avatar-card-image">
                                <img class="" src="${data.image}" alt="" title="">
                            </span>
                        </span>
                    </div>
                    <p style="text-align: left; margin: 10px">@${data.name}</p>
                    <div style="display: flex; margin-left: auto; flex-direction: column; height: 110px; justify-content: space-between;">
                        <button id="${data.id}" class="btn-more btn-control-xs btn-primary-md btn-min-width" style="font-size: 13px; background-color: #ff7100">Join</button>
                        <button id="${data.id}" class="btn-more btn-control-xs btn-primary-md btn-min-width" style="font-size: 13px">Login</button>
                        <button id="${data.id}" class="btn-more btn-control-xs btn-primary-md btn-min-width" style="font-size: 13px">Update</button>
                        <button id="${data.id}" class="btn-more btn-control-xs btn-primary-md btn-min-width" style="font-size: 13px; background-color: #ff4100">Delete</button>
                    </div>
                </div>
                `)
            }
        }

        $("#altmanager").click(async () => {
            // $("#sizeChange").attr("style", "min-width: 730px")
            $("#MainMiddle").html(`
            <div style="padding-bottom: 15px">
                <button id="saveNow" class="btn-more btn-control-xs btn-primary-md btn-min-width" style="font-size: 13px">Save This Account</button>
            </div>
            <div id="AltsDisplay" style="overflow-y: scroll; height: 350px;">
            
            </div>`)

            refrash()

            $("#saveNow").click(async () => {
                let selfdata = await fetch("https://users.roblox.com/v1/users/authenticated", {
                    method: "GET",
                    credentials: "include",
                }).then(dV => dV.json())

                if (storagedData.accounts.find(user => user && user.id == selfdata.id)) return

                let pfp = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${selfdata.id}&size=150x150&format=Png&isCircular=false`).then(dV => dV.json())
                
                $("#AltsDisplay").append(`
                <div class="border-bottom" style="display: flex; align-items: center; padding: 10px">
                    <div>
                        <span class="avatar avatar-headshot-sm player-avatar" style="display: block; width: 60px; height: 60px">
                            <span class="thumbnail-2d-container avatar-card-image">
                                <img class="" src="${pfp.data[0].imageUrl}" alt="" title="">
                            </span>
                        </span>
                    </div>
                    <p style="text-align: left; margin: 10px">@${selfdata.name}</p>
                    <div style="display: flex; margin-left: auto; flex-direction: column; height: 110px; justify-content: space-between;">
                        <button id="${selfdata.id}" class="btn-more btn-control-xs btn-primary-md btn-min-width" style="font-size: 13px; background-color: #ff7100">Join</button>
                        <button id="${selfdata.id}" class="btn-more btn-control-xs btn-primary-md btn-min-width" style="font-size: 13px">Login</button>
                        <button id="${selfdata.id}" class="btn-more btn-control-xs btn-primary-md btn-min-width" style="font-size: 13px">Update</button>
                        <button id="${selfdata.id}" class="btn-more btn-control-xs btn-primary-md btn-min-width" style="font-size: 13px; background-color: #ff4100">Delete</button>
                    </div>
                </div>
                `)

                storagedData.accounts.push({
                    id: selfdata.id,
                    name: selfdata.name,
                    cookie: await chrome.runtime.sendMessage({type: "get"}),
                    image: pfp.data[0].imageUrl
                })
                save(storagedData)
            })

            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            $("#AltsDisplay").on("click", ".btn-more", function () {
                if ($(this).html() == "Join") {
                    (async () => {
                        let account = storagedData.accounts.find(user => user && user.id.toString() == $(this).attr("id"))
                        let oldcookie = await chrome.runtime.sendMessage({type: "get"})
                        if (!oldcookie) {
                            if (document.cookie.split(".ROBLOSECURITY=")[1]) {
                                oldcookie = document.cookie.split(".ROBLOSECURITY=")[1].split(";")[0]
                            } else {
                                return
                            }
                        }
    
                        if (account) {
                            $(".dialog").remove()
                            await chrome.runtime.sendMessage({type: "set", value: account.cookie})
                            await chrome.runtime.sendMessage({type: "join"})
                            await sleep(2500)
                            await chrome.runtime.sendMessage({type: "set", value: oldcookie})
                        }
                    })()
                }

                if ($(this).html() == "Login") {
                    (async () => {
                        let account = storagedData.accounts.find(user => user && user.id.toString() == $(this).attr("id"))
    
                        if (account) {
                            await chrome.runtime.sendMessage({type: "set", value: account.cookie})
                            location.reload()
                        }
                    })()
                }
            })
        })
    })()
})()