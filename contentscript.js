chrome.runtime.sendMessage({type: "allowjoin"}, function(msg) {
    if (msg) {
        var s = document.createElement('script');
        s.src = chrome.runtime.getURL('script.js');
        (document.head || document.documentElement).appendChild(s);
        s.onload = function() {
            this.remove();
        };
    }
})