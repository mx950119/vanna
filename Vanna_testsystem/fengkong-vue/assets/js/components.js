Vue.component('date-picker', {
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
    }
})

Vue.component('loading', {
    // props: ['dateshowed'],
    template: ['<div class="spinner" style="position: fixed;left: 50%;top: 50%;z-index: 999;">',
        '<div class="rect1"></div>',
        '<div class="rect2"></div>',
        '<div class="rect3"></div>',
        '<div class="rect4"></div>',
        '<div class="rect5"></div>',
        '</div>'
    ].join(''),
    mounted: function() {
        var self = this;
        // $(this.$el).datepicker({
        //     numberOfMonths: 1,
        //     showOn: 'both',
        //     buttonText: '<i class="fa fa-calendar-o"></i>',
        //     prevText: '<i class="fa fa-chevron-left"></i>',
        //     nextText: '<i class="fa fa-chevron-right"></i>',
        //     beforeShow: function(input, inst) {
        //         var newclass = 'admin-form';
        //         var themeClass = $(this).parents('.admin-form').attr('class');
        //         var smartpikr = inst.dpDiv.parent();
        //         if (!smartpikr.hasClass(themeClass)) {
        //             inst.dpDiv.wrap('<div class="' + themeClass + '"></div>');
        //         }
        //     },
        //     onSelect: function(dateText, event) {
        //         self.$emit('selectedhandler', dateText)
        //     }
        // });
    }
})



Vue.component('day-picker', {
    props: ['curdayoption'],
    data: function() {
        return {
            dayOptions: ['1D', '5D', '10D'],
        }
    },
    template: ['<div class="topbar-right btn-group">' +
        '<div class="ib topbar-dropdown">' +
        '<label for="topbar-multiple" class="control-label pr10 fs11 text-muted"></label>' +
        '<select id="topbar-multiple" class="hidden" v-model="curdayoption">' +
        '<option v-for="option in dayOptions" :value="option">{{option}}</option>' +
        '</select>' +
        '</div>' +
        '</div>'
    ].join(''),
    mounted: function() {
        var self = this;
        $('#topbar-multiple').multiselect({
            buttonClass: 'btn btn-info btn-md p5-20 dropdown-variant-1',
            dropRight: true,
            onChange: function(option, event) {
                alert('change')
                self.$emit('dayselectedhandler', option[0]._value)
            }
        });
    }
})

Vue.component('per-picker', {
    data: function() {
        return {
            perOptions: ['95', '99'],
            curPerOption: '95' //todo用属性默认值
        }
    },

    template: ['<div class="topbar-right btn-group">' +
        '<div class="ib topbar-dropdown">' +
        '<label for="topbar-percentum" class="control-label pr10 fs11 text-muted"></label>' +
        '<select id="topbar-percentum" class="hidden" v-model="curPerOption">' +
        '<option v-for="option in perOptions" :value="option">{{option}}%</option>' +
        '</select>' +
        '</div>' +
        '</div>'
    ].join(''),
    mounted: function() {
        var self = this;
        $('#topbar-percentum').multiselect({
            buttonClass: 'btn btn-info btn-md p5-20 dropdown-variant-1',
            dropRight: true,
            onChange: function(option, event) {
                self.$emit('perselectedhandler', option[0]._value)
            }
        });
    }
})


Vue.component('var-picker', {
    data: function() {
        return {
            varOptions: ['var', 'es'],
            curVarOption: 'var' //todo用属性默认值
        }
    },

    template: ['<div class="topbar-right btn-group">' +
        '<div class="ib topbar-dropdown">' +
        '<label for="topbar-risk" class="control-label pr10 fs11 text-muted"></label>' +
        '<select id="topbar-risk" class="hidden" v-model="curVarOption">' +
        '<option v-for="option in varOptions" :value="option">{{option}}</option>' +
        '</select>' +
        '</div>' +
        '</div>'
    ].join(''),
    mounted: function() {
        var self = this;
        $('#topbar-risk').multiselect({
            buttonClass: 'btn btn-info btn-md p5-20 dropdown-variant-1',
            dropRight: true,
            onChange: function(option, event) {
                self.$emit('varselectedhandler', option[0]._value)
            }
        });
    },
})


Vue.component('pagination', {
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
        tabNum: function() {
            var self = this;
            return self.config.totalPage < self.config.groupcount ? self.config.totalPage : self.config.groupcount;

        },
        pageindex: function() {
            var self = this;
            var tmp = [];
            if (self.counter + self.tabNum - 1 > self.config.totalPage) {
                self.counter = self.config.totalPage - self.tabNum + 1
                tmp = self.pageindex;
            } else if (self.counter < 1) {
                self.counter = 1;
                tmp = self.pageindex;
            } else {
                for (var i = 0; i < self.tabNum; i++) {
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
            console.log(tmp)
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
        '<li v-for="n in tabNum" class="footable-page" :class="{active : pageindex[n-1] == activePageIndex}" @click="pageclickhandler" :data-pageindex="pageindex[n-1]">' +
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
})