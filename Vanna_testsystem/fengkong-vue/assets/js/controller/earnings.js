$(document).ready(function() {
    window.alert=function(){};
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
//          self.getLoginInfo();
            $.ajax({
                method: "POST",
                   url: "http://192.168.0.192:8080/risk-control/api/earning/listTrader",
//              url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/earning/listTrader ",
                data: {
                    token: self.token
                }
            }).always(function(res) {
                
                if(res.success && res.result) {
                  self.tradersRaw = res.result;
                  self.isShowTraderList = true;
                }                                               
            });
            self.getPnlAndGeneral();
            self.getVarOrEsReport();
            self.getYtdPnlReport();
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
                   
                    self.curTeamId = res.result.teamId;
                    self.curTeamName = res.result.team && res.result.team.teamName;
                    self.curTraderId = res.result.clientId;
                    self.curFavicon = "/risk-control" + res.result.favicon;
                    self.curRealName = res.result.realName;
                    $('.avatar').attr('src',"/risk-control" + res.result.favicon);

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
                    data: {
                        token: self.token,
                        teamId: self.curTeamId,
                        traderId: self.curTraderId,
                        type: self.varParam,
                        day: self.dayParam,
                        per: self.perParam
                    }
                }).always(function(res) {
                    
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
//              if (dataclientid) {
                    self.curTraderId = dataclientid;
                    self.curTeamId = datateamid;
                    self.curTeamName = datateamname;
                    self.curFavicon = "/risk-control" + datafavicon;
                    self.curRealName = datarealname;
                    self.varParam = 'var';
                    self.dayParam = '1D';
                    self.perParam = '95';
                    self.getPnlAndGeneral();
                    self.getVarOrEsReport()
                    self.getYtdPnlReport();
//              }
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
				exporting: {
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
                exporting: {
				enabled: false
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