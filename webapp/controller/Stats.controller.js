sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, History) {
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

			var oView = this.getView(),
				oData = {},
				self = this;
			var oModel = new sap.ui.model.json.JSONModel();
			oView.setModel(oModel, "staticDataModel");
			self.oBindingParameters = {};

			oData["sap_IconTabBar_Page_0-87kc0ivf53grds3vjuu9ph8s3_S3-yem1ic2acf9gevkchllfsqd34_S4-content-sap_chart_BarChart-1542637380231"] = {};

			oData["sap_IconTabBar_Page_0-87kc0ivf53grds3vjuu9ph8s3_S3-yem1ic2acf9gevkchllfsqd34_S4-content-sap_chart_BarChart-1542637380231"]["data"] = [{
				"dim0": "Tom",
				"mea0": "80",
				"__id": 0
			}, {
				"dim0": "Wout",
				"mea0": "85",
				"__id": 1
			}, {
				"dim0": "Glenn",
				"mea0": "75",
				"__id": 2
			}, {
				"dim0": "Christophe",
				"mea0": "90",
				"__id": 3
			}, {
				"dim0": "Steve",
				"mea0": "90",
				"__id": 4
			}];

			self.oBindingParameters['sap_IconTabBar_Page_0-87kc0ivf53grds3vjuu9ph8s3_S3-yem1ic2acf9gevkchllfsqd34_S4-content-sap_chart_BarChart-1542637380231'] = {
				"path": "/sap_IconTabBar_Page_0-87kc0ivf53grds3vjuu9ph8s3_S3-yem1ic2acf9gevkchllfsqd34_S4-content-sap_chart_BarChart-1542637380231/data",
				"model": "staticDataModel",
				"parameters": {}
			};

			oData["sap_IconTabBar_Page_0-87kc0ivf53grds3vjuu9ph8s3_S3-yem1ic2acf9gevkchllfsqd34_S4-content-sap_chart_BarChart-1542637390493"] = {};

			oData["sap_IconTabBar_Page_0-87kc0ivf53grds3vjuu9ph8s3_S3-yem1ic2acf9gevkchllfsqd34_S4-content-sap_chart_BarChart-1542637390493"]["data"] = [{
				"dim0": "Andrea",
				"mea0": "10",
				"__id": 0
			}, {
				"dim0": "André",
				"mea0": "40",
				"__id": 1
			}, {
				"dim0": "Jozef",
				"mea0": "20",
				"__id": 2
			}, {
				"dim0": "Josefien",
				"mea0": "30",
				"__id": 3
			}, {
				"dim0": "Gilbert",
				"mea0": "15",
				"__id": 4
			}];

			self.oBindingParameters['sap_IconTabBar_Page_0-87kc0ivf53grds3vjuu9ph8s3_S3-yem1ic2acf9gevkchllfsqd34_S4-content-sap_chart_BarChart-1542637390493'] = {
				"path": "/sap_IconTabBar_Page_0-87kc0ivf53grds3vjuu9ph8s3_S3-yem1ic2acf9gevkchllfsqd34_S4-content-sap_chart_BarChart-1542637390493/data",
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

			var aDimensions = oView.byId("sap_IconTabBar_Page_0-87kc0ivf53grds3vjuu9ph8s3_S3-yem1ic2acf9gevkchllfsqd34_S4-content-sap_chart_BarChart-1542637380231").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

			var aDimensions = oView.byId("sap_IconTabBar_Page_0-87kc0ivf53grds3vjuu9ph8s3_S3-yem1ic2acf9gevkchllfsqd34_S4-content-sap_chart_BarChart-1542637390493").getDimensions();
			aDimensions.forEach(function(oDimension) {
				oDimension.setTextFormatter(dateDimensionFormatter);
			});

		},
		onAfterRendering: function() {

			var oChart,
				self = this,
				oBindingParameters = this.oBindingParameters,
				oView = this.getView();

			oChart = oView.byId("sap_IconTabBar_Page_0-87kc0ivf53grds3vjuu9ph8s3_S3-yem1ic2acf9gevkchllfsqd34_S4-content-sap_chart_BarChart-1542637380231");
			oChart.bindData(oBindingParameters['sap_IconTabBar_Page_0-87kc0ivf53grds3vjuu9ph8s3_S3-yem1ic2acf9gevkchllfsqd34_S4-content-sap_chart_BarChart-1542637380231']);

			oChart = oView.byId("sap_IconTabBar_Page_0-87kc0ivf53grds3vjuu9ph8s3_S3-yem1ic2acf9gevkchllfsqd34_S4-content-sap_chart_BarChart-1542637390493");
			oChart.bindData(oBindingParameters['sap_IconTabBar_Page_0-87kc0ivf53grds3vjuu9ph8s3_S3-yem1ic2acf9gevkchllfsqd34_S4-content-sap_chart_BarChart-1542637390493']);

		}
	});
}, /* bExport= */ true);
