/** 
 * Shoutout to Hannes Tydén (github.com/hannestyden). 
 * His gist, https://gist.github.com/hannestyden/563893, helped.
 */

(function () {

var ACCOUNT_TYPES = {
    IMGUR: 'imgur'
};

function configureImgurGreeting() {
    document.getElementById('login').className = "hidden";
    document.getElementById('greeting').className = "";

    var hash = document.location.hash;
    var token = document.getElementById('token');
    var username = document.getElementById('username');

    var match = hash.match(/account_username=(\w+)/);    
    username.innerHTML = match && match[1];

    match = hash.match(/access_token=(\w+)/);
    token.innerHTML = match && match[1]; 
}

function configureLoginPage() {
    localStorage.removeItem('type');

    // IMGUR
    var imgur = document.getElementById('imgur-link');
    imgur.href = getImgurUrl();
    imgur.addEventListener('click', function () { 
        localStorage.setItem('type', ACCOUNT_TYPES.IMGUR);
        return true;
    });
}

function getImgurUrl() {
    var clientId = window.location.host === 'localhost'? '8e03182c1f5bb65':
                                                         '1cb3805bbf7d811';
    return 'https://api.imgur.com/oauth2/authorize?response_type=token'+
           '&client_id='+clientId;
}

function parseToken(hash) {
    console.log('hash is: ' + hash);

    var match = hash.match(/access_token=(\w+)/);
    return match && match[1];
}

window.onload = function () {
    var type = localStorage.getItem('type');
    console.log('account type: ' + type);
    if (type === ACCOUNT_TYPES.IMGUR) {
        configureImgurGreeting();
    }
    else {
        configureLoginPage();
    }
};

})();

