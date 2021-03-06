'use strict';

var React = require('react');
var Link = require('../Link.jsx');
var EmailModal = require('../Partial/EmailModal.jsx');
var LinksSection = require('./LinksSection.jsx');
var Picture = require('../Partial/Picture.jsx');

var connectToStores = require('fluxible-addons-react/connectToStores');
var _ = require('lodash');

var Footer = React.createClass({
    render: function() {
        return (
            <div>
                {this.renderDesktop()}
                {this.renderMobile()}
            </div>
            );
    }, 
    renderDesktop: function () {
        return (
            <footer className="visible-md visible-lg">
                <div className="footer-bg" />
                <div className="container">
                    <Picture picture={{url: '/img/icons/logo-Hairfie.svg'}} svg={true} />
                    <h4>
                        Suivez-nous !
                    </h4>
                    <div className="col-xs-10 col-xs-offset-1">
                        <p>
                            Hairfie, c'est la plateforme Web et mobile qui permet aux coiffeurs de diffuser leur talent
                            mais aussi aux clients de trouver et prendre rendez-vous avec le coiffeur qui correspond !
                        </p>
                    </div>
                    <div className="row">
                        <ul className="social-links col-md-3">
                            <li><a href="https://www.facebook.com/Hairfie" target="_blank" className='icon'>b</a></li>
                            <li><a href="https://twitter.com/Hairfie" target="_blank" className='icon'>a</a></li>
                            <li><a href="https://plus.google.com/+Hairfie" target="_blank" className='icon'>c</a></li>
                            <li><a href="https://instagram.com/Hairfie" target="_blank" className='icon'>x</a></li>
                            <li><a href="https://www.pinterest.com/hairfie/" target="_blank" className='icon'>d</a></li>
                        </ul>
                    </div>
                    <div className="row">
                        <div className="hr col-sm-10 col-xs-10"></div>
                    </div>
                    <div className="row">
                        <ul className="footer-links col-md-11 col-lg-10">
                            <li target="_blank"><a href="http://jobs.hairfie.com/">Recrutement</a></li>
                            <li>
                                <Link route="howitworks_page">Comment ça marche ?</Link>
                            </li>
                            <li><Link route="newsletter">Newsletter</Link></li>
                            <li><a href="http://blog.hairfie.com/" target="_blank">Blog</a></li>
                            <li><a href="http://api.hairfie.com/public/mentions_legales_v3_fr.pdf" target="_blank">Conditions générales</a></li>
                            <li><Link route="home_pro">Gérez votre salon</Link></li>
                        </ul>
                    </div>
                    <div className="row">
                        <div className="hr col-sm-10 col-xs-10"></div>
                    </div>
                    <p>© Hairfie 2016<span className="pull-right hidden-xs heap"><a href="https://heapanalytics.com/?utm_source=badge" target="_blank"><img style={{width:'108px', height:'41px'}} src="//heapanalytics.com/img/badge.png" alt="Heap | Mobile and Web Analytics" target="_blank" /></a></span></p>
                    <LinksSection links={this.props.links}/>
                </div>
                <EmailModal ref="emailModal" />
            </footer>
        );
    },
    renderMobile: function() {
        return (
            <footer className="visible-xs visible-sm mobile">
                <div className="row">
                    <Picture picture={{url: '/img/icons/logo-Hairfie.svg'}} svg={true} />
                    <h4>
                        Suivez-nous !
                    </h4>
                    <div className="col-xs-10 col-xs-offset-1">
                        <p>
                            Hairfie, c'est la plateforme Web et mobile qui permet aux coiffeurs de diffuser leur talent
                            mais aussi aux clients de trouver et prendre rendez-vous avec le coiffeur qui correspond !
                        </p>
                    </div>
                    <div className="row">
                        <ul className="social-links col-md-3">
                            <li><a href="https://www.facebook.com/Hairfie" target="_blank" className='icon'>b</a></li>
                            <li><a href="https://twitter.com/Hairfie" target="_blank" className='icon'>a</a></li>
                            <li><a href="https://plus.google.com/+Hairfie" target="_blank" className='icon'>c</a></li>
                            <li><a href="https://instagram.com/Hairfie" target="_blank" className='icon'>x</a></li>
                            <li><a href="https://www.pinterest.com/hairfie/" target="_blank" className='icon'>d</a></li>
                        </ul>
                    </div>
                    <div className="row">
                        <div className="hr col-sm-10 col-xs-10"></div>
                    </div>
                    <p>© Hairfie 2016</p>
                </div>
            </footer>
        )
    },
    openEmailModal: function() {
        this.refs.emailModal.open();
    }
});

Footer = connectToStores(Footer, [
    'FooterLinkStore'
], function (context, props) {
    return _.assign({}, {
        links       : context.getStore('FooterLinkStore').all()
    }, props);
});

module.exports = Footer;
