jQuery(document).ready(function() {
    var ChildPagination = {
        props: ['config'],
        data: function() {
            return {
                counter: 1,
                classObject: {
                    isFirstDisabled: true,
                    isLastDisabled: true
                },
                activePageIndex: 1
            }
        },
        computed: {
            pageindex: function() {
                var self = this;
                var tmp = [];

                if (self.counter + self.config.groupcount - 1 > self.config.totalPage) {

                    self.counter = self.config.totalPage - self.config.groupcount + 1
                    tmp = self.pageindex;
                } else if (self.counter < 1) {
                    self.counter = 1;
                    tmp = self.pageindex;

                } else {
                    for (var i = 0; i < self.config.groupcount; i++) {
                        tmp.push(self.counter + i)
                    }

                }

                if (self.counter == 1) {
                    self.classObject = {
                        isFirstDisabled: false,
                        isLastDisabled: true
                    };

                } else if (self.counter == self.config.totalPage - self.config.groupcount + 1) {
                    self.classObject = {
                        isFirstDisabled: true,
                        isLastDisabled: false
                    };
                } else {
                    self.classObject = {
                        isFirstDisabled: false,
                        isLastDisabled: false
                    };
                }

                return tmp;
            }
        },
        template: ['<ul class="pagination hide-if-no-paging">' +
            // '<li class="footable-page-arrow disabled">' +
            // '<a data-page="first" href="#first">' +
            // '<font style="vertical-align: inherit;">' +
            // '<font style="vertical-align: inherit;">«</font>' +
            // '</font>' +
            // '</a>' +
            // '</li>' +
            '<li class="footable-page-arrow" :class="{disabled: classObject.isFirstDisabled}" @click="!classObject.isFirstDisabled ? counter+=1 : 0">' +
            '<a data-page="prev" href="#prev">' +
            '<font style="vertical-align: inherit;">' +
            '<font style="vertical-align: inherit;">&lt;</font>' +
            '</font>' +
            '</a>' +
            '</li>' +
            '<li v-for="n in config.groupcount" class="footable-page" :class="{active : pageindex[n-1] == activePageIndex}" @click="pageclickhandler" :data-pageindex="pageindex[n-1]">' +
            '<a data-page="0" href="#">' +
            '<font style="vertical-align: inherit;">' +
            '<font style="vertical-align: inherit;">{{pageindex[n-1]}}</font>' +
            '</font>' +
            '</a>' +
            '</li>' +
            // '<li class="footable-page">' +
            // '<a data-page="1" href="#">' +
            // '<font style="vertical-align: inherit;">' +
            // '<font style="vertical-align: inherit;">2</font>' +
            // '</font>' +
            // '</a>' +
            // '</li>' +
            // '<li class="footable-page">' +
            // '<a data-page="2" href="#">' +
            // '<font style="vertical-align: inherit;">' +
            // '<font style="vertical-align: inherit;">3</font>' +
            // '</font>' +
            // '</a>' +
            // '</li>' +
            // '<li class="footable-page">' +
            // '<a data-page="3" href="#">' +
            // '<font style="vertical-align: inherit;">' +
            // '<font style="vertical-align: inherit;">4</font>' +
            // '</font>' +
            // '</a>' +
            // '</li>' +
            '<li class="footable-page-arrow" :class="{disabled: classObject.isLastDisabled}" @click="!classObject.isLastDisabled ? counter-=1 : 0">' +
            '<a data-page="next" href="#next">' +
            '<font style="vertical-align: inherit;">' +
            '<font style="vertical-align: inherit;">&gt;</font>' +
            '</font>' +
            '</a>' +
            '</li>' +
            // '<li class="footable-page-arrow">' +
            // '<a data-page="last" href="#last">' +
            // '<font style="vertical-align: inherit;">' +
            // '<font style="vertical-align: inherit;">»</font>' +
            // '</font>' +
            // '</a>' +
            // '</li>' +
            '</ul>'
        ].join(''),

        methods: {
            pageclickhandler: function(e) {
                var self = this;
                console.log()
                var pageindex = $(e.target).closest('li').attr('data-pageindex');
                self.activePageIndex = pageindex;
                self.$emit('activepagechanged', pageindex)
            }
        }
    }
    var ChildOperationButton = {
        props: ['posid'],
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
                       url: "http://192.168.0.195:8080/risk-control/api/simulationPosition/del",
//                  url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/simulationPosition/del",
                    data: {
                        token: self.token,
                        Id: self.posid
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
            }
        }
    }


    new Vue({
        el: '#app',
        data: {
            assetClass: [],
            posnType: [],
            selectedposnType: '仓位类型',
            pagination: {

            },
            positionListRaw: [],
            simulationPos: {
                assetClassStr: '交易品种',
                posnTypeStr: '仓位类型',
                tickerCode: '',
                posn: '',
                productName: '',
                curUser: ''

            },
            positionListOfPage: []
        },
        computed: {
            positionList: function() {
                var self = this;
                var tmp = {};
                var key = '';
                $.each(self.positionListRaw, function(k, v) {
                    key = parseInt(k / self.pagination.grouplist) + 1;
                    if (tmp['page' + key]) {
                        tmp['page' + key].push(v)
                    } else {
                        tmp['page' + key] = [];
                        tmp['page' + key].push(v)
                    }
                })
                console.log('====')
                console.log(tmp)
                return tmp;
            },
            token: function() {
                return getCookie('token')
            }

        },
        components: {
            'vue-pagination': ChildPagination,
            'operation-button': ChildOperationButton
        },
        created: function(){
            var self = this;
               if(!self.token) {
                   window.location.href = "./login.html" //取不到token跳转登录页
               }
        },
        mounted: function() {
            var self = this;
            self.getLoginInfo();
            self.getAssetClass();
            self.getPosnType();
            self.getPositionList();
            $("#uploadfilebtn").uploadFile({
                   url: "http://192.168.0.192:8080/risk-control/api/simulationPosition/batchSave/check",
//              url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/simulationPosition/batchSave/check",
                fileName: "myfile",
                dragDropStr: '<span class="mr10 icon fa fa-cloud-upload"></span>',
                dragdropWidth: 78,
                uploadStr: '上传数据',
                showStatusAfterSuccess: false,
                showStatusAfterError: false,
                showFileCounter: false,
                showFileSize: false
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
//                          realName: '',
//                          clientName: 'abc',
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
                    self.simulationPos.curUser = res.result.clientName
                   
                })
            },
            varoptionschanged: function(value) {
                var self = this;

                self.varParam = value;
                self.getAndRenderAllCharts();
            },
            getAssetClass: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                       url: "http://192.168.0.192:8080/risk-control/api/simulationPosition/getAssetClass",
//                  url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/simulationPosition/getAssetClass",
                    data: {}
                }).always(function(res) {
                    //假数据START
                    // res = {
                    //     "result":["股票","期货"],
                    //     "code":"",
                    //     "resultMassage":"",
                    //     "success":true
                    // };
                    //假数据END
                    console.log(res.result)
                    var result = res.result;
                    result.unshift('交易品种');
                    self.assetClass = result;
                    hightchart1dh();
                    hightchart5dh();
                    hightchart10dh();
                    hightchart1dh();


                });
            },
            getPosnType: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                       url: "http://192.168.0.192:8080/risk-control/api/simulationPosition/getPosnType",
