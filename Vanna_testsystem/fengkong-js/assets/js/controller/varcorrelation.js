$(document).ready(function() {
    Demo.init();
    // Init Theme Core
    Core.init();
    // Init Chart Types

    $(window).trigger('resize');

    //渲染左侧列表
    new Vue({
        el: '#app',
        data: {
            tradersRaw: [],
            selectedDate: '',
            isShowTraderList: false
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
            curSelectedDate: function(){
                var self = this;
                if(self.selectedDate) {
                    var tmp = self.selectedDate.split('/')
                    return tmp[2] + tmp[0] + tmp[1]
                } else {
                    var today = new Date();
                    self.selectedDate = (today.getMonth()+1) + '/' + today.getDate()  + '/' + today.getFullYear() 
                    
                    return today.getFullYear() + '' +  (today.getMonth()+1) + '' + today.getDate()
                }
            },
            token: function() {
                return getCookie('token')
            }
        },
        created: function(){
            var self = this;
               if(!self.token) {
                   window.location.href = "./login.html" //取不到token跳转登录页
               }
        },
        mounted: function() {

            // demoHighPies();
            
            var self = this;
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
                // res = {
                //        result: [{
                //            teamId: 384394893,
                //            teamName: "A组",
                //            listClient: [{
                //                clientId: 1,
                //                favicon: './assets/img/avatars/1.jpg',
                //                realName: "丽娜",
                //                clientRole: '交易员',
                //                teamId: 384394893,
                //                teamName: "A组",
                //                contact: "18649630577"
                //            }, {
                //                clientId: 2,
                //                favicon: './assets/img/avatars/2.jpg',
                //                realName: "王鹏",
                //                clientRole: '交易员',
                //                teamId: 384394893,
                //                teamName: "A组",
                //                contact: "18649630577"
                //            }]
                //        }, {
                //            teamId: 333,
                //            teamName: "B组",
                //            listClient: [{
                //                clientId: 3,
                //                favicon: './assets/img/avatars/3.jpg',
                //                realName: "李泰民",
                //                clientRole: '小组长',
                //                teamId: 333,
                //                teamName: "B组",
                //                contact: "18649630577"
                //            }, {
                //                clientId: 4,
                //                favicon: './assets/img/avatars/4.jpg',
                //                realName: "张莉莉",
                //                clientRole: '交易员',
                //                teamId: 333,
                //                teamName: "B组",
                //                contact: "18649630577"
                //            }]
                //        }],
                //        code: "",
                //        resultMassage: "",
                //        success: true
                //    }
                //假数据END
                // console.log(res.result)
                if(res.success && res.result) {
                  self.tradersRaw = res.result;
                  self.isShowTraderList = true;
                } 
                
            });

            self.getIlliquidReport();


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
//                          teamId: 8003905308,
//                          team: {
//                            teamId: 133,
//                            teamName: 'A组'
//                          },
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
                    self.curTeamName = res.result.team.teamName;
                    self.curTraderId = res.result.team.clientId;
                    self.curFavicon = res.result.favicon;
                    self.curRealName = res.result.realName;
                   
                   self.getPnlAndGeneral();
                    self.getVarOrEsReport()
                    self.getYtdPnlReport();
                })
            },
            datechanged: function(dateTxt) {
                var self = this;
                self.selectedDate = dateTxt;
                self.getIlliquidReport()
            },
            getIlliquidReport: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                       url: "http://192.168.0.192:8080/risk-control/api/varCorrelation/listIlliquidReport",
//                  url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/varCorrelation/listIlliquidReport",

                    data: {
                        token: self.token,
                        date: self.curSelectedDate,//this
                        assetClass: 0, //0期货 1股票
                        teamId: self.curTeamId,
                        traderId: self.curTraderId
                    }
                }).always(function(res) {
                    //假数据START
                    // res = {
                    //     result: {
                    //         mvPers:[100,200,300,100,400],
                    //         tickerCodes:['01','02','03','06','05'],
                    //         securityNames:['农业银行','中国银行','中石油','中石化','交通银行']
                    //     },
                    //     code: "",
                    //     resultMassage: "",
                    //     success: true
                    // }
                    //假数据END
                    // console.log(res.result)
                    demoHighColumns(res.result);
                    self.getStatisticExhan();
                });
            },
            getStatisticExhan: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                       url: "http://192.168.0.192:8080/risk-control/api/varCorrelation/statisticExhange",
