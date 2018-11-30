jQuery(document).ready(function() {
    "use strict";
    // Init Theme Core
    Core.init();
    $(window).trigger('resize');

    // Init Demo JS
    Demo.init();
var Child = {
        props: ['item'],
        template: ['<tr><td style="padding-left:25px;font-size:16px;">',
'<span class="fa fa-square  fs14 mr10" :class="item.className">',
'</span>{{item.name}}',
'</td>',
'<td :id="item.name" style="padding-right:105px;text-align:right;">{{item.data}}',
'</td></tr>'].join(''),
    }
    new Vue({
        el: '#app',
        data: {
            varParam: 'var',
            dayParam: '1D',
            perParam: '95',
            date: '',
            netAsset: '',
            generalResult: {},
            scenarioResultStressTest: {},
            scenarioResultHistroyEvent: {}
        },
        computed: {
             token: function() {
                            return getCookie('token')
                        }
        },
        components: {
            'stress-component': Child
        },
        created: function(){
            var self = this;
               if(!self.token) {
                   window.location.href = "./login.html" //取不到token跳转登录页
               }
        },
        mounted: function() {
            var self = this;
            self.getAndRenderAllCharts();
        },
        methods: {
            getAndRenderAllCharts: function(){
                var self = this;
                self.getAndRenderNetAsset();
                self.getAndRenderGeneralReport();
                self.getAndRenderGeneralResult();
                self.getAndRenderScenarioResult(0);
                self.getAndRenderScenarioResult(1);
                self.getAndRenderScenarioReport(0);
                self.getAndRenderScenarioReport(1);
            },
            varoptionschanged: function(value) {
                var self = this;

                self.varParam = value;
                self.getAndRenderAllCharts();
            },
            dayoptionschanged: function(value) {
                this.dayParam = value;
            },
            peroptionschanged: function(value) {
                var self = this;
                self.perParam = value;
                self.getAndRenderAllCharts();
            },
            getAndRenderNetAsset: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                       url: "http://192.168.0.192:8080/risk-control/api/scenario/getNetAsset",
//                  url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/scenario/getNetAsset",
                    data: {
                        token: self.token
                    }
                }).always(function(res) {
                    //假数据START
                    // res = { 
                    //     "result": 
                    //     { 
                    //         "netAsset": "313,247",
                    //          "date": "2017/9/28" },
                    //          "code": "",
                    //          "resultMassage": "",
                    //          "success": true 
                    //      };
                    //假数据END
                    // console.log(res.result)
                    self.date = res.result.date;
                    self.netAsset = res.result.netAsset;
                });
            },
            getAndRenderGeneralReport: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                       url: "http://192.168.0.192:8080/risk-control/api/scenario/listGeneralReport",
//                  url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/scenario/listGeneralReport",
                    data: {
                        token: self.token,
                        type: self.varParam,
                        per: self.perParam
                    }
                }).always(function(res) {
                    //假数据START
                    // res = {
                    //     "result":
                    //         {
                    //             "names":["1D","5D","10D"],
                    //             "datas":[300,4300,4650]
                    //         },
                    //         "code":"",
                    //         "resultMassage":"",
                    //         "success":true
                    //     }
                     res = {
                        "result":
                            {
                                "names":["1D","5D","10D"],
                                "datas":["300","4300","4650"]
                            },
                            "code":"",
                            "resultMassage":"",
                            "success":true
                        }
                    //假数据END
                    // console.log(res.result)
                    highchartGeneralReport(res.result)
                });
            },
            getAndRenderGeneralResult: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                       url: "http://192.168.0.192:8080/risk-control/api/scenario/listGeneralResult",
