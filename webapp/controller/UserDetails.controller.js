sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./Popover16", "./Popover22",
	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, Popover16, Popover22, Utilities, History) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.untitledPrototype.controller.UserDetails", {
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
		_onIconPress: function(oEvent) {

			var sPopoverName = "Popover16";
			this.mPopovers = this.mPopovers || {};
			var oPopover = this.mPopovers[sPopoverName];

			if (!oPopover) {
				oPopover = new Popover16(this.getView());
				this.mPopovers[sPopoverName] = oPopover;

				oPopover.getControl().setPlacement("Auto");

				// For navigation.
				oPopover.setRouter(this.oRouter);
			}

			var oSource = oEvent.getSource();

			oPopover.open(oSource);

		},
		_onButtonPress: function(oEvent) {

			var sPopoverName = "Popover22";
			this.mPopovers = this.mPopovers || {};
			var oPopover = this.mPopovers[sPopoverName];

			if (!oPopover) {
				oPopover = new Popover22(this.getView());
				this.mPopovers[sPopoverName] = oPopover;

				oPopover.getControl().setPlacement("Auto");

				// For navigation.
				oPopover.setRouter(this.oRouter);
			}

			var oSource = oEvent.getSource();

			oPopover.open(oSource);

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
			this.oRouter.getTarget("UserDetails").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			var oView = this.getView();
			oView.addEventDelegate({
				onBeforeShow: function() {
					if (sap.ui.Device.system.phone) {
						var oPage = oView.getContent()[0];
						if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
							oPage.setShowNavButton(true);
							oPage.attachNavButtonPress(function() {
								this.oRouter.navTo("", {}, true);
							}.bind(this));
						}
					}
				}.bind(this)
			});

			var oView = this.getView(),
				oData = {},
				self = this;
			var oModel = new sap.ui.model.json.JSONModel();
			oView.setModel(oModel, "staticDataModel");
			self.oBindingParameters = {};

			oData["sap_IconTabBar_Page_0-content-sap_m_IconTabBar-1542620724394-77sdlztqj8nkhqxnrxje8rw45_S5-items-sap_m_IconTabFilter-1543243521891-content-sap_chart_LineChart-1543244511366"] = {};

			oData["sap_IconTabBar_Page_0-content-sap_m_IconTabBar-1542620724394-77sdlztqj8nkhqxnrxje8rw45_S5-items-sap_m_IconTabFilter-1543243521891-content-sap_chart_LineChart-1543244511366"]["data"] = [{
				"dim0": "Communication",
				"mea0": "80",
				"__id": 0
			}, {
				"dim0": "Quantity",
				"mea0": "70",
				"__id": 1
			}, {
				"dim0": "Quality",
				"mea0": "60",
				"__id": 2
			}, {
				"dim0": "Motivation",
				"mea0": "80",
				"__id": 3
			}, {
				"dim0": "Teamplayer",
				"mea0": "70",
				"__id": 4
			}];

			self.oBindingParameters['sap_IconTabBar_Page_0-content-sap_m_IconTabBar-1542620724394-77sdlztqj8nkhqxnrxje8rw45_S5-items-sap_m_IconTabFilter-1543243521891-content-sap_chart_LineChart-1543244511366'] = {
				"path": "/sap_IconTabBar_Page_0-content-sap_m_IconTabBar-1542620724394-77sdlztqj8nkhqxnrxje8rw45_S5-items-sap_m_IconTabFilter-1543243521891-content-sap_chart_LineChart-1543244511366/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oView.getModel("staticDataModel").setData(oData, true);

			function dateDimensionFormatter(oDimensionValue, sTextValue) {
				var oValueToFormat = sTextValue !== undefined ? sTextValue : oDimensionValue;
				if (oValueToFormat instanceof Date) {
					var oFormat = sap.ui.core.format.DateFormat.getDateInstance({
						style: "short"
					});
					return oFormat.format(oValueToFormat);
				}
				return oValueToFormat;
			}

			var aDimensions = oView.byId("sap_IconTabBar_Page_0-content-sap_m_IconTabBar-1542620724394-77sdlztqj8nkhqxnrxje8rw45_S5-items-sap_m_IconTabFilter-1543243521891-content-sap_chart_LineChart-1543244511366").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

		},
		onAfterRendering: function() {

			var oChart,
				self = this,
				oBindingParameters = this.oBindingParameters,
				oView = this.getView();

			oChart = oView.byId("sap_IconTabBar_Page_0-content-sap_m_IconTabBar-1542620724394-77sdlztqj8nkhqxnrxje8rw45_S5-items-sap_m_IconTabFilter-1543243521891-content-sap_chart_LineChart-1543244511366");
			oChart.bindData(oBindingParameters['sap_IconTabBar_Page_0-content-sap_m_IconTabBar-1542620724394-77sdlztqj8nkhqxnrxje8rw45_S5-items-sap_m_IconTabFilter-1543243521891-content-sap_chart_LineChart-1543244511366']);

		}
	});
}, /* bExport= */ true);
