/*eslint-disable no-console, no-alert*/
/*global history*/

sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./Popover4", "./Popover3", "./Popover2", "./Popover11",
	"./utilities",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/ui/core/routing/History",
	"sap/ui/core/util/Export", 
	"sap/ui/core/util/ExportTypeCSV"


], function(BaseController, MessageBox, Popover4, Popover3, Popover2, Popover11, Utilities, History, Filter,FilterOperator,FilterType, Export, ExportTypeCSV) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.untitledPrototype.controller.ProjectDetails", {
		handleRouteMatched: function(oEvent) {
			//main
			var oArgument = oEvent.getParameter("arguments").SelectedItem;
			$.sap.projectId = oArgument;

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
				  	oText.setText(jModel.getProperty("/Name"));
				  },
				  error: function(oError) { oText.setText(managerId); }
				});
			}
			//check deliverables_url
			var url = this.getView().byId("trelloUrl").getTooltip();
			if (url === null){
				this.getView().byId("trelloUrl").setEnabled(false);
				this.getView().byId("trelloUrl").setType(sap.m.ButtonType.Ghost);
			} else {
				this.getView().byId("trelloUrl").setEnabled(true);
				this.getView().byId("trelloUrl").setType(sap.m.ButtonType.Emphasized);
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
			
			//fill update fields
			this.getValuesForUpdate();
			
		},
		getValuesForUpdate: function(oEvent){
			//update
			var oView = this.getView();
			oView.byId('comboboxManagerU').setSelectedKey(oView.byId("managerId").getText());
			var date = new Date(oView.byId('startDate').getText());
			this.getView().byId('startDateU').setDateValue(date);
			date = new Date(oView.byId('endDate').getText());
			this.getView().byId('endDateU').setDateValue(date);	
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
		getODataDateFromDatePicker: function (datePickerInstance) {
			var yyyymmdd = datePickerInstance;
			var splitDateArray = yyyymmdd.match(/(\d{4})(\d{2})(\d{2})/);
			var yyyySlashMMSlashDD = splitDateArray[1] + '/' + splitDateArray[2] + '/' + splitDateArray[3];
			var jsDateObject = new Date(yyyySlashMMSlashDD);
			return jsDateObject;

		},
		_onUpdateProject: function(oEvent){
			var projectId = this.getView().byId("projectId").getText();
			var name = this.getView().byId("projectNameU").getValue();
			var company = this.getView().byId('company').getText();
			var budget = this.getView().byId('budgetU').getValue();
			var startDate = this.getView().byId('startDateU').getValue();
			var endDate = this.getView().byId('endDateU').getValue();
			var desc = this.getView().byId('descriptionU').getValue();
			var trello = this.getView().byId('deliverablesU').getValue();
			var manager = this.getView().byId('comboboxManagerU').getSelectedKey();
			//check if all required fields are submitted
			if (name === "" || budget === "" || startDate === "" ||
				desc === "" || manager === "") {
					this.getView().byId("projectNameU").setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId('budgetU').setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId('startDateU').setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId('descriptionU').setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId('comboboxManagerU').setValueState(sap.ui.core.ValueState.Error);
					sap.m.MessageToast.show('Please fill in all the required fields');
					this.getValuesForUpdate();


			} else {
					this.getView().byId("projectNameU").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId('budgetU').setValueState(sap.ui.core.ValueState.None);
					this.getView().byId('startDateU').setValueState(sap.ui.core.ValueState.None);
					this.getView().byId('descriptionU').setValueState(sap.ui.core.ValueState.None);
					this.getView().byId('comboboxManagerU').setValueState(sap.ui.core.ValueState.None);
				var oModel = this.getView().getModel();
				//create your json object (based on the odata/cds!!)
				var oData = {
					ProjectId : parseInt(projectId, 10),
					Name: name,
					Description: desc,
					Company: company,
					Budget: parseFloat(budget).toFixed(2),
					StartDate: this.getODataDateFromDatePicker(startDate),
					EndDate: (endDate !== "" ? this.getODataDateFromDatePicker(endDate) : null),
					DeliverablesUrl: (trello !== "" ? trello : null),
					ManagerId: parseInt(manager, 10),
					Active: 1,
					Deleted: 0
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
					oModel.update("/ProjectSet("+projectId+")", oData, {
					  merge: true, //updates changed fields
					  success: function() { 
					  	sap.m.MessageToast.show('Your updates were successfully processed');
					  },
					  error: function(oError) {  }
					});
			}
		},
		_onIconPress: function(oEvent) {
			var userId = oEvent.getSource().getCustomData()[0].getProperty('value');
			var username =  oEvent.getSource().getCustomData()[1].getProperty('value');
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
			oPopover.setUserId(userId);
			oPopover.setName(username);
			oPopover.open(oSource);

		},
		_onDelete: function(oEvent) {
			var userId = oEvent.getSource().getCustomData()[0].getProperty('value');
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
			oPopover.setUserId(userId);
			oPopover.open(oSource);

		},
		archiveProject: function(oEvent) {
			var projectId = oEvent.getSource().getCustomData()[0].getProperty('value');
			console.log(projectId);
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
			oPopover.setProjectId(projectId);
			oPopover.open(oSource);

		},
		_onNavigateTrello: function(oEvent){
			var url = this.getView().byId("trelloUrl").getTooltip();
			window.open(url,"_blank");


		},
	
		OnExcelAssets: function(oEvt){
            var oModel = this.getView().byId("teamMembers").getModel();
            var oTab = this.getView().byId("teamMembers");
            var oBinding = oTab.getBinding("items");
            var oExport = new Export({
                exportType : new ExportTypeCSV({
                    separatorChar : ";"
                }),
                models : oModel,
                rows : {
                    path : "/TeamMemberSet",
                    filters: oBinding.aFilters
                },
                columns: [{
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
					name: "ProjectId",
					template: {
						content: "{ProjectId}"
					}
				}, {
					name: "Role",
					template: {
						content: "{Role}"
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

			var dropdown = new sap.m.ComboBox('comboboxManagers');

			
			  var itemTemplate = new sap.ui.core.ListItem({
			  text : "{Name}",
			  key :"{UserId}"
			  });
			
			dropdown.bindItems("/UserSet",itemTemplate);
		}
	});
}, /* bExport= */ true);