//                  url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/varCorrelation/statisticExhan",
                    data: {
                        token: self.token,
                        teamId: self.curTeamId,
                        traderId: self.curTraderId
                    }
                }).always(function(res) {
                    //假数据START
                    // res = {
                    //     result: {
                    //         exchanges:[{
                    //             count: 3,
                    //             name: "中国金融期货交易所"
                    //         },{
                    //             count: 1,
                    //             name: "深圳证券交易所"
                    //         },{
                    //             count: 3,
                    //             name: "上海证券交易所"
                    //         },{
                    //             count: 3,
                    //             name: "上海期货交易所"
                    //         },{
                    //             count: 3,
                    //             name: "其他"
                    //         }],
                    //         names: [
                    //         "中国金融期货交易所",
                    //         "深圳证券交易所",
                    //         "上海证券交易所",
                    //         "上海期货交易所",
                    //         "其他"
                    //         ]
                    //     },
                    //     code: "",
                    //     resultMassage: "",
                    //     success: true
                    // }
                    //假数据END
                    // console.log(res.result)
                    demoHighPies2(res.result);
                    self.getExposureReport();
                });
            },
            getExposureReport: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                       url: "http://192.168.0.192:8080/risk-control/api/varCorrelation/listExposureReport",
//                  url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/varCorrelation/listExposureReport",
                    data: {
                        token: self.token,
                        date: self.curSelectedDate,
                        teamId: self.curTeamId,
                        traderId: self.curTraderId
                    }
                }).always(function(res) {
                    //假数据START
                    // res = {
                    //     result: {
                    //         longDatas:[36, 55, 50, 70, 20],
                    //         shortDatas: [-10, -18, -20, -10, -10],
                    //         netDatas: [36, 55, 50, 70, 20],
                    //         totalDatas: [100, 78, 80, 72, 100],
                    //         securityTypes: ['股票', '大宗商品期货', '股票期权期货', '电子货币', '外汇'],
                    //         positionTypes: [1,0,2,3]
                    //     },
                    //     code: "",
                    //     resultMassage: "",
                    //     success: true
                    // }
                    //假数据END
                    console.log(res.result)
                    demoHighBars(res.result);
                    self.getSingleHoldReport();
                });
            },
            getSingleHoldReport: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                       url: "http://192.168.0.192:8080/risk-control/api/varCorrelation/singleHoldReport",
//                  url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/varCorrelation/singleHoldReport",
                    data: {
                        token: self.token,
                        date: self.curSelectedDate,
                        teamId: self.curTeamId,
                        traderId: self.curTraderId
                    }
                }).always(function(res) {
                    //假数据START
                    // res = {
                    //     result: {
                    //         singleNames:['最大空仓', '最大多仓'],
                    //         mvDatas: [-120, 260]
                    //     },
                    //     code: "",
                    //     resultMassage: "",
                    //     success: true
                    // }
                    //假数据END
                    // console.log(res.result)
                    demoSingleHold(res.result);
                });
            },
            switchclient: function(e) {
                var self = this;
                var dataclientid = $(e.target).closest('li').attr('data-clientid');
                var datateamid = $(e.target).closest('li').attr('data-teamid');
                var datateamname = $(e.target).closest('li').attr('data-teamname');
                var datafavicon = $(e.target).closest('li').attr('data-favicon');
                if (dataclientid) {
                    self.curTraderId = dataclientid;
                    self.curTeamId = datateamid;
                    self.curTeamName = datateamname;
                    self.curFavicon = datafavicon;
                    self.getIlliquidReport();
                }
            }
        }
    })

    
});
// High Charts Demo
var highColors = [bgInfo, bgPrimary, bgSuccess, bgWarning,
    bgDanger, bgSuccess, bgSystem, bgDark
];

