/*eslint-disable no-console, no-alert*/
/*global history*/
sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/ui/core/util/Export", 
	"sap/ui/core/util/ExportTypeCSV"
], function(BaseController, MessageBox, Utilities, History,Export,ExportTypeCSV) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.untitledPrototype.controller.Stats", {
		handleRouteMatched: function(oEvent) {
			var sAppId = "App5bf2850a07da730110b7b171";

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function(oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype") {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};

					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

				}
			}

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}
			

		},
		applyFiltersAndSorters: function(sControlId, sAggregationName, chartBindingInfo) {
			if (chartBindingInfo) {
				var oBindingInfo = chartBindingInfo;
			} else {
				var oBindingInfo = this.getView().byId(sControlId).getBindingInfo(sAggregationName);
			}
			var oBindingOptions = this.updateBindingOptions(sControlId);
			this.getView().byId(sControlId).bindAggregation(sAggregationName, {
				model: oBindingInfo.model,
				path: oBindingInfo.path,
				parameters: oBindingInfo.parameters,
				template: oBindingInfo.template,
				templateShareable: true,
				sorter: oBindingOptions.sorters,
				filters: oBindingOptions.filters
			});

		},
		OnExcelAssets: function(oEvt){
            var oModel = this.getView().getModel();
           
            var oExport = new Export({
                exportType : new ExportTypeCSV({
                    separatorChar : ";"
                }),
                models : oModel,
                rows : {
                    path : "/UserEvalSet",
                },
                columns: [{
					name: "Evals Id",
					template: {
						content: "{EvalsId}"
					}
				}, {
					name: "User Id",
					template: {
						content: "{UserId}"
					}
				}, {
					name: "Name",
					template: {
						content: "{Name}"
					}
				}, {
					name: "Email",
					template: {
						content: "{Email}"
					}
				}, {
					name: "Role",
					template: {
						content: "{Role}"
					}	
				}, {
					name: "ProjName",
					template: {
						content: "{ProjName}"
					}
				}, {
					name: "Communication",
					template: {
						content: "{Communication}"
					}
				}, {
					name: "Motivation",
					template: {
						content: "{Motivation}"
					}
				}, {
					name: "Quality",
					template: {
						content: "{Quality}"
					}
				}, {
					name: "Quantity",
					template: {
						content: "{Quantity}"
					}
				}, {
					name: "Teamplayer",
					template: {
						content: "{Teamplayer}"
					}
				}, {
					name: "StartDate",
					template: {
						content: "{StartDate}"
					}
				}, {
					name: "EndDate",
					template: {
						content: "{EndDate}"
					}
				}, {
					name: "DeliverablesUrl",
					template: {
						content: "{DeliverablesUrl}"
					}	
				}]
            });
            this.onExcel(oExport);
        },
		
		onExcel: sap.m.Table.prototype.exportData || function(oExport){
            oExport.saveFile().catch(function(oError) {
            }).then(function() {
                oExport.destroy();
            });
        },
		updateBindingOptions: function(sCollectionId, oBindingData, sSourceId) {
			this.mBindingOptions = this.mBindingOptions || {};
			this.mBindingOptions[sCollectionId] = this.mBindingOptions[sCollectionId] || {};

			var aSorters = this.mBindingOptions[sCollectionId].sorters;
			var aGroupby = this.mBindingOptions[sCollectionId].groupby;

			// If there is no oBindingData parameter, we just need the processed filters and sorters from this function
			if (oBindingData) {
				if (oBindingData.sorters) {
					aSorters = oBindingData.sorters;
				}
				if (oBindingData.groupby || oBindingData.groupby === null) {
					aGroupby = oBindingData.groupby;
				}
				// 1) Update the filters map for the given collection and source
				this.mBindingOptions[sCollectionId].sorters = aSorters;
				this.mBindingOptions[sCollectionId].groupby = aGroupby;
				this.mBindingOptions[sCollectionId].filters = this.mBindingOptions[sCollectionId].filters || {};
				this.mBindingOptions[sCollectionId].filters[sSourceId] = oBindingData.filters || [];
			}

			// 2) Reapply all the filters and sorters
			var aFilters = [];
			for (var key in this.mBindingOptions[sCollectionId].filters) {
				aFilters = aFilters.concat(this.mBindingOptions[sCollectionId].filters[key]);
			}

			// Add the groupby first in the sorters array
			if (aGroupby) {
				aSorters = aSorters ? aGroupby.concat(aSorters) : aGroupby;
			}

			var aFinalFilters = aFilters.length > 0 ? [new sap.ui.model.Filter(aFilters, true)] : undefined;
			return {
				filters: aFinalFilters,
				sorters: aSorters
			};

		},
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("Stats").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
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
