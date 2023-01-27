let loaded


function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
};

function notification(message) {
    $("#NotificationShit")?.remove()
    $("#rbx-body").append(`
    <div id="NotificationShit" class="dialog">
        <div class="fade modal-backdrop in"></div>
            <div tabindex="-1" class="fade modal-modern modal-modern-challenge-captcha in modal" style="display: block;">
                <div class="modal-dialog">
                    <div class="modal-content" role="document">
                        <div class="modal-body">
                            <button type="button" class="challenge-captcha-close-button">
                                <span id="Close-Notification" class="icon-close"></span>
                            </button>
                            <div class="challenge-captcha-body" id="challenge-captcha-element">
                                <div id="FunCaptchaMain">
                                    <p>${message}</p>
                                    <div style="padding-top:30px">
                                        <button id="Close-Notification-Button" class="btn-primary-md btn-min-width ng-binding"> OK </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`)

    $("#Close-Notification").click(async () => {
        $("#NotificationShit").remove()
    })
    $("#Close-Notification-Button").click(async () => {
        $("#NotificationShit").remove()
    })
}

(async () => {
    let descriptionCope = $(".remove-panel.btr-description")
    if (descriptionCope.length < 1) {
        notification("Please install <a class='text-name' herf='https://chrome.google.com/webstore/detail/btroblox-making-roblox-be/hbkpclpemjeibhioopcebchdmohaieln'>BTRoblox</a> before using AltBlox!")
        return
    }
    $(".col-xs-12.btr-game-main-container.section-content").addClass("rbx-tabs-horizontal")
    $(".col-xs-12.btr-game-main-container.section-content").after(`
    <div class="col-xs-12 btr-game-main-container section-content rbx-tabs-horizontal">
        <div class="btr-description">
            <div style="padding-bottom: 15px;">
                <p id="AltsTopNote" style="padding-bottom: 10px; font-size: 5px;">Note: make sure to login before save/update the account/s</p>
                <div style="display: flex; gap: 5px;">
                    <button id="saveNow" class="btn-more btn-control-xs btn-primary-md" style="font-size: 13px">Save This Account</button>
                    <button id="importCookie" class="btn-more btn-control-xs btn-primary-md" style="font-size: 13px">Import From Cookie/s</button>
                    <button id="importRbxManager" class="btn-more btn-control-xs btn-primary-md" style="font-size: 13px">Import From Rbx Account Manager</button>
                    <div style="display: flex; margin-left: auto; gap: 5px;">
                        <button id="safelogout" class="btn-more btn-control-xs btn-primary-md" style="font-size: 13px">Safe Logout</button>
                    </div>
                </div>
            </div>
            <div id="AltsDisplay" style="overflow-y: auto;height: 265px;">

            </div>
        </div>
    </div>

    <div class="col-xs-12 btr-game-main-container section-content">
        <div class="remove-panel btr-description">
            ${descriptionCope.html()}
        </div>
    </div>
    `);

    descriptionCope.remove();

    let storagedData = await chrome.storage.local.get()

    if (!storagedData.accounts) storagedData.accounts = []
    storagedData.accounts = storagedData.accounts.filter(function (el) {return el != null})

    async function refrash() {
        $("#AltsDisplay").html("")
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
                <div>
                    <p style="text-align: left; margin: 10px">@${data.name}</p>
                    <p style="text-align: left; margin: 10px; font-size: 5px">${data.notes || ""}</p>
                </div>
                <div style="display: flex; margin-left: auto; flex-direction: column; height: 110px; justify-content: space-evenly;">
                    <button id="${data.id}" class="btn-more btn-control-xs btn-primary-md btn-min-width" style="font-size: 13px; background-color: #00b06f; border-color: #00b06f">Join</button>
                    <button id="${data.id}" class="btn-more btn-control-xs btn-primary-md btn-min-width" style="font-size: 13px">Login</button>
                    <button id="${data.id}" class="btn-more btn-control-xs btn-primary-md btn-min-width" style="font-size: 13px">Setting</button>
                </div>
            </div>
            `)
        }
        $("#AltsTopNote").html(`Note: make sure to login before save/update the account/s - (${storagedData.accounts.length} accounts)`)
    }

    refrash()

    function save(object) {
        chrome.storage.local.set(object)
    }

    $("#saveNow").click(async () => {
        let selfdata = await fetch("https://users.roblox.com/v1/users/authenticated", {
            method: "GET",
            credentials: "include",
        }).then(dV => dV.json())

        if (storagedData.accounts.find(user => user && user.id == selfdata.id)) return

        let pfp = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${selfdata.id}&size=150x150&format=Png&isCircular=false`).then(dV => dV.json())

        await storagedData.accounts.push({
            id: selfdata.id,
            name: selfdata.name,
            cookie: await chrome.runtime.sendMessage({type: "get"}),
            image: pfp.data[0].imageUrl
        })
        save(storagedData)
        location.reload()
    })

    $("#importCookie").click(async () => {
        $("#rbx-body").append(`
        <div id="importCookiess" class="dialog">
            <div class="fade modal-backdrop in"></div>
                <div tabindex="-1" class="fade modal-modern modal-modern-challenge-captcha in modal" style="display: block;">
                    <div class="modal-dialog">
                        <div class="modal-content" role="document">
                            <div class="modal-body">
                                <button type="button" class="challenge-captcha-close-button">
                                    <span id="importCancel" class="icon-close"></span>
                                </button>
                                <div class="challenge-captcha-body" id="challenge-captcha-element">
                                    <div id="FunCaptchaMain">
                                        <input id="importVal" type="text" focus-me="true" placeholder="_|WARNING:-DO-NOT-SHARE-THIS..." class="form-control input-field ng-pristine ng-valid ng-isolate-scope ng-not-empty ng-valid-maxlength ng-touched">
                                        <div style="padding-top:10px">
                                            <button id="importSave" class="btn-primary-md btn-min-width ng-binding"> Save </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`)

        $("#importCancel").click(async () => {
            $("#importCookiess").remove()
        })

        $("#importSave").click(async () => {
            let setcookie = $("#importVal").val().replace(/\s/g, '')
            let oldcookie = await chrome.runtime.sendMessage({type: "get"})
            if (!oldcookie) {
                if (document.cookie.split(".ROBLOSECURITY=")[1]) {
                    oldcookie = document.cookie.split(".ROBLOSECURITY=")[1].split(";")[0]
                } else {
                    return
                }
            }

            await chrome.runtime.sendMessage({type: "set", value: setcookie})

            let selfdata = await fetch("https://users.roblox.com/v1/users/authenticated", {
                method: "GET",
                credentials: "include",
            }).then(dV => dV.json())
    
            if (storagedData.accounts.find(user => user && user.id == selfdata.id)) {
                await chrome.runtime.sendMessage({type: "set", value: oldcookie})
                $("#importCookiess").remove()
                return
            }
    
            let pfp = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${selfdata.id}&size=150x150&format=Png&isCircular=false`).then(dV => dV.json())
    
            await storagedData.accounts.push({
                id: selfdata.id,
                name: selfdata.name,
                cookie: setcookie,
                image: pfp.data[0].imageUrl
            })
            save(storagedData)
    
            refrash()
            await chrome.runtime.sendMessage({type: "set", value: oldcookie})
            $("#importCookiess").remove()
        })
    })

    $("#importRbxManager").click(async () => {
        const pickerOpts = {
            types: [
                {
                    description: 'AccountData',
                    accept: {
                        'AccountData/*': ['.json']
                    }
                },
            ],
            excludeAcceptAllOption: false,
            multiple: false
        };
        let [filehandle] = await window.showOpenFilePicker(pickerOpts)
        let datafile = await filehandle.getFile()
        let data = await datafile.text()
        try {
            data = JSON.parse(data)
            let added = 0
            let oldcookie = await chrome.runtime.sendMessage({type: "get"})
            if (!oldcookie) {
                if (document.cookie.split(".ROBLOSECURITY=")[1]) {
                    oldcookie = document.cookie.split(".ROBLOSECURITY=")[1].split(";")[0]
                } else {
                    return
                }
            }

            notification(`Please wait... *Do not make any action*`)

            for (let i = 0; i < data.length; i++) {
                const dataV = data[i];

                let setcookie = dataV.SecurityToken
                await chrome.runtime.sendMessage({type: "set", value: setcookie})
    
                let selfdata = await fetch("https://users.roblox.com/v1/users/authenticated", {
                    method: "GET",
                    credentials: "include",
                }).then(dV => dV.json())
        
                if (storagedData.accounts.find(user => user && user.id == selfdata.id)) {
                    continue
                }
        
                let pfp = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${selfdata.id}&size=150x150&format=Png&isCircular=false`).then(dV => dV.json())
        
                await storagedData.accounts.push({
                    id: selfdata.id,
                    name: selfdata.name,
                    cookie: setcookie,
                    image: pfp.data[0].imageUrl
                })
                save(storagedData)
                added += 1
        
                refrash()
            }

            await chrome.runtime.sendMessage({type: "set", value: oldcookie})
            notification(`Success Added ${added} Account/s`)
        } catch (err) {
            notification(`Wrong File / Undecrypted data / ${err}`)
        }
    })

    $("#safelogout").click(async () => {
        await chrome.runtime.sendMessage({type: "set", value: ""})
        location.reload()
    })

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    let joining = false
    async function joinWithAccountData(account) {
        if (!account || joining) return
        joining = true
        let oldcookie = await chrome.runtime.sendMessage({type: "get"})
        if (!oldcookie) {
            if (document.cookie.split(".ROBLOSECURITY=")[1]) {
                oldcookie = document.cookie.split(".ROBLOSECURITY=")[1].split(";")[0]
            } else {
                return
            }
        }

        $(".dialog").remove()
        await chrome.runtime.sendMessage({type: "set", value: account.cookie})
        await chrome.runtime.sendMessage({type: "join"})
        await sleep(2500)
        await chrome.runtime.sendMessage({type: "set", value: oldcookie})
        joining = false
    }

    $("#AltsDisplay").on("click", ".btn-more", function () {
        let selection = $(this).html()
        if (selection == "Join") {
            (async () => {
                let account = storagedData.accounts.find(user => user && user.id.toString() == $(this).attr("id"))
                joinWithAccountData(account)
            })()
        }

        if (selection == "Login") {
            (async () => {
                let account = storagedData.accounts.find(user => user && user.id.toString() == $(this).attr("id"))

                if (account) {
                    await chrome.runtime.sendMessage({type: "set", value: account.cookie})
                    location.reload()
                }
            })()
        }

        // Setting Menu
        if (selection == "Setting") {
            let account = storagedData.accounts.find(user => user && user.id.toString() == $(this).attr("id"))

            $("#rbx-body").append(`
            <div id="AccountSettingMenu" class="dialog">
                <div class="fade modal-backdrop in"></div>
                    <div tabindex="-1" class="fade modal-modern modal-modern-challenge-captcha in modal" style="display: block;">
                        <div class="modal-dialog">
                            <div class="modal-content" role="document">
                                <div class="modal-body">
                                    <button type="button" class="challenge-captcha-close-button">
                                        <span id="CancelSetting" class="icon-close"></span>
                                    </button>
                                    <div class="challenge-captcha-body" id="challenge-captcha-element">
                                        <div id="MainMenu">
                                            <p style="text-align: left; margin: 10px">@${account.name} - ${account.id}</p>
                                            <button id="UpdateAccount" class="btn-primary-md btn-min-width ng-binding" title="Replace account data to the logined account"> Update </button>
                                            <button id="DeleteAccount" class="btn-primary-md btn-min-width ng-binding" style="background-color: #ff4100; border-color: #ff4100; color: #ffffff" title="Delete account data"> Delete </button>
                                            <div style="padding-top: 10px">
                                                <p style="text-align: left; margin: 10px">Account's notes</p>
                                                <textarea class="form-control input-field personal-field-description ng-pristine ng-untouched ng-valid ng-valid-maxlength ng-not-empty" id="accountTextBox" placeholder="Write something..." rows="4" ng-model="$ctrl.data.description">${account.notes || ""}</textarea>
                                                <button id="SaveAccountNotes" class="btn-primary-md btn-min-width ng-binding"> Save </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`)

            $("#CancelSetting").click(async () => {
                $("#AccountSettingMenu").remove()
            })

            $("#UpdateAccount").click(async () => {
                if (account) {
                    let selfdata = await fetch("https://users.roblox.com/v1/users/authenticated", {
                        method: "GET",
                        credentials: "include",
                    }).then(dV => dV.json())
            
                    let pfp = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${selfdata.id}&size=150x150&format=Png&isCircular=false`).then(dV => dV.json())
            
                    account.id = selfdata.id
                    account.name = selfdata.name
                    account.cookie = await chrome.runtime.sendMessage({type: "get"})
                    account.image = pfp.data[0].imageUrl

                    save(storagedData)
                    location.reload()
                }
            })
            
            $("#DeleteAccount").click(async () => {
                let indexWhere = await storagedData.accounts.findIndex(user => user && user.id.toString() == $(this).attr("id"))

                if (indexWhere > -1) {
                    await storagedData.accounts.splice(indexWhere, 1)
                    save(storagedData)
                    refrash()
                    $("#AccountSettingMenu").remove()
                }
            })

            $("#SaveAccountNotes").click(async () => {
                account.notes = $("#accountTextBox").val()
                save(storagedData)
                location.reload()
            })
        }
    })

    let test = await waitForElm("button[data-testid='play-button']")
        
    if (test) {
        $("#game-details-play-button-container").html(`
        <div style="padding-right: 5px" class="btn-full-width">
            <button id="play" type="button" class="btn-full-width btn-common-play-game-lg btn-primary-md btn-min-width" data-testid="play-button">
                <span class="icon-common-play"></span>
            </button>
        </div>
        <div id="LetsGoAlts">
            <button id="playAlt" type="button" class="btn-common-play-game-lg btn-primary-md" style="background-color: #747474; width: 65px;">
                <span class="icon-nav-profile" style="background-position: -36px -215px;"></span>
            </button>
        </div>
        `)
        
        $("#play").click(function () {
            chrome.runtime.sendMessage({type: "join"})
        })
    
        $("#LetsGoAlts").click(async () => {
            let account = storagedData.accounts[Math.floor(Math.random() * storagedData.accounts.length)]
            joinWithAccountData(account)
        })
    }
})();