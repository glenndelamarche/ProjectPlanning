
/*eslint-disable no-console, no-alert*/
/*global history*/

sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./Popover16", "./Popover22",
	"./utilities",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/ui/core/routing/History",
	"sap/ui/core/util/Export", 
	"sap/ui/core/util/ExportTypeCSV"
], function(BaseController, MessageBox, Popover16, Popover22, Utilities, History, Filter, FilterOperator, FilterType, Export, ExportTypeCSV) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.untitledPrototype.controller.UserDetails", {
		handleRouteMatched: function(oEvent) {
			
			
			//main
			
			var sAppId = "App5bf2850a07da730110b7b171";

			var oArgument = oEvent.getParameter("arguments").SelectedItem;
			$.sap.userId = oArgument;

			var oView = this.getView();
			
			oView.bindElement({
				path: "/UserSet(" + oArgument + ")"
			});
			
			//userProjects
			
			var oSelect, oBinding, aFilters;
			var sFilterValue = oArgument; // I assume you can get the filter value from somewhere...
			oSelect = this.getView().byId("projects"); //get the reference to your Select control
			oBinding = oSelect.getBinding("items");
			aFilters = [];
			
			if (sFilterValue){
			    aFilters.push( new sap.ui.model.Filter("UserId", sap.ui.model.FilterOperator.EQ, oArgument) );
			}
			oBinding.filter(aFilters, FilterType.Application);  //apply the filter
		
		
			//UserEval

			var oSelect, oBinding, aFilters;
			var sFilterValue = oArgument; // I assume you can get the filter value from somewhere...
			oSelect = this.getView().byId("evaluations"); //get the reference to your Select control
			oBinding = oSelect.getBinding("items");
			aFilters = [];
			
			if (sFilterValue){
			    aFilters.push( new sap.ui.model.Filter("UserId", sap.ui.model.FilterOperator.EQ, oArgument) );
			}
			oBinding.filter(aFilters, FilterType.Application);  //apply the filter
					
			
			var oTable = oView.byId("evaluations");
			var aData = (oTable.getItems() || []).map(function(oItem){
			// assuming that you are using the default model  
				return oItem.getBindingContext().getObject();
			});
			
			
			
			
		
			
			 oView.getModel().read("/EvalAvgSet("+$.sap.userId+")", {
				  success: function(oRetrievedResult) { 
				  	
				  
				  	var jModel = new sap.ui.model.json.JSONModel(oRetrievedResult);
					sap.ui.getCore().setModel(jModel);
					if(jModel.getProperty("/UserId") === 0 && jModel.getProperty("/Name") === "Empty") {
				   	oView.byId("InputCom").setText("Not Evaluated");
				   	oView.byId("InputMoti").setText("Not Evaluated");
				  	oView.byId("InputQual").setText("Not Evaluated");
				  	oView.byId("InputQuan").setText("Not Evaluated");
				  	oView.byId("InputTeam").setText("Not Evaluated");
				  	oView.byId("InputTot").setTitle("Not Evaluated");
				   } else {
				   	oView.byId("InputCom").setText(Number(jModel.getProperty("/AvgCom")).toPrecision(4));
				   	oView.byId("InputMoti").setText(Number(jModel.getProperty("/AvgMot")).toPrecision(4));
				  	oView.byId("InputQual").setText(Number(jModel.getProperty("/AvgQual")).toPrecision(4));
				  	oView.byId("InputQuan").setText(Number(jModel.getProperty("/AvgQuan")).toPrecision(4));
				  	oView.byId("InputTeam").setText(Number(jModel.getProperty("/AvgTeam")).toPrecision(4));
				  	oView.byId("InputTot").setTitle(Number(jModel.getProperty("/TotScore")).toPrecision(4));
				   }
					//$.sap.ChartCom = Number(jModel.getProperty("/AvgCom")).toPrecision(4);
				  	//oView.byId("InputCom").setText($.sap.ChartCom);
				  	
				  },
				    error: function(oError) { 
				  	oView.byId("InputCom").setText("Not evaluated");
				  	oView.byId("InputMoti").setText("Not evaluated");
				  	oView.byId("InputQual").setText("Not evaluated");
				  	oView.byId("InputQuan").setText("Not evaluated");
				  	oView.byId("InputTeam").setText("Not evaluated");
				  	oView.byId("InputTot").setTitle("Not evaluated");
				  }
				});
			 
		//	}
			
	
			this.getValuesForUpdate();

		},
		
		getValuesForUpdate: function(oEvent){
			//update
			var oView = this.getView();
			var date = new Date(oView.byId('BeginDate').getText());
			this.getView().byId('BeginDateU').setDateValue(date);
			date = new Date(oView.byId('Birthdate').getText());
			this.getView().byId('BirthdateU').setDateValue(date);	
		},
		
		
		getODataDateFromDatePicker: function (datePickerInstance) {
			var yyyymmdd = datePickerInstance;
			var splitDateArray = yyyymmdd.match(/(\d{4})(\d{2})(\d{2})/);
			var yyyySlashMMSlashDD = splitDateArray[1] + "/" + splitDateArray[2] + "/" + splitDateArray[3];
			var jsDateObject = new Date(yyyySlashMMSlashDD);
			return jsDateObject;
		},
		 
		
		
		_onIconPress: function(oEvent) {
			var userId = oEvent.getSource().getCustomData()[0].getProperty('value');
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
			oPopover.setUserId(userId);
			oPopover.open(oSource);

		},
		
		archiveUser: function(oEvent) {
			var userId = oEvent.getSource().getCustomData()[0].getProperty('value');
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
			oPopover.setUserId(userId);
			oPopover.open(oSource);

		},
		
	
        	OnExcelAssets2: function(oEvt){
            var oModel = this.getView().byId("evaluations").getModel();
            var oTab = this.getView().byId("evaluations");
            var oBinding = oTab.getBinding("items");
            var oExport = new Export({
                exportType : new ExportTypeCSV({
                    separatorChar : ";"
                }),
                models : oModel,
                rows : {
                    path : "/UserEvalSet",
                    filters: oBinding.aFilters
                },
                columns: [{
					name: "Project name",
					template: {
						content: "{ProjName}"
					}
				}, {
					name: "Role",
					template: {
						content: "{Role}"
					} },
					{
					name: "Communication",
					template: {
						content: "{Communication}"
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
						name: "Motivation",
					template: {
						content: "{Motivation}"
					}
					}, {
						name: "Teamplayer",
					template: {
						content: "{Teamplayer}"
					}
					},
					{
						name: "Description",
					template: {
						content: "{Description}"
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
		
		_onUpdateUser: function(oEvent){
			var userId = this.getView().byId("UserId").getValue();
			var beginDate = this.getView().byId("BeginDateU").getValue();
			var firstname = this.getView().byId("Firstname").getValue();
			var lastname = this.getView().byId("Lastname").getValue();
			var email = this.getView().byId("Email").getValue();
			var phone = this.getView().byId("Phone").getValue();
			var birthdate = this.getView().byId("BirthdateU").getValue();
			var gender = this.getView().byId("Gender").getValue();
			var nationality = this.getView().byId("Nationality").getValue();
			var street = this.getView().byId("Street").getValue();
			var houseNumber = this.getView().byId("HouseNumber").getValue();
			var bus = this.getView().byId("Bus").getValue();
			var zipcode = this.getView().byId("Zipcode").getValue();
			var city = this.getView().byId("City").getValue();
			var country = this.getView().byId("Country").getValue();
			
			//check if all required fields are submitted
			if (firstname === "" || lastname === "" || email === "" || beginDate === "" ||
				phone === "" || birthdate === "" || gender === ""  || nationality === ""  || street === ""  || houseNumber === ""  || bus === ""|| zipcode === ""  || city === ""  || country === "") {
					this.getView().byId('Firstname').setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId('Lastname').setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId('BeginDateU').setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId('Email').setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId('Phone').setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId('BirthdateU').setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId('Gender').setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId('Nationality').setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId('Street').setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId('HouseNumber').setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId('Bus').setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId('Zipcode').setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId('City').setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId('Country').setValueState(sap.ui.core.ValueState.Error);
				
					sap.m.MessageToast.show('Please fill in all the required fields');
					this.getValuesForUpdate();
				

			} else {
					this.getView().byId('Firstname').setValueState(sap.ui.core.ValueState.None);
					this.getView().byId('Lastname').setValueState(sap.ui.core.ValueState.None);
					this.getView().byId('BeginDateU').setValueState(sap.ui.core.ValueState.None);
					this.getView().byId('Email').setValueState(sap.ui.core.ValueState.None);
					this.getView().byId('Phone').setValueState(sap.ui.core.ValueState.None);
					this.getView().byId('BirthdateU').setValueState(sap.ui.core.ValueState.None);
					this.getView().byId('Gender').setValueState(sap.ui.core.ValueState.None);
					this.getView().byId('Nationality').setValueState(sap.ui.core.ValueState.None);
					this.getView().byId('Street').setValueState(sap.ui.core.ValueState.None);
					this.getView().byId('HouseNumber').setValueState(sap.ui.core.ValueState.None);
					this.getView().byId('Bus').setValueState(sap.ui.core.ValueState.None);
					this.getView().byId('Zipcode').setValueState(sap.ui.core.ValueState.None);
					this.getView().byId('City').setValueState(sap.ui.core.ValueState.None);
					this.getView().byId('Country').setValueState(sap.ui.core.ValueState.None);
					
				var oModel = this.getView().getModel();
				//create your json object (based on the odata/cds!!)
				
				
				var oData = {
					UserId : parseInt(userId, 10),
					Name : null,
					Firstname : firstname,
					Lastname : lastname,
					Email: email,
					Phone : phone,
					//AddressId: null,
					Street: street,
					HouseNumber: parseInt(houseNumber,10),
					Bus: parseInt(bus,10),
					Zipcode: zipcode,
					City: city,
					Country: country,
					//Birthdate: null,
					Birthdate: this.getODataDateFromDatePicker(birthdate),
					Gender: gender,
					Nationality: nationality,
					//BeginDate: null,
					BeginDate: this.getODataDateFromDatePicker(beginDate),
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
					oModel.update("/UserSet("+userId+")", oData, {
					  merge: true, //updates changed fields
					  success: function() { 
					  	sap.m.MessageToast.show('Your updates were successfully processed');
					  },
					  error: function(oError) {  }
					});
			}
		},
		
		
	
		_onSavePress: function() {
			var oModel = this.getView().getModel();
   var oEntry = {};
	oEntry.UserId = this.getView().byId("UserId").getValue();
	oEntry.Fistname = this.getView().byId("Firstname").getValue();

   oModel.update ("/UserSet('" + oEntry.UserId + "')", oEntry, {
    method: "PUT",
    success: function(data) {
    },
    error: function(e) {
    }
   });
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
			this.oRouter.getRoute("UserDetails").attachPatternMatched(this, this.handleRouteMatched, this);
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
			
		},
		
	});
}, /* bExport= */ true); 