//                  url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/scenario/listGeneralResult",
                    data: {
                        token: self.token,
                        type: self.varParam,
                        per: self.perParam
                    }
                }).always(function(res) {
                    //假数据START
                    

                    //假数据END
                    // console.log(res.result)
                    var tmp = [];
                    var result = res.result;
                    tmp = result;
                    $.each(result, function(k, v) {
                        switch (v.name) {
                            case '1D':
                                // tmp.push('text-info');
                                tmp[k]['className'] = 'text-info'
                                break;
                            case '5D':
                                // tmp.push('text-primary');
                                tmp[k]['className'] = 'text-primary'
                                break;
                            case '10D':
                                // tmp.push('text-warning');
                                tmp[k]['className'] = 'text-warning'
                                break;
                            default:
                                break;
                        }

                    })
                    self.generalResult = tmp;
                    console.log(self.generalResult)
                });
            },
            getAndRenderScenarioResult: function(scenarioType) {
                var self = this;
                $.ajax({
                    method: "POST",
                       url: "http://192.168.0.192:8080/risk-control/api/scenario/listScenarioResult",
//                  url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/scenario/listScenarioResult",
                    data: {
                        token: self.token,
                        type: self.varParam,
                        per: self.perParam,
                        scenarioType: scenarioType
                    }
                }).always(function(res) {
                    // console.log(res.result)
                    if (scenarioType == 0) {
                        //假数据START
                        
                        // res = {
                        //     "result":[{
                        //         day1: '213',
                        //         day5:'23',
                        //         day10: '23',
                        //         icon: null,
                        //         scenarionName: '股票上涨10%'
                        //     },{
                        //         day1: '213',
                        //         day5:'1',
                        //         day10: '23',
                        //         icon: null,
                        //         scenarionName: '股票下跌10%'
                        //     }],
                        //     "code":"",
                        //     "resultMassage":"",
                        //     "success":true
                        // }

                        //假数据END
                        var tmp = {
                            scenarioNames: []
                        };
                        var result = res.result;
                        // $.each(result.scenarioNames, function(k, name) {
                        //     tmp[name] = [result.datas1d[k], result.datas5d[k], result.datas10d[k]];
                        // })
                        $.each(result, function(k, v) {
                            console.log(v)
                            tmp['scenarioNames'].push(v.scenarioName)
                            tmp[v.scenarioName] = [v.day1, v.day5, v.day10,]
                        })
                        self.scenarioResultStressTest = tmp;
                        // self.scenarioResultStressTest = $.extend(result, tmp);
                        console.log(self.scenarioResultStressTest)

                    } else if(scenarioType == 1) {
                        //假数据START
                       
                        //假数据END
                        var tmp = {
                            scenarioNames: []
                        };
                        var result = res.result;
                        // $.each(result.scenarioNames, function(k, name) {
                        //     tmp[name] = [result.datas1d[k], result.datas5d[k], result.datas10d[k]];
                        // })
                         $.each(result, function(k, v) {
                            console.log(v)
                            tmp['scenarioNames'].push(v.scenarioName)
                            tmp[v.scenarioName] = [v.day1, v.day5, v.day10,]
                        })
                        // self.scenarioResultHistroyEvent = $.extend(result, tmp);
                        self.scenarioResultHistroyEvent = tmp;
                        // console.log(self.scenarioResultHistroyEvent)

                    }
                });
            },
            getAndRenderScenarioReport: function(scenarioType) {
                var self = this;
                $.ajax({
                    method: "POST",
                       url: "http://192.168.0.192:8080/risk-control/api/scenario/listScenarioReport",
//                  url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/scenario/listScenarioReport",
                    data: {
                        token: self.token,
                        type: self.varParam,
                        per: self.perParam,
                        scenarioType: scenarioType
                    }
                }).always(function(res) {
                    var result = {};
                    // console.log(res.result)
                    if (scenarioType == 0) {
                        // 假数据START
                        
                        //假数据END
                        $.extend(result, res.result);
                        result['datas1d'] = [];
                        result['datas5d'] = [];
                        result['datas10d'] = [];
                        $.each(res.result.datas1d, function(k,v) {
                            result['datas1d'].push(parseFloat(v))
                        })
                        $.each(res.result.datas5d, function(k,v) {
                            result['datas5d'].push(parseFloat(v))
                        })
                        $.each(res.result.datas10d, function(k,v) {
                            result['datas10d'].push(parseFloat(v))
                        })
                        highchartStressTest(result);
                    } else if(scenarioType == 1) {
                        //假数据START
                       
                        //假数据END
                        $.extend(result, res.result);
                        result['datas1d'] = [];
                        result['datas5d'] = [];
                        result['datas10d'] = [];
                        $.each(res.result.datas1d, function(k,v) {
                            result['datas1d'].push(parseFloat(v))
                        })
                        $.each(res.result.datas5d, function(k,v) {
                            result['datas5d'].push(parseFloat(v))
                        })
                        $.each(res.result.datas10d, function(k,v) {
                            result['datas10d'].push(parseFloat(v))
                        })
                        highchartHistroyEvent(result);
                    }

                });
            },


        }
    })



});

var highColors = [bgInfo, bgPrimary, bgWarning, bgSuccess,
    bgDanger, bgSuccess, bgSystem, bgDark
];

