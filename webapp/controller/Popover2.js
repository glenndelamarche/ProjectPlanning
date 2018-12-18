/*eslint-disable no-console, no-alert*/
/*global history*/
sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function(ManagedObject, MessageBox, Utilities, History) {

	return ManagedObject.extend("com.sap.build.standard.untitledPrototype.controller.Popover2", {
		constructor: function(oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "com.sap.build.standard.untitledPrototype.view.Popover2", this);
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
		
		_onDeleteMember: function() {
			var projectId = this.getView().byId("projectId").getText();
			var userId = $.sap.userId;
				var oModel = this.getView().getModel(); 
				//create your json object (based on the odata/cds!!)
				var oData = {
						UserId : parseInt(userId,10),
						Name : null,
						ProjectId : parseInt(projectId,10),
						Role : null,
						Deleted : 1
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
					oModel.update("/TeamMemberSet(UserId="+userId+",ProjectId="+projectId+")", oData, {
					  merge: true, //updates changed fields
					  success: function() {  },
					  error: function(oError) {  }
					});
					
		},
		onInit: function() {
			this._oDialog = this.getControl();
		},
		onExit: function() {
			this._oDialog.destroy();
		}

	});
}, /* bExport= */ true);
