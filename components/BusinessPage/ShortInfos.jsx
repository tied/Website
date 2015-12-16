'use strict';

var React = require('react');
var _ = require('lodash');
var Link = require('../Link.jsx');
var moment = require('moment');
var DateTimeConstants = require('../../constants/DateTimeConstants');
var parseTimetable = require('../../lib/time').parseTimetable;
moment.locale('fr');

var Rating = React.createClass({
    render: function () {
        var business = this.props.business || {};
        if (!business.numReviews) return <span />;

        var rating = Math.round(business.rating / 100 * 5);

        return (
            <div className="stars">
                {_.map([1, 2, 3, 4, 5], function (starValue) {
                    return <Link key={starValue} route="business_reviews" params={{ businessId: business.id, businessSlug: business.slug }} className={'star'+(starValue <= rating ? ' full' : '')} />
                })}
                <Link route="business_reviews" params={{ businessId: business.id, businessSlug: business.slug }} className="avis  hidden-md">
                    {business.numReviews+' avis'}
                </Link>
            </div>
        );
    }
});

var ShareButton = React.createClass({
    componentDidMount: function () {
        new window.Share('.share-business', {
            ui: {
              button_text: "Partager",
              },
            networks: {
              pinterest: {
                enabled: false
                }
              }
        });
    },
    render: function () {
        return (
              <div style={{dispay: 'inline-block'}}>
                <div className="share-business">
                </div>
              </div>
            );
    }
});

module.exports = React.createClass({
    getInitialState: function() {
      return {
        displayTimetable: false
      };
    },
    render: function () {
        var business = this.props.business || {};
        var address  = business.address || {};
        var timetable = business.timetable || {};

        var today = DateTimeConstants.weekDaysNumber[moment().day()];

        var displayAddress = _.isEmpty(address) ? null : address.street + ', ' + address.zipCode + ', ' + address.city + '.';
        var linkToMap = _.isEmpty(address) ? null : <div onClick={function() {$('html,body').animate({ scrollTop: $("#location").offset().top}, 'slow');}}><Link route="business" params={{ businessId: business.id, businessSlug: business.slug }} fragment="location" className="linkToMap" preserveScrollPosition={true}>(Voir la carte)</Link></div>;
        var open;

        if (!_.isEmpty(timetable)) {
          if (!timetable[today] || _.isEmpty(timetable[today]))
            open = <h2>Horaires d'ouverture: <a className="red" role="button" onClick={this.handleDisplayTimetable}>Fermé aujourd'hui</a></h2>;
          else
            open = <h2>Horaires d'ouverture: <a className="green" role="button" onClick={this.handleDisplayTimetable}>Ouvert aujourd'hui</a></h2>;
        } else {
            open = null;
        }

        return (
            <section className="salon-info">
              <div className="row">
                <div className="col-sm-8">
                  <h1>{business.name}</h1>
                  {open}
                  <div className="visible-xs">
                    {this.renderTimetable()}
                  </div>
                  <h2>{displayAddress} {linkToMap}</h2>
                  {this.renderAveragePrice()}
                </div>
                <div className="col-sm-4" style={{padding: '0', paddingRight: '15px', marginTop: '-5px'}}>
                  <Rating business={business} />
                  <div style={{overflow: 'auto'}}>
                    <Link route="write_business_review" className="pull-right request-review"
                      query={{businessId: this.props.business.id}}>
                      {business.numReviews > 0 ? 'Déposez un avis' : 'Soyez le 1er à déposer un avis'}
                    </Link>
                  </div>
                  <div className="hidden-xs">
                    {this.renderTimetable()}
                  </div>
                </div>
              </div>
              <div className="row" style={{paddingBottom: '20px'}}>
                <div className="prix col-xs-12 col-sm-12">
                </div>
              </div>
          </section>
        );
    },
    renderAveragePrice: function () {
        var price = this.props.business && this.props.business.averagePrice || {};

        if (!price.men && !price.women) return;

        return (
            <p>
                <span className="glyphicon glyphicon-euro"></span>
                {price.men ? 'Homme ' : ''}
                {price.men ? <span>&nbsp;{Math.round(price.men)}€</span> : ''}
                {price.men && price.women ? <span>&nbsp;-&nbsp;</span> : ''}
                {price.women ? 'Femme' : ''}
                {price.women ? <span>&nbsp;{Math.round(price.women)}€</span> : ''}
            </p>
        );
    },
    handleDisplayTimetable: function() {
      this.setState({displayTimetable: (!this.state.displayTimetable)});
    },
    renderTimetable: function() {
        if (!this.props.business.timetable)
            return;

        var timetable = this.props.business.timetable;
        var render = [];
        render = _.map(DateTimeConstants.weekDaysNumberFR, function(val, i) {
            return (
                <div className={this.state.displayTimetable ? '' : 'seo-hide'} key={i}>
                    <span className="extra-small col-xs-2 col-sm-4">{DateTimeConstants.weekDayLabel(val)} : </span>
                    { _.isEmpty(timetable[val]) ? <span className="red">Fermé</span> : _.map(parseTimetable(timetable[val]), function(t) {
                            return t.startTime + ' - ' + t.endTime;
                        }).join(" / ") }
                </div>
            );
        }, this);
      return (
          <div className="timetable">
              {render}
          </div>
      );
    }
});
