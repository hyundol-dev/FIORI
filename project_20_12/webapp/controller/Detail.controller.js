sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("sync.project2012.controller.Detail", {
            // 초기화 함수 onInit은 해당 Controller가 로드될 때 한번만 실행
            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter()
                // RouteDetail에 대해 pattern(=URL)이 일치할 때 마다 
                // _onPatternMatched라는 함수를 실행시키겠다.
                this.oRouter.getRoute("RouteDetail").attachPatternMatched(this._onPatternMatched, this);
            },
            // PatternMatched 이벤트는 URL 일치 "할때마다" 실행
            _onPatternMatched: function(oEvent) {
                // RouterDetail 라우트 객체의 Pattern(=URL)이 일치할 때 마다 
                // 해당 이벤트가 실행됨
                var oArgu= oEvent.getParameters().arguments;

                // { key 1 : 'okok', key2 : '123' }
                console.log("Detail : ", oArgu); 
                // oArgu.key1 / oArgu['key1'] 통해서도 원하는 키 값 얻을 수 있음
                 
            },
            // Detail에서 Main으로 뒤로가기
            onNavBack: function() {
                // URL parameter로 넘기는 데이터가 많으면
                // JSONModel 과 같은 모델을 사용하는게 좋음.
                // ∵ URL에 길이 제한 존재하기 때문.
                this.oRouter.navTo('RouteMain', {
                    'query' : {
                        tab : 'okok',
                        test : 10
                    }
                });
            }
        });
    });
