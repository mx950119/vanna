/* All functions in this file are used only for charts.html */
var D3Charts = function () {

    // Init Flot Chart Plugins
    var runD3Plugins = function () {

		// Plugin 1

	}

    // Init Flot Charts Plugin
    var runD3Charts = function () {

       // Add a series of colors to be used in the charts and pie graphs
        var Colors = [bgPrimary, bgInfo, bgWarning, bgAlert, bgDanger, bgSystem, bgSuccess,];

        // Line Chart
        var lineChart = c3.generate({
        	bindto: '#line-chart',
          color: {
            pattern: Colors,
          },
          point: {
            r: 3
          },
          padding: {
            left: 30,
            right: 30,
            top: 0,
            bottom: 0,
          },
          data: {
            columns: [
              ['data1', 30, 200, 100, 400, 150, 250],
              ['data2', 50, 20, 10, 40, 15, 25]
            ],
            axes: {
              data1: 'y',
              data2: 'y2',
            }
          },
          axis: {
            x: {
              label: 'X Label'
            },
            y: {
              label: {
                text: 'Y Axis Label',
                position: 'outer-middle'
              }
            },
            y2: {
              show: true,
              label: {
                text: 'Y2 Axis Label',
                position: 'outer-middle'
              }
            }
          }
        });

        // Area Chart
        var areaChart = c3.generate({
            bindto: '#area-chart',
            color: {
              pattern: Colors,
            },
            padding: {
            left: 30,
              right: 15,
              top: 0,
              bottom: 0,
           },
            data: {
                columns: [
                    ['data1', 300, 350, 300, 0, 0, 0],
                    ['data2', 130, 100, 140, 200, 150, 50]
                ],
                types: {
                    data1: 'area',
                    data2: 'area-spline'
                }
            }
        });


        // Step Chart
        var stepChart = c3.generate({
            bindto: '#step-chart',
            color: {
              pattern: Colors,
            },
            padding: {
              left: 30,
              right: 15,
              top: 0,
              bottom: 0,
           },
            data: {
                columns: [
                    ['data1', 300, 350, 300, 0, 0, 100],
                    ['data2', 130, 100, 140, 200, 150, 50]
                ],
                types: {
                    data1: 'step',
                    data2: 'area-step'
                }
            }
        });


        // Bar Chart
        var barChart = c3.generate({
            bindto: '#bar-chart',
            color: {
              pattern: Colors,
            },
            padding: {
            left: 30,
              right: 15,
              top: 0,
              bottom: 0,
           },
            data: {
                columns: [
                    ['data1', 30, 200, 100, 400, 150, 250],
                    ['data2', 130, 100, 140, 200, 150, 50]
                ],
                type: 'bar'
            },
            bar: {
                width: {
                    ratio: 0.5 // this makes bar width 50% of length between ticks
                }
            }
        });


        // Donut Chart
        var donutChart = c3.generate({
            bindto: '#donut-chart',
            color: {
              pattern: Colors,
            },
            data: {
                columns: [
                    ['data1', 30],
                    ['data2', 120],
                ],
                type : 'donut',
                onclick: function (d, i) { console.log("onclick", d, i); },
                onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                onmouseout: function (d, i) { console.log("onmouseout", d, i); }
            },
            donut: {
                title: "Iris Petal Width"
            }
        });


        // Pie Chart
        var pieChart = c3.generate({
            bindto: '#pie-chart',
            color: {
              pattern: Colors,
            },
            data: {
                columns: [
                    ['data1', 30],
                    ['data2', 120],
                ],
                type : 'pie',
                onclick: function (d, i) { console.log("onclick", d, i); },
                onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                onmouseout: function (d, i) { console.log("onmouseout", d, i); }
            }
        });




    };
    return {
        init: function () {
			runD3Plugins();
        	runD3Charts();
        }
    };
}();