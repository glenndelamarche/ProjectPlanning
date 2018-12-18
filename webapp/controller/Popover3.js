/*eslint-disable no-console, no-alert*/
/*global history*/
sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function(ManagedObject, MessageBox, Utilities, History) {

	return ManagedObject.extend("com.sap.build.standard.untitledPrototype.controller.Popover3", {
		constructor: function(oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "com.sap.build.standard.untitledPrototype.view.Popover3", this);
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
		setUserId: function(userId){
			$.sap.userId = userId;
		},
		setName: function(username){
			$.sap.username = username;
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
			this.getView().byId("userEvalName").setTitle($.sap.username);

			if (oControl.open) {
				oControl.open.apply(oControl, args);
			} else if (oControl.openBy) {
				oControl.openBy.apply(oControl, args);
			}
		},
		checkNumber: function(oEvent){
			var val = oEvent.getSource()._lastValue;
			if (isNaN(val)){
				oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
				$.sap.allChecked = false;
			} else if(parseInt(val, 10) > 100 || parseInt(val,10) < 0) {
                oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
                $.sap.allChecked = false;
			} else {
				oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
				$.sap.allChecked = true;
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
		_onSave: function() {
			//get all inserted/needed fields BY ID (you can access fields from detail page)
			if (!$.sap.allChecked){
				sap.m.MessageToast.show('Something went wrong, please check again');
			}else {
			var projectId = this.getView().byId("projectId").getText();
			var userId = $.sap.userId;
			var description = this.getView().byId('description').getValue();
			var communication =  this.getView().byId('communication').getValue();
		    var quality =  this.getView().byId('quality').getValue();
		    var quantity =  this.getView().byId('quantity').getValue();
		    var motivation =  this.getView().byId('motivation').getValue();
		    var teamplayer =  this.getView().byId('teamplayer').getValue();
			//check if all required fields are submitted
			if (communication === "" || quality === "" || quantity === "" || motivation === "" || teamplayer === ""){
				sap.m.MessageToast.show('All skill-fields are required');
			} else {
				var oModel = this.getView().getModel(); 
				//create your json object (based on the odata/cds!!)
				var oData = {
					EvalsId : 0,
					ProjectId : parseInt(projectId, 10),
				    UserId : parseInt(userId, 10),
				    Description : description,
				    Communication : parseInt(communication, 10),
				    Quality : parseInt(quality, 10),
				    Quantity : parseInt(quantity, 10),
				    Motivation : parseInt(motivation, 10),
				    Teamplayer : parseInt(teamplayer, 10),
				    Deleted : 0
				};
					//(only for update/insert //get csfr token)
					jQuery.ajax("/",{
						  type: "GET",
						  contentType: 'application/json',
						  dataType: 'json',
						  beforeSend: function(xhr){
						    xhr.setRequestHeader('X-CSRF-Token', 'fetch');
						  },
						  success : function(response) {
						  	jQuery.ajaxSetup({
						      beforeSend: function(xhr) {
						        oModel.setRequestHeader("X-CSRF-Token",response.getResponseHeader('X-CSRF-Token'));
						      }
						    });
						  }
						});
					//oModel.update("</yourset>", oData<created_entity)
					oModel.create("/EvalSet", oData, {
					  merge: true, //updates changed fields
					  success: function() { },
					  error: function(oError) { }
					});
					this.close();
					sap.m.MessageToast.show('Evaluation submitted');

					}
			}
		},
		_onClose: function() {

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
