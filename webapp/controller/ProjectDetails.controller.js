/*eslint-disable no-console, no-alert*/
/*global history*/

sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./Popover4", "./Popover3", "./Popover2", "./Popover11",
	"./utilities",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, Popover4, Popover3, Popover2, Popover11, Utilities, History, Filter,FilterOperator,FilterType) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.untitledPrototype.controller.ProjectDetails", {
		handleRouteMatched: function(oEvent) {
			//main
			var oArgument = oEvent.getParameter("arguments").SelectedItem;
			var oView = this.getView();
			oView.bindElement({
				path: "/ProjectSet(" + oArgument + ")"
				});
			
			//managername
			var oText = oView.byId("managerName");
			
			var managerId = oView.byId("managerId").getText();
			if (!isNaN(managerId)){
				oView.getModel().read("/UserSet("+managerId+")", {
				  success: function(oRetrievedResult) { 
				  	var jModel = new sap.ui.model.json.JSONModel(oRetrievedResult);
					sap.ui.getCore().setModel(jModel);
				  	oText.setText(jModel.getProperty("/Name"));
				  },
				  error: function(oError) { oText.setText(""); }
				});
			}
			//teammembers
			var oSelect, oBinding, aFilters;
			var sFilterValue = oArgument; // I assume you can get the filter value from somewhere...
			oSelect = this.getView().byId("teamMembers"); //get the reference to your Select control
			oBinding = oSelect.getBinding("items");
			aFilters = [];
			
			if (sFilterValue){
			    aFilters.push( new sap.ui.model.Filter("ProjectId", sap.ui.model.FilterOperator.EQ, oArgument) );
			}
			oBinding.filter(aFilters, FilterType.Application);  //apply the filter
		},
		_onOverflowToolbarButtonPress: function(oEvent) {

			var sPopoverName = "Popover4";
			this.mPopovers = this.mPopovers || {};
			var oPopover = this.mPopovers[sPopoverName];

			if (!oPopover) {
				oPopover = new Popover4(this.getView());
				this.mPopovers[sPopoverName] = oPopover;

				oPopover.getControl().setPlacement("Auto");

				// For navigation.
				oPopover.setRouter(this.oRouter);
			}

			var oSource = oEvent.getSource();

			oPopover.open(oSource);

		},
		_onIconPress: function(oEvent) {

			var sPopoverName = "Popover3";
			this.mPopovers = this.mPopovers || {};
			var oPopover = this.mPopovers[sPopoverName];

			if (!oPopover) {
				oPopover = new Popover3(this.getView());
				this.mPopovers[sPopoverName] = oPopover;

				oPopover.getControl().setPlacement("Auto");

				// For navigation.
				oPopover.setRouter(this.oRouter);
			}

			var oSource = oEvent.getSource();

			oPopover.open(oSource);

		},
		_onIconPress1: function(oEvent) {

			var sPopoverName = "Popover2";
			this.mPopovers = this.mPopovers || {};
			var oPopover = this.mPopovers[sPopoverName];

			if (!oPopover) {
				oPopover = new Popover2(this.getView());
				this.mPopovers[sPopoverName] = oPopover;

				oPopover.getControl().setPlacement("Auto");

				// For navigation.
				oPopover.setRouter(this.oRouter);
			}

			var oSource = oEvent.getSource();

			oPopover.open(oSource);

		},
		_onButtonPress: function(oEvent) {

			var sPopoverName = "Popover11";
			this.mPopovers = this.mPopovers || {};
			var oPopover = this.mPopovers[sPopoverName];

			if (!oPopover) {
				oPopover = new Popover11(this.getView());
				this.mPopovers[sPopoverName] = oPopover;

				oPopover.getControl().setPlacement("Auto");

				// For navigation.
				oPopover.setRouter(this.oRouter);
			}

			var oSource = oEvent.getSource();

			oPopover.open(oSource);

		},
		_onNavigateTrello: function(oEvent){
			var url = this.getView().byId("trelloUrl").getTooltip();
			
			sap.m.URLHelper.redirect(url, true);
		},
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getRoute("ProjectDetails").attachPatternMatched(this,this.handleRouteMatched, this);
			var oView = this.getView();
			oView.addEventDelegate({
				onBeforeShow: function() {
					if (sap.ui.Device.system.phone) {
						var oPage = oView.getContent()[0];
						if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
							oPage.setShowNavButton(true);
							oPage.attachNavButtonPress(function() {
								this.oRouter.navTo("ScrollBar", {}, true);
							}.bind(this));
						}
					}
				}.bind(this)
			});
			
 
		}
	});
}, /* bExport= */ true);