//                  url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/simulationPosition/getPosnType",
                    data: {}
                }).always(function(res) {
                    //假数据START
                    // res = {
                    //     "result":["交易","对冲"],
                    //     "code":"",
                    //     "resultMassage":"",
                    //     "success":true
                    // }
                    //假数据END
                    console.log(res.result)
                    var result = res.result;
                    result.unshift('仓位类型');
                    self.posnType = result;
                });
            },
            getPositionList: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/simulationPosition/list",
                    data: {
                        token: self.token
                    }
                }).always(function(res) {
                //假数据START
//              res = {
//                  "result": {
//                      "totalCount": 19,
//                      "result": [{
//                              "Id": 123234,
//                              "assetClass": "大宗商品期货0",
//                              "posnType": "交易",
//                              "productName": "橡胶1808",
//                              "tickerCode": "IF1803",
//                              "Posn": 296
//                          },
//                          {
//                              "Id": 1,
//                              "assetClass": "大宗商品期货1",
//                              "posnType": "交易",
//                              "productName": "橡胶1808",
//                              "tickerCode": "IF1803",
//                              "Posn": 296
//                          },
//                          {
//                              "Id": 2,
//                              "assetClass": "大宗商品期货2",
//                              "posnType": "交易",
//                              "productName": "橡胶1808",
//                              "tickerCode": "IF1803",
//                              "Posn": 296
//                          },
//                          {
//                              "Id": 3,
//                              "assetClass": "大宗商品期货3",
//                              "posnType": "交易",
//                              "productName": "橡胶1808",
//                              "tickerCode": "IF1803",
//                              "Posn": 296
//                          },
//                          {
//                              "Id": 123234,
//                              "assetClass": "大宗商品期货4",
//                              "posnType": "交易",
//                              "productName": "橡胶1808",
//                              "tickerCode": "IF1803",
//                              "Posn": 296
//                          },
//                          {
//                              "Id": 123234,
//                              "assetClass": "大宗商品期货5",
//                              "posnType": "交易",
//                              "productName": "橡胶1808",
//                              "tickerCode": "IF1803",
//                              "Posn": 296
//                          },
//                          {
//                              "Id": 123234,
//                              "assetClass": "大宗商品期货6",
//                              "posnType": "交易",
//                              "productName": "橡胶1808",
//                              "tickerCode": "IF1803",
//                              "Posn": 296
//                          },
//                          {
//                              "Id": 123234,
//                              "assetClass": "大宗商品期货7",
//                              "posnType": "交易",
//                              "productName": "橡胶1808",
//                              "tickerCode": "IF1803",
//                              "Posn": 296
//                          },
//                          {
//                              "Id": 123234,
//                              "assetClass": "大宗商品期货8",
//                              "posnType": "交易",
//                              "productName": "橡胶1808",
//                              "tickerCode": "IF1803",
//                              "Posn": 296
//                          },
//                          {
//                              "Id": 123234,
//                              "assetClass": "大宗商品期货9",
//                              "posnType": "交易",
//                              "productName": "橡胶1808",
//                              "tickerCode": "IF1803",
//                              "Posn": 296
//                          },
//                          {
//                              "Id": 123234,
//                              "assetClass": "大宗商品期货10",
//                              "posnType": "交易",
//                              "productName": "橡胶1808",
//                              "tickerCode": "IF1803",
//                              "Posn": 296
//                          },
//                          {
//                              "Id": 123234,
//                              "assetClass": "大宗商品期货11",
//                              "posnType": "交易",
//                              "productName": "橡胶1808",
//                              "tickerCode": "IF1803",
//                              "Posn": 296
//                          },
//                          {
//                              "Id": 123234,
//                              "assetClass": "大宗商品期货12",
//                              "posnType": "交易",
//                              "productName": "橡胶1808",
//                              "tickerCode": "IF1803",
//                              "Posn": 296
//                          },
//                          {
//                              "Id": 123234,
//                              "assetClass": "大宗商品期货13",
//                              "posnType": "交易",
//                              "productName": "橡胶1808",
//                              "tickerCode": "IF1803",
//                              "Posn": 296
//                          },
//                          {
//                              "Id": 123234,
//                              "assetClass": "大宗商品期货14",
//                              "posnType": "交易",
//                              "productName": "橡胶1808",
//                              "tickerCode": "IF1803",
//                              "Posn": 296
//                          },
//                          {
//                              "Id": 123234,
//                              "assetClass": "大宗商品期货15",
//                              "posnType": "交易",
//                              "productName": "橡胶1808",
//                              "tickerCode": "IF1803",
//                              "Posn": 296
//                          },
//                          {
//                              "Id": 123234,
//                              "assetClass": "大宗商品期货16",
//                              "posnType": "交易",
//                              "productName": "橡胶1808",
//                              "tickerCode": "IF1803",
//                              "Posn": 296
//                          },
//                          {
//                              "Id": 123234,
//                              "assetClass": "大宗商品期货17",
//                              "posnType": "交易",
//                              "productName": "橡胶1808",
//                              "tickerCode": "IF1803",
//                              "Posn": 296
//                          },
//                          {
//                              "Id": 123234,
//                              "assetClass": "大宗商品期货18",
//                              "posnType": "交易",
//                              "productName": "橡胶1808",
//                              "tickerCode": "IF1803",
//                              "Posn": 296
//                          },
//                      ]
//                  },
//                  "code": "",
//                  "resultMassage": "",
//                  "success": true
//              }
                //假数据END
                console.log(res.result)
                //groupcount > totalPage
                self.pagination = {
                    count: res.result.totalCount,
                    groupcount: 4,
                    totalPage: 7,
                    grouplist: 6
                }
                self.positionListRaw = res.result.result;
                self.renderList(1);
                });
            },
            renderList: function(pageindex) {
                var self = this;
                self.positionListOfPage = self.positionList['page' + pageindex]
                console.log(self.positionListOfPage)
            },
            submitSimulationPos: function() {
                var self = this;
                console.log(self)
                if (self.simulationPos.assetClassStr == '交易品种') {
                    alert('请选择交易品种')
                    return;
                }
                if (self.simulationPos.posnTypeStr == '仓位类型') {
                    alert('请选择仓位类型')
                    return;
                }
                $.ajax({
                    method: "POST",
                       url: "http://192.168.0.192:8080/risk-control/api/simulationPosition/save",
//                  url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/simulationPosition/save",
                    data: {
                        token: self.token,
                        assetClassStr: self.simulationPos.assetClassStr,
                        posnTypeStr: self.simulationPos.posnTypeStr,
                        tickerCode: self.simulationPos.tickerCode,
                        posn: self.simulationPos.posn,
                        productName: self.simulationPos.productName
                    }
                }).always(function(res) {
                    //假数据START

                    //假数据END
                    console.log(res.result)
                });
            },
            exportexcel: function() {
                var self = this;

                $.ajax({
                    method: "POST",
                       url: "http://192.168.0.192:8080/risk-control/api/report/exportExcel",
//                  url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/report/exportExcel",
                    data: {
                        token: self.token,
                        pageCodes: []
                    }
                }).always(function(res) {
                    //假数据START

                    //假数据END
                    console.log(res.result)
                });
            }


        }
    })


    Core.init();
    // Init Demo JS
    Demo.init();
    demoHighCharts.init();


    $(window).trigger('resize');

    var highColors = [bgInfo, bgPrimary, bgSuccess, bgWarning,
        bgDanger, bgSuccess, bgSystem, bgDark
    ];

    function hightchart1dh() {

        $('#1dh').highcharts({
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
                lineColor: "#C0C0C0",
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
            series: [{
                name: '1D 95%风险价值',
                data: [120]
            }, {
                name: '1D 99%风险价值',
                data: [110]
            }, {
                name: '1D 95%预期收益不足',
                data: [90]
            }, {
                name: '1D 99%预期收益不足',
                data: [100]
            }]
        });
    }



    function hightchart5dh() {
        var column_dh2 = $('#5dh');

        if (column_dh2.length) {
            // Column Chart 1
            $('#5dh').highcharts({
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
                    lineColor: "#C0C0C0",
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
                series: [{
                    name: '5D 95%风险价值',
                    data: [120]
                }, {
                    name: '5D 99%风险价值',
                    data: [110]
                }, {
                    name: '5D 95%预期收益不足',
                    data: [90]
                }, {
                    name: '5D 99%预期收益不足',
                    data: [100]
                }]
            });
        }
    }


    function hightchart10dh() {
        var column_dh3 = $('#10dh');

        if (column_dh3.length) {
            // Column Chart 1
            $('#10dh').highcharts({
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
                    tickLength: 6,
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
                series: [{
                    name: '10D 95%风险价值',
                    data: [100]
                }, {
                    name: '10D 99%预期收益不足',
                    data: [120]
                }, {
                    name: '10D 95%风险价值',
                    data: [80]
                }, {
                    name: '10D 99%预期收益不足',
                    data: [90]
                }]
            });
        }
    }
});