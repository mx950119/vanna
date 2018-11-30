jQuery(document).ready(function() {
    Demo.init();
    Core.init();
    $(".panel-toggle").click(function() {
        var obj = $(this).next().next();
        if (obj.is(":hidden")) {
            $(".sub-ul").hide();
            obj.show();
            $(this).children("span").removeClass("fa-plus-square-o");
            $(this).children("span").addClass("fa-minus-square-o");
        } else {
            obj.hide();
            $(this).children("span").addClass("fa-plus-square-o");
            $(this).children("span").removeClass("fa-minus-square-o");
        }
    });

    var ChildOperationButton = {
        props: ['threhold'],
        template: ['<div class="btn-group text-right">' +
            '<button type="button" data-toggle="dropdown" aria-expanded="false" class="btn btn-info br2 btn-xs fs12 dropdown-toggle">操作<span class="caret ml15"></span></button>' +
            '<ul role="menu" class="dropdown-menu">' +
            '<li @click="modifyHandler"><a href="#">修改</a></li>' +
            '<li @click="delHandler"><a href="#">删除</a></li>' +
            '</ul>' +
            '</div>'
        ].join(''),
        methods: {
            delHandler: function(e) {
                var self = this;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/client/updThreshold",
                    data: {
                        token: self.token,
                    }
                }).always(function(res) {
                    //假数据START
                    // res = {
                    //     "code":"",
                    //     "resultMassage":"",
                    //     "success":true
                    // }
                    //假数据END
                    console.log(res.result)
                });
            },
            modifyHandler: function(e) {
                var self = this;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.189:8080/risk-control/api/client/updThreshold",
                    data: {
                        token: self.token,
                        thresholdId: self.threhold.thresholdId,
                        clientName: self.threhold.clientName,
                        varThreshold: self.threhold.varThreshold,
                        varPercentum: self.threhold.varPercentum,
                        esThreshold: self.threhold.esThreshold,
                        esPercentum: self.threhold.esPercentum,
                        teamId: self.threhold.teamId,
                        traderId: self.threhold.traderId

                    }
                }).always(function(res) {
                    //假数据START
                    //假数据END
                    // console.log(res.result)
                });
            }
        }
    }

    new Vue({
        el: '#app',
        data: {
            teamList: [],
            traderList: [{
                clientId: '',
                realName: '请选择交易员'
            }],
            thresholdList: [],
            teamIdSelected: '',
            traderIdSelected: '',
            varThreshold: '', 
            varPercentum: '',
            esThreshold: '', 
            esPercentum: '',
        },
        computed: {
            token: function() {
                return getCookie('token')
            }
        },
        components: {
            'operation-btn': ChildOperationButton
        },
        created: function() {
            var self = this;
            // if(!self.token) {
            //     window.location.href = "./login.html" //取不到token跳转登录页
            // }
        },
        mounted: function() {
            var self = this;

            self.getLoginInfo();
            self.getListTeam();
            self.getThreshold();

        },
        methods: {
            saveThreshold: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/client/saveThreshold",
                    data: {
                        token: self.token,
                        teamId: self.teamIdSelected,
                        traderId: self.traderIdSelected,
                        varThreshold: self.varThreshold, 
                        varPercentum: self.varPercentum,
                        esThreshold: self.esThreshold, 
                        esPercentum: self.esPercentum,
                    }
                }).always(function(res) {
                    //假数据START
                    //假数据END
                    // console.log(res.result)
                });
            },
            getThreshold: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/client/getThreshold",
                    data: {
                        token: self.token
                    }
                }).always(function(res) {
                //假数据START
                // res = {
                //     result: [{
                //         thresholdId: 39308,
                //         clientName: '公司名称a',
                //         teamId: '小组id',
                //         traderId: '',
                //         varThreshold: 83893,
                //         varPercentum: 0.23,
                //         esThreshold: 383,
                //         esPercentum: 0.49
                //     }, {
                //         thresholdId: 39308,
                //         clientName: '公司名称a',
                //         teamId: '小组id',
                //         traderId: '',
                //         varThreshold: 83893,
                //         varPercentum: 0.23,
                //         esThreshold: 383,
                //         esPercentum: 0.49
                //     }, {
                //         thresholdId: 39308,
                //         clientName: '公司名称a',
                //         teamId: '小组id',
                //         traderId: '',
                //         varThreshold: 83893,
                //         varPercentum: 0.23,
                //         esThreshold: 383,
                //         esPercentum: 0.49
                //     }, {
                //         thresholdId: 39308,
                //         clientName: '公司名称a',
                //         teamId: '小组id',
                //         traderId: '',
                //         varThreshold: 83893,
                //         varPercentum: 0.23,
                //         esThreshold: 383,
                //         esPercentum: 0.49
                //     }],
                //     code: "",
                //     resultMassage: "",
                //     success: true
                // }
                //假数据END
                // console.log(res.result)
                self.thresholdList = res.result;
                });
            },
            getListTeam: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/client/listTeam",
                    data: {
                        token: self.token,
                    }
                }).always(function(res) {
                //假数据START
                // res = {
                //     result: [{
                //         teamId: 11,
                //         teamName: 'A组'
                //     }, {
                //         teamId: 113,
                //         teamName: 'B组'
                //     }, {
                //         teamId: 114,
                //         teamName: 'C组'
                //     }],
                //     code: "",
                //     resultMassage: "",
                //     success: true
                // }
                //假数据END
                self.teamList = [{
                    teamId: '',
                    teamName: '请选择小组'
                }].concat(res.result);
                // console.log(self.teamList)


                });
            },
            getListTrader: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/client/listTrader",
                    data: {
                        token: self.token,
                        teamId: self.teamIdSelected
                    }
                }).always(function(res) {
                //假数据START
                // res = {
                //     result: [{
                //         clientId: 112,
                //         realName: '张三'
                //     }, {
                //         clientId: 11,
                //         realName: '李四'
                //     }, {
                //         clientId: 11,
                //         realName: '王五'
                //     }, {
                //         clientId: 11,
                //         realName: '哈哈'
                //     }],
                //     code: "",
                //     resultMassage: "",
                //     success: true
                // }
                //假数据END

                self.traderList = [{
                    clientId: '',
                    realName: '请选择交易员'
                }].concat(res.result);
                console.log(self.traderList)

                });
            },
            getLoginInfo: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/client/getLoginInfo",
                    data: {
                        token: self.token,
                    }
                }).success(function(res) {
                    //假数据START
                    // res = {
                    //     result: {
                    //         clientId: 893038,
                    //         account: '',
                    //         favicon: '',
                    //         realName: '',
                    //         clientName: '',
                    //         position: '',
                    //         clientRole: {
                    //             roleId: 393893,
                    //             roleName: '交易员'
                    //         },
                    //         contact: '',
                    //         email: '',
                    //         teamId: 8003905308,
                    //         team: '',
                    //         createDte: '2017-1-1',
                    //         enabled: 0,
                    //     },
                    //     code: "",
                    //     resultMassage: "",
                    //     success: true
                    // }
                    //假数据END
                    // console.log(res.result)
                    self.teamId = res.result.teamId;
                    self.traderId = res.result.clientRole.roleId;
                }).error(function(res) {
                    //假数据END
                    alert('获取登陆者信息失败')
                });
            },
        }
    })
});