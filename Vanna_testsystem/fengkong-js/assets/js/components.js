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

Vue.component('day-picker', {
  props: ['curdayoption'],
    data: function () {
        return {
            dayOptions: ['1D', '5D', '10D'],
        }
      },
    template: ['<div class="topbar-right btn-group">'+
                '<div class="ib topbar-dropdown">'+
                  '<label for="topbar-multiple" class="control-label pr10 fs11 text-muted"></label>'+
                  '<select id="topbar-multiple" class="hidden" v-model="curdayoption">'+
                    '<option v-for="option in dayOptions" :value="option">{{option}}</option>'+
                  '</select>'+
                '</div>'+
            '</div>'].join(''),
    mounted: function() { 
        var self = this;
        $('#topbar-multiple').multiselect({
            buttonClass: 'btn btn-info btn-md p5-20 dropdown-variant-1',
            dropRight: true,
            onChange: function(option, event){
                alert('change')
                self.$emit('dayselectedhandler', option[0]._value)
            }
          });
    }
})

Vue.component('per-picker', {
  data: function () {
        return {
            perOptions: ['95', '99'],
            curPerOption: '95'//todo用属性默认值
        }
      },

    template: ['<div class="topbar-right btn-group">'+
                '<div class="ib topbar-dropdown">'+
                  '<label for="topbar-percentum" class="control-label pr10 fs11 text-muted"></label>'+
                  '<select id="topbar-percentum" class="hidden" v-model="curPerOption">'+
                    '<option v-for="option in perOptions" :value="option">{{option}}%</option>'+
                  '</select>'+
                '</div>'+
            '</div>'].join(''),
    mounted: function() { 
        var self = this;
        $('#topbar-percentum').multiselect({
        buttonClass: 'btn btn-info btn-md p5-20 dropdown-variant-1',
        dropRight: true,
        onChange: function(option, event){
                self.$emit('perselectedhandler', option[0]._value)
            }
      });
    }
})


Vue.component('var-picker', {
  data: function () {
      return {
        varOptions: ['var', 'es'],
        curVarOption: 'var'//todo用属性默认值
      }
    },

  template: ['<div class="topbar-right btn-group">'+
        '<div class="ib topbar-dropdown">'+
          '<label for="topbar-risk" class="control-label pr10 fs11 text-muted"></label>'+
          '<select id="topbar-risk" class="hidden" v-model="curVarOption">'+
          '<option v-for="option in varOptions" :value="option">{{option}}</option>'+
          '</select>'+
        '</div>'+
      '</div>'].join(''),
  mounted: function() { 
    var self = this;
    $('#topbar-risk').multiselect({
        buttonClass: 'btn btn-info btn-md p5-20 dropdown-variant-1',
        dropRight: true,
        onChange: function(option, event){
            self.$emit('varselectedhandler', option[0]._value)
          }
      });
  },
})