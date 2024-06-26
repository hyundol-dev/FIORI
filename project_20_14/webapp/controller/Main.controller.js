sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
    'sap/ui/core/Fragment',
    'sap/ui/model/Filter'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Fragment, Filter) {
        "use strict";

        return Controller.extend("project2014.controller.Main", {
            onInit: function () {
                var oData = {
                    "Memid" : "",
                    "Memnm" : "",
                    "Telno" : "",
                    "Email" : ""
                }
                // Input value 에다가 Binding 하기=> {data>/Productno}
                this.getView().setModel(new JSONModel(oData), "data")

            },
            // onRowSelectionChange
            onRowSelectionChange: function(oEvent) {
                // Row 선택 해제 되었을 때도, '선택'된 것이기 때문에 이벤트 발생
                // ∴ rowContext가 없을 땐 함수 종료하도록 함
                if(!oEvent.getParameter('rowContext'))
                return; // 함수 종료


                // Productno 가져오기
                var sPath = oEvent.getParameter('rowContext').getPath()

                // sPath에 있는 Productno(key값) 통해 전체 데이터 가져오기
                // 한 건의 model data-모델경로로 해당 경로의 전체 데이터 얻음
                var oSelectData = this.getView().getModel().getProperty(sPath);
                // "data" 모델 불러오기
                var oModel = this.getView().getModel("data");

                // 불러온 oSelectData를 oModel에 넣어줌!
                oModel.setData(oSelectData);
            },

            // 초기화 버튼 구현하기 (onReset)
            onReset: function() {
                this.getView().getModel("data").setData()
                ;
                
                /* this.getView().getModel("data").setData({
                    "Memid" : "",
                    "Memnm" : "",
                    "Telno" : "",
                    "Email" : "" })
                // 로도 작성 가능! */

                // Table 선택 값도 Clear
                this.byId("idTable").clearSelection();
                this.getView().getModel().refresh(true);
                // Model refresh!
            },
            // onEntitySet 함수 구현 (Read/GET)
            onEntitySet: function (oEvent) {
                // Model 불러오기
                // var oDataModel = this.getView().getModel();

                // Popover
                var oButton = oEvent.getSource(), // , 로 변수 2개 동시에 선언
				    oView = this.getView(); 

                // create popover
                if (!this._pPopover) { // controller의 _pPopover 변수값이 없으면
                    this._pPopover = Fragment.load({ 
                        id: oView.getId(),  // <-- 요거 없으면 sap.ui.getCore().byId('')
                        name: "project2014.view.fragment.Popover",
                        controller: this
                    }).then(function(oPopover) { // Fragment.load가 끝나면 실행
                        oPopover.setModel(new JSONModel(), 'popover');
                        oView.addDependent(oPopover); // oView에 oPopover 세팅하는 과정
                        return oPopover; 
                    });
                }
                this._pPopover.then(function(oPopover) {
                    oPopover.openBy(oButton);  // 한번 View에 Popover가 붙었으니깐 이를 보여주는 코드
                });

                // oDataModel.read("/Member", {
                //     success: function(oReturn) {
                //         console.log("전체조회: ", oReturn)
                //     },
                //     error: function(oError) {
                //         console.log("전체조회 중 오류 발생 ", oError)
                //     }
                // });
            },

            onRead: function() {
                // var oPopover = sap.ui.getCore().byId('idPopover');

                // Fragment.load() 사용 시,
                // view id를 같이 넘겨줬기 때문에 view 안에 popover가 붙게 됨
                // ∴ this.byId() 로 접근 가능
                var oPopover = this.byId("idPopover");
                var oPopoverModel = oPopover.getModel('popover').getData();
                // var oPopoverModel = oPopover.getModel('popover');
                // var oData = oPopoverModel.getData(); 로도 가능
                var oDataModel = this.getView().getModel();

                var oFilter = new Filter("Memnm", "Contains", oPopoverModel.Membername);
                
                oDataModel.read("/Member", {
                    urlParameters: {
                        "$expand" : "WorkSet",
                        "$select" : "Memid,WorkSet"
                    },
                    filters: [oFilter],
                    success: function(oReturn) {
                        // debugger;
                        console.log("전체조회: ", oReturn)
                    }
                });
            },

            // onEntity 함수 구현 (단 건 조회)
            onEntity: function() {
                // Input 불러오기 by 'data' 모델에 들어온 값 불러오기
                var oBody = this.getView().getModel('data').getData();
                var oDataModel = this.getView().getModel();
                //
                var sPath = oDataModel.createKey("/Member",{
                    Memid: oBody.Memid
                });
                oDataModel.read(sPath, {
                    success: function(oReturn) {
                        console.log("한 건 조회: ", oReturn)
                    }
                });
            },

            // onCreate 함수 구현 (Create/POST)
            onCreate: function() {
                var oDataModel = this.getView().getModel();
                var oJSONData = this.getView().getModel('data').getData();
                var oBody = {
                    "Memid" : oJSONData.Memid || "",
                    "Memnm" : oJSONData.Memnm || "",
                    "Telno" : oJSONData.Telno || "",
                    "Email" : oJSONData.Email || "",
                    // WorkSet : [
                    //     {}, {}, {}, ...
                    // ]

                };

                oDataModel.create("/Member", oBody, {
                    success: function() {
                        // sap.m.MessageBox.success("데이터 생성 완료");
                        // sap.m.MessageToast.show("데이터 생성 완료");

                        // 서버 요청 끝난 후 작업은 해당 함수 안에서 구현
                        // 해당 함수 안에서는 this가 달라지기 때문에,
                        // 이전에 사용하던 this를 그대로 넘겨주기 위해서
                        // .bind(this)를 적용시킴
                        this._showMessage("데이터 생성 완료");
                    }.bind(this),
                    error: function(oError) {
                        // sap.m.MessageBox.error("에러 발생");
                        this._showMessage("에러 발생");
                    }.bind(this)
                });
            },

            // MessageBox 모듈/함수화
            _showMessage: function(msg) {
                sap.m.MessageToast.show(msg);
            },

            // onUpdate 함수 구현 (PUT)
            onUpdate: function() {
                // Input 불러오기 by 'data' 모델에 들어온 값 getData
                var oBody = this.getView().getModel('data').getData();
                var oDataModel = this.getView().getModel();
                var sPath = oDataModel.createKey("/Member",{
                    Memid: oBody.Memid
                });

                oDataModel.update(sPath, oBody, {
                    success: function() {
                        sap.m.MessageBox.success("Data Update Complete");
                    }
                })
            },

            // onDelete 함수 구현 (DELETE)
            onDelete: function() {
                var oBody = this.getView().getModel('data').getData();
                var oDataModel = this.getView().getModel();
                var sPath = oDataModel.createKey("/Member", {
                    Memid: oBody.Memid
                });

                oDataModel.remove(sPath, {
                    success: function() {
                        sap.m.MessageBox.success("Data delete Complete")
                    },
                    error: function(oError) {
                        sap.m.MessageBox.error("Error: Unable to remove Data")
                    }
                })
            }


        });
    });
