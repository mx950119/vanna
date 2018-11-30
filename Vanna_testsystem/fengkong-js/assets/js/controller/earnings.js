$(document).ready(function() {
    "use strict";
    // Init Demo JS
    Demo.init();
    // Init Theme Core
    Core.init();
    $(window).trigger('resize');

    //渲染左侧列表
    new Vue({
        el: '#app',
        data: {
            tradersRaw: [],
            curTeamId: '',
            curTeamName: '',
            curTraderId: '',
            curFavicon: '',
            curRealName: '',
            generalResult: {},
            generalRisk: {},
            riskThreshold: '',
            ecommerceData1: [],
            ecommerceData2: [],
            varParam: 'var',
            dayParam: '1D',
            perParam: '95',
            isShowTraderList: false
            // dateTag: ''
        },
        computed: {
            traders: function() {
                var tmp = [];
                $.each(this.tradersRaw, function(k, v) {
                    tmp.push({
                        teamName: v.teamName,
                        clientRole: '',
                        realName: '',
                        className: 'group_a',
                        teamId: v.teamId,
                        clientId: '',
                        favicon: ''
                    })
                    $.each(v.listClient, function(kk, vv) {
                        tmp.push({
                            teamName: vv.teamName,
                            clientRole: vv.clientRole,
                            realName: vv.realName,
                            className: '',
                            teamId: vv.teamId,
                            clientId: vv.clientId,
                            favicon: vv.favicon
                        })
                    })
                })
                return tmp;
            },
            token: function() {
                   return getCookie('token')
//              return '123'
            }
        },
        created: function(){
            var self = this;
            if(!self.token) {
                window.location.href = "./login.html" //取不到token跳转登录页
            }
        },
        mounted: function() {
            var self = this;
            // self.dateTag = self.getNowFormatDate(new Date());
            self.getLoginInfo();
            $.ajax({
                method: "POST",
                   url: "http://192.168.0.192:8080/risk-control/api/earning/listTrader",
//              url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/earning/listTrader ",
                data: {
                    token: self.token
                }
            }).always(function(res) {
                // console.log(res.result)
                //假数据START
//              res = {
//                  result: null,
//                     result: [{
//                         teamId: 384394893,
//                         teamName: "A组",
//                         listClient: [{
//                             clientId: 1,
//                             favicon: './assets/img/avatars/1.jpg',
//                             realName: "丽娜",
//                             clientRole: {
//                              creatorId: null,
//                              opdate: 1505788035000,
//                              roleId: 4,
//                              roleName: '交易员'
//                             },
//                             teamId: 384394893,
//                             teamName: "A组",
//                             contact: "18649630577"
//                         }, {
//                             clientId: 2,
//                             favicon: './assets/img/avatars/2.jpg',
//                             realName: "王鹏",
//                             clientRole: {
//                              creatorId: null,
//                              opdate: 1505788035000,
//                              roleId: 4,
//                              roleName: '交易员'
//                             },
//                             teamId: 384394893,
//                             teamName: "A组",
//                             contact: "18649630577"
//                         }]
//                     }, {
//                         teamId: 333,
//                         teamName: "B组",
//                         listClient: [{
//                             clientId: 3,
//                             favicon: './assets/img/avatars/3.jpg',
//                             realName: "李泰民",
//                             clientRole: {
//                              creatorId: null,
//                              opdate: 1505788035000,
//                              roleId: 4,
//                              roleName: '小组长'
//                             },
//                             teamId: 333,
//                             teamName: "B组",
//                             contact: "18649630577"
//                         }, {
//                             clientId: 4,
//                             favicon: './assets/img/avatars/4.jpg',
//                             realName: "张莉莉",
//                             clientRole: {
//                              creatorId: null,
//                              opdate: 1505788035000,
//                              roleId: 4,
//                              roleName: '交易员'
//                             },
//                             teamId: 333,
//                             teamName: "B组",
//                             contact: "18649630577"
//                         }]
//                     }],
//                     code: "",
//                     resultMassage: "",
//                     success: true
//                 }
                //假数据END
                if(res.success && res.result) {
                  self.tradersRaw = res.result;
                  self.isShowTraderList = true;
                } 
               
               
                
            });
        },
        methods: {
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
//                          account: '',
//                          favicon: '',
//                          realName: 'xx',
//                          clientName: '',
//                          position: '',
//                          clientRole: {
//                              roleId: 393893,
//                              roleName: '交易员'
//                          },
//                          contact: '',
//                          email: '',
//                          team: null,
//                          teamId: 8003905308,
//                          // team: {
//                          //   teamId: 133,
//                          //   teamName: 'A组'
//                          // },
//                          createDte: '2017-1-1',
//                          enabled: 0,
//                      },
//                      code: "",
//                      resultMassage: "",
//                      success: true
//                  }
                    //假数据END
                    // console.log(res.result)
                    self.curTeamId = res.result.teamId;
                    self.curTeamName = res.result.team && res.result.team.teamName;
                    self.curTraderId = res.result.clientId;
                    self.curFavicon = res.result.favicon;
                    self.curRealName = res.result.realName;
                   
                    self.getPnlAndGeneral();
                    self.getVarOrEsReport()
                    self.getYtdPnlReport();
                })
            },
            dayoptionschanged: function(value) {
                this.dayParam = value;
                this.getVarOrEsReport()
            },
            peroptionschanged: function(value) {
                this.perParam = value;
                this.getVarOrEsReport()
            },
            varoptionschanged: function(value) {
                this.varParam = value;
                this.getVarOrEs();
                this.getVarOrEsReport();
            },
            getVarOrEs: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                       url: "http://192.168.0.192:8080/risk-control/api/earning/getVarOrEs",
//                  url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/earning/getVarOrEs",
                    data: {
                        token: self.token,
                        teamId: self.curTeamId,
                        traderId: self.curTraderId,
                        type: self.varParam,
                        day: self.dayParam,
                        per: self.perParam
                    }
                }).always(function(res) {
                    //假数据START
                    // res = {
                    //        result: {
                    //            value: '234',
                    //            riskThreshold: '3333',
                    //            percentum: "10.07"
                    //        },
                    //        code: "",
                    //        resultMassage: "",
                    //        success: true
                    //    }
                    //假数据END
                    // console.log(res.result)
                    self.generalRisk = res.result;
                    self.riskThreshold = res.result['riskThreshold'];
                });
            },
            getPnlAndGeneral: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                       url: "http://192.168.0.192:8080/risk-control/api/earning/getPnlAndGeneral",
