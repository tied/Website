/**
 * TODO: only the controller component (*Page) should be a store listener
 */

'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible/addons/FluxibleMixin');
var BusinessStore = require('../stores/BusinessStore');
var BusinessActions = require('../actions/Business');
var BusinessFacebookPageStore = require('../stores/BusinessFacebookPageStore');
var FacebookStore = require('../stores/FacebookStore');
var FacebookActions = require('../actions/Facebook');
var FacebookPermissions = require('../constants/FacebookConstants').Permissions;
var Layout = require('./ProLayout.jsx');
var Panel = require('react-bootstrap/Panel');
var Label = require('react-bootstrap/Label');
var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');
var Modal = require('react-bootstrap/Modal');
var ModalTrigger = require('react-bootstrap/ModalTrigger');
var Facebook = require('../services/facebook');
var _ = require('lodash');

var ConnectFacebookPageModal = React.createClass({
    facebookPermissions: [
        FacebookPermissions.MANAGE_PAGES,
        FacebookPermissions.PUBLISH_ACTIONS
    ],
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [BusinessStore, FacebookStore]
    },
    componentWillMount: function () {
        // we need to be sure Facebook is loaded (@see linkFacebook)
        Facebook.load();
    },
    getStateFromStores: function () {
        return {
            hasPermissions  : this.getStore(FacebookStore).hasPermissions(this.facebookPermissions),
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
            </Modal>
        );
    },
    renderBody: function () {
        if (!this.state.hasPermissions) return this.renderBodyLogin();
        if (!this.state.managedPages.length) return this.renderBodyNoManagedPage();

        var managedPageOptions = this.state.managedPages.map(function (page) {
            return <option key={page.id} value={page.id}>{page.name}</option>;
        });

        return (
            <div>
                <p>Sélectionnez dans la liste ci-dessous la page facebook que vous souhaitez connecter à votre activité Hairfie.</p>
                <Input ref="page" type="select">
                    {managedPageOptions}
                </Input>
                <Button onClick={this.connectPage}>Connecter la page</Button>
            </div>
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
    linkFacebook: function (e) {
        e.preventDefault();

        if (typeof window.FB == "undefined") {
            debug('Facebook not loaded');
            return;
        }

        // NOTE: we are breaking the flux architecture here, this si necessary
        //       to make the Facebook's login popup work on some browsers
        window.FB.login(function (response) {
            this.executeAction(FacebookActions.HandleLinkResponse, {
                response: response
            });
        }.bind(this), {scope: this.facebookPermissions.join(',')});
    },
    connectPage: function () {
        var facebookPage = _.find(this.state.managedPages, {id: this.refs.page.getValue()});
        if (facebookPage) {
            this.executeAction(BusinessActions.SaveFacebookPage, {
                business    : this.props.business,
                facebookPage: facebookPage
            });

            this.props.onRequestHide();
        }
    }
});

var FacebookPanel = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [BusinessStore, BusinessFacebookPageStore]
    },
    getStateFromStores: function () {
        return {
            page: this.props.business && this.getStore(BusinessFacebookPageStore).getFacebookPageByBusiness(this.props.business)
        };
    },
    getInitialState: function () {
        return this.getStateFromStores();
    },
    render: function () {
        return (
            <Panel {...this.props} header={this.renderHeader()}>
                {this.renderBody()}
            </Panel>
        );
    },
    renderHeader: function () {
        var status;
        if (this.state.page) {
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
        if (this.state.page) return this.renderBodyWithPage();
        else return this.renderBodyWithoutPage();
    },
    renderBodyWithPage: function () {
        return (
            <div>
                <p>Connecté à la page "{this.state.page.name}".</p>
                <Button onClick={this.disconnectPage}>Déconnecter la page</Button>
            </div>
        );
    },
    renderBodyWithoutPage: function () {
        return (
            <ModalTrigger modal={<ConnectFacebookPageModal context={this.props.context} business={this.props.business} />}>
                <Button>Connecter une page facebook</Button>
            </ModalTrigger>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    },
    disconnectPage: function () {
        this.executeAction(BusinessActions.DeleteFacebookPage, {
            business: this.props.business
        });
    }
});

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [BusinessStore, BusinessFacebookPageStore]
    },
    getStateFromStores: function () {
        var business = this.getStore(BusinessStore).getById(this.props.route.params.businessId);

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
                <FacebookPanel context={this.props.context} business={this.state.business} />
            </Layout>
        );
    },
    onChange: function () {
        this.setState(this.getStateFromStores());
    }
});
