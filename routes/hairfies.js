var express = require('express');
var router = express.Router();

require('node-jsx').install({extension:'.jsx'});

var app = require('../client/app.js');
var navigateAction = require('flux-router-component').navigateAction;

var React = require('react');
var metaGenerator = require('../services/metaGenerator.js');
var hairfieApi = require('../client/services/hairfie-api-client');
var getHairfieAction = require('../client/actions/getHairfie');
var ApplicationStore = require('../client/stores/ApplicationStore');

var ROUTE_PREFIX = '/hairfies'

router.get('/:id', function(req, res, next) {
    var context = app.createContext();
    var path = ROUTE_PREFIX + req.path;

    context.getActionContext().executeAction(navigateAction, {path: path}, function (err) {
        context.getActionContext().executeAction(getHairfieAction, {id: req.params.id}, function (err) {
            if (err)  {
                console.log(err);
                if (err.status && err.status === 404) {
                    next();
                } else {
                    next(err);
                }
                return;
            }

            var appHtml = React.renderToString(app.getAppComponent()({
                context: context.getComponentContext()
            }));
            var appState = app.dehydrate(context);

            res.render('index/app', {
                title: 'Hairfie',
                appHtml: appHtml,
                appState: appState
            });
        });
    });
});

module.exports = router;


// router.get('/:id', function(req, res) {
//     hairfie.getHairfie(req.params.id)
//         .then(function (hairfie) {
//             if (!hairfie) {
//                 res.status(404);
//                 res.send('Hairfie not found');
//             } else {
//                 metaGenerator.getHairfieMetas(hairfie, function(metas) {
//                     res.render('hairfies/show', {
//                         hairfie: hairfie,
//                         metas: metas
//                     });
//                 });
//             }
//         })
//         .catch(function () {
//             res.status(500);
//         });
// });

