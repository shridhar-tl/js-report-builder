export const chartTypes = [
    { value: 'pie', label: 'Pie Chart' },
    { value: 'doughnut', label: 'Doughnut Chart' },
    { value: 'bar', label: 'Bar Chart' },
    { value: 'horizontalBar', label: 'Bar Chart (Horizontal)' },
    { value: 'line', label: 'Line Chart' },
    { value: 'polarArea', label: 'Polar Area Chart' },
    { value: 'radar', label: 'Radar Chart' }
];

export function getChartTypes() {
    return chartTypes;
}

var type1Data = {
    labels: ['A', 'B', 'C'],
    datasets: [
        {
            data: [300, 50, 100],
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56"
            ]
        }]
};

var type2Data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
        label: 'Dataset 1',
        fill: false,
        backgroundColor: '#42A5F5',
        borderColor: '#42A5F5',
        yAxisID: 'y-axis-1',
        data: [65, 59, 80, 81, 56, 55, 10]
    }, {
        label: 'Dataset 2',
        fill: false,
        backgroundColor: '#66BB6A',
        borderColor: '#66BB6A',
        yAxisID: 'y-axis-2',
        data: [28, 48, 40, 19, 86, 27, 90]
    }]
};

var type2Options = {
    responsive: true,
    hoverMode: 'index',
    stacked: false,
    scales: {
        yAxes: [{
            type: 'linear',
            display: true,
            position: 'left',
            id: 'y-axis-1',
        }, {
            type: 'linear',
            display: true,
            position: 'right',
            id: 'y-axis-2',
            gridLines: {
                drawOnChartArea: false
            }
        }]
    }
};

var barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor: '#42A5F5',
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: 'My Second dataset',
            backgroundColor: '#9CCC65',
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};

export const defaultChartDefinition = {
    pie: { type: 'pie', data: type1Data },
    doughnut: { type: 'doughnut', data: type1Data },
    bar: { type: 'bar', data: barData },
    horizontalBar: { type: 'horizontalBar', data: barData },
    line: { type: 'line', data: type2Data, options: type2Options },
    polarArea: { type: 'polarArea', data: type1Data },
    radar: {
        type: 'radar', data: {
            labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
            datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(179,181,198,0.2)',
                    borderColor: 'rgba(179,181,198,1)',
                    pointBackgroundColor: 'rgba(179,181,198,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(179,181,198,1)',
                    data: [65, 59, 90, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    pointBackgroundColor: 'rgba(255,99,132,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255,99,132,1)',
                    data: [28, 48, 40, 19, 96, 27, 100]
                }
            ]
        }
    }
};