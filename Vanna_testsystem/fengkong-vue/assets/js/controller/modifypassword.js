jQuery(document).ready(function() {
    Demo.init();
    Core.init();

    new Vue({
        el: '#app',
        data: {
            zhanghu:'',
            oldPassword:'',
            newPassword:'',
            renewPasswrod: ''
        },
        computed: {
            token: function() {
                return getCookie('token')
            }

        },
        components: {
           
        },
        created: function() {
            var self = this;
               if(!self.token) {
                   window.location.href = "./login.html" //取不到token跳转登录页
               }
        },
        mounted: function() {
            var self = this;
            self.getLoginInfo();
        },
        methods: {
            validate: function(){
                var self = this;
                var flag = false;
                for(var i = 0; i< 1; i++) {
                    if(self.oldPassword == '') {
                        alert('请输入原密码')
                        break;
                    }
                    if(self.newPassword == '') {
                        alert('请输入新密码')
                        break;
                    }
                    
                    if(self.renewPasswrod == '') {
                        alert('请输入确认密码')
                        break;
                    }
                    
                    if(self.newPassword !== self.renewPasswrod) {
                        alert('密码不一致，请重新输入')
                        break;
                    }                    
                    flag = true;
                }
                return flag
            },
            modifyPassword: function(){
                var self = this;
                if(!self.validate()) {
                    return false;
                }
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/client/modifyPwd",
                    data: {
                        token: self.token,
                        oldPwd: self.oldPassword,
                        newPwd: self.newPassword

                    }
                }).always(function(res) {
                    //假数据START
//                  res = {
//                      code: "",
//                      resultMassage: "",
//                      success: true
//                  }
                    //假数据END
                    // console.log(res.result)
                    if(!res.success) {
                        if(res.resultMessage !== '请求参数缺失') {
                            alert(res.resultMessage);
                        }
                    } else {
                        alert('操作成功')
                        self.oldPassword = '';
                        self.newPassword = '';
                        self.renewPasswrod = '';
                    }

                })   
            },
            getLoginInfo: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/client/getLoginInfo",
                    data: {
                        token: self.token,
                    }
                }).always(function(res) {
                    //假数据START
//                  res = {
//                      result: {
//                          clientId: 893038,
//                          account: '我是账号',
//                          favicon: '',
//                          realName: '',
//                          clientName: '',
//                          position: '',
//                          clientRole: {
//                              roleId: 393893,
//                              roleName: '交易员'
//                          },
//                          contact: '',
//                          email: '',
//                          teamId: 8003905308,
//                          team: '',
//                          createDte: '2017-1-1',
//                          enabled: 0,
//                      },
//                      code: "",
//                      resultMassage: "",
//                      success: true
//                  }
                    //假数据END
                    // console.log(res.result)
                    // self.clientPos.traderId = self.queryparam.traderId = res.result.clientId
                    self.zhanghu = res.result.clientId
                    console.log(zhanghu)

                })
            },


        }
    })
});