'use strict';

var createStore = require('fluxible-app/utils/createStore');
var makeHandlers = require('../lib/fluxible/makeHandlers');

var AuthEvents = require('../constants/AuthConstants').Events;
var BusinessEvents = require('../constants/BusinessConstants').Events;

module.exports = createStore({
    storeName: 'AuthStore',
    init: function () {
        this.loginInProgress = false;
        this.user = null;
        this.token = null;
        this.managedBusinesses = [];
    },
    handlers: makeHandlers({
        'handleLogin': AuthEvents.LOGIN,
        'handleLoginFailure': AuthEvents.LOGIN_FAILURE,
        'handleLoginSuccess': [AuthEvents.LOGIN_SUCCESS, AuthEvents.SIGNUP_SUCCESS],
        'handleLogoutSuccess': AuthEvents.LOGOUT_SUCCESS,
        'handleReceiveManagedBusinesses': BusinessEvents.RECEIVE_MANAGED,
    }),
    dehydrate: function () {
        return {
            user                : this.user,
            token               : this.token,
            managedBusinesses   : this.managedBusinesses
        };
    },
    rehydrate: function (state) {
        this.user = state.user;
        this.token = state.token;
        this.managedBusinesses = state.managedBusinesses;
    },
    handleLogin: function (payload) {
        this.loginInProgress = true;
        this.emitChange();
    },
    handleLoginSuccess: function (payload) {
        this.user = payload.user;
        this.token = payload.token;
        this.loginInProgress = false;
        this.emitChange();
    },
    handleLoginFailure: function (payload) {
        this.loginInProgress = false;
        this.emitChange();
    },
    handleLogoutSuccess: function (payload) {
        this.user = this.token = null;
        this.emitChange();
    },
    handleReceiveManagedBusinesses: function (payload) {
        // check credentials are still valid for the list
        if (!this.user || !this.token || this.user.id != payload.user.id || this.token.id != payload.token.id) {

            return;
        }

        this.managedBusinesses = payload.businesses;
        this.emitChange();
    },
    getUser: function () {
        return this.user;
    },
    getToken: function () {
        return this.token;
    },
    isLoginInProgress: function () {
        return this.loginInProgress;
    },
    getManagedBusinesses: function () {
        return this.managedBusinesses || [];
    }
});
