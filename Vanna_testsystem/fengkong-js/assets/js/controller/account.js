jQuery(document).ready(function() {
    "use strict";
    // Init Demo JS
    Demo.init();
    // Init Theme Core
    Core.init();
    demoHighCharts.init();


    var ChildOperationButton = {
        props: ['account', 'token'],
        data: function() {
            return {
                classObject: {}
            }
        },
        computed: {
            pageindex: function() {

                return tmp;
            }
        },
        template: ['<div class="btn-group">' +
            '<button type="button" data-toggle="dropdown" aria-expanded="false" class="btn btn-success br2 btn-xs fs12 dropdown-toggle">操作<span class="caret ml15"></span></button>' +
            '<ul role="menu" class="dropdown-menu">' +
            '<li>' +
            '<a>编辑</a>' +
            '</li>' +
            '<li>' +
            '<a @click="delHandler">删除</a>' +
            '</li>' +
            '</ul>' +
            '</div>'
        ].join(''),

        methods: {
            delHandler: function(e) {
                var self = this;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/client/updStatus",
                    data: {
                        token: self.token,
                        clientId: self.account.clientId,
                        enabled: 1

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
                    self.$emit('regetaccoutlist')

                });
            }
        }
    }

    new Vue({
        el: '#app',
        data: {
            account: {
                account: '',
                password: '',
                realName: '',
                roleId: '',
                teamId: '',
                position: '',
                contact: '',
                email: ''
            },
            clientList: [],
            roleList:[],
            teamList:[]
        },
        computed: {
            token: function() {
                return getCookie('token')
            }
        },
        components: {
            // 'date-picker': ChildDatePicker,
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
            self.getRoleList();
            self.getTeamList();
            self.queryClientList();

        },
        methods: {
            datechanged: function(dateTxt, labelId) {
                var transforedDataTxt = '';
                var tmp = dateTxt.split('/');
                transforedDataTxt = tmp[2]+ tmp[0] + tmp[1];
                var self = this;
                if (labelId == 'date1') {
                    self.queryparam.startDate = transforedDataTxt;
                } else if (labelId == 'date2') {
                    self.queryparam.endDate = transforedDataTxt;
                }
            },

            saveAccount: function() {
                var self = this;
                    alert('hi')
                // if (self.clientPos.assetClass == '交易品种') {
                //     alert('请选择交易品种')
                //     return;
                // }
                // if (self.clientPos.posnType == '仓位类型') {
                //     alert('请选择仓位类型')
                //     return;
                // }

                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/client/save",
                    data: {
                        token: self.token,
                        account: self.account.account,
                        password: self.account.password,
                        realName: self.account.realName,
                        roleId: self.account.roleId,
                        teamId: self.account.teamId,
                        position: self.account.position,
                        contact: self.account.contact,
                        email: self.account.email
                    }
                }).always(function(res) {
                    //假数据START
                    //假数据END
                    // console.log(res.result)
                    if(!res.success) {
                        alert(res.resultMessage);
                    }
                    self.queryClientList();
                });
            },
            getTeamList: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/client/listTeam",
                    data: {
                        token: self.token
                    }
                }).always(function(res) {
                    //假数据START
//                  res = {
//                      "result":[{
//                          teamId: 133,
//                          teamName: '小组A'
//                      },{
//                          teamId: 22,
//                          teamName: '小组B'
//                      },{
//                          teamId: 33,
//                          teamName: '小组C'
//                      },],
//                      "code":"",
//                      "resultMassage":"",
//                      "success":true
//                  }
                    //假数据END
                    console.log(res.result)
                    var result = res.result;
                    result.unshift({
                            teamId: '',
                            teamName: '请选择小组'
                        });
                    self.teamList = result;
                });
            },            
            getRoleList: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/client/listRole",
                    data: {
                        token: self.token
                    }
                }).always(function(res) {
                    //假数据START
//                  res = {
//                      "result":[{
//                          roleId: 133,
//                          roleName: '小组长'
//                      },{
//                          roleId: 22,
//                          roleName: '交易员'
//                      },{
//                          roleId: 33,
//                          roleName: '其他'
//                      },],
//                      "code":"",
//                      "resultMassage":"",
//                      "success":true
//                  }
                    //假数据END
                    console.log(res.result)
                    var result = res.result;
                    result.unshift({
                            roleId: '',
                            roleName: '请选择角色'
                        });
                    self.roleList = result;
                });
            },
            queryClientList: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/client/list",
                    data: {
                        token: self.token,
                    }
                }).always(function(res) {


                    //假数据START
//                  res = {
//                      result: [{
//                          clientId: 123,
//                          account: 'Otto',
//                          realName: 'Mark',
//                          clientName: '公司名称',
//                          position: '职位',
//                          clientRole: {
//                                 roleId: 2343,
//                                  roleName: '小组长'
//                          },
//                          contact: '12246998',
//                          email: 'zxy(93823@cc.com',
//                          teamId: 13364,
//                          team: null,
//                          createDte: '20171210',
//                          enabled: ''
//                      }, {
//                          clientId: 123,
//                          account: 'Otto',
//                          realName: 'Mark',
//                          clientName: '公司名称',
//                          position: '职位',
//                          clientRole: {
//                                 roleId: 2343,
//                                  roleName: '小组长'
//                          },
//                          contact: '12246998',
//                          email: 'zxy(93823@cc.com',
//                          teamId: 13364,
//                          team: {
//                                  teamId: 133,
//                                  teamName:'小组名称'
//                          },
//                          createDte: '20171210',
//                          enabled: ''
//                      },{
//                          clientId: 123,
//                          account: 'Otto',
//                          realName: 'Mark',
//                          clientName: '公司名称',
//                          position: '职位',
//                          clientRole: {
//                                 roleId: 2343,
//                                  roleName: '小组长'
//                          },
//                          contact: '12246998',
//                          email: 'zxy(93823@cc.com',
//                          teamId: 13364,
//                          team: {
//                                  teamId: 133,
//                                  teamName:'小组名称'
//                          },
//                          createDte: '20171210',
//                          enabled: ''
//                      },{
//                          clientId: 123,
//                          account: 'Otto',
//                          realName: 'Mark',
//                          clientName: '公司名称',
//                          position: '职位',
//                          clientRole: {
//                                 roleId: 2343,
//                                  roleName: '小组长'
//                          },
//                          contact: '12246998',
//                          email: 'zxy(93823@cc.com',
//                          teamId: 13364,
//                          team: {
//                                  teamId: 133,
//                                  teamName:'小组名称'
//                          },
//                          createDte: '20171210',
//                          enabled: ''
//                      },{
//                          clientId: 123,
//                          account: 'Otto',
//                          realName: 'Mark',
//                          clientName: '公司名称',
//                          position: '职位',
//                          clientRole: {
//                                 roleId: 2343,
//                                  roleName: '小组长'
//                          },
//                          contact: '12246998',
//                          email: 'zxy(93823@cc.com',
//                          teamId: 13364,
//                          team: {
//                                  teamId: 133,
//                                  teamName:'小组名称'
//                          },
//                          createDte: '20171210',
//                          enabled: ''
//                      }],
//                      code: "",
//                      resultMassage: "",
//                      success: true
//                  }

                    //假数据END
                    // console.log(res.result)
                    self.clientList = res.result;
                });
            }

        }
    })

});