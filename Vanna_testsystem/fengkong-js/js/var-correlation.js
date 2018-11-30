$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        
        xAxis: {
            categories: [
                '一月',
                '二月',
                '三月',
                '四月',
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: '降雨量 (mm)'
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
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: '东京',
            data: [49.9]
        }, {
            name: '纽约',
            data: [83.6]
        }, {
            name: '伦敦',
            data: [48.9]
        }]
    });
});