/*eslint-disable no-console, no-alert*/
/*global history*/

sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"./utilities",
	"sap/ui/core/routing/History"
], function(ManagedObject, MessageBox, Utilities, History, Filter, FilterOperator, FilterType) {

	return ManagedObject.extend("com.sap.build.standard.untitledPrototype.controller.Popover16", {
		constructor: function(oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "com.sap.build.standard.untitledPrototype.view.Popover16", this);
			this._bInit = false;
		},

		exit: function() {
			delete this._oView;
		},

		getView: function() {
			return this._oView;
		},
		
        setUserId: function(userId) {
        	$.sap.userId = userId;
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

			var oTable = this.getView().byId("evalItems");
			
			var oSelect, oBinding, aFilters;
			var sFilterValue = $.sap.userId; // I assume you can get the filter value from somewhere...
			oSelect = this.getView().byId("evalItems"); //get the reference to your Select control
			console.log(oSelect);
			//oBinding = oSelect.bindAggregation();
			oBinding = oSelect.getBindingContext("items").getPath();
			
			console.log(oBinding);
			aFilters = [];
			
			if (sFilterValue){
			    aFilters.push( new sap.ui.model.Filter("UserId", sap.ui.model.FilterOperator.EQ, sFilterValue) );
			}
			oBinding.filter(aFilters, FilterType.Application);
			
			/*
			oTable.bindElement({
				path: "/EvalAvgSet("+$.sap.userId+")"
			});
			*/


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
