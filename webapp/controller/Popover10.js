/*eslint-disable no-console, no-alert*/
/*global history*/

sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function(ManagedObject, MessageBox, Utilities, History) {

	return ManagedObject.extend("com.sap.build.standard.untitledPrototype.controller.Popover10", {
		constructor: function(oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "com.sap.build.standard.untitledPrototype.view.Popover10", this);
			this._bInit = false;
		},

		exit: function() {
			delete this._oView;
		},

		getView: function() {
			return this._oView;
		},

		getControl: function() {
			return this._oControl;
		},

		getOwnerComponent: function() {
			return this._oView.getController().getOwnerComponent();
		},

		open: function() {
			var oView = this._oView;
			var oControl = this._oControl;

			if (!this._bInit) {

				// Initialize our fragment
				this.onInit();

				this._bInit = true;

				// connect fragment to the root view of this component (models, lifecycle)
				oView.addDependent(oControl);
			}

			var args = Array.prototype.slice.call(arguments);
			if (oControl.open) {
				oControl.open.apply(oControl, args);
			} else if (oControl.openBy) {
				oControl.openBy.apply(oControl, args);
			}
		},

		close: function() {
			this._oControl.close();
		},

		setRouter: function(oRouter) {
			this.oRouter = oRouter;

		},
		getBindingParameters: function() {
			return {};

		},
		
		getODataDateFromDatePicker: function (datePickerInstance) {

			var yyyymmdd = datePickerInstance;

			var splitDateArray = yyyymmdd.match(/(\d{4})(\d{2})(\d{2})/);

			var yyyySlashMMSlashDD = splitDateArray[1] + '/' + splitDateArray[2] + '/' + splitDateArray[3];

			var jsDateObject = new Date(yyyySlashMMSlashDD);

			return jsDateObject;

		},
		
		getCSRFToken: function () {	
			$.get('CSRFTokenManager.do', function(data) {
			   var send = XMLHttpRequest.prototype.send,
			   token =data;
			   document.cookie='X-CSRF-Token='+token;
			   XMLHttpRequest.prototype.send = function(data) {
			       this.setRequestHeader('X-CSRF-Token',token);
			       //dojo.cookie("X-CSRF-Token", "");
			
			       return send.apply(this, arguments);
			   };
			});
		},

		_onAddPress: function () {
			//console.log("add pressed");
			//get all inserted/needed fields BY ID (you can access fields from detail page)
			var firstName = this.getView().byId("txtFName").getValue();
			var lastName = this.getView().byId('txtLName').getValue();
			var email = this.getView().byId('txtEmail').getValue();
			var phone = this.getView().byId('txtPhone').getValue();
			var street = this.getView().byId('txtStreet').getValue();
			var housenumber = this.getView().byId('txtHouseNumber').getValue();
			var zipcode = this.getView().byId('txtZipcode').getValue();
			var city = this.getView().byId('txtCity').getValue();
			var country = this.getView().byId('txtCountry').getValue();
			var birthdate = this.getView().byId('datBirthdate').getValue();
			var gender = this.getView().byId('cboGender').getSelectedKey();
			var nationality = this.getView().byId('txtNationality').getValue();
			var beginDate = this.getView().byId('datBeginDate').getValue();
			//check if all required fields are submitted
			if (firstName === "" || lastName === "" || email === "" || phone === "" ||
				street === "" || housenumber === "" || zipcode === "" || city === "" ||
				country === "" || birthdate === "" || gender === "" || nationality === "" ||
				beginDate === "") {
				sap.m.MessageToast.show('All fields are required');
			} else {

				var oModel = this.getView().getModel();
				//create your json object (based on the odata/cds!!)
				var oData = {
					UserId : 0,
					Name: null,
					Firstname: firstName,
					Lastname: lastName,
					Email: email,
					Phone: phone,
					Street: street,
					HouseNumber: parseInt(housenumber, 10),
					Bus: null,
					Zipcode: zipcode,
					City: city,
					Country: country,
					Birthdate: this.getODataDateFromDatePicker(birthdate),
					Gender: gender,
					Nationality: nationality,
					BeginDate: this.getODataDateFromDatePicker(beginDate),
					Deleted: 0
				};
				//(only for update/insert //get csfr token)
				jQuery.ajax("/", {
					type: "GET",
					contentType: 'application/json',
					dataType: 'json',
					beforeSend: function (xhr) {
						xhr.setRequestHeader('X-CSRF-Token', 'fetch');
					},
					complete: function (response) {
						jQuery.ajaxSetup({
							beforeSend: function (xhr) {
								oModel.setRequestHeader("X-CSRF-Token", response.getResponseHeader('X-CSRF-Token'));
							}
						});
					}
				});
				//oModel.update("</yourset>", oData<created_entity)
				oModel.create("/UserSet", oData, {
					merge: true, //updates changed fields
					success: function () {
							sap.m.MessageToast.show('User '+firstName+" "+lastName+" created");

					},
					error: function (oError) {
						console.log(oError);
					}
				});
			}
		},
		
		_onButtonPress: function() {

			this.close();

		},
		onInit: function() {

			this._oDialog = this.getControl();

		},
		onExit: function() {
			this._oDialog.destroy();

		}

	});
}, /* bExport= */ true);
