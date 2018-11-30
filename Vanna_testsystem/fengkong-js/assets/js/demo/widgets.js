'use strict'; 
/*! widget.js - v0.1.1

/* Demo theme functions. Required for
 * Settings Pane and misc functions */
var demoHighCharts = function () {
// Define chart color patterns
var highColors = [bgInfo, bgPrimary, bgSuccess, bgWarning,
    bgDanger, bgSuccess, bgSystem, bgDark
];
// High Charts Demo
var demoHighCharts = function() {


    var demoHighLines = function() {

        var line1 = $('#high-line');

        if (line1.length) {

            // High Line 1
            $('#high-line').highcharts({
                credits: false,
                colors: highColors,
                chart: {
                    type: 'column',
                    zoomType: 'x',
                    panning: true,
                    panKey: 'shift',
                    marginRight: 50,
                    marginTop: -5,
                },
                title: {
                    text: null
                },
                xAxis: {
                    gridLineColor: '#EEE',
                    lineColor: '#EEE',
                    tickColor: '#EEE',
                    categories: ['Jan', 'Feb', 'Mar', 'Apr',
                        'May', 'Jun', 'Jul', 'Aug',
                        'Sep', 'Oct', 'Nov', 'Dec'
                    ]
                },
                yAxis: {
                    min: -2,
                    tickInterval: 5,
                    gridLineColor: '#EEE',
                    title: {
                        text: 'Traffic',
                        style: {
                            color: bgInfo,
                            fontWeight: '600'
                        }
                    }
                },
                plotOptions: {
                    spline: {
                        lineWidth: 3,
                    },
                    area: {
                        fillOpacity: 0.2
                    }
                },
                legend: {
                    enabled: false,
                },
                series: [{
                    name: 'Yahoo',
                    data: [7.0, 6, 9, 14, 18, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                }, {
                    name: 'CNN',
                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                }, {
                    visible: false,
                    name: 'Yahoo',
                    data: [1, 5, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                }, {
                    visible: false,
                    name: 'Facebook',
                    data: [3, 1, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
                }, {
                    visible: false,
                    name: 'Facebook',
                    data: [7.0, 6, 9, 14, 18, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                }, {
                    visible: false,
                    name: 'CNN',
                    data: [1, 5, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                }]
            });

        }

        var line3 = $('#high-line3');

        if (line3.length) {

            // High Line 3
            $('#high-line3').highcharts({
                credits: false,
                colors: highColors,
                chart: {
                    backgroundColor: '#f9f9f9',
                    className: 'br-r',
                    type: 'line',
                    zoomType: 'x',
                    panning: true,
                    panKey: 'shift',
                    marginTop: 25,
                    marginRight: 1,
                },
                title: {
                    text: null
                },
                xAxis: {
                    gridLineColor: '#EEE',
                    lineColor: '#EEE',
                    tickColor: '#EEE',
                    categories: ['Jan', 'Feb', 'Mar', 'Apr',
                        'May', 'Jun', 'Jul', 'Aug',
                        'Sep', 'Oct', 'Nov', 'Dec'
                    ]
                },
                yAxis: {
                    min: 0,
                    tickInterval: 5,
                    gridLineColor: '#EEE',
                    title: {
                        text: null,
                    }
                },
                plotOptions: {
                    spline: {
                        lineWidth: 3,
                    },
                    area: {
                        fillOpacity: 0.2
                    }
                },
                legend: {
                    enabled: false,
                },
                series: [{
                    name: 'Yahoo',
                    data: [7.0, 6, 9, 14, 18, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                }, {
                    name: 'CNN',
                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                }, {
                    visible: false,
                    name: 'Yahoo',
                    data: [1, 5, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                }, {
                    visible: false,
                    name: 'Facebook',
                    data: [3, 1, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
                }, {
                    visible: false,
                    name: 'Facebook',
                    data: [7.0, 6, 9, 14, 18, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                }, {
                    visible: false,
                    name: 'CNN',
                    data: [1, 5, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                }]
            });

        }

    } // End High Line Charts Demo



    // Demo High Area Charts
    var demoHighAreas = function() {

        var area1 = $('#high-area');

        if (area1.length) {

            // Area 1
            $('#high-area').highcharts({
                colors: highColors,
                credits: false,
                chart: {
                    type: 'areaspline',
                    spacing: 0,
                    margin: -5
                },
                title: {
                    text: null
                },
                legend: {
                    enabled: false
                },
                xAxis: {
                    allowDecimals: false,
                    tickColor: '#EEE',
                    labels: {
                        formatter: function() {
                            return this.value; // clean, unformatted number for year
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: null
                    },
                    gridLineColor: 'transparent',
                    labels: {
                        enabled: false,
                    }
                },
                plotOptions: {
                    areaspline: {
                        fillOpacity: 0.25,
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
                    }
                },
                series: [{
                    id: 0,
                    name: 'USA',
                    data: [150, 260, 80, 100, 150, 200, 240]
                }, {
                    id: 1,
                    name: 'Russia',
                    data: [10, 20, 40, 120, 240, 180, 160]
                }, {
                    id: 2,
                    name: 'China',
                    data: [60, 100, 180, 110, 100, 20, 40]
                }]
            });
        }
    }

    // Init Chart Types
    demoHighLines();
    demoHighAreas();

}; // End Demo HighCharts

// High Charts Demo
var demoHighChartMenus = function() {

    // Create custom menus for charts associated
    // with the ".chart-legend" element
    var chartLegend = $('.chart-legend');

    if (chartLegend.length) {

        $('.chart-legend').each(function(i, ele) {
            var legendID = $(ele).data('chart-id');
            $(ele).find('a.legend-item').each(function(
                i, e) {
                var This = $(e);
                var itemID = This.data(
                    'chart-id');
                // Use ID of menu to find what chart it belongs to
                // Then use ID of its child menu items to find out what
                // data on the chart it is connected to
                var legend = $(legendID).highcharts()
                    .series[itemID];
                // pull legend name from chart and populate menu buttons
                var legendName = legend.name;
                This.html(legendName);
                // assign click handler which toggles legend data 
                This.click(function(e) {
                    if (This.attr(
                            'href')) {
                        e.preventDefault();
                    }
                    if (legend.visible) {
                        legend.hide();
                        This.toggleClass(
                            'active'
                        );
                    } else {
                        legend.show();
                        This.toggleClass(
                            'active'
                        );
                    }
                });
            });
        });
    }

    // Create custom menus for table charts
    var tableLegend = $('.table-legend');

    if (tableLegend.length) {

        $('.table-legend').each(function(i, e) {
            var legendID = $(e).data('chart-id');
            $(e).find('input.legend-switch').each(
                function(i, e) {
                    var This = $(e);
                    var itemID = This.val();
                    // Use ID of menu to find what chart it belongs to
                    // Then use ID of its child menu items to find out what
                    // data on the chart it is connected to
                    var legend = $(legendID).highcharts()
                        .series[itemID];
                    // pull legend name from chart and populate menu buttons
                    var legendName = legend.name;
                    This.html(legendName);
                    // Toggle checkbox state based on series visability
                    if (legend.visible) {
                        This.attr('checked', true);
                    } else {
                        This.attr('checked', false);
                    }
                    // assign click handler which toggles legend data 
                    This.on('click', function(i, e) {
                        if (legend.visible) {
                            legend.hide();
                            This.attr(
                                'checked',
                                false);
                        } else {
                            legend.show();
                            This.attr(
                                'checked',
                                true);
                        }
                    });
                });
        });
    }

} // End Demo HighChart Menus

// Color Library we used to grab a random color
var sparkColors = {
    "primary": [bgPrimary, bgPrimaryLr, bgPrimaryDr],
    "info": [bgInfo, bgInfoLr, bgInfoDr],
    "warning": [bgWarning, bgWarningLr, bgWarningDr],
    "success": [bgSuccess, bgSuccessLr, bgSuccessDr],
    "alert": [bgAlert, bgAlertLr, bgAlertDr]
};
// Sparklines Demo
var demoSparklines = function() {

    var sparkLine = $('.inlinesparkline');
    // Init Sparklines
    if (sparkLine.length) {

        var sparklineInit = function() {
            $('.inlinesparkline').each(function(i, e) {
                var This = $(this);
                var Color = sparkColors["primary"];
                var Height = '35';
                var Width = '70%';
                This.children().remove();
                // default color is "primary"
                // Color[0] = default shade
                // Color[1] = light shade
                // Color[2] = dark shade
                //alert('hi')
                // User assigned color and height, else default
                var userColor = This.data('spark-color');
                var userHeight = This.data('spark-height');
                if (userColor) {
                    Color = sparkColors[userColor];
                }
                if (userHeight) {
                    Height = userHeight;
                }
                $(e).sparkline('html', {
                    type: 'line',
                    width: Width,
                    height: Height,
                    enableTagOptions: true,
                    lineColor: Color[2], // Also tooltip icon color
                    fillColor: Color[1],
                    spotColor: Color[0],
                    minSpotColor: Color[0],
                    maxSpotColor: Color[0],
                    highlightSpotColor: bgWarningDr,
                    highlightLineColor: bgWarningLr
                });
            });
        }

        // Refresh Sparklines on Resize
        var refreshSparklines;

        $(window).resize(function(e) {
            clearTimeout(refreshSparklines);
            refreshSparklines = setTimeout(sparklineInit, 500);
        });

        sparklineInit();
    }

} // End Sparklines Demo

// Circle Graphs Demo
var demoCircleGraphs = function() {
    var infoCircle = $('.info-circle');
    if (infoCircle.length) {
        // Color Library we used to grab a random color
        var colors = {
            "primary": [bgPrimary, bgPrimaryLr,
                bgPrimaryDr
            ],
            "info": [bgInfo, bgInfoLr, bgInfoDr],
            "warning": [bgWarning, bgWarningLr,
                bgWarningDr
            ],
            "success": [bgSuccess, bgSuccessLr,
                bgSuccessDr
            ],
            "system": [bgSystem, bgSystemLr,
                bgSystemDr
            ],
            "danger": [bgDanger, bgDangerLr,
                bgDangerDr
            ],
            "alert": [bgAlert, bgAlertLr, bgAlertDr]
        };
        // Store all circles
        var circles = [];
        infoCircle.each(function(i, e) {
            // Define default color
            var color = ['#f1f4f8', bgPrimary];
            // Modify color if user has defined one
            var targetColor = $(e).data(
                'circle-color');
            if (targetColor) {
                var color = ['#f1f4f8', colors[
                    targetColor][0]]
            }
            // Create all circles
            var circle = Circles.create({
                id: $(e).attr('id'),
                value: $(e).attr('value'),
                radius: $(e).width() / 2,
                width: 14,
                colors: color,
                text: function(value) {
                    var title = $(e).attr('title');
                    if (title) {
                        return '<h2 class="circle-text-value"> + ' + value + '</h2><p>' + title + '</p>'
                    } else {
                        return '<h2 class="circle-text-value mb5"> + ' + value + '</h2>'
                    }
                }
            });
            circles.push(circle);
        });

        // Add debounced responsive functionality
        var rescale = function() {
            infoCircle.each(function(i, e) {
                var getWidth = $(e).width() / 2;
                circles[i].updateRadius(
                    getWidth);
            });
            setTimeout(function() {
                // Add responsive font sizing functionality
                $('.info-circle').find('.circle-text-value').fitText(0.55);
            }, 50);
        }
        var lazyLayout = _.debounce(rescale, 300);
        $(window).resize(lazyLayout);

    }

} // End Circle Graphs Demo

// Helper functions used in widgets.js(this file)
var defineHelpers = function() {



}

return {
    init: function() {
        // Init Demo Charts 
        demoHighCharts();
        demoHighChartMenus();

        demoSparklines();
        demoCircleGraphs();

        defineHelpers();

    }
}

}();






