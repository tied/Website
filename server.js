require('node-jsx').install({extension:'.jsx'});

if (process.env.NEW_RELIC_LICENSE_KEY) {
    require('newrelic');
}

var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var url             = require('url');
var swig            = require('swig');
var config          = require('./configs/server');
var facebookConfig  = require('./configs/facebook');
var i18nConfig      = require('./configs/i18n');
var debug           = require('debug')('Server');
var server          = express();
var expressState    = require('express-state');
var compress        = require('compression');
var robots          = require('robots.txt')

expressState.extend(server);

// Gzip compression
server.use(compress());

// view engine setup
server.engine('.html.swig', swig.renderFile);
server.set('view engine', '.html.swig');
server.set('views', path.join(__dirname, 'views'));
swig.setDefaults({ cache: false });
server.set('view cache', !config.DEBUG);

server.use(favicon(__dirname + '/public/favicon.ico'));
server.use(logger('dev'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(robots(__dirname + '/public/robots/' + config.ROBOTS));

server.use(express.static(path.join(__dirname, 'public')));

server.set('state namespace', 'App');

function bestLocale(req) {
    return req.acceptsLanguages(i18nConfig.SUPPORTED_LOCALES) || i18nConfig.DEFAULT_LOCALE;
}

function redirectToLocalized(req, res, next) {
    res.redirect(302, '/'+bestLocale(req)+req.url);
    next();
}

server.get('/', redirectToLocalized);
server.get('/hairfies/:hairfieId', redirectToLocalized);
server.get('/businesses/:businessId', redirectToLocalized);
server.get('/businesses/:businessId/:slug', redirectToLocalized);
server.get('/reset-password/:userId/:token', redirectToLocalized);
server.get('/write-business-review/:businessReviewRequestId', redirectToLocalized);


// serve application
server.use(function (req, res, next) {
    var app              = require('./app');
    var context          = app.createContext();
    var ServerActions    = require('./actions/Server');
    var payload          = {request: req};
    var RouteStore       = require('./stores/RouteStore');
    var RedirectStore    = require('./stores/RedirectStore');
    var MetaStore        = require('./stores/MetaStore');
    var BusinessStore    = require('./stores/BusinessStore');
    var React            = require('react');
    var HtmlComponent    = React.createFactory(require('./components/Html.jsx'));

    context.executeAction(ServerActions.Initialize, payload, function (error) {
        if (error) return next(error);

        try {
            var redirect = context.getActionContext().getStore(RedirectStore).getPending();
            if (redirect) {
                res.redirect(redirect.url, redirect.permanent ? 301 : 302);
                return;
            }

            var currentRoute = context.getActionContext().getStore(RouteStore).getCurrentRoute();

            var title = context.getActionContext().getStore(MetaStore).getTitle();
            var metas = context.getActionContext().getStore(MetaStore).getMetas();

            var appState = app.dehydrate(context);
            var AppComponent = app.getAppComponent();

            res.expose(appState, 'App');

            var markup = React.renderToString(AppComponent({
                context: context.getComponentContext()
            }));

            var html = React.renderToStaticMarkup(HtmlComponent({
                state   : res.locals.state,
                title   : title,
                metas   : metas,
                markup  : markup
            }));

            if (!currentRoute) res.status(404);

            res.write(html);
            res.end();
            next();
        } catch (e) {
            next(e);
        }
    });
});

// error handlers
server.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: config.DEBUG ? err: {}
    });
});

module.exports = server;

if (require.main === module) {
    server.set('port', config.PORT);
    server.listen(server.get('port'), function () {
        debug('listening on port ' + server.get('port'));
    });
}
