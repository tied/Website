'use strict';

var React = require('react');
var _ = require('lodash');
var PublicLayout = require('./PublicLayout.jsx');
var FacebookButton = require('./Auth/FacebookButton.jsx');
var FormRegistration = require('./Auth/FormRegistration.jsx');
var Link = require('./Link.jsx');

var RegistrationPage = React.createClass({
	render: function() {
		return (
			<PublicLayout>
				<div className="connect-form col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3 col-xs-12">
					<h2>Inscription</h2>
					<Link route="connect_page" className="green">Déjà inscrit ? Connectez-vous</Link>
					<FacebookButton withNavigate={true}/>
					<h4>ou remplissez ce formulaire</h4>
					<span className="separator"/>
					<FormRegistration 
						withNavigate={true} 
						firstName={this.props.booking.firstName || ""} 
						lastName={this.props.booking.lastName || ""} 
						phoneNumber={this.props.booking.phoneNumber || ""} 
						email={this.props.booking.email || ""} 
						gender={this.props.booking.gender || ""} />
				</div>
			</PublicLayout>
			);
	}
});

<<<<<<< HEAD
RegistrationPage = connectToStores(RegistrationPage, [
    'AuthStore',
    'BookingStore'
], function (stores, props) {
    return {
        token: stores.AuthStore.getToken(),
        booking: props.route.query.bookingId ? stores.BookingStore.getById(props.route.query.bookingId) : {}
    };
});

=======
>>>>>>> d56d01a50f30fb0168aaf3581cf7fcccd415c367
module.exports = RegistrationPage;