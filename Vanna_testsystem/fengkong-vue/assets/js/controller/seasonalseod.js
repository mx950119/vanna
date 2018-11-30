jQuery(document).ready(function() {
    "use strict";
    // Init Theme Core
    Core.init();
    $(window).trigger('resize');
    var ChildPanelTab = {
        props: [''],
        data: function() {
            return {
                counter: 1
            }
        },
        computed: {
            pageindex: function() {
                var self = this;
                var tmp = [];
                return tmp;
            }
        },
        template: ['<ul class="nav panel-tabs-border panel-tabs">' +
            '<li class="active" data-activetab="30天"><a href="#tab1_1" data-toggle="tab" @click="togglehandler">30天</a></li>' +
            '<li data-activetab="60天"><a href="#tab1_2" data-toggle="tab" @click="togglehandler">60天</a></li>' +
            '</ul>'
        ].join(''),

        methods: {
            togglehandler: function(e) {
                var self = this;
                var activetab = $(e.target).closest('li').attr('data-activetab')
                self.$emit('toggletab', activetab)
            }
        }
    }
    new Vue({
        el: '#app',
        data: {
            seasonalRiskListRaw: [],
            activetab: '30天'
        },
        computed: {
            seasonalRiskList: function() {
                var self = this;
                var tmp = [];
                var classList = [
                    'text-warning',
                    'text-primary',
                    'text-info',
                    'text-alert'
                ]
                $.each(self.seasonalRiskListRaw, function(k, v) {
                    tmp.push($.extend({}, v, {
                        className: classList[k]
                    }))
                })
                console.log(tmp)
                return tmp;
            },
            token: function() {
                return getCookie('token')
            }
        },
        components: {
            'panel-tab': ChildPanelTab
        },
        created: function(){
            var self = this;
               if(!self.token) {
                   window.location.href = "./login.html" //取不到token跳转登录页
               }
        },
        mounted: function() {
            var self = this;
            self.getSeasonalRiskList();

            // renderHighLine();
        },
        methods: {

            getSeasonalRiskList: function(activetab) {
                var self = this;
                if (activetab) {
                    self.activetab = activetab;
                }
                $.ajax({
                    method: "POST",
                       url: "http://192.168.0.192:8080/risk-control/api/scenario/listSeasonalRisk",
//                  url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/scenario/listSeasonalRisk",
                    data: {
                        token: self.token,
                        scenarioName: self.activetab
                    }
                }).always(function(res) {
                    //假数据START
//                     res ={
//                         "result":[
//                             {
//                                 "name":"1D风险价值",
//                                 "per95":"0.64",
//                                 "per99":"0.63"
//                             },
//                             {
//                                 "name":"1D预期收益不足",
//                                 "per95":"0.64",
//                                 "per99":"0.52"
//                             },
//                             {
//                                 "name":"10D风险价值",
//                                 "per95":"0.44",
//                                 "per99":"0.63"
//                             },
//                             {
//                                 "name":"10D预期收益不足",
//                                 "per95":"0.78",
//                                 "per99":"0.63"
//                             }],
//                             "code":"",
//                             "resultMassage":"",
//                             "success":true
//                         }
                    //假数据END
                    console.log(res.result)
                    self.seasonalRiskListRaw = res.result;

                    self.getAndRenderSeasonalRiskReport(activetab);
                });
            },
            getAndRenderSeasonalRiskReport: function(activetab) {
                var self = this;
                if (activetab) {
                    self.activetab = activetab;
                }
                $.ajax({
                    method: "POST",
                       url: "http://192.168.0.192:8080/risk-control/api/scenario/listSeasonalReport",
//                  url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/scenario/listSeasonalReport",
                    data: {
                        token: self.token,
                        scenarioName: self.activetab
                    }
                }).always(function(res) {
                    //假数据START
//                  res = {
//                      "result":{
//                          "datas95":["195","1195","1095","11095"],
//                          "datas99":["199","23", "1099", "23"]
//                      },
//                      "code":"",
//                      "resultMassage":"",
//                      "success":true
//                  }
                    //假数据END
                    console.log(res.result)
                    renderHighLine(res.result)
                });
            }


        }
    })


    function renderHighLine(res) {
        console.log(res)

        var data = [{
            color: '#ffc841',
            name: '1D风险价值',
            data: [parseFloat(res['datas95'][0]), parseFloat(res['datas99'][0])]
        }, {
            color: '#43c7d7',
            name: '1D预期收益不足',
            data: [parseFloat(res['datas95'][1]), parseFloat(res['datas99'][1])]
        }, {
            color: '#30b5e1',
            name: '10D风险价值',
            data: [parseFloat(res['datas95'][2]), parseFloat(res['datas99'][2])]
        }, {
            color: '#967adc',
            name: '10D风险价值',
            data: [parseFloat(res['datas95'][3]), parseFloat(res['datas99'][3])]
        }];
        $('#high-line').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: null
            },
            exporting: {  
            enabled:false  
}, 
            xAxis: {
                categories: [
                    '95%',
                    '99%'
                ]
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
            credits: {
                enabled: false
            },
            tooltip: {
                return: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f}</b></td></tr></table>'
            },
            plotOptions: {
                column: {
                    groupPadding: 0.1,
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            // series: [{
            //     color: '#ffc841',
            //     name: '1D风险价值',
            //     data: [0.9, 0.5]
            // }, {
            //     color: '#43c7d7',
            //     name: '1D预期收益不足',
            //     data: [0.6, 0.8]
            // }, {
            //     color: '#30b5e1',
            //     name: '10D风险价值',
            //     data: [0.9, 0.8]
            // }, {
            //     color: '#967adc',
            //     name: '10D风险价值',
            //     data: [0.4, 0.2]
            // }]
            series: data
        });
    }


});