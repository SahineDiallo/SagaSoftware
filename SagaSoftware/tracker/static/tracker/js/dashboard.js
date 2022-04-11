$(document).ready(function() {
  var months =['Jan', 'Feb', 'Mar', 'Apr', 'Jun', "Jul", "Agu", "Oct", "Nov", "Dec"]
  var url_end = (window.location.pathname).split("/").at(-2)
  if (window.location.pathname.includes('home')) {
    console.log("we are in the home page")
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
          backgroundColor: [
            'rgba(255, 26, 104, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(0, 0, 0, 1)'
          ],
          borderColor: [
            'rgba(255, 26, 104, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(0, 0, 0, 1)'
          ],
          barPercentage: .3
        }]
      };
  
      // config 
      const _config = {
        type: 'bar',
        data: _data,
        options: {
          maintainAspectRatio: false,
          responsive: true,
          indexAxis: 'y',
          scales: {
            x: {
              position: 'top',
              min: data.min_date,
              type: 'time',
              time: {
                unit: 'day'
              }
            },
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  var new_val = this.getLabelForValue(value)
                  var trunc_val = new_val.substr(50) === "" ? new_val.substr(0, 50) : new_val.substr(0, 50) + '...'
                  return trunc_val
                }
              }
            },
          }
        }
      };
  
      // render init block
      ctx = $('#calendarChrt')
      ctx.height = '500'
      const myChart = new Chart( ctx, _config );
    })
    .catch(error => {console.log(error)})
  }

  function changeDateFormat(arr) {    
    let min;
    var date_ranges = []
    arr.forEach((date_range, main_index) => {
      new_range = []
      date_range.forEach((date, index)=> {
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