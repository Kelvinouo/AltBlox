<h1 align="center">
    <sub>
        <img  src="https://github.com/Kelvinouo/AltBlox/blob/master/images/icon48.png?raw=true" height="38" width="38">
    </sub>
    AltBlox
</h1>

<p align="center">
<a href="https://chrome.google.com/webstore/detail/altblox/ebbdlahojlpeinplalcmpghhemodkkof"><img src="https://user-images.githubusercontent.com/585534/107280622-91a8ea80-6a26-11eb-8d07-77c548b28665.png" alt="Get AltBlox for Chrome"></a>
</p>

---

## FAQ

#### What does this plugin do?

This plugin allows user to manage/play with their accounts on Roblox with this plugin

#### Can you get my account credentials that i save into plugin?

No. The plugin will **NOT** send me your account credentials, you can check the source code to verify that.

#### What does "Error starting experience" mean?

It means the account cookie is expired, try log into the account manually and update the account in setting.
 * Why this happen?
    1. Reset by roblox after few month not using.
    2. Not using the "Safe Logout" instead of click on logout button can cause cookie reset.

#### Instructions:
1. Open a game page
2. Menu
    - White Button (Next to the green play button) will lets you play with random account you saved
    - Menu
        - "Save This Account" : save currect account that you logged on
        - "Import From Cookie/s" : save account through cookie/s
            - cookies should be format by one line each cookie
        - "Import From Rbx Account Manager" : save accounts from Rbx Account Manager, **Choose "AccountData.json" to import!!**
            - makes sure that you decrypt the data before import! https://github.com/ic3w0lf22/RAMDecrypt
        - "Safe Logout" : logout without reset your session cookie
3. Setting for accounts
    - "Update" : overwrite the saved cookie to currect account that you logged
    - "Delete" : delete account credentials from your local storage
    - "Notes" : write a note for the account that you selected and display on the panel