// Column Charts
var demoHighColumns = function(data) {
    console.log(data)
    var dataTransfered = [];
    $.each(data.securityNames, function(k, v) {
        dataTransfered.push({
            name: v,
            data: [data.mvPers[k]]
        })
    })
    var column1 = $('#high-column');

    if (column1.length) {
        // Column Chart 1
        $('#high-column').highcharts({
            credits: false,
            colors: highColors,
            chart: {
                backgroundColor: 'transparent',
                type: 'column'
            },
            legend: {
                enabled: false
            },
            title: {
                text: null
            },
            xAxis: {
                title: {
                    text: null
                },
                labels: {
                    enabled: false
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: null
                },
                gridLineWidth: 0
            },
            tooltip: {
                formatter: function() {
                    return '<span style="font-size:10px"></span><table><tr>' +
                        '<td style="color:{series.color};padding:0">' + this.series.name + ': </td>' +
                        '<td style="padding:0"><b>' + this.y + '</b></td></tr>' +
                        '</table>'

                }
            },
            plotOptions: {
                column: {
                    groupPadding: 0.05,
                    pointPadding: 0.25,
                    borderWidth: 0
                }
            },
            // series: [{
            //     name: '农业银行',
            //     data: [500]
            // }, {
            //     name: '中国银行',
            //     data: [400]
            // }, {
            //     name: '中石油',
            //     data: [300]
            // }, {
            //     name: '中石化',
            //     data: [200]
            // }, {
            //     name: '交通银行',
            //     data: [100]
            // }]
            series: dataTransfered
        });
    }


    var column2 = $('#high-column2');

    if (column2.length) {

        // Column Chart 2
        $('#high-column2').highcharts({
            credits: false,
            colors: [bgPrimary, bgPrimary, bgWarning,
                bgWarning, bgInfo, bgInfo
            ],
            chart: {
                padding: 0,
                marginTop: 25,
                marginLeft: 15,
                marginRight: 5,
                marginBottom: 30,
                type: 'column',
            },
            legend: {
                enabled: false
            },
            title: {
                text: null,
            },
            xAxis: {
                lineWidth: 0,
                tickLength: 6,
                title: {
                    text: null
                },
                labels: {
                    enabled: true
                }
            },
            yAxis: {
                max: 20,
                lineWidth: 0,
                gridLineWidth: 0,
                lineColor: '#EEE',
                gridLineColor: '#EEE',
                title: {
                    text: null
                },
                labels: {
                    enabled: false,
                    style: {
                        fontWeight: '400'
                    }
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    colorByPoint: true,
                }
            },
            series: [{
                name: 'Tokyo',
                data: [12, 14, 20, 19, 8, 12,
                    14, 20, 5, 16, 8, 12,
                    14, 20, 19, 5, 16, 8,
                    12, 14, 20, 19, 5, 16,
                    8
                ]
            }]
        });

    }

    var column3 = $('#high-column3');

    if (column3.length) {

        // Column Chart3
        $('#high-column3').highcharts({
            credits: false,
            colors: highColors,
            chart: {
                type: 'column',
                padding: 0,
                spacingTop: 10,
                marginTop: 100,
                marginLeft: 30,
                marginRight: 30
            },
            legend: {
                enabled: false
            },
            title: {
                text: '30.8 hrs',
                style: {
                    fontSize: 20,
                    fontWeight: 600
                }
            },
            subtitle: {
                text: 'Average First response time <br> in past 30 days',
                style: {
                    color: '#AAA'
                }
            },
            xAxis: {
                lineWidth: 0,
                tickLength: 0,
                title: {
                    text: null
                },
                labels: {
                    enabled: true,
                    formatter: function() {
                        return this.value + "-" + (
                                this.value + 2) +
                            "<br> hours"; // clean, unformatted number for year
                    }
                },
            },
            yAxis: {
                gridLineWidth: 0,
                title: {
                    text: null
                },
                labels: {
                    enabled: false
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    colorByPoint: true,
                    colors: [bgPrimary, bgPrimary,
                        bgInfo, bgInfo
                    ],
                    groupPadding: 0,
                    pointPadding: 0.24,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'Yahoo',
                data: [7, 6, 9, 14, 18, 21, 25]
            }, {
                visible: false,
                name: 'CNN',
                data: [3, 4.2, 5.7, 8.5, 11.9, 15]
            }, {
                visible: false,
                name: 'Yahoo',
                data: [1, 5, 5, 11, 17, 22, 24]
            }, {
                visible: false,
                name: 'CNN',
                data: [1, 5, 5, 11, 17.0, 22, 24]
            }],
            dataLabels: {
                enabled: true,
                rotation: 0,
                color: '#AAA',
                align: 'center',
                x: 0,
                y: -8,
            }
        });
    }


} // End High Columns

