jQuery(document).ready(function() {
    // Init Theme Core
    Core.init();
    renderApp();

    $(window).trigger('resize');
});

function renderApp() {
    var Child = {
        props: ['item'],
        template: [
            '<tr >',
            '<td >',
            '<span class="spanr">{{item.name}}</span>',
            '<div class="progress progress-bar-xs mt10 mb10">',
            '<div role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" :style="{width: item.percentum}" class="progress-bar progress-bar-info"><span class="sr-only">60%</span></div>',
            '</div>',
            '<div class="font12"><span class="col-lg-6 " style="text-align: left;">{{item.percentum}}</span><span class="col-lg-6 right" style="text-align: right;">{{item.totalOvm}}</span></div>',
            '</td>',
            '<td>{{item.tickerCode}}</td>',
            '<td>{{item.exchangeName}}</td>',
            '<td>{{item.posn}}</td>',
            '<td>{{item.price}}<i class="fa fa-caret-up text-info pr10"></i></td>',
            '</tr>'
        ].join(''),

    }
    var ChildDatePicker = {
        props: ['dateshowed'],
        template: '<input  type="text" :value="dateshowed"  name="filter-datepicker" placeholder="Filter by Date" class="gui-input"/>',
        mounted: function() {
            var self = this;
            $(this.$el).datepicker({
                numberOfMonths: 1,
                showOn: 'both',
                buttonText: '<i class="fa fa-calendar-o"></i>',
                prevText: '<i class="fa fa-chevron-left"></i>',
                nextText: '<i class="fa fa-chevron-right"></i>',
                beforeShow: function(input, inst) {
                    var newclass = 'admin-form';
                    var themeClass = $(this).parents('.admin-form').attr('class');
                    var smartpikr = inst.dpDiv.parent();
                    if (!smartpikr.hasClass(themeClass)) {
                        inst.dpDiv.wrap('<div class="' + themeClass + '"></div>');
                    }
                },
                onSelect: function(dateText, event) {
                    self.$emit('selectedhandler', dateText)
                }
            });
        },
    }
    new Vue({
        el: '#app',
        data: {
            sectors: [],
            rawFutures: [],
            curSectorId: '',
            selectedDate: ''
        },
        computed: {
            curSectorName: function() {
                var tmp = "";
                var self = this;
                $.each(this.sectors, function(k, v) {
                    if (self.curSectorId == v.sectorId) {
                        tmp = v.sectorName;
                    }
                })
                return tmp
            },
            futures: function() {
                var transferedFutures = [];
                $.each(this.rawFutures, function(k, v) {
                    v.percentum = v.percentum * 100 + '%'
                    transferedFutures.push(v)
                })
                return this.rawFutures;
            },
            curSelectedDate: function(){
                var self = this;
                if(self.selectedDate) {
                    var tmp = self.selectedDate.split('/')
                    return tmp[2] + tmp[0] + tmp[1]
                    // return this.selectedDate
                } else {
                    var today = new Date();
                    // return (today.getMonth()+1) + "/" +today.getDate() + "/" + today.getFullYear()
                    return today.getFullYear() + "" +(today.getMonth()+1) +  "" + today.getDate() 
                }
            },
            token: function() {
                return getCookie('token')

            }

        },
        components: {
            'future-component': Child,
            'date-picker': ChildDatePicker
        },
        created: function(){
            var self = this;
                  if(!self.token) {
                      window.location.href = "./login.html" //取不到token跳转登录页
                  }
        },
        mounted: function() {
            var self = this;
            $.ajax({
                method: "POST",
                   url: "http://192.168.0.192:8080/risk-control/api/portfolio/listStockSector",
//              url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/portfolio/listFutureSeodSector",
                data: {
                    token: self.token
                }
            }).always(function(res) {
                //假数据START
//              res = {
//                  result: [{
//                     sectorId: 12345,
//                     sectorName: '广告业'
//                  },{
//                     sectorId: 12346,
//                     sectorName: '银行酒水业'
//                  },{
//                     sectorId: 12347,
//                     sectorName: '计算机'
//                  },{
//                     sectorId: 12348,
//                     sectorName: '农业'
//                  },{
//                     sectorId: 12349,
//                     sectorName: '生物技术'
//                  },{
//                     sectorId: 12350,
//                     sectorName: '化妆品'
//                  },],
//                  code: "",
//                  resultMassage: "",
//                  success: true
//              }

                //假数据END
                console.log(res.result)
                self.sectors = res.result;
                self.curSectorId = self.sectors[0].sectorId
                self.getAndRenderSectorReport(self.curSectorId, self.token);
                self.getAndRenderFutureSeodList(self.selectedDate)
            });

        },
        methods: {
            datechanged: function(dateTxt) {
                this.selectedDate = dateTxt;
                this.getAndRenderFutureSeodList(this.curSelectedDate)
            },
            sectorchanged: function() {
                this.getAndRenderSectorReport(this.curSectorId, this.token);
                this.getAndRenderFutureSeodList(this.curSelectedDate)
            },
            getAndRenderSectorReport: function(sectorid, token) {
                if ($('#high-datamap').length) {
                    $.ajax({
                        method: "POST",
                           url: "http://192.168.0.192:8080/risk-control/api/portfolio/listStockReport",
//                      url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/portfolio/listFutureSeodReport",
                        data: {
                            token: token,
                            sectorId: sectorid
                        }
                    }).always(function(res) {
                        //假数据START
                        
//                      res = {
//
//                          result: {
//                              // dates: [1504195200000, 1504281600000,1504368000000,1504454400000],//时间戳*1000
//                              dates: [
//                              "20170911","20170912","20170913","20170914","20170915",], //时间戳*1000
//                              // dailyPnls: [20,30,40,20],
//                              dailyPnls: ["23","23","23","23","23"],
//                              mvDatas: ["0","0","0","0","0"]
//                          },
//                          code: "",
//                          resultMassage: "",
//                          success: true
//                      }
                        //假数据END
                        console.log(res.result)
                        demoHighChartsAdvanced(res.result);

                    });
                }
            },
            getAndRenderFutureSeodList: function(dateTxt){
                var self = this;
                
                $.ajax({
                    method: "POST",
                       url: "http://192.168.0.192:8080/risk-control/api/portfolio/listStock ",
//                  url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/portfolio/listFutureSeod",
                    data: {
                        token: self.token,
                        sectorId: self.curSectorId,
                        date: self.curSelectedDate
                    }
                }).always(function(res) {
                    //假数据START
//                  res = {
//                      "result":
//                      {
//                          "listFutureSeod": [
//                          {
//                              "name": "沪锌1708",
//                              "tickerCode": "ZN1708",
//                              "exchangeName": "上海期货交易所",
//                              "posn": 0,
//                              "price": "0",
//                              "totalOvm": "20029",
//                              "mv": 34.00,
//                              "percentum": 0.17
//                          }],
//                          "date": "20171021"
//                      },
//                      "code": "200",
//                      "resultMessage": "数据获取成功",
//                      "success": true
//                  }
                    // {
                    //     result: [
                    //     {
                    //        name: '美国土33豆连续',//名称
                    //        tickerCode: '132354',//产品代码
                    //        exchangeName:'Otto',//交易所名称
                    //        posn: 23564,//持仓量
                    //        price:'325',//price
                    //        totalOvm: '122564',//总的净资产
                    //        percentum: 0.1//百分比
                    //     },{
                    //        name: '美国土豆连续',//名称
                    //        tickerCode: '132354',//产品代码
                    //        exchangeName:'Otto',//交易所名称
                    //        posn: 23564,//持仓量
                    //        price:'325',//price
                    //        totalOvm: '122564',//总的净资产
                    //        percentum: 0.7//百分比
                    //     },{
                    //        name: '美国土豆连续',//名称
                    //        tickerCode: '132354',//产品代码
                    //        exchangeName:'Otto',//交易所名称
                    //        posn: 23564,//持仓量
                    //        price:'325',//price
                    //        totalOvm: '122564',//总的净资产
                    //        percentum: 0.4//百分比
                    //     },{
                    //        name: '美国土豆连续',//名称
                    //        tickerCode: '132354',//产品代码
                    //        exchangeName:'Otto',//交易所名称
                    //        posn: 23564,//持仓量
                    //        price:'325',//price
                    //        totalOvm: '122564',//总的净资产
                    //        percentum: 0.6//百分比
                    //     }
                    //     ],
                    //     code: "",
                    //     resultMassage: "",
                    //     success: true
                    // }
                    //假数据END
                    console.log(res.result)
                    self.rawFutures = res.result.listStock;
                });
            }
        }
    })
}

