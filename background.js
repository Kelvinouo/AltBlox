let allowjoin = false

function getCookies(domain, name, callback) {
    chrome.cookies.getAll({"domain": domain}, function(cookie) {
        if(callback) {
            callback(cookie);
        }
    });
}

async function joinlol() {
    for (const cs of chrome.runtime.getManifest().content_scripts) {
        for (const tab of await chrome.tabs.query({ url: cs.matches })) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: cs.js,
            });
        }
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == "get") {
        chrome.cookies.getAll({"domain": ".roblox.com"}, function(cookies) {
            let cookie = cookies.find(d => d.name == ".ROBLOSECURITY")
            if (cookie) {
                sendResponse(cookie.value)
            } else {
                sendResponse(null)
            }
        })
        return true
    }
    if (request.type == "set") {
        sendResponse(true)
        chrome.cookies.set({ domain: ".roblox.com", url: "https://roblox.com", name: ".ROBLOSECURITY", value: request.value, expirationDate: 2603399368})
        return true
    }
    if (request.type == "join") {
        sendResponse(true)
        allowjoin = true
        joinlol()
    }
    if (request.type == "allowjoin") {
        sendResponse(allowjoin)
        allowjoin = false
    }
    if (request.type == "login") {
        sendResponse(true)
        chrome.windows.create({"url": "https://roblox.com/login", "incognito": true});
    }
});

// chrome.action.onClicked.addListener(async (tab) => {
//     if (!tab.url.match("roblox.com/games")) return;

//     chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         files: ["js/FunCaptcha.js", "js/jquery.js", "content.js"],
//     });
// });

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, { url }) => {
    if (changeInfo.status !== 'complete' || !/https:\/\/.+roblox.com\/games/g.test(url)) return;
    
    await chrome.scripting.insertCSS({
        target: { tabId: tabId },
        files: ["css/customscroll.css"],
    });

    chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["js/FunCaptcha.js", "js/jquery.js", "load.js"],
    });
});

chrome.runtime.onInstalled.addListener(joinlol);