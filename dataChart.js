import { countervalue, paidStatus } from "./home.js";
// Now you can use the counter variable in this file
console.log("Counter value from file1.js:", countervalue);
console.log("Counter :", paidStatus);

  
 
  var xValues = ["PERCENTAGE OF ISSUED TICKETS", "PERCENTAGE OF PAID TICKETS"];
  var yValues = [countervalue, paidStatus];
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
            data: [0, 2, countervalue],
            borderColor: "black",
            pointBorderColor: "black", // Set the point border color to black
            fill: false
          }, {
            data: [0, 1, paidStatus],
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
                display: false, 
                fontColor: 'black' // Set x-axis label color to black
              },
              gridLines: {
                color: 'white' // Set grid line color for x-axis
              }
            }],
            yAxes: [{
              ticks: {
                display: false, 
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
        dateElement.textContent = 'Date: ' + currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        timeElement.textContent ='Time: ' +  currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }

      // Update every second (1000 milliseconds)
      setInterval(updateDateTime, 1000);

      // Initial update to display current date and time
      updateDateTime();