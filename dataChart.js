var xValues = ["PERCENTAGE OF ISSUED TICKETS", "PERCENTAGE OF PAID TICKETS"];
var yValues = [55, 45];
var barColors = ["#d6d6c1", "#e7e778"];

new Chart("myChart", {
  type: "pie",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    title: {
      display: false,
      text: "Ticket Types"
    },
    legend: {
      position: 'right',
      labels: {
        fontColor: 'black',
        fontSize: 14 
      }
    }
  }
});


const xVal = [1, 2, 3];

    new Chart("myChart2", {
      type: "line",
      data: {
        labels: xVal,
        datasets: [{
          data: [1, 2, 3],
          borderColor: "black",
          pointBorderColor: "black", // Set the point border color to black
          fill: false
        }, {
          data: [5, 6, 17],
          borderColor: "yellow",
          pointBorderColor: "yellow", // Set the point border color to yellow
          fill: false
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            ticks: {
              fontColor: 'black' // Set x-axis label color to black
            },
            gridLines: {
              color: 'white' // Set grid line color for x-axis
            }
          }],
          yAxes: [{
            ticks: {
              fontColor: 'black' // Set y-axis label color to black
            },
            gridLines: {
              color: 'white' // Set grid line color for y-axis
            }
          }]
        },
        elements: {
          line: {
            borderWidth: 5, // Set the border width for the lines
            borderColor: 'red' // Set the border color for the lines
          },
          point: {
            borderWidth: 10 // Set the border width for the data points
          }
        }
      }
    });


    function updateDateTime() {
      const currentDate = new Date();
      const dateElement = document.querySelector('.date');
      const timeElement = document.querySelector('.time');

      // Update date and time content
      dateElement.textContent = 'Date: ' + currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      timeElement.textContent ='Time: ' +  currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Update every second (1000 milliseconds)
    setInterval(updateDateTime, 1000);

    // Initial update to display current date and time
    updateDateTime();