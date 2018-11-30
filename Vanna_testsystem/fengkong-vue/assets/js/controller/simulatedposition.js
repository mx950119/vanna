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
        props: ['posid', 'token'],
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
                       url: "http://192.168.0.192:8080/risk-control/api/simulationPosition/del",
//                  url: "http://www.easy-mock.com/mock/59ce5d28c5c4302238f59cb1/risk-control/api/simulationPosition/del",
                    data: {
                        token: self.token,
                        id: self.posid
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
            },
            editHandler: function(e) {
                var self = this;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/simulationPosition/edit",
                    data: {
                        token: self.token,
                        id: self.posid
                    }
                }).always(function(res) {
                    //假数据START
//                  res = {
//                      "result": {
//                          id: '233',
//                          assetClass: '期货',
//                          posnType: '交易',
//                          productName: '',
//                          tickerCode: 'IF1803',
//                          Posn: '111'
//                      },
//                      "code":"",
//                      "resultMassage":"",
//                      "success":true
//                  }
                    //假数据END
                    console.log(res.result)
                    self.$emit('update', res.result)
                });
            }
        }
    }


    new Vue({
        el: '#app',
        data: {
            ajaxCount: 0,
            loading: true,
            assetClass: [],
            posnType: [],
            selectedposnType: '仓位类型',
            pagination: {

            },
            curId: '',
            positionListRaw: [],
            simulationPos: {
                assetClassStr: '交易品种',
                posnTypeStr: '仓位类型',
                tickerCode: '',
                posn: '',
                productName: '',
                curUser: ''

            },
            positionListOfPage: [],
            productname: ''
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

            $('#uploadfilebtn').on('click', function(e) {
                    $('input[name=myfile]').trigger('click');
                 });
                $('input[name=myfile]').on('change', function(){
                 var formData = new FormData();
                     // formData.ppend(name, element);
                     formData.append('file', $('input[name=myfile]')[0].files[0]);
                     formData.append('token', self.token);
                     $.ajax({
                         url: 'http://192.168.0.192:8080/risk-control/api/simulationPosition/batchSave/check',
                         method: 'POST',
                         data: formData,
                         contentType: false, // 注意这里应设为false
                         processData: false,
                         cache: false,
                         success: function(data) {
                            console.log(data.result)
                              $.ajax({
                                    method: "POST",
                                    url: "http://192.168.0.192:8080/risk-control/api/simulationPosition/batchSave",
                                    data: {
                                        token: self.token,
                                        filePath: data.result
                                        
                                    }
                                   
                                }).always(function(res) {
                                    //假数据START
                                    
                                    //假数据END
                                    console.log(res.result)
                                    if(res.result.success) {
                                    	
                                        alert('上传成功')
                                    } else {
                                        alert('上传失败')
                                    }
                                }); 
                         },
                         error: function (jqXHR) {
                                alert('上传失败')
                         }
                     })
                     .done(function(data) {
                         console.log('done');
                     })
                     .fail(function(data) {
                         console.log('fail');
                     })
                     .always(function(data) {
                         console.log('always');
                     });

                })


            // $("#uploadfilebtn").uploadFile({
            //     url: "http://192.168.0.189:8080/risk-control/api/simulationPosition/batchSave/check",
            //     fileName: "myfile",
            //     dragDropStr: '<span class="mr10 icon fa fa-cloud-upload"></span>',
            //     dragdropWidth: 78,
            //     uploadStr: '上传数据',
            //     showStatusAfterSuccess: false,
            //     showStatusAfterError: false,
            //     showFileCounter: false,
            //     showFileSize: false
            // });


        },
        methods: {
            getProductName: function(){
                var self = this;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/simulationPosition/getProduct",
                    data: {
                        token: self.token,
                        assetClass: self.simulationPos.assetClassStr,
                        tickerCode: self.simulationPos.tickerCode
                    }
                }).always(function(res) {
                    //假数据START
                    
                    //假数据END
                    console.log(res.result)
                    self.simulationPos.productName = res.result[0].name;
                });
            },
            renderSimulationPosition: function(res){
                var self = this;
                self.simulationPos.assetClassStr = res.assetClass;
                self.simulationPos.posnTypeStr = res.posnType;
                self.simulationPos.tickerCode = res.tickerCode;
                self.simulationPos.posn = res.Posn;
                self.simulationPos.productName = res.productName;
                self.curId = res.id;
            
            },
            validateForm: function() {
                var self = this;
                var flag = false;
                    for(var i = 0; i< 1; i++) {
                        if (self.simulationPos.assetClassStr == '交易品种') {
                            alert('请选择交易品种')
                            break;
                        }
                        if (self.simulationPos.posnTypeStr == '仓位类型') {
                            alert('请选择仓位类型')
                            break;
                        }
                        if(self.simulationPos.tickerCode == '') {
                            alert('请填写交易品代码')
                            break;
                        }
                        if(self.simulationPos.posn == '') {
                            alert('请填写持仓量')
                            break;
                        }
                        
                        flag = true;
                    }
                    return flag
                    
            },
            updateSingleSimulation: function(){
              var self = this;
                if(!self.validateForm()) {
                    return false;
                }
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/simulationPosition/update",
                    data: {
                        token: self.token,
                        id: self.curId,
                        assetClassStr: self.simulationPos.assetClassStr,
                        posnTypeStr: self.simulationPos.posnTypeStr,
                        tickerCode: self.simulationPos.tickerCode,
                        posn: self.simulationPos.posn
                    }
                }).always(function(res) {


                    //假数据START
                    
                    //假数据END

                    if(!res.success ) {
                        if(res.resultMessage !== '请求参数缺失') {
                            alert(res.resultMessage);
                        }
                    } else {
                        alert('操作成功')
                         self.simulationPos.assetClassStr = '交易品种';
                        self.simulationPos.posnTypeStr = '仓位类型';
                        self.simulationPos.tickerCode = '';
                        self.simulationPos.posn = '';
                        self.simulationPos.productName = '';
                        self.curId = '';
                        self.getPositionList();
                    }

                    // console.log(res.result)
                   
                })  

            },
            getLoginInfo: function() {
                var self = this;
                self.loading = true;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/client/getLoginInfo",
                    data: {
                        token: self.token,
                    }
                }).always(function(res) {
                    //假数据START
                    
                    //假数据END
                    // console.log(res.result)
                    self.simulationPos.curUser = res.result.clientName;
                    self.ajaxCount++;
                    self.loadingEnd();
                   
                })
            },
            varoptionschanged: function(value) {
                var self = this;

                self.varParam = value;
                self.getAndRenderAllCharts();
            },
            getAssetClass: function() {
                var self = this;
                self.loading = true;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/simulationPosition/getAssetClass",
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
                    self.ajaxCount++;
                    self.loadingEnd();

                });
            },
            getPosnType: function() {
                var self = this;
                self.loading = true;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/simulationPosition/getPosnType",
                    data: {}
                }).always(function(res) {
                    //假数据START
                    
                    //假数据END
                    console.log(res.result)
                    var result = res.result;
                    result.unshift('仓位类型');
                    self.posnType = result;
                    self.ajaxCount++;
                    self.loadingEnd();
                });
            },
            getPositionList: function() {
                var self = this;
                self.loading = true;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/simulationPosition/list",
                    data: {
                        token: self.token
                    }
                }).always(function(res) {
                //假数据START

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
                self.ajaxCount++;
                self.loadingEnd();
                });
            },
            renderList: function(pageindex) {
                var self = this;
                self.positionListOfPage = self.positionList['page' + pageindex]
                console.log(self.positionListOfPage)
            },
            submitSimulationPos: function() {
                var self = this;
                if(!self.validateForm()) {
                    return false;
                }
                console.log(self)

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

                    if(!res.success ) {
                        if(res.resultMessage !== '请求参数缺失') {
                            alert(res.resultMessage);
                        }
                    } else {
                        alert('操作成功')
                        self.simulationPos.assetClassStr = '交易品种';
                        self.simulationPos.posnTypeStr = '仓位类型';
                        self.simulationPos.tickerCode = '';
                        self.simulationPos.posn = '';
                        self.simulationPos.productName = '';
                        self.curId = '';
                        self.getPositionList();
                    }

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
            },
            loadingEnd: function(){
                var self = this;
                if(self.ajaxCount == 4) {
                    self.loading = false;
                }
               
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