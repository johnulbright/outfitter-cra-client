let APIURL = ''

switch (window.location.hostname) {
    case 'localhost':
    case '127.0.0.1':
        APIURL = 'http://localhost:3001'
        break
    case 'jru-outfitter-client.herokuapp.com':
        APIURL = 'https://jeru-outfitter.herokuapp.com'
}

export default APIURL