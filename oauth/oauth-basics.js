/** 
 * Shoutout to Hannes Tydén (github.com/hannestyden). 
 * His gist, https://gist.github.com/hannestyden/563893, helped.
 */

(function () {

var ACCOUNT_TYPES = {
    IMGUR: 'imgur',
    REDDIT: 'reddit'
};

var CREDS = {
    IMGUR: {
        LOCAL: { ID: '8e03182c1f5bb65' },
        GITHUB: { ID: '1cb3805bbf7d811' }
    },
    REDDIT: {
        LOCAL: { ID: 'BiUZlzc_NDDDvw', SECRET: '7P-9VmMK0mK7rgb-fIn_VXI1K3Y' },
        GITHUB: { ID: 'kIAcaaera55KmA', SECRET: 'rvaEo67dVX_XJjphF3qxvm2fKo8' }
    }
};

function configureImgurGreeting() {
    document.getElementById('login').className = "hidden";
    document.getElementById('greeting').className = "";

    var hash = document.location.hash;
    var match = hash.match(/account_username=(\w+)/);    
    document.getElementById('username').innerHTML = match && match[1];

    match = hash.match(/access_token=(\w+)/);
    document.getElementById('token').innerHTML = match && match[1]; 
}

function configureRedditGreeting() {
    // Validate state
    var search = window.location.search;
    var state = search.match(/state=(\w+)/);
    state = state && state[1];

    if (state !== 'johnnybravo') {
        console.log('Invalid state: ' + state);
        return;
    }

    // Check for error
    var error = search.match(/error=(\w+)/);
    error = error && error[1];
    if (error) {
        logout();
        return;
    }

    // Retrieve Access Token
    var getAccessToken = new Promise(function (fulfill, reject) {
        var code = search.match(/code=(\w+)/);
        code = code && code[1];
        console.log('retrieval code: ' + code);

        var accessUrl = 'https://www.reddit.com/api/v1/access_token';
        var postData = 'grant_type=authorization_code&code=' + code + 
                       '&redirect_uri=' + window.location.origin + 
                       window.location.pathname;

        var request = new XMLHttpRequest();
        request.open('POST', accessUrl, true);

        var source = window.location.host === 'localhost'? 'LOCAL': 'GITHUB';
        request.setRequestHeader(
            'Authorization',                      
            'Basic ' + window.btoa(CREDS.REDDIT[source].ID + ':' + 
                                   CREDS.REDDIT[source].SECRET));
        request.setRequestHeader('Content-Type', 
                                 'application/x-www-form-urlencoded');

        request.onload = function () {
            var response = JSON.parse(request.response);
            var accessToken = response.access_token;
            if (accessToken) {
                fulfill(accessToken);
            }
            else {
                reject(response.error);
            }
        }

        request.send(postData);
    });

    // Retrieve username
    getAccessToken
    .then(function (accessToken) {
        localStorage.setItem('access_token', accessToken);

        var authUrl = 'https://oauth.reddit.com/api/v1/me';
        var request = new XMLHttpRequest();  
        request.open('GET', authUrl, true);
        request.setRequestHeader('Authorization', 'bearer ' + accessToken);

        return new Promise(function (fulfill, reject) {
            request.onload = function () {
                var response = JSON.parse(request.response);
                if (response.name) {
                    fulfill(response.name);
                }
                else {
                    reject(response.error);
                }
            }

            request.send(null);
        });
    }, function (error) {
        console.log('Unable to retrieve access token: ' + error);
        logout();
    })
    .then(function (username) {
        document.getElementById('login').className = "hidden";
        document.getElementById('greeting').className = "";

        document.getElementById('username').innerHTML = username;
        document.getElementById('token').innerHTML = localStorage.getItem(
                                                                'access_token'); 
    }, function (error) {
        console.log('Unable to retrieve username: ' + error);
        logout();
    });
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

    // REDDIT
    var reddit = document.getElementById('reddit-link');
    reddit.href = getRedditUrl();
    reddit.addEventListener('click', function () { 
        localStorage.setItem('type', ACCOUNT_TYPES.REDDIT);
        return true;
    });
}

function getImgurUrl() {
    var clientId = window.location.host === 'localhost'? CREDS.IMGUR.LOCAL.ID:
                                                         CREDS.IMGUR.GITHUB.ID;
    return 'https://api.imgur.com/oauth2/authorize?response_type=token'+
           '&client_id='+clientId;
}

function getRedditUrl() {
    var clientId = window.location.host === 'localhost'? CREDS.REDDIT.LOCAL.ID:
                                                         CREDS.REDDIT.GITHUB.ID;
    return 'https://www.reddit.com/api/v1/authorize?client_id=' + clientId + 
           '&response_type=code&state=johnnybravo' +
           '&redirect_uri=' + window.location + 
           '&duration=permanent&scope=identity'
}

function logout() {
    var type = localStorage.getItem('type');
    var accessToken = localStorage.getItem('access_token');
    if (type === ACCOUNT_TYPES.REDDIT && accessToken) {
        var request = new XMLHttpRequest();
        request.open('POST', 'https://www.reddit.com/api/v1/revoke_token', true);
        
        var source = window.location.host === 'localhost'? 'LOCAL': 'GITHUB';
        request.setRequestHeader(
            'Authorization',                      
            'Basic ' + window.btoa(CREDS.REDDIT[source].ID + ':' + 
                                   CREDS.REDDIT[source].SECRET));
        request.setRequestHeader('Content-Type', 
                                 'application/x-www-form-urlencoded');
        request.send('token=' + accessToken + '&token_type_hint=access_token');
    }

    localStorage.clear();
    window.location.href = window.location.origin + window.location.pathname;
}

window.onload = function () {
    var type = localStorage.getItem('type');
    console.log('account type: ' + type);

    var logoutButton = document.getElementById('logout');
    if (!type) {
        logoutButton.className = "hidden";
        configureLoginPage();
    }
    else {
        logoutButton.onclick = logout;

        switch (type) {
          case ACCOUNT_TYPES.IMGUR: {
            configureImgurGreeting();
          } break;

          case ACCOUNT_TYPES.REDDIT: {
            configureRedditGreeting();
          } break;

          default: {
            console.log('Invalid account type: ' + type);
          }
        }
    }
};

})();