function highchartGeneralReport(dataRaw) {
    // console.log(dataRaw)
    var data = [];
    $.each(dataRaw.names, function(k, v) {
        data.push({
            name: v,
            data: [parseFloat(dataRaw.datas[k])]
        })
    })

    $('#high-column-l1').highcharts({
        colors: highColors,
        credits: {
            enabled: false
        },
        chart: {
            type: 'column'
        },
        title: {
            text: null
        },
        exporting: {  
            enabled:false  
}, 
        subtitle: {
            text: null
        },
        xAxis: {
            crosshair: false,
            labels: {
                enabled: false
            },
            lineWidth: 1,
            lineColor: '#E1E3E7',
            tickLength: 0

        },
        yAxis: {
            min: 0,
            gridLineWidth: 0,
            title: {
                text: null
            },
            lineWidth: 1,
            lineColor: '#E1E3E7',
            labels: {
                formatter: function() {
                    return this.value;
                }
            }
        },
        tooltip: {
            shared: false,
            useHTML: true,
            formatter: function() {
                return '<span style="font-size:10px"></span><table><tr>' +
                    '<td style="padding:10px">2017年9月28日 星期四 <br/>' + this.series.name + ' 95%风险价值：' +
                    this.y +
                    '</td></tr></table>'
            }
        },
        plotOptions: {
            column: {
                groupPadding: 0.08,
                pointPadding: 0.25,
                borderWidth: 0
            }
        },
        // series: [{
        //     name: '1D',
        //     data: [4950]
        // }, {
        //     name: '5D',
        //     data: [4300]
        // }, {
        //     name: '10D',
        //     data: [4650]
        // }],
        series: data
    });
}

function highchartStressTest(data) {
    $('#high-line-l2').highcharts({
        colors: highColors,
        credits: {
            enabled: false
        },
        chart: {
            type: 'column'
        },
        title: {
            text: null
        },
        exporting: {  
            enabled:false  
}, 
        subtitle: {
            text: null
        },
        xAxis: {
            // categories: [
            //     '股票上涨10%',
            //     '股票下跌10%',
            //     '欧元兑美元上升10%',
            //     '欧元兑美元下跌10%'
            // ],
            categories: data.scenarioNames,
            crosshair: false,
            labels: {
                enabled: false
            },
            lineWidth: 1,
            lineColor: '#E1E3E7',
            tickLength: 0

        },
        yAxis: {
            min: 0,
            gridLineWidth: 0,
            title: {
                text: null
            },
            lineWidth: 1,
            lineColor: '#E1E3E7',
            labels: {
                formatter: function() {
                    return this.value
                }
            }
        },
        tooltip: {
            shared: false,
            useHTML: true,
            formatter: function() {
                return '<span style="font-size:10px"></span><table><tr>' +
                    '<td style="padding:10px;text-align:center;">' + this.x + '<br/>' + this.series.name + ' 95%风险价值：' +
                    this.y +
                    '</td></tr></table>'

            }
        },
        plotOptions: {
            column: {
                groupPadding: 0.1,
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: '1D',
            // data: [4950, 4950, 4950, 4950]
            data: data.datas1d
        }, {
            name: '5D',
            // data: [4300, 4300, 4300, 4300]
            data: data.datas5d
        }, {
            name: '10D',
            // data: [4650, 4650, 4650, 4650]
            data: data.datas10d
        }]
    });
}

function highchartHistroyEvent(data) {
    // console.log(data)
    $('#high-column2-l3').highcharts({
        colors: highColors,
        credits: {
            enabled: false
        },
        chart: {
            type: 'column'
        },
        title: {
            text: null
        },
        exporting: {  
            enabled:false  
}, 
        subtitle: {
            text: null
        },
        xAxis: {
            // categories: [
            //     '2008年金融危机',
            //     '2008年雷蒙兄弟违约',
            //     '2011年债务上限危机及降级',
            //     '2015年希腊金融危机',
            //     '2011年日本大地震',
            //     '2015年5月石油价格下降',
            //     '俄罗斯金融危机',
            //     '利比亚石油危机',
            //     '911事件'
            // ], 
            categories: data.scenarioNames,
            crosshair: false,
            labels: {
                enabled: false
            },
            lineWidth: 1,
            lineColor: '#E1E3E7',
            tickLength: 0

        },
        yAxis: {
            min: 0,
            gridLineWidth: 0,
            title: {
                text: null
            },
            lineWidth: 1,
            lineColor: '#E1E3E7',
            labels: {
                formatter: function() {
                    return this.value;

                }
            }
        },
        tooltip: {

            shared: false,
            useHTML: true,
            formatter: function() {
                return '<span style="font-size:10px"></span><table><tr>' +
                    '<td style="padding:10px;text-align:center;">' + this.x + '<br/>' + this.series.name + ' 95%风险价值：' +
                    this.y +
                    '</td></tr></table>'

            }
        },
        plotOptions: {
            column: {
                groupPadding: 0.1,
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: '1D',
            // data: [3050, 4950, 4950, 4950, 4950, 4950, 4950, 4950, 4950]
            data: data.datas1d
        }, {
            name: '5D',
            // data: [3300, 4300, 4300, 4300, 4300, 4300, 4300, 4300, 4300]
            data: data.datas5d

        }, {
            name: '10D',
            // data: [3650, 4650, 4650, 4650, 4650, 4650, 4650, 4650, 4650]
            data: data.datas10d

        }]
    });   
}