// Advanced HighChart Demo
var demoHighChartsAdvanced = function(data) {

    var dailyPnlsList = [];
    $.each(data.dates, function(k, v) {
        var t = new Date(v.substring(0, 4) + '/' + v.substring(4, 6) + '/' + v.substring(6, 8));
        var timestamp = t.getTime();
        dailyPnlsList.push([timestamp, parseFloat(data.dailyPnls[k])])
    })
    console.log(dailyPnlsList)
    // High Chart Data Set 
    var detailChart;

    // create the detail chart
    function createDetail(masterChart) {
        // prepare the detail chart
        var detailData = [];

        $.each(masterChart.series[0].data, function() {
            detailData.push([this.x, this.y]);
        });
        // create a detail chart referenced by a global variable

     
          detailChart = $('#high-datamap').highcharts({
            chart: {
                type: 'spline',
                backgroundColor: 'transparent',
                reflow: true,
                marginTop: 25,
                marginBottom: 0,
                marginLeft: 35,
                marginRight: 5,
                style: {
                    position: 'absolute'
                }
            },
            credits: {
                enabled: false
            },
            title: {
                text: null
            },
            subtitle: {
                text: null
            },
            xAxis: {
                type: 'datetime',
                minorTickLength: 0,
                tickLength: 0,
                gridLineWidth: 0,
                lineWidth: 0,
                lineColor: '#ddd',
                labels: {
                    enabled: false
                },
            },
            yAxis: {
                gridLineColor: '#EEE',
                lineColor: '#EEE',
                tickColor: '#EEE',
                tickLength: 10,
                showFirstLabel: false,
                title: {
                    text: null
                },
                labels: {
                    x: -5
                },
                maxZoom: 0.1
            },
            tooltip: {
                formatter: function() {
                    var point = this.points[0];
                    return Highcharts.dateFormat('%Y年%m月%d日', this.x) +
                        '<br/>' +
                        '收益 ： ' +
                        Highcharts.numberFormat(point.y, 2);
                },
                shared: true
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                areaspline: {
                    fillOpacity: 0.3,
                    marker: {
                        enabled: true,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                },
                series: {
                    marker: {
                        enabled: false,
                        states: {
                            hover: {
                                enabled: true,
                                radius: 3
                            }
                        }
                    }
                }
            },
            series: [{
                name: 'datetime',
                // pointStart: detailStart,
                // pointInterval: 24 *
                //     3600 * 1000,
                data: detailData,
            }],
            exporting: {
                enabled: false
            }
        }).highcharts(); // return chart  
        
        
    }
    // create the sibling chart

    function createMaster() {
        $('#high-siblingmap').highcharts({
                chart: {
                    reflow: true,
                    backgroundColor: 'transparent',
                    marginLeft: 0,
                    marginRight: 0,
                    marginBottom: 30,
                    zoomType: 'x',
                    events: {
                        // listen to the selection event on the sibling chart to update the
                        // extremes of the detail chart
                        selection: function(event) {
                            var extremesObject = event.xAxis[0],
                                min = extremesObject.min,
                                max = extremesObject.max,
                                detailData = [],
                                xAxis = this.xAxis[0];
                            // reverse engineer the last part of the data
                            $.each(this.series[0].data, function() {
                                if (this.x > min && this.x < max) {
                                    detailData.push([this.x, this.y]);
                                }
                            });
                            // move the plot bands to reflect the new detail span
                            xAxis.removePlotBand(
                                'mask-before'
                            );
                            xAxis.addPlotBand({
                                id: 'mask-before',
                                from: min,
                                to: max,
                                color: 'rgba(0, 0, 0, 0.05)',
                                borderColor: 'rgba(0,0,0,0.1)',
                                borderWidth: 1,
                            });
                            xAxis.removePlotBand(
                                'mask-after'
                            );
                            detailChart.series[
                                0].setData(
                                detailData
                            );
                            return false;
                        }
                    }
                },
                title: {
                    text: null
                },
                xAxis: {
                    type: 'datetime',
                    showLastTickLabel: true,
                    maxZoom: 14 * 24 * 3600000, // fourteen days
                    plotBands: [{
                        id: 'mask-before',
                        from: Date.UTC(
                            2008, 0,
                            1),
                        to: Date.UTC(
                            2008, 5,
                            1),
                        color: 'rgba(0, 0, 0, 0.05)',
                    }],
                    title: {
                        text: null
                    },
                    showFirstLabel: false,
                    showLastLabel: false
                },
                yAxis: {
                    gridLineWidth: 0,
                    // gridLineColor: '#EEE',
                    labels: {
                        enabled: false
                    },
                    title: {
                        text: null
                    },
                    min: 0.6,
                    showFirstLabel: false
                },
                tooltip: {
                    formatter: function() {
                        return false;
                    }
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    series: {
                        fillColor: {
                            linearGradient: [
                                '0%', '0%',
                                '100%',
                                '0%'
                            ], // Left Top Right Bot
                            stops: [
                                [0, 'rgba(74,137,220, 0.75)'],
                                [1, 'rgba(74,137,220, 0.1)'],
                            ]
                        },
                        lineWidth: 1,
                        marker: {
                            enabled: false
                        },
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        enableMouseTracking: false
                    }
                },
                series: [{
                    type: 'area',
                    name: 'USD to EUR',
                    // pointInterval: 24 * 3600 * 1000,//1 day
                    // pointStart: Date.UTC(
                    //     2006, 0, 1),
                    // data: data
                    data: dailyPnlsList
                    // data: [{
                    //     x: data.dates,
                    //     y: data.dailyPnls
                    // }]
                }],
                exporting: {
                    enabled: false
                }
            }, function(masterChart) {
                createDetail(masterChart);
            }

        ).highcharts(); // return chart instance
    }
    // create master and in its callback, create the detail chart
    createMaster();

} // end HighChartsAdvanced