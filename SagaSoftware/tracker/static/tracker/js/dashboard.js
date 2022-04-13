$(document).ready(function() {
  var months =['Jan', 'Feb', 'Mar', 'Apr', 'Jun', "Jul", "Agu", "Oct", "Nov", "Dec"]
  var url_end = (window.location.pathname).split("/").at(-2)
  if (window.location.pathname.includes('home')) {

    Date.prototype.addDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    };
    Date.prototype.removeDays = function(days) {
      var date = new Date(this.valueOf());
      date.setDate(date.getDate() - days);
      return date;
    }

    var url = `/api/${url_end}/timelinedata/`
    fetch(url)
    .then(resp=> resp.json())
    .then(data=> {
      var date_ranges = changeDateFormat(data.date_ranges)
      // setup 
      const _data = {
        labels: data.labels,
        datasets: [{
          label: 'Tickets TimeLine View',
          data: date_ranges,
          ticket_completion: data.progress,
          backgroundColor: [
            'rgba(255, 26, 104, 0.9)',
            'rgba(54, 162, 235, 0.9)',
            'rgba(255, 206, 86, 0.9)',
            'rgba(75, 192, 192, 0.9)',
            'rgba(153, 102, 255,0.9)',
            'rgba(255, 159, 64, 0.9)',
            'rgba(0, 0, 0, 1)'
          ],
          borderColor: [
            'rgba(255, 26, 104, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255,1)',
            'rgba(255, 159, 64, 1)',
            'rgba(0, 0, 0, 1)'
          ],
          borderWidth: 2,
          barPercentage: .5,
          borderRadius: 100,
          borderSkipped: false
        }]
      };
      // Move Chart Plugin
      const  MoveChart = {
        id: "MoveChart",
        afterDraw(chart, args, pluginOptions) {
          const {ctx, chartArea: {left, right, bottom, top, width, height} } = chart;
          // /// cercles drawing class /////
          class DrawCercle {
            draw(ctx, _xpos, pix) {
              /// draw the cercle ////
              var angle = Math.PI / 180
              ctx.beginPath();
              ctx.fillStyle = 'white'
              ctx.StrokeStyle = 'rgba(102, 102, 102, 0.5)'
              ctx.lineWidth = 3
              ctx.arc(_xpos, height/2 + top, 15, angle*0, angle*360, false);
              ctx.stroke()
              ctx.fill();
              ctx.closePath();


              /////// draw the arrow ////////
              ctx.beginPath();
              ctx.lineWidth = 3;
              ctx.StrokeStyle = 'rgba(255, 26, 104, 1)';
              ctx.moveTo(_xpos + pix, height/2 + top - 7);
              ctx.lineTo(_xpos - pix, height/2 + top);
              ctx.lineTo(_xpos + pix, height/2 + top + 7);
              ctx.stroke();
              ctx.closePath();
            }
          }

          // draw the left cercle //
          var leftCercle = new DrawCercle()
          leftCercle.draw(ctx, left, 5)

          // draw the right cercle //
          var rightCercle = new DrawCercle()
          rightCercle.draw(ctx, right, -5)
          
        }
      }
  
      // config 
      const _config = {
        type: 'bar',
        data: _data,
        plugins: [ChartDataLabels, MoveChart],
        options: {
          plugins: {
            datalabels: {
              formatter: (val, ctx) => {
                var ticketPercentage = ctx.dataset.ticket_completion[ctx.dataIndex]
                return `${ticketPercentage}%`
              }
            },
            tooltip: {
              yAlign: 'bottom',
              callbacks: {
                label: (ctx) => {
                  var percentage = ctx.dataset.ticket_completion[ctx.dataIndex]
                  var readableDate = new Date(ctx.parsed.x).toDateString();
                  var leftPercentage = 100 - parseInt(percentage)
                  var result = (percentage ===  100) ? `Ticket completed `:
                              `${leftPercentage}% left before ${readableDate}`
                  return result;
                }
              }
            }
            
          },                    
          maintainAspectRatio: false,
          responsive: true,
          indexAxis: 'y',
          scales: {
            x: {
              offset: false,
              position: 'top',
              min: data.min_date,
              max: (new Date(data.min_date).addDays(30)),
              type: 'time',
              time: {
                unit: 'day',
                stepSize: 1
              },
              ticks: {
                align: 'start'
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  var new_val = this.getLabelForValue(value)
                  var trunc_val = new_val.substr(50) === "" ? new_val.substr(0, 50) : new_val.substr(0, 50) + '...'
                  return trunc_val
                },
                fontSize: 14,
                fontWeight: 500
              }
            },
          }
        }
      };
  
      // render init block
      ctx = $('#calendarChrt')
      ctx.height = '500'
      const myChart = new Chart( ctx, _config );
      myChart.ctx.onclick = moveScroll();
      
      function moveScroll() {
        const {ctx, canvas, chartArea: {left, right, bottom, top, width, height} } = myChart;
        canvas.addEventListener('click', e => {
          var minDate = myChart.options.scales.x.min
          var maxDate = myChart.options.scales.x.max 
          var rect = canvas.getBoundingClientRect();
          var x = e.clientX - rect.left
          var y = e.clientY - rect.top
          var left_x_cercle_bounds = x <= left + 15 && x >= left -15
          var left_y_cercle_bounds = y <= height/2 + top + 15 && y >= height/2 + top - 15
          if(left_x_cercle_bounds && left_y_cercle_bounds ) {
            myChart.options.scales.x.min = (new Date(minDate)).removeDays(5);
            myChart.options.scales.x.max = (new Date(maxDate)).removeDays(5);
            if ((new Date(maxDate)).removeDays(5) >= (new Date(data.min_date)).removeDays(1)) {
              myChart.options.scales.x.min = (new Date(data.min_date)).removeDays(1);
              myChart.options.scales.x.max = (new Date(data.min_date)).addDays(30);
            }
            myChart.update();
          }

          var right_x_cercle_bounds = x <= right + 15 && x >= right - 15
          var right_y_cercle_bounds = y <= height/2 + top + 15 && y >= height/2 + top - 15
          if(right_x_cercle_bounds && right_y_cercle_bounds ) {
            myChart.options.scales.x.min = (new Date(minDate)).addDays(5);
            myChart.options.scales.x.max = (new Date(maxDate)).addDays(5);
            if ((new Date(maxDate)).addDays(5) >= (new Date(data.max_date)).addDays(1)) {
              myChart.options.scales.x.min = (new Date(data.max_date)).removeDays(30);
              myChart.options.scales.x.max = (new Date(data.max_date)).addDays(1);
            }
            myChart.update();
          }
        })
      
      }

    })
    .catch(error => {console.log(error)})
  }

  function changeDateFormat(arr) {    
    var date_ranges = []
    arr.forEach(date_range => {
      new_range = []
      date_range.forEach( date => {
        var year = date.substring(date.length-4, date.length);
        var month = date.substr(0, 3)
        var month_index = months.indexOf(month) + 1
        month_index = (month_index === -1) ? "00" : month_index < 10 ? '0'+month_index.toString() : month_index.toString();
        var day = date.substring(4, 6)
        var new_date = `${year}-${month_index}-${day}`
        new_range.push(new_date)

      })
      date_ranges.push(new_range)

    })
    return date_ranges
  }
})