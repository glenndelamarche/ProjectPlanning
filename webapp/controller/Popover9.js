/*eslint-disable no-console, no-alert*/
/*global history*/
sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function (ManagedObject, MessageBox, Utilities, History) {

	return ManagedObject.extend("com.sap.build.standard.untitledPrototype.controller.Popover9", {
		constructor: function (oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "com.sap.build.standard.untitledPrototype.view.Popover9", this);
			this._bInit = false;
		},

		exit: function () {
			delete this._oView;
		},

		getView: function () {
			return this._oView;
		},

		getControl: function () {
			return this._oControl;
		},

		getOwnerComponent: function () {
			return this._oView.getController().getOwnerComponent();
		},

		open: function () {
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

		close: function () {
			this._oControl.close();
		},

		setRouter: function (oRouter) {
			this.oRouter = oRouter;

		},
		getBindingParameters: function () {
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
			var name = this.getView().byId("txtName").getValue();
			var company = this.getView().byId('txtCompany').getValue();
			var budget = this.getView().byId('txtBudget').getValue();
			var startDate = this.getView().byId('datStartDate').getValue();
			var endDate = this.getView().byId('datEndDate').getValue();
			var desc = this.getView().byId('txtDesc').getValue();
			var trello = this.getView().byId('txtTrello').getValue();
			var manager = this.getView().byId('ddlManager').getSelectedKey();
			//check if all required fields are submitted
			if (name === "" || company === "" || budget === "" || startDate === "" ||
				desc === "" || manager === "") {
				sap.m.MessageToast.show('All fields are required');
			} else {

				var oModel = this.getView().getModel();
				//create your json object (based on the odata/cds!!)
				var oData = {
					ProjectId : 0,
					Name: name,
					Description: desc,
					Company: company,
					//Budget: parseFloat(budget).toFixed(2),
					Budget: parseFloat(budget).toFixed(2),
					StartDate: this.getODataDateFromDatePicker(startDate),
					EndDate: (endDate !== "" ? this.getODataDateFromDatePicker(endDate) : null),
					DeliverablesUrl: (trello !== "" ? trello : null),
					ManagerId: parseInt(manager, 10),
					Active: 1,
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
				oModel.create("/ProjectSet", oData, {
					merge: true, //updates changed fields
					success: function () {},
					error: function (oError) {
						console.log(oError);
					}
				});
			}
		},

		_onButtonPress: function () {
			this.close();

		},
		onInit: function () {

			this._oDialog = this.getControl();

		},
		onExit: function () {
			this._oDialog.destroy();

		}

	});
}, /* bExport= */ true);