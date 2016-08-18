var express = require('express');
var app = express();
var server = require('http').createServer(app);
var path = require('path');
var cookieParser = require('cookie-parser')
var compress = require('compression');

var bodyParser = require('body-parser')
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(cookieParser());
app.use(compress());


app.use(express.static(path.join(__dirname + '/scripts')));
app.use(express.static(path.join(__dirname + '/public')));

function unknownMethodHandler(req, res) {

    if (req.method.toLowerCase() === 'options') {
        var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 'Authorization'];

        if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');

        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
        res.header('Access-Control-Allow-Methods', res.methods.join(', '));
        res.header('Access-Control-Allow-Origin', req.headers.origin);

        return res.send(204);
    }
    else
        return res.send('error');
}

app.on('MethodNotAllowed', unknownMethodHandler);

var cors = require('cors')
app.use(cors());

app.use(function (req, res, next) {
    if (req.query.token) {
        console.log('SETTING THE COOKIE');

        res.cookie('token-test', req.query.token)
        res.cookie('user', req.query.user);

        var url = require('url');
        console.log(url.parse(req.url).pathname)
        res.redirect(url.parse(req.url).pathname);
    }
    return next();
});

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.set('port', process.env.PORT || 8088);
server.listen(app.get('port'), function () {
    console.log('Ticketscanner app listening on port ' + app.get('port'));
});
