'use strict';

var React = require('react');
var UserGenders = require('../constants/UserConstants').Genders;
var BusinessKinds = require('../constants/BusinessConstants').Kinds;
var BusinessLeadActions = require('../actions/BusinessLeadActions');
var PublicLayout = require('./PublicLayout.jsx');
var Picture = require('./Partial/Picture.jsx');
var NotificationActions = require('../actions/NotificationActions');
var formValidation = require('../lib/formValidation');
var connectToStores = require('fluxible-addons-react/connectToStores');
var ReactDOM = require('react-dom');

var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var UUID = require('uuid');
var _ = require('lodash');


var HomePagePro = React.createClass({
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
    return {
      businessKind: ''
    };
  },
  onBusinessKindChange: function (e) {
    this.setState({
      businessKind: e.currentTarget.value
      });
  },
    render: function () {
        return (
            <PublicLayout withProLink={false}>
                <section className="home-pro">
                    <div className="container">
                        <div className="row">
                            <div className="claim">
                                <h3>Vous êtes un professionnel de la coiffure ?</h3>
                                <p>Laissez-nous vos coordonnées, nous vous recontacterons pour vous présenter nos services</p>
                                <form role="form" className="form-horizontal">
                                    <Input label="* Vous êtes:" labelClassName="radio-label" wrapperClassName="col-sm-10">
                                        <Input name="businessKind" type="radio" ref="businessKind" value={BusinessKinds.SALON} label="Un salon" groupClassName="radio-inline"  onChange={this.onBusinessKindChange} />
                                        <Input name="businessKind" type="radio" ref="businessKind" value={BusinessKinds.HOME} label="À domicile" groupClassName="radio-inline"  onChange={this.onBusinessKindChange}/>
                                    </Input>
                                </form>
                                <form role="form" ref="form2" className="second-form">
                                    <br/>
                                    <Input ref="businessName" type="text" placeholder="Nom de votre salon de coiffure" label="* Nom du salon:" groupClassName="col-sm-6 col-xs-12" onChange={formValidation.required} onFocus={formValidation.required} />
                                    <Input ref="zipCode" type="text" placeholder="Code postal" label="* Code postal:"  groupClassName="col-sm-6 col-xs-12" onChange={formValidation.required} onFocus={formValidation.required} />
                                    <Input ref="phoneNumber" type="text" placeholder="Numéro de téléphone" label="* Votre numéro de téléphone" groupClassName="col-sm-6 col-xs-12" onChange={formValidation.phoneNumber} onFocus={formValidation.phoneNumber} />
                                    <Input ref="email" type="email" placeholder="Email" label="* Votre adresse email" groupClassName="col-sm-6 col-xs-12" onChange={formValidation.email} onFocus={formValidation.email} />
                                    <Input ref="remarque" type="textarea" label="Une remarque, une question ?" groupClassName="col-sm-12" />
                                    <Button className="btn-red" onClick={this.submit}>Laisser mes coordonnées</Button>
                                </form>
                                <div className="btn-scroll hidden-xs">
                                    <a onClick={this.scrollTo.bind(this, "advices")} className="arrow hidden-xs">
                                        <Picture picture={{url: "/img/pro/btn-scroll.png"}} alt="scroll" />
                                    </a>
                                    <span className="more-infos">Plus d'informations&nbsp;?</span>
                                </div>
                                {this.displayThankYouMessage()}
                                <div className="contact">
                                    <h4>Contactez-nous au <a href="tel:+33185089169">+33 1 85 08 91 69</a> ou <a href="mailto:hello@hairfie.com">hello@hairfie.com</a></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="advices" ref="advices">
                    <div className="container text-center">
                        <h3>Améliorez votre image sur Internet avec Hairfie </h3>
                        <div className="row">
                            <div className="col-sm-6">
                                <Picture picture={{url: "/img/howitworks/iphone.png"}} style={{width: 50, height: 50}}alt="Visibilité" />
                                <h5>Visibilité</h5>
                                <p>
                                    Aidez-vos clients à vous trouver sur Internet ! Que vous soyez déjà un geek de la coiffure ou tout débutant avec Internet, Hairfie est là pour vous aider à maîtriser et développer votre image sur Internet. Montrez vos créations (les fameux hairfies, photos de vos coupes et coiffures) sur votre page salon gratuite et commencez tout de suite à toucher de nouveaux clients.
                                </p>
                            </div>
                            <div className="col-sm-6">
                                <Picture picture={{url: "/img/howitworks/store.png"}} style={{width: 50, height: 50}}alt="Visibilité" />
                                <h5>Réservation</h5>
                                <p>
                                    Accueillez vos clients quand ils le souhaitent. Les clients peuvent demander un RDV 24h sur 24 et 7 jours sur 7. Hairfie vous transmet ensuite cette demande sur vos horaires d’ouverture que vous confirmez selon votre disponibilité. Le salon est déjà complet ? Proposez un ou deux autres créneaux disponibles afin d’optimisez vos chances d’acquérir de nouveaux clients.
                                </p>
                            </div>
                            <div className="col-sm-6">
                                <Picture picture={{url: "/img/howitworks/dollar.png"}} style={{width: 50, height: 50}}alt="Visibilité" />
                                <h5>Optimisez</h5>
                                <p>
                                    Des moments plus calmes dans la semaine ? Optimisez le remplissage de votre salon de coiffure grâce à la mise en place de promotions ciblées sur certains jours et certaines heures. Attirez plus de clients et faites plus de chiffre d’affaires en heures creuses  en offrant une promotion sur vos prestations et produits. Offrez un avantage de 20 à 50 % à vos clients pour prendre rendez-vous quand ça VOUS arrange.
                                </p>
                            </div>
                            <div className="col-sm-6">
                                <Picture picture={{url: "/img/pro/icon-4.png"}} style={{width: 50, height: 50}}alt="Visibilité" />
                                <h5>Service clientèle</h5>
                                <p>
                                    Gardez le contact, réduisez les rendez-vous non honorés et développez une vraie relation avec vos clients. Vos clients reçoivent un sms de rappel quelques heures avant le rendez-vous prévu. Grâce au hairfie que vous aurez pris, le client reçoit aussi la photo par email et intègre votre base de donnée clients. Vous gardez ainsi le contact avec lui et bénéficiez des outils marketing d’Hairfie pour donner envie à vos clients de revenir plus souvent dans votre salon.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </PublicLayout>
        );
    },
    handleBusinessNameChanged: function (e) {
        formValidation.required(e);
    },
    displayThankYouMessage: function() {
        if(this.props.hasBeenRegistered) {
            //vide le form après validation
            ReactDOM.findDOMNode(this.refs.form2).reset();
            return (<div className="row">
                        <div className="success bg-success">
                            <span className="glyphicon glyphicon-ok-sign" aria-hidden="true"></span> Merci, vos coordonnées sont enregistrées ! <br/>Nous vous recontacterons très prochainement.
                        </div>
                    </div>); 
        }
    },
    scrollTo: function(toRef) {
        var target = ReactDOM.findDOMNode(this.refs[toRef]);
        TweenMax.to(window, 0.5, {scrollTo:{y:target.offsetTop}, ease:Power2.easeOut});
    },
    submit: function (e) {
        if (
            !this.state.businessKind ||
            !this.refs.businessName.getValue() ||
            !this.refs.zipCode.getValue() ||
            !this.refs.phoneNumber.getValue() ||
            !this.refs.email.getValue() 
            ) {
            return this.context.executeAction(
                NotificationActions.notifyWarning,
                {
                    title: 'Information',
                    message: "Certains champs obligatoires n'ont pas été remplis"
                }
            );
        }
        e.preventDefault();
        if(typeof heap !== "undefined") {
            heap.identify({email: this.refs.email.getValue()});
        }
        this.context.executeAction(BusinessLeadActions.submit, {
            businessLead        : {
                kind        : this.state.businessKind,
                name        : this.refs.businessName.getValue(),
                zipCode     : this.refs.zipCode.getValue(),
                phoneNumber : this.refs.phoneNumber.getValue(),
                email       : this.refs.email.getValue(),
                note        : this.refs.remarque.getValue()
            }
        });
    }
});
HomePagePro = connectToStores(HomePagePro, [
    'BusinessLeadStore'
], function (context, props) {
    return {
        hasBeenRegistered: context.getStore('BusinessLeadStore').getHairdresserRegistrationStatus()
    };
});

module.exports = HomePagePro;