//                  url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/earning/getPnlAndGeneral",
                    data: {
                        token: self.token,
                        teamId: self.curTeamId,
                        traderId: self.curTraderId

                    }
                }).always(function(res) {
                    //假数据START
                    // res = {
                    //        result: {
                    //            date: '2016-07-20',
                    //            netAsset: '313,000',
                    //            dailyPnl: '65.346',
                    //            ytdPnl: '27321.213',
                    //            riskThreshold: '4444.88',
                    //            percentum: 9999,
                    //            Var95per1day: 'xxx',
                    //            maxDd: '13.274',
                    //            currDd: '19.962',
                    //            histHigh: '1.925',
                    //            annVol: '529 479',
                    //            sharpe: '22.274',
                    //            wlPatio: 'xx', //盈亏天数比
                    //            pi: 'xx',
                    //            avgProfit: '1.976',
                    //            avgLoss: '529 000'
                    //        },
                    //        code: "",
                    //        resultMassage: "",
                    //        success: true
                    //    }
                    //假数据END
                    // console.log(res.result)
                    self.generalResult = res.result;
                    self.riskThreshold = res.result['riskThreshold'];
                });
            },
            getVarOrEsReport: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                       url: "http://192.168.0.192:8080/risk-control/api/earning/listResultReport",
