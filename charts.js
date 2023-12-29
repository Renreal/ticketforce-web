

google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
            var data = google.visualization.arrayToDataTable([
                ['Ticket type', 'Percentage'],
                ['ISSUED TICKET',   55],
                ['PAID TICKET',  45],
            ]); 

  var options = {
    chartArea: {top:0,width:'100%',height:'60%' },
    
    legend:{textStyle: {fontSize: 20, color:'white'}},
    pieSliceTextStyle: {color: 'black'},
    backgroundColor: 'transparent',
    pieStartAngle: 135,
    tooltip: { trigger: 'none' },
    slices: {
      0: { color: '#d6d6c1', offset: 0.1},
      1: { color: '#e7e778'}
    }
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart'));
  chart.draw(data, options);
}
