/** @jsx React.DOM */

'use strict';

var React = require('react');
var StoreMixin = require('fluxible-app').StoreMixin;
var BusinessStore = require('../stores/BusinessStore');
var BusinessFacebookPageStore = require('../stores/BusinessFacebookPageStore');
var FacebookStore = require('../stores/FacebookStore');
var FacebookActions = require('../actions/Facebook');
var FacebookPermissions = require('../constants/FacebookConstants').Permissions;
var Layout = require('./ProLayout.jsx');
var Panel = require('react-bootstrap/Panel');
var Label = require('react-bootstrap/Label');
var Button = require('react-bootstrap/Button');
var Modal = require('react-bootstrap/Modal');
var ModalTrigger = require('react-bootstrap/ModalTrigger');

var ConnectFacebookPageModal = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [FacebookStore]
    },
    getStateFromStores: function () {
        return {
            canManagePages  : this.getStore(FacebookStore).canManagePages(),
            managedPages    : this.getStore(FacebookStore).getPagesWithCreateContentPermission()
        }
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        return (
            <Modal {...this.props} title="Connecter une page facebook">
                <div className="modal-body">
                    {this.renderBody()}
                </div>
                <div className="modal-footer">

                </div>
            </Modal>
        );
    },
    renderBody: function () {
        if (!this.state.canManagePages) return this.renderBodyLogin();
        if (0 == this.state.managedPages.length) return this.renderBodyNoManagedPage();

        return (
            <p>Choisissez la page à associer.</p>
        );
    },
    renderBodyLogin: function () {
        return (
            <div>
                <p>Pour pouvoir associer une page facebook, vous devez autoriser Hairfie à gérer vos pages.</p>
                <Button className="btn-social btn-facebook" onClick={this.linkFacebook}>
                    <i className="fa fa-facebook" />
                    Autoriser Hairfie à gérer mes pages Facebook
                </Button>
            </div>
        );
    },
    renderBodyNoManagedPage: function () {
        return <p>Aucune page n'a pu être trouvée.</p>;
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    linkFacebook: function () {
        this.props.context.executeAction(FacebookActions.Link, {
            scope: [FacebookPermissions.MANAGE_PAGES]
        });
    }
});

var FacebookPanel = React.createClass({
    render: function () {
        return (
            <Panel {...this.props} header={this.renderHeader()}>
                {this.renderBody()}
            </Panel>
        );
    },
    renderHeader: function () {
        var status;
        if (this.props.page) {
            status = <Label bsStyle="success">Connecté</Label>;
        } else {
            status = <Label bsStyle="danger">Non connecté</Label>;
        }

        return (
            <div>
                <i className="fa fa-facebook" /> Facebook
                <span className="pull-right">{status}</span>
            </div>
        );
    },
    renderBody: function () {
        if (this.props.page) return this.renderBodyWithPage();
        else return this.renderBodyWithoutPage();
    },
    renderBodyWithPage: function () {
        return (
            <p>Connecté à la page "{this.props.page.name}".</p>
        );
    },
    renderBodyWithoutPage: function () {
        return (
            <ModalTrigger modal={<ConnectFacebookPageModal context={this.props.context} />}>
                <Button>Connecter une page facebook</Button>
            </ModalTrigger>
        );
    }
});

module.exports = React.createClass({
    mixins: [StoreMixin],
    statics: {
        storeListeners: [BusinessStore, BusinessFacebookPageStore]
    },
    getStateFromStores: function () {
        var business = this.getStore(BusinessStore).getBusiness();

        return {
            business: business
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        return (
            <Layout context={this.props.context} business={this.state.business}>
                <h2>Réseaux Sociaux</h2>
                <FacebookPanel context={this.props.context} />
            </Layout>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});
