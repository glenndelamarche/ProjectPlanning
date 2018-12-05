function initModel() {
	var sUrl = "/SAPGateway/sap/opu/odata/SAP/YXM138_FLEXSO_SRV_02/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}