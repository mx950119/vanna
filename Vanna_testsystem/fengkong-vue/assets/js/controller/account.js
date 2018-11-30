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
            '<a @click="editHandler">编辑</a>' +
            '</li>' +
            '<li>' +
            '<a @click="delHandler">{{account.enabled == 0 ? "删除" : "删除"}}</a>' +
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
                        enabled: self.account.enabled == 0 ? 1 : 0

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
            },            
            editHandler: function(e) {
                var self = this;
            var self = this;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/client/findById",
                    data: {
                        token: self.token,
                        clientId: self.account.clientId
                    }
                }).always(function(res) {

                    //假数据START
                    

                    //假数据END
                    
                    console.log(res.result)
                    self.$emit('update', res.result)
                    // self.clientList = res.result;
                });

                
            },
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
                email: '',
                repassword: ''
            },
            curClientId: '',
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
                  if(!self.token) {
                      window.location.href = "./login.html" //取不到token跳转登录页
                  }
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
            validate: function(status){
                var self = this;
                var flag = false;
                    for(var i = 0; i< 1; i++) {
                        if(self.account.realName == '') {
                            alert('请填写姓名')
                            break;
                        }
                        if(self.account.account == '') {
                            alert('请填写账号')
                            break;
                        }
                        
                        if(self.account.roleId == '') {
                            alert('请选择角色')
                            break;
                        }
                        
                        if(self.account.password == '') {
                            alert('请输入密码')
                            break;
                        }
                        if(self.account.repassword == '') {
                            alert('请再次输入密码')
                            break;
                        }
                        if(self.account.password !== self.account.repassword) {
                            alert('密码不一致，请重新输入')
                            break;
                        }
                        if(status !== 'update') {
                           if(self.clientList.length >= 10) {
                                alert('最多只能分配10个账号')
                                break;
                            } 
                        }
                        
                        flag = true;
                    }
                    return flag
                    
            },
            saveAccount: function() {
                var self = this;
                if(!self.validate()){
                    return false;
                }
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
                    } else {
                        alert('保存成功')
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
                    

                    //假数据END
                    // console.log(res.result)
                    self.clientList = res.result;
                });
            },
            renderClient: function(res) {
                var self = this;
                self.account.realName = res.realName;
                self.account.roleId = res.clientRole.roleId;
                self.account.teamId = res.teamId;
                self.account.account = res.account;
                self.curClientId = res.clientId
    
            },
            updateAccount: function() {
                var self = this;
                if(!self.validate('update')){
                    return false;
                }
                 $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/client/update",
                    data: {
                        token: self.token,
                        clientId:self.curClientId,
                        account: self.account.account,
                        realName: self.account.realName,
                        roleId: self.account.roleId,
                        position: self.account.position,
                        contact: self.account.contact,
                        email:self.account.email


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
                    self.curClientId = '';
                    self.queryClientList();
					self.account.realName = '';
					self.account.roleId ='';
					self.account.password = '';
					self.account.repassword ='';
					self.account.account = '';
					self.account.teamId ='';
                });
            },

        }
    })

});