let APIURL = ''

switch (window.location.hostname) {
    case 'localhost':
    case '127.0.0.1':
        APIURL = 'http://localhost:3001'
        break
    case 'eventual heroku app':
        APIURL = ''
}

export default APIURL