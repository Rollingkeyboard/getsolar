var options = {
    chart: {
        renderTo: 'container',
        type: 'line'
    },
    title: {
        text: 'Monthly AC',
        x: -20 //center
    },
    subtitle: {
        text: 'Source: NREL API',
        x: -20
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
        title: {
            text: 'Electricity (Kwh)'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
    tooltip: {
        valueSuffix: 'Kwh'
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
    },
    series: []
};