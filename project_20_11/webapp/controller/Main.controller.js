sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("project2011.controller.Main", {
            onInit: function () {
                // var oData = {
                //     chartDataset : [
                //         { year : '2020', priceSum : '1000' },
                //         { year : '2021', priceSum : '2000' },
                //         { year : '2022', priceSum : '1200' },
                //         { year : '2023', priceSum : '2500' },
                //     ]
                // }

                // this.getView().setModel(new JSONModel(oData), 'chart');
                
            }
        });
    });
