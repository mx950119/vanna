jQuery(document).ready(function() {
    "use strict";
    // Init Demo JS
    Demo.init();
    // Init Theme Core
    Core.init();
    demoHighCharts.init();

    var ChildOperationButton = {
        props: ['item', 'token'],
        template: ['<div class="btn-group text-right">' +
            '<button type="button" data-toggle="dropdown" aria-expanded="false" class="btn btn-success br2 btn-xs fs12 dropdown-toggle">操作<span class="caret ml15"></span></button>' +
            '<ul role="menu" class="dropdown-menu">' +
            '<li>' +
            '<a @click="editHandler" href="#">编辑</a>' +
            '</li>' +
            '<li>' +
            '<a @click="delHandler" href="#">删除</a>' +
            '</li>' +
            '</ul>' +
            '</div>'
        ].join(),

        methods: {
            delHandler: function(e) {
                var self = this;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/clientPosition/del",
                    data: {
                        token: self.token,
                        id: self.item.id
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

                    self.$emit('requeryclientposition')
                    // self.queryClientPosition();
                });
            },
            editHandler: function(e) {
                var self = this;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/clientPosition/view",
                    data: {
                        token: self.token,
                        id: self.item.id
                    }
                }).always(function(res) {
                    //假数据START
                    
                    //假数据END
                    console.log(res.result)
                    self.$emit('editclientposition', res.result)

                });
            },
        }
    }

    var ChildDatePicker = {
        props: ['dateshowed', 'labelid'],
        template: '<input  :id="labelid" :name="labelid" type="text" :value="dateshowed"  placeholder="Filter by Date" class="gui-input"/>',
        mounted: function() {
            var self = this;
            $(this.$el).datepicker({
                numberOfMonths: 1,
                showOn: 'both',
                buttonText: '',
                prevText: '',
                nextText: '',
                beforeShow: function(input, inst) {
                    var newclass = 'admin-form';
                    var themeClass = $(this).parents('.admin-form').attr('class');
                    var smartpikr = inst.dpDiv.parent();
                    alert(smartpikr);
                    if (!smartpikr.hasClass(themeClass)) {
                        inst.dpDiv.wrap('<div class="' + themeClass + '"></div>');
                    }
                },
                onSelect: function(dateText, event) {
                    self.$emit('selectedhandler', dateText, self.labelid)
                }
            });
        },
    }
    new Vue({
        el: '#app',
        data: {
            positionListOfPage: [],
            pagination: {
                currentPage: 1,
                rowsPage: 10,
                totalCount: 1,
                totalPage: '',
                groupcount: 4
            },
            hasPrivilegesToShowCreate: false,
            assetClass: [],
            traderList:[],
            posnType: [],
            fundId: [],
            bookId: [{
                        fundId: '',
                        fundName: '子基金'
                    }],
            clientPos: {
                fundId: '',
                bookId: '',
                traderId: '',
                assetClass: '交易品种',
                posnType: '仓位类型',
                tickerCode: '',
                posn: '',
                dailyPnl: '',
                mtdPnl: '',
                ytdPnl: '',
                unitCode: '',
                ovm: '',
                id: ''
            },
            errorMsg: {
                fundId: '基金',
                // bookId: '子基金',
                assetClass: '交易品种',
                posnType: '仓位类型',
                tickerCode: '交易品代码',
                posn: '持仓量',
                dailyPnl: '日盈亏',
                // mtdPnl: '月盈亏',
                // ytdPnl: '年盈亏',
                // unitCode: '平均成本',
                ovm: '管理资金规模' 
            },
            queryparam: {
                traderId: '请选择交易员',
                tickerCode: '',
                assetClass: '交易品种',
                startDate: '',
                endDate: '',
                currentPage: 1,
                rowsPage: 10
            },
            clientPositionList: [],
            productname: ''
        },
        computed: {
            token: function() {
                return getCookie('token')
            }

        },
        components: {
            'date-picker': ChildDatePicker,
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

                $('#uploadfilebtn').on('click', function(e) {
                    $('input[name=myfile]').trigger('click');
                 });
                $('input[name=myfile]').on('change', function(){
                 var formData = new FormData();
                     // formData.ppend(name, element);
                     formData.append('positionFile', $('input[name=myfile]')[0].files[0]);
                     formData.append('token', self.token);
                     $.ajax({
                         url: 'http://192.168.0.192:8080/risk-control/api/clientPosition/upload',
                         method: 'POST',
                         data: formData,
                         contentType: false, // 注意这里应设为false
                         processData: false,
                         cache: false,
                         success: function(data) {
                            console.log(data)
                              $.ajax({
                                    method: "POST",
                                    url: "http://192.168.0.192:8080/risk-control/api/clientPosition/batchSave",
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
            //     url: "http://192.168.0.189:8080/risk-control/api/clientPosition/upload",
            //     formData: {
            //         token: self.token
            //     },
            //     fileName: "myfile",
            //     dragDropStr: '<span class="mr10 icon fa fa-cloud-upload"></span>',
            //     dragdropWidth: 78,
            //     uploadStr: '上传数据',
            //     showStatusAfterSuccess: false,
            //     showStatusAfterError: false,
            //     showFileCounter: false,
            //     showFileSize: false,
            //     onSuccess: function(files, response, xhr, pd){
            //        $.ajax({
            //         method: "POST",
            //         url: "http://192.168.0.189:8080/risk-control/api/clientPosition/batchSave",
            //         data: {
            //             token: self.token,
            //             filePath: response.result
            //         }
            //     }).always(function(res) {
            //         //假数据START
                    
            //         //假数据END
            //         console.log(res.result)
            //         if(res.result.success) {
            //             alert('上传成功')
            //         } else {
            //             alert('上传失败')
            //         }
            //         // self.traderList = res.result;
            //     }); 
            //     },
            //     onError:function(){
            //         alert('上传失败')
            //     }
            // });
            self.getPrivileges();
            self.getTraderList();
            self.getLoginInfo();
            self.getAssetClass();
            self.getPosnType();
            self.getFundId();
            self.getListTeam();
            self.getThreshold();
            self.queryClientPosition();

        },
        methods: {

            getTraderList: function(){
                var self = this;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/client/listTraderByLogin",
                    data: {
                        token: self.token
                    }
                }).always(function(res) {
                    //假数据START
//                  res = {
//                      "result":[{
//                          clientId: 123,
//                          realName: '小张'
//                      },{
//                          clientId: 222,
//                          realName: '小er'
//                      },{
//                          clientId: 333,
//                          realName: '小5'
//                      },{
//                          clientId: 444,
//                          realName: '小4'
//                      },],
//                      "code":"",
//                      "resultMassage":"",
//                      "success":true
//                  };
                    //假数据END
                    console.log(res.result)
                    self.traderList = [{
                        clientId: '请选择交易员',
                        realName: '请选择交易员'
                    }].concat(res.result);
                    // self.traderList = res.result;
                });
    
            },
            getProductName: function(){
                var self = this;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/simulationPosition/getProduct",
                    data: {
                        token: self.token,
                        assetClass: self.clientPos.assetClass,
                        tickerCode: self.clientPos.tickerCode
                    }
                }).always(function(res) {
                    //假数据START
//                  res = {
//                      "result":[{
//                      tickerCode: '1334',
//                      name:'aaa'
//                  }],
//                      "code":"",
//                      "resultMassage":"",
//                      "success":true
//                  };
                    //假数据END
                    console.log(res.result)
                    self.productname = res.result[0].name;
                });
            },
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
            getPrivileges: function(){
                var self = this;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/client/getPrivileges",
                    data: {
                        token: self.token
                    }
                }).always(function(res) {
                    //假数据START
//                  res = {
//                      "result":['数据管理','导出报告'],
//                      "code":"",
//                      "resultMassage":"",
//                      "success":true
//                  };
                    //假数据END
                    console.log(res.result)
                    self.hasPrivilegesToShowCreate = res.result.indexOf('数据管理') != -1  ? true : false;

                });

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
//                  res = {
//                      "result":["股票","期货"],
//                      "code":"",
//                      "resultMassage":"",
//                      "success":true
//                  };
                    //假数据END
                    console.log(res.result)
                    var result = res.result;
                    result.unshift('交易品种');
                    self.assetClass = result;

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
//                  res = {
//                      "result":["交易","对冲"],
//                      "code":"",
//                      "resultMassage":"",
//                      "success":true
//                  }
                    //假数据END
                    console.log(res.result)
                    var result = res.result;
                    result.unshift('仓位类型');
                    self.posnType = result;
                });
            },
            getFundId: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                       url: "http://192.168.0.192:8080/risk-control/api/client/listSuperFund",
                    data: {
                        token: self.token
                    }
                }).always(function(res) {
                    //假数据START
//                  res = {
//                      "result":[{
//                          fundId: 222,
//                          fundName: '基金A'
//                      },{
//                          fundId: 3333,
//                          fundName: '基金B'
//                      }],
//                      "code":"",
//                      "resultMassage":"",
//                      "success":true
//                  }
                    //假数据END
                    console.log(res.result)
                    var result = res.result;
                    result.unshift({
                        fundId: '',
                        fundName: '基金'
                    });
                    self.fundId = result;
                });
            },
            getBookId: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                       url: "http://192.168.0.192:8080/risk-control/api/client/listSubFund",
                    data: {
                        token: self.token,
                        parentId: self.clientPos.fundId
                    }
                }).always(function(res) {
                    //假数据START
//                  res = {
//                      "result":[{
//                          fundId: 444,
//                          fundName: '子基金A'
//                      },{
//                          fundId: 555,
//                          fundName: '子基金B'
//                      }],
//                      "code":"",
//                      "resultMassage":"",
//                      "success":true
//                  }
                    //假数据END
                    console.log(res.result)
                    var result = res.result;
                    result.unshift({
                        fundId: '',
                        fundName: '子基金'
                    });
                    self.bookId = result;
                });
            },
            saveClientPosition: function() {
                var self = this;
                if(!self.validateForm()) {
                    return false;
                }

                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/clientPosition/save",
                    data: {
                        token: self.token,
                        fundId: self.clientPos.fundId,
                        bookId: self.clientPos.bookId,
                        traderId: self.clientPos.traderId,
                        assetClass: self.clientPos.assetClass,
                        posnType: self.clientPos.posnType,
                        tickerCode: self.clientPos.tickerCode,
                        posn: self.clientPos.posn,
                        dailyPnl: self.clientPos.dailyPnl,
                        mtdPnl: self.clientPos.mtdPnl,
                        ytdPnl: self.clientPos.ytdPnl,
                        unitCode: self.clientPos.unitCode,
                        ovm: self.clientPos.ovm
                    }
                }).always(function(res) {
                    //假数据START
                    //假数据END
                    self.queryClientPosition();
                    // console.log(res.result)
                    if(!res.success) {
                        if(res.resultMessage !== '请求参数缺失') {
                            alert(res.resultMessage);
                        }
                    } else {
                        alert('操作成功')
                    }

                });
            },
            validateForm: function() {
                var self = this;
                if (self.clientPos.assetClass == '交易品种') {
                    alert('请选择交易品种')
                    return false;
                }
                if (self.clientPos.posnType == '仓位类型') {
                    alert('请选择仓位类型')
                    return false;
                }
                console.log(self.clientPos)
                $.each(self.clientPos, function(k, v) {
                    console.log(k)
                    console.log(v)
                    if(v== '' && self.errorMsg[k]) {
                        alert('请填写' + self.errorMsg[k])
                        return false;
                    }
                })
                return true;
            },
            renderClientPosition: function(data){
                var self = this;
                self.clientPos.fundId = data.fundId;
                self.clientPos.bookId = data.bookId;
                self.clientPos.traderId = data.traderId;
                self.clientPos.assetClass = data.assetClass;
                self.clientPos.posnType = data.posnType;
                self.clientPos.tickerCode = data.tickerCode;
                self.clientPos.posn = data.posn;
                self.clientPos.dailyPnl = data.dailyPnl;
                self.clientPos.mtdPnl = data.mtdPnl;
                self.clientPos.ytdPnl = data.ytdPnl;
                self.clientPos.unitCode = data.unitCode;
                self.clientPos.ovm = data.ovm;
                self.clientPos.id = data.id;

            },
            updateClientPosition: function() {
                var self = this;
                if(!self.validateForm()) {
                    return false;
                }
                $.ajax({
                    method: "POST",
                       url: "http://192.168.0.192:8080/risk-control/api/clientPosition/update",
                    data: {
                        token: self.token,
                        fundId: self.clientPos.fundId,
                        bookId: self.clientPos.bookId,
                        traderId: self.clientPos.traderId,
                        assetClass: self.clientPos.assetClass,
                        posnType: self.clientPos.posnType,
                        tickerCode: self.clientPos.tickerCode,
                        posn: self.clientPos.posn,
                        dailyPnl: self.clientPos.dailyPnl,
                        mtdPnl: self.clientPos.mtdPnl,
                        ytdPnl: self.clientPos.ytdPnl,
                        unitCode: self.clientPos.unitCode,
                        ovm: self.clientPos.ovm,
                        id: self.clientPos.id
                    }
                }).always(function(res) {
                    //假数据START
                    // res = {
                    //     // "result":[{
                    //     //     fundId: 444,
                    //     //     fundName: '子基金A'
                    //     // },{
                    //     //     fundId: 555,
                    //     //     fundName: '子基金B'
                    //     // }],
                    //     "result": null,
                    //     "code":"301",
                    //     "resultMessage":"请求参数缺失",
                    //     "success":false
                    // }
                    //假数据END
                    console.log(res.result)
                    if(!res.success ) {
                        if(res.resultMessage !== '请求参数缺失') {
                            alert(res.resultMessage);
                        }
                    } else {
                        alert('操作成功')
                        self.clientPos.fundId = '';
                        self.clientPos.bookId = '';
                        self.clientPos.traderId = '';
                        self.clientPos.assetClass = '交易品种';
                        self.clientPos.posnType = '仓位类型';
                        self.clientPos.tickerCode = '';
                        self.clientPos.posn = '';
                        self.clientPos.dailyPnl = '';
                        self.clientPos.mtdPnl = '';
                        self.clientPos.ytdPnl = '';
                        self.clientPos.unitCode = '';
                        self.clientPos.ovm = '';
                        self.clientPos.id = '';
                    }
                    self.queryClientPosition();
                   
                });
            },
            queryClientPosition: function(curPage) {
                var self = this;
                self.queryparam.currentPage = curPage;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/clientPosition/list",
                    data: {
                        token: self.token,
                        traderId: self.queryparam.traderId == '请选择交易员' ? '' :  self.queryparam.traderId,
                        tickerCode: self.queryparam.tickerCode,
                        assetClass: self.queryparam.assetClass == '交易品种' ? '' : self.queryparam.assetClass,
                        startDate: self.queryparam.startDate,
                        endDate: self.queryparam.endDate,
                        currentPage: self.queryparam.currentPage,
                        rowsPage: self.queryparam.rowsPage
                    }
                }).always(function(res) {
                    //假数据START
                    

                    //假数据END
                    // console.log(res.result)
                   
                    // self.pagination = res.result.pager;
                    self.pagination.currentPage = res.pager.currentPage;
                    self.pagination.rowsPage = res.pager.rowsPage;
                    self.pagination.totalCount = res.pager.totalCount;
                    self.pagination.totalPage  = res.pager.totalPage;
                    console.log('++++')
                    console.log(self.pagination)
                    // self.clientPositionList = res.result;
                    self.positionListOfPage = res.result;
                    // queryparam.currentPage = self.pagination.currentPage + 1;
                });
            },
            getThreshold: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/client/getThreshold",
                    data: {
                        token: self.token
                    }
                }).always(function(res) {
                    //假数据START
                    
                    //假数据END
                    // console.log(res.result)
                    self.thresholdList = res.result;
                });
            },
            getListTeam: function() {
                var self = this;
                $.ajax({
                    method: "POST",
                    url: "http://192.168.0.192:8080/risk-control/api/client/listTeam",
                    data: {
                        token: self.token,
                    }
                }).always(function(res) {
                    //假数据START
                    // res = {
                    //     result: [{
                    //         teamId: 11,
                    //         teamName: 'A组'
                    //     }, {
                    //         teamId: 113,
                    //         teamName: 'B组'
                    //     }, {
                    //         teamId: 114,
                    //         teamName: 'C组'
                    //     }],
                    //     code: "",
                    //     resultMassage: "",
                    //     success: true
                    // }
                    //假数据END
                    self.teamList = [{
                        teamId: '',
                        teamName: '请选择小组'
                    }].concat(res.result);
                    // console.log(self.teamList)


                });
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
                    
                    //假数据END
                    // console.log(res.result)
                    // self.clientPos.traderId = self.queryparam.traderId = res.result.clientId
                    self.clientPos.traderId =  res.result.clientId
                   
                })
            },
            // getListTrader: function() {
            //     var self = this;
            //     $.ajax({
            //         method: "POST",
            //         url: "http://192.168.0.192:8080/risk-control/api/client/listTrader",
            //         data: {
            //             token: self.token,
            //             teamId: self.teamIdSelected
            //         }
            //     }).always(function(res) {
            //         //假数据START
            //         // res = {
            //         //     result: [{
            //         //         clientId: 112,
            //         //         realName: '张三'
            //         //     }, {
            //         //         clientId: 11,
            //         //         realName: '李四'
            //         //     }, {
            //         //         clientId: 11,
            //         //         realName: '王五'
            //         //     }, {
            //         //         clientId: 11,
            //         //         realName: '哈哈'
            //         //     }],
            //         //     code: "",
            //         //     resultMassage: "",
            //         //     success: true
            //         // }
            //         //假数据END

            //         self.traderList = [{
            //             clientId: '',
            //             realName: '请选择交易员'
            //         }].concat(res.result);
            //         console.log(self.traderList)

            //     });
            // },

        }
    })

    // runVectorMaps();
    // $(window).trigger('resize');
    // // Init plugins for ".calendar-widget"
    // // plugins: FullCalendar
    // //
    // $('#calendar-widget').fullCalendar({
    //  header: {
    //      right: ' prev,next,today,month,agendaWeek,agendaDay'
    //  },
    //  editable: true,
    //  events: [{
    //          title: 'ALL Day event',
    //          start: '2016-02-2',
    //          end: '2016-02-2',
    //          className: 'fc-event-warning'
    //      },
    //      {
    //          title: 'ALL DAY EVENT',
    //          start: '2016-03-11',
    //          end: '2016-03-11',
    //          className: 'fc-event-warning'
    //      },
    //      {
    //          title: 'Sony Meeting',
    //          start: '2016-05-2',
    //          end: '2016-05-2',
    //          className: 'fc-event-warning'
    //      },

    //      {
    //          title: 'Conference',
    //          start: '2016-05-11',
    //          end: '2016-05-13',
    //          className: 'fc-event-info'
    //      },

    //      {
    //          title: 'LONG EVENT',
    //          start: '2016-03-21',
    //          end: '2016-03-23',
    //          className: 'fc-event-info'
    //      }
    //  ],
    //  eventRender: function(event, element) {
    //      // create event tooltip using bootstrap tooltips
    //      $(element).attr("data-original-title", event.title);
    //      $(element).tooltip({
    //          container: 'body',
    //          delay: {
    //              "show": 100,
    //              "hide": 200
    //          }
    //      });
    //      // create a tooltip auto close timer
    //      $(element).on('show.bs.tooltip', function() {
    //          var autoClose = setTimeout(function() {
    //              $('.tooltip').fadeOut();
    //          }, 3500);
    //      });
    //  }
    // });
    // // Init plugins for ".task-widget"
    // // plugins: Custom Functions + jQuery Sortable
    // //
    // $('#datepicker2').datepicker({
    //  numberOfMonths: 1,
    //  showOn: 'both',
    //  buttonText: '<i class="fa fa-calendar-o"></i>',
    //  prevText: '<i class="fa fa-chevron-left"></i>',
    //  nextText: '<i class="fa fa-chevron-right"></i>',
    //  beforeShow: function(input, inst) {
    //      var newclass = 'admin-form';
    //      var themeClass = $(this).parents('.admin-form').attr('class');
    //      var smartpikr = inst.dpDiv.parent();
    //      if(!smartpikr.hasClass(themeClass)) {
    //          inst.dpDiv.wrap('<div class="' + themeClass + '"></div>');
    //      }
    //  }
    // });

    // var taskWidget = $('div.task-widget');
    // var taskItems = taskWidget.find('li.task-item');
    // var currentItems = taskWidget.find('ul.task-current');
    // var completedItems = taskWidget.find('ul.task-completed');
    // // Init jQuery Sortable on Task Widget
    // taskWidget.sortable({
    //  items: taskItems, // only init sortable on list items (not labels)
    //  handle: '.task-menu',
    //  axis: 'y',
    //  connectWith: ".task-list",
    //  update: function(event, ui) {
    //      var Item = ui.item;
    //      var ParentList = Item.parent();
    //      // If item is already checked move it to "current items list"
    //      if(ParentList.hasClass('task-current')) {
    //          Item.removeClass('item-checked').find('input[type="checkbox"]').prop('checked', false);
    //      }
    //      if(ParentList.hasClass('task-completed')) {
    //          Item.addClass('item-checked').find('input[type="checkbox"]').prop('checked', true);
    //      }
    //  }
    // });
    // // Custom Functions to handle/assign list filter behavior
    // taskItems.on('click', function(e) {
    //  e.preventDefault();
    //  var This = $(this);
    //  var Target = $(e.target);
    //  if(Target.is('.task-menu') && Target.parents('.task-completed').length) {
    //      This.remove();
    //      return;
    //  }
    //  if(Target.parents('.task-handle').length) {
    //      // If item is already checked move it to "current items list"
    //      if(This.hasClass('item-checked')) {
    //          This.removeClass('item-checked').find('input[type="checkbox"]').prop('checked', false);
    //      }
    //      // Otherwise move it to the "completed items list"
    //      else {
    //          This.addClass('item-checked').find('input[type="checkbox"]').prop('checked', true);
    //      }
    //  }
    // });

    // var sparkBars = $('.inlinesparkbars');

    // var sparkColors = {
    //  "primary": [bgPrimary, bgPrimaryLr, bgPrimaryDr],
    //  "info": [bgInfo, bgInfoLr, bgInfoDr],
    //  "warning": [bgWarning, bgWarningLr, bgWarningDr],
    //  "success": [bgSuccess, bgSuccessLr, bgSuccessDr],
    //  "alert": [bgAlert, bgAlertLr, bgAlertDr]
    // };
    // // Init Sparkbars
    // if(sparkBars.length) {

    //  var sparkbarInit = function() {
    //      $('.inlinesparkbars').each(function(i, e) {
    //          var This = $(this);
    //          var Color = sparkColors["primary"];
    //          var Height = '120';
    //          This.children().remove();
    //          // default color is "primary"
    //          // Color[0] = default shade
    //          // Color[1] = light shade
    //          // Color[2] = dark shade
    //          //alert('hi')
    //          // User assigned color and height, else default
    //          var userColor = This.data('spark-color');
    //          var userHeight = This.data('spark-height');

    //          if(userColor) {
    //              Color = sparkColors[userColor];
    //          }
    //          if(userHeight) {
    //              Height = userHeight;
    //          }
    //          $(e).sparkline('html', {
    //              type: 'bar',
    //              barWidth: 5,
    //              barSpacing: 2,
    //              height: Height,
    //              zeroAxis: false,
    //              barColor: Color[0]
    //          });
    //      });
    //  }

    //  // Refresh Sparklines on Resize
    //  var refreshSparkbars;

    //  $(window).resize(function(e) {
    //      clearTimeout(refreshSparkbars);
    //      refreshSparkbars = setTimeout(sparkbarInit, 500);
    //  });

    //  sparkbarInit();
    // }

    // var highColors = [bgSystem, bgSuccess, bgWarning, bgPrimary];
    // // Chart data
    // var seriesData = [{
    //  name: 'Phones',
    //  data: [0, 9, 17, 22, 19, 11.5, 5.2, 9, 17, 22, 19, 11.5, 5.2, 9, 17, 22, 19, 11.5, 5.2]
    // }];
    // var ecomChart = $('#ecommerce_chart1');
    // if(ecomChart.length) {
    //  ecomChart.highcharts({
    //      chart: {
    //          type: 'areaspline',
    //          marginTop: 30,
    //          backgroundColor: 'transparent',
    //      },
    //      credits: {
    //          enabled: false
    //      },

    //      title: {
    //          text: ''
    //      },
    //      yAxis: {
    //          title: {
    //              text: ''
    //          },
    //          gridLineColor: '#f0f2f6',
    //          gridLineWidth: 2,
    //          labels: {
    //              formatter: function() {
    //                  return this.value;
    //              },
    //              style: {
    //                  color: '#d1d4da',
    //                  "textTransform": "uppercase",
    //                  "fontSize": "12px",
    //                  "letterSpacing": 0.02
    //              }
    //          }
    //      },
    //      xAxis: {
    //          type: 'datetime',
    //          labels: {
    //              overflow: 'justify',
    //              style: {
    //                  color: '#d1d4da',
    //                  "textTransform": "uppercase",
    //                  "fontSize": "10px",
    //                  "letterSpacing": 0.02
    //              },
    //              y: 30
    //          },
    //          lineWidth: 0,
    //          tickWidth: 0,
    //          formatter: function() {
    //              return this.value; // clean, unformatted number for year
    //          }
    //      },
    //      tooltip: {
    //          valueSuffix: ' $'
    //      },
    //      plotOptions: {
    //          areaspline: {
    //              lineWidth: 1,
    //              states: {
    //                  hover: {
    //                      lineWidth: 1
    //                  }
    //              },
    //              marker: {
    //                  enabled: false
    //              },
    //              pointInterval: 86400000, // one day
    //              pointStart: Date.UTC(2016, 3, 31, 0, 0, 0)
    //          }
    //      },
    //      series: [{
    //          name: 'Hestavollane',
    //          showInLegend: false,
    //          lineColor: 'rgba(0,0,0,0)',
    //          fillColor: {
    //              linearGradient: {
    //                  x1: 0,
    //                  y1: 0,
    //                  x2: 0,
    //                  y2: 1
    //              },
    //              stops: [
    //                  [0.0, '#5ddcff'],
    //                  [0.5, '#5ddcff'],
    //                  [1.0, '#5cbbe3']
    //              ]
    //          },
    //          data: [0, 850, 900, 1200, 1500, 1000, 1300, 1500, 2300, 2500, 2600, 2200, 3000, 3600, 3500, 2500, 2000, 0]

    //      }],
    //      navigation: {
    //          menuItemStyle: {
    //              fontSize: '10px'
    //          }
    //      }
    //  });

    //  $('#ecommerce_chart1-new-data').click(function(e) {
    //      e.preventDefault();
    //      $('.chart-1').removeClass('active-default')
    //      $(this).addClass('active-success');

    //      var chart = $('#ecommerce_chart1').highcharts();
    //      chart.series[0].setData([0, 850, 900, 1200, 1100, 1000, 1200, 1400, 2200, 2300, 2600, 2200, 2700, 3100, 3000, 2400, 2000, 0]);
    //  });

    //  $('#ecommerce_chart1-new-data-2').click(function(e) {
    //      e.preventDefault();
    //      $('.chart-1').removeClass('active-success');
    //      $(this).addClass('active-default');

    //      var chart = $('#ecommerce_chart1').highcharts();
    //      chart.series[0].setData([0, 450, 800, 1300, 1600, 1200, 1100, 1500, 2300, 2400, 2500, 2500, 2800, 2300, 2100, 1500, 1300, 300]);
    //  });
    // }

    // var seriesData2 = [{
    //  name: 'Phones',
    //  data: [5.0, 9, 17, 22, 19, 11.5, 5.2, 9.5, 11.3, 15.3, 19.9, 24.6]
    // }];

    // var ecomChart2 = $('#ecommerce_chart2');
    // if(ecomChart2.length) {
    //  ecomChart2.highcharts({
    //      chart: {
    //          zoomType: 'x',
    //          backgroundColor: 'transparent',
    //      },
    //      credits: false,
    //      title: {
    //          text: ''
    //      },
    //      yAxis: {
    //          title: {
    //              text: ''
    //          },
    //          gridLineColor: '#f0f2f6',
    //          gridLineWidth: 2,
    //          labels: {
    //              formatter: function() {
    //                  return this.value;
    //              },
    //              style: {
    //                  color: '#d1d4da',
    //                  "textTransform": "uppercase",
    //                  "fontSize": "12px",
    //                  "letterSpacing": 0.02
    //              }
    //          }
    //      },
    //      xAxis: {
    //          type: 'datetime',
    //          categories: ['Jan', 'Feb', 'Mar', 'Apr',
    //              'May', 'Jun', 'Jul', 'Aug',
    //              'Sep', 'Oct', 'Nov', 'Dec'
    //          ],
    //          tickWidth: 0,
    //          lineWidth: 0,
    //          labels: {
    //              overflow: 'justify',
    //              style: {
    //                  color: '#d1d4da',
    //                  "textTransform": "uppercase",
    //                  "fontSize": "10px",
    //                  "letterSpacing": 0.02
    //              },
    //              y: 30
    //          }
    //      },
    //      legend: {
    //          enabled: false
    //      },
    //      plotOptions: {
    //          area: {
    //              fillColor: {
    //                  linearGradient: {
    //                      x1: 0,
    //                      y1: 0,
    //                      x2: 0,
    //                      y2: 1
    //                  },
    //                  stops: [
    //                      [0, 'rgba(67, 199, 215, .7)'],
    //                      [0.5, 'rgba(67, 199, 215, .3)'],
    //                      [1, 'rgba(67, 199, 215, 0)']
    //                  ]
    //              },
    //              marker: {
    //                  radius: 6,
    //                  lineWidth: 4,
    //                  lineColor: '#fff'
    //              },
    //              lineWidth: 3,
    //              threshold: null
    //          }
    //      },

    //      series: [{
    //          type: 'area',
    //          name: 'Orders',
    //          data: [0, 1400, 900, 1200, 1500, 1000, 1300, 1500, 2900, 2500, 2600, 2200],
    //          color: '#43c7d7'
    //      }]
    //  });

    //  $('#ecommerce_chart2-new-data').click(function(e) {
    //      e.preventDefault();
    //      $('.filter-range').removeClass('bg-whitesmoke');
    //      $(this).addClass('bg-whitesmoke');

    //      var chart = $('#ecommerce_chart2').highcharts();
    //      chart.series[0].setData([0, 1400, 900, 1200, 1500, 1000, 1300, 1500, 2900, 2500, 2600, 2200]);
    //  });

    //  $('#ecommerce_chart2-new-data-2').click(function(e) {
    //      e.preventDefault();
    //      $('.filter-range').removeClass('bg-whitesmoke');
    //      $(this).addClass('bg-whitesmoke');

    //      var chart = $('#ecommerce_chart2').highcharts();
    //      chart.series[0].setData([1400, 1200, 0, 900, 1500, 1300, 1000, 2900, 1500, 2600, 2500, 2200]);
    //  });

    //  $('#ecommerce_chart2-new-data-3').click(function(e) {
    //      e.preventDefault();
    //      $('.filter-range').removeClass('bg-whitesmoke');
    //      $(this).addClass('bg-whitesmoke');

    //      var chart = $('#ecommerce_chart2').highcharts();
    //      chart.series[0].setData([100, 400, 900, 1100, 1500, 1400, 1600, 1100, 2000, 2100, 1600, 2000]);
    //  });
    // }

    // var ecomChart3 = $('#ecommerce_chart3');
    // if(ecomChart3.length) {
    //  ecomChart3.highcharts({
    //      chart: {
    //          zoomType: 'x',
    //          backgroundColor: 'transparent',
    //      },
    //      credits: false,
    //      title: {
    //          text: ''
    //      },
    //      yAxis: {
    //          title: {
    //              text: ''
    //          },
    //          gridLineColor: '#f0f2f6',
    //          gridLineWidth: 0,
    //          tickWidth: 0,
    //          lineWidth: 0,
    //          labels: {
    //              enabled: false
    //          }
    //      },
    //      xAxis: {
    //          labels: {
    //              enabled: false
    //          },
    //          tickWidth: 0,
    //          lineWidth: 0,
    //          gridLineWidth: 0
    //      },
    //      legend: {
    //          enabled: false
    //      },
    //      plotOptions: {
    //          area: {
    //              fillColor: {
    //                  linearGradient: {
    //                      x1: 0,
    //                      y1: 0,
    //                      x2: 0,
    //                      y2: 1
    //                  },
    //                  stops: [
    //                      [0, 'rgba(67, 199, 215, .7)'],
    //                      [0.5, 'rgba(67, 199, 215, .3)'],
    //                      [1, 'rgba(67, 199, 215, 0)']
    //                  ]
    //              },
    //              marker: {
    //                  radius: 3,
    //                  lineWidth: 0,
    //                  lineColor: '#fff'
    //              },
    //              lineWidth: 2,
    //              threshold: null
    //          }
    //      },

    //      series: [{
    //          type: 'area',
    //          name: 'Orders',
    //          data: [0, 1400, 900, 1200, 1500, 1000, 1300, 1500, 2900, 2500, 2600, 2200],
    //          color: '#43c7d7'
    //      }]
    //  });
    // }
    // // Widget VectorMap
    // function runVectorMaps() {
    //  // Jvector Map Plugin
    //  var runJvectorMap = function() {
    //      // Data set
    //      var mapData = [900, 700, 350, 500];
    //      // Init Jvector Map
    //      $('#WidgetMap').vectorMap({
    //          map: 'world_mill_en',
    //          backgroundColor: 'transparent',
    //          series: {
    //              markers: [{
    //                  attribute: 'r',
    //                  scale: [3, 7],
    //                  values: mapData
    //              }]
    //          },
    //          regionStyle: {
    //              initial: {
    //                  fill: '#eaedf1'
    //              },
    //              hover: {
    //                  fill: bgInfo
    //              }
    //          },
    //      });
    //      // Manual code to alter the Vector map plugin to
    //      // allow for individual coloring of countries
    //      var states = ['DE', 'US', 'CA', 'FR', 'HU'];

    //      var colors = [bgInfo, bgInfo, bgInfo, bgInfo, bgInfo];
    //      var colors2 = [bgInfo, bgInfo, bgInfo, bgInfo, bgInfo];
    //      $.each(states, function(i, e) {
    //          $("#WidgetMap path[data-code=" + e + "]").css({
    //              fill: colors[i]
    //          });
    //      });
    //      $('#WidgetMap').find('.jvectormap-marker')
    //          .each(function(i, e) {
    //              $(e).css({
    //                  fill: colors2[i],
    //                  stroke: colors2[i]
    //              });
    //          });
    //  }
    //  if($('#WidgetMap').length) {
    //      runJvectorMap();
    //  }
    // }
});