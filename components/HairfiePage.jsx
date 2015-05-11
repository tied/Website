'use strict';

var React = require('react');
var _ = require('lodash');
var Link = require('./Link.jsx');
var PublicLayout = require('./PublicLayout.jsx');
var UserProfilePicture = require('./Partial/UserProfilePicture.jsx');
var Picture = require('./Partial/Picture.jsx');
var Loader = require('./Partial/Loader.jsx');
var connectToStores = require('../lib/connectToStores');

var Carousel = React.createClass({
    getInitialState: function () {
        return {
            displayIndex: 0
        };
    },
    componentWillReceiveProps: function () {
        this.setState({displayIndex: 0});
    },
    render: function () {
        var pictures = this.props.hairfie.pictures.slice(0, 2);

        return (
            <div id="carousel-hairfie" className="carousel slide" data-ride="carousel">
                <div className="carousel-inner" role="listbox">
                    {_.map(pictures, function (picture, i) {
                        return (
                            <div key={i+'-'+picture.url} className={'item '+(this.state.displayIndex == i ? ' active' : '')}>
                                <div className="outer-img">
                                    <Picture picture={picture} />
                                </div>
                            </div>
                        );
                    }, this)}
                </div>
                {this.renderControl('left', 0, 'Précédent')}
                {this.renderControl('right', 1, 'Suivant')}
            </div>
        );
    },
    renderControl: function (position, index, label) {
        if (this.props.hairfie.pictures.length < 2) return;

        return (
            <a className={position+' carousel-control'} href="#" role="button" onClick={this.show.bind(this, index)}>
                <span className={'arrow arrow-'+position} aria-hidden="true" />
                <span className="sr-only">{label}</span>
            </a>
        );
    },
    show: function (i) {
        this.setState({displayIndex: i});
    }
});

var HairfieSingle = React.createClass({
    render: function () {
        return (
            <div className="col-xs-12 col-sm-6">
                <Carousel hairfie={this.props.hairfie} />
                <div className="like-group">
                    {this.renderBookingButton()}
                </div>
            </div>
       );
    },
    renderBookingButton: function () {
        if (!this.props.hairfie.business) return;

        return (
            <div className="cta">
                <Link className="btn btn-red full" route="business_booking" params={{ businessId: this.props.hairfie.business.id, businessSlug: this.props.hairfie.business.slug }}>
                    Réserver dans ce salon
                </Link>
            </div>
        );
    }
});

var RightColumn = React.createClass({
    render: function() {
        if (!this.props.hairfie.business) return <div />;

        var hairdresserNode;
        if (this.props.hairfie.hairdresser) {
            hairdresserNode = (
                <p>Réalisé par :
                    <Link route="business" params={{ businessId: this.props.hairfie.business.id, businessSlug: this.props.hairfie.business.slug }}>
                        {this.props.hairfie.hairdresser.firstName}
                    </Link>
                </p>
            );
        }

        return (
            <div className="col-xs-12 col-sm-6">
                <div className="salon-infos">
                    <div className="row">
                        <div className="col-xs-3">
                            <Link route="business" params={{ businessId: this.props.hairfie.business.id, businessSlug: this.props.hairfie.business.slug }}>
                                <Picture picture={this.props.hairfie.business.pictures[0]} resolution={220} />
                            </Link>
                        </div>
                        <div className="col-xs-9 address-bloc">
                            <h2>
                                <Link route="business" params={{ businessId: this.props.hairfie.business.id, businessSlug: this.props.hairfie.business.slug }}>
                                    {this.props.hairfie.business.name}
                                </Link>
                            </h2>
                            {hairdresserNode}
                        </div>
                        <div className="col-xs-9 tags">
                            { _.map(this.props.hairfie.tags, function(tag) {
                                return (<span className="tag" key={tag.id}><a href="#">{tag.name}</a></span>)
                            }) }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-3">
                        </div>
                        <div className="col-xs-9 likes">
                          <p>
                            {/*<a href="#" className="col-xs-3 like">J'aime</a>
                            - */}
                            <span className="col-xs-3">{this.props.hairfie.numLikes}&nbsp;&nbsp;j'aime</span>
                          </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

var HairfiePage = React.createClass({
    contextTypes: {
        config: React.PropTypes.object
    },
    componentDidMount: function () {
        new Share(".share-button", {
            image: "{{ this.state.hairfie.picture.url }}",
            title: "{{ this.state.hairfie.descriptions.facebook }}",
            networks: {
                facebook: {
                  app_id: "{{ this.context.config.facebookAppId }}",
                  load_sdk: false
                },
                twitter: {
                    description: "{{ this.state.hairfie.descriptions.twitter }}"
                }
            }
        });
        TweenMax.to('#content .single-view', 0.5, {marginTop:40,opacity:1,ease:Power2.easeIn});
        TweenMax.to('#content .related-hairfies', 0.5, {marginTop:0,opacity:1,ease:Power2.easeIn,delay:0.3});
        $('.like-btn').on('click',function(){
          $('.glyphicon-heart').toggleClass('full');
        });
        $('#carousel-hairfie').carousel();
    },
    render: function () {
        if (!this.props.hairfie) return this.renderLoading();

        return (
            <PublicLayout>
                <div className="container hairfie-singleView" id="content" >
                    <div className="single-view row">
                        <HairfieSingle hairfie={this.props.hairfie} />
                        <RightColumn hairfie={this.props.hairfie} />
                    </div>
                </div>
            </PublicLayout>
        );
    },
    renderLoading: function () {
        return (
            <PublicLayout>
                <div className="container hairfie-singleView" id="content" >
                    <div className="loading" />
                </div>
            </PublicLayout>
        );
    }
});

HairfiePage = connectToStores(HairfiePage, [
    'HairfieStore'
], function (stores, props) {
    return {
        hairfie: stores.HairfieStore.getById(props.route.params.hairfieId)
    };
});

module.exports = HairfiePage;