var demoHighBars = function(data) {
    console.log(data)
    var dataTransfered = [];
    var positionName = [{
        name: '多仓',
        code: 'longDatas'
    },{
        name: '空仓',
        code: 'shortDatas'
    },{
        name: '净仓',
        code: 'netDatas'
    },{
        name: '总仓',
        code: 'totalDatas'
    }]
    $.each(positionName, function(k, v){
        dataTransfered.push({
            id: data.positionTypes,
            name: v.name,
            data: data[v.code]
        })
    })
    var bars1 = $('#high-bars');

    if (bars1.length) {

        // Bar Chart 1
        $('#high-bars').highcharts({
            colors: highColors,
            credits: false,
            legend: {
                enabled: false,
                y: -5,
                verticalAlign: 'top',
                useHTML: true
            },
            chart: {
                spacingLeft: 30,
                type: 'bar',
                marginBottom: 0,
                marginTop: 0
            },
            title: {
                text: null
            },
            xAxis: {
                showEmpty: false,
                tickLength: 80,
                offset: 1,
                // categories: ['股票', '大宗商品期货', '股票期权期货', '电子货币', '外汇'],
                categories: data.securityTypes,

                title: {
                    text: null
                },
                labels: {
                    align: 'right',
                    style: {
                        color: '#fff',
                        fontSize: '18px',
                        fontFamily: '微软雅黑'
                    }
                }
            },
            yAxis: {
                title: {
                    text: null
                },
                gridLineWidth: 0,
                lineColor: '#FFFFFF'
            },
            plotOptions: {
                bar: {}
            },
            // series: [{
            //     id: 3,
            //     name: '总仓',
            //     data: [100, 78, 80, 72, 100]
            // }, {
            //     id: 2,
            //     name: '净仓',
            //     data: [36, 55, 50, 70, 20]
            // }, {
            //     id: 1,
            //     name: '多仓',
            //     data: [36, 55, 50, 70, 20]
            // }, {
            //     id: 0,
            //     name: '空仓',
            //     data: [-10, -18, -20, -10, -10]
            // }] 
            series: dataTransfered
        });
    }
}


// Pie Charts
var demoHighPies = function() {

    var pie1 = $('#high-pie');

    if (pie1.length) {

        // Pie Chart1
        $('#high-pie').highcharts({
            credits: false,
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: null
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    center: ['30%', '50%'],
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            colors: highColors,
            legend: {
                x: 90,
                floating: true,
                verticalAlign: "middle",
                layout: "vertical",
                itemMarginTop: 10
            },
            series: [{
                type: 'pie',
                name: '所占百分比',
                data: [
                    ['中国', 35.0],
                    ['美国', 36.8], {
                        name: '日本',
                        y: 15.8,
                        sliced: true,
                        selected: true
                    },
                    ['俄罗斯', 18.5],
                    ['其他', 18.5],

                ]
            }]
        });
    }
} // End High Pie Charts Demo

var demoHighPies2 = function(data) {
    console.log(data)
    var dataTransfered = [];
    $.each(data.exchanges, function(k,v){
        dataTransfered.push([v.name, v.count])
    })
    var pie2 = $('#high-pie2');

    if (pie2.length) {

        // Pie Chart1
        $('#high-pie2').highcharts({
            credits: false,
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: null
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    center: ['30%', '50%'],
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            colors: highColors,
            legend: {
                x: 90,
                floating: true,
                verticalAlign: "middle",
                layout: "vertical",
                itemMarginTop: 10
            },
            series: [{
                type: 'pie',
                name: '所占百分比',
                // data: [
                //     ['中国金融期货交易所', 35.0],
                //     ['深圳证券交易所', 36.8],
                //     {
                //         name: '上海证券交易所',
                //         y: 15.8,
                //         sliced: true,
                //         selected: true
                //     },
                //     ['上海期货交易所', 18.5],
                //     ['其他', 18.5]
                // ]
                data: dataTransfered
            }]
        });
    }
} // End High Pie Charts Demo


var demoSingleHold = function(data){
    console.log(data)
    var dataTransfered = [];
    $.each(data.singleNames,function(k,v){
        dataTransfered.push([v, data.mvDatas[k]])
    })
    var highColors = [bgWarning, bgSuccess,
        bgDanger, bgSuccess, bgSystem, bgDark
    ];
    $('#bar-chart').highcharts({
        colors: highColors,
        chart: {
            type: 'column'
        },
        title: {
            text: null
        },
        xAxis: {
            title: {
                text: null
            },
            labels: {
                enabled: false
            }
        },
        yAxis: {
            title: {
                text: null
            }
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: '<b>{point.y}</b>'
        },
        plotOptions: {
            column: {
                groupPadding: 0.1,
                pointPadding: 0.4,
                borderWidth: 0
            }
        },
        series: [{
            negativeColor: '#00ce9b',
            // data: [
            //     ['最大空仓', -240],
            //     ['最大多仓', 260]
            // ],
            data: dataTransfered,
            dataLabels: {
                enabled: true,
                color: '#FFFFFF',
                align: 'right'
            }
        }]
    });
}