//                  url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/earning/listResultReport",
                    data: {
                        token: self.token,
                        teamId: self.curTeamId,
                        traderId: self.curTraderId,
                        type: self.varParam,
                        day: self.dayParam,
                        per: self.perParam
                    }
                }).always(function(res) {
                    //假数据START
                    Date.prototype.format = function(format) {
                           if (!format) {
                               format = this.fullPattern || "yyyy-MM-dd HH:mm:ss";
                           }

                           var o = {
                               "M+": this.getMonth() + 1, // month
                               "d+": this.getDate(), // day
                               "H+": this.getHours(), // hour (24)
                               "h+": this.getHours() % 12, // hour (12)
                               "m+": this.getMinutes(), // minute
                               "s+": this.getSeconds(), // second
                               "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
                               "S": this.getMilliseconds()
                           };

                           if (/(y+)/.test(format)) {
                               format = format.replace(RegExp.$1, (this.getFullYear() + "")
                                   .substr(4 - RegExp.$1.length));
                           }

                           for (var k in o) {
                               if (new RegExp("(" + k + ")").test(format)) {
                                   format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                               }
                           }

                           return format;
                       };
                       var d = new Date();
                       var r = Array.apply(null, new Array(1096))
                           .map((v, i) => {
                               d.setDate(d.getDate() + i);
                               return d.format("yyyyMMdd");
                           });
                       console.log(r)

                       var datesArray = [];
                       datesArray = r;
                       res = {
                           result: {
                               // dates: [1504195200000, 1504281600000,1504368000000,1504454400000],//时间戳*1000
                               dates: ["20170828","20170829"], //时间戳*1000
                               // dailyPnls: [20,30,40,20],
                               values: [
                                   "0","0"
                               ]
                           },
                           code: "",
                           resultMassage: "",
                           success: true
                       }
                    //假数据END
                    // console.log(res.result)
                    self.ecommerceData1 = res.result;
                    highChartsEcommerce1(self.ecommerceData1)
                });
            },
            getYtdPnlReport: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                       url: "http://192.168.0.192:8080/risk-control/api/earning/listYtdPnlReport",
//                  url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/earning/listYtdPnlReport",
                    data: {
                        token: self.token,
                        teamId: self.curTeamId,
                        traderId: self.curTraderId,
                    }
                }).always(function(res) {
                    //假数据START
                    
//                     res = {
//                         result: {
//                             dates: [
//                             "20170828",
//                             "20170829",
//                             "20170911",
//                             "20170912",
//                             "20170913",
//                             "20170914",
//                             "20170915",
//                             "20170916",
//                             "20171009",
//                             ], //时间戳*1000
//                             values: [
//                                 "46.00", "-184.00","23.00", "23.00", "23.00", "23.00", "23.00","7116.00","46426.00"
//                             ]
//                         },
//                         code: "",
//                         resultMassage: "",
//                         success: true
//                     }
                    //假数据END
                    // console.log(res.result)
                    self.ecommerceData2 = res.result;
                    highChartsEcommerce2(self.ecommerceData2);
                    highChartsEcommerce2(self.ecommerceData2);
                });
            },
            switchclient: function(e) {
                var self = this;
                var dataclientid = $(e.target).closest('li').attr('data-clientid');
                var datateamid = $(e.target).closest('li').attr('data-teamid');
                var datateamname = $(e.target).closest('li').attr('data-teamname');
                var datafavicon = $(e.target).closest('li').attr('data-favicon');
                var datarealname = $(e.target).closest('li').attr('data-realname');
                if (dataclientid) {
                    self.curTraderId = dataclientid;
                    self.curTeamId = datateamid;
                    self.curTeamName = datateamname;
                    self.curFavicon = datafavicon;
                    self.curRealName = datarealname;
                    self.varParam = 'var';
                    self.dayParam = '1D';
                    self.perParam = '95';
                    self.getPnlAndGeneral();
                    self.getVarOrEsReport()
                    self.getYtdPnlReport();
                }
            },
            getNowFormatDate: function(date) {

                var seperator1 = "-";
                var seperator2 = ":";
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
                return currentdate;
            }
        }
    })

    function highChartsEcommerce1(data) {
        var ecommerce1Data = [];
        $.each(data.dates, function(k, v) {
            var t = new Date(v.substring(0, 4) + '/' + v.substring(4, 6) + '/' + v.substring(6, 8));
            var timestamp = t.getTime();
            // var timestamp = v;
            ecommerce1Data.push([timestamp, parseFloat(data.values[k])])

        })
        console.log(ecommerce1Data)

        var ecomChart = $('#ecommerce_chart1');
        if (ecomChart.length) {
            ecomChart.highcharts({
                chart: {
                    type: 'areaspline',
                    marginTop: 30,
                    backgroundColor: 'transparent',
                },
                credits: {
                    enabled: false
                },

                title: {
                    text: ''
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    gridLineColor: '#f0f2f6',
                    gridLineWidth: 2,
                    labels: {
                        formatter: function() {
                            return this.value;
                        },
                        style: {
                            color: '#d1d4da',
                            "textTransform": "uppercase",
                            "fontSize": "12px",
                            "letterSpacing": 0.02
                        }
                    }
                },
                xAxis: {
                    type: 'datetime',
                    lineWidth: 0,
                    tickWidth: 0,
                    labels: {
                        formatter: function() {
                            return Highcharts.dateFormat('%Y/%m/%d', this.value);
                        }
                    },

                },
                tooltip: {
                    pointFormat: '{series.name} <b>${point.y}</b>'
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    areaspline: {
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        marker: {
                            enabled: false
                        },
                        pointInterval: 86400000, // one day
                        pointStart: Date.UTC(2017, 1, 1, 0, 0, 0)
                    }
                },
                series: [{
                    name: '日收益',
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0.0, '#5ddcff'],
                            [0.5, '#5ddcff'],
                            [1.0, '#5cbbe3']
                        ]
                    },
                    data: ecommerce1Data
                }],
                navigation: {
                    menuItemStyle: {
                        fontSize: '10px'
                    }
                }
            });
        }

    }

    function highChartsEcommerce2(data) {
        var ecommerce2Data = [];
        $.each(data.dates, function(k, v) {
            var t = new Date(v.substring(0, 4) + '/' + v.substring(4, 6) + '/' + v.substring(6, 8));
            var timestamp = t.getTime();
            ecommerce2Data.push([timestamp, parseFloat(data.values[k])])
        })
        console.log(ecommerce2Data)

        var ecomChart2 = $('#ecommerce_chart2');
        if (ecomChart2.length) {
            ecomChart2.highcharts({
                chart: {
                    zoomType: 'x',
                    backgroundColor: 'transparent',
                },
                credits: false,
                title: {
                    text: ''
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    gridLineColor: '#f0f2f6',
                    gridLineWidth: 2,
                    labels: {
                        formatter: function() {
                            return this.value;
                        },
                        style: {
                            color: '#d1d4da',
                            "textTransform": "uppercase",
                            "fontSize": "12px",
                            "letterSpacing": 0.02
                        }
                    }
                },
                xAxis: {
                    type: 'datetime',
                    tickWidth: 0,
                    lineWidth: 0,
                    labels: {
                        formatter: function() {
                            return Highcharts.dateFormat('%Y/%m/%d', this.value);
                        }
                    }
                },
                tooltip: {
                    pointFormat: '{series.name} <b>${point.y}</b>'
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, 'rgba(67, 199, 215, .7)'],
                                [0.5, 'rgba(67, 199, 215, .3)'],
                                [1, 'rgba(67, 199, 215, 0)']
                            ]
                        },
                        marker: {
                            radius: 6,
                            lineWidth: 4,
                            lineColor: '#fff'
                        },
                        lineWidth: 3,
                        // pointInterval: 86400000, // one day
                        // pointStart: Date.UTC(2017, 3, 5, 0, 0, 0)
                    }
                },
                series: [{
                    type: 'area',
                    name: '年收益',
                    data: ecommerce2Data,
                    color: '#43c7d7',
                }]
            });
        }
    }

});