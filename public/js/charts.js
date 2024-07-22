// chart avilability, performance, quality, and OEE
document.addEventListener('DOMContentLoaded', function() {
    const OEEGauge = new JustGage({
        id: "OEEGauge",
        value: 0,
        min: 0,
        max: 100,
        label: "%",
        customSectors: {
            percents: true,
            ranges: [
                {color: "#ff4048", lo: 0, hi: 33.99},
                {color: "#ffe716", lo: 34, hi: 66.99},
                {color: "#2df726", lo: 67, hi: 100}
            ]
        }
    });

    const availabilityGauge = new JustGage({
        id: "availabilityGauge",
        value: 0,
        min: 0,
        max: 100,
        label: "%",
        customSectors: {
            percents: true,
            ranges: [
                {color: "#ff4048", lo: 0, hi: 33.99},
                {color: "#ffe716", lo: 34, hi: 66.99},
                {color: "#2df726", lo: 67, hi: 100}
            ]
        }
    });

    const performanceGauge = new JustGage({
        id: "performanceGauge",
        value: 0,
        min: 0,
        max: 100,
        label: "%",
        customSectors: {
            percents: true,
            ranges: [
                {color: "#ff4048", lo: 0, hi: 33.99},
                {color: "#ffe716", lo: 34, hi: 66.99},
                {color: "#2df726", lo: 67, hi: 100}
            ]
        }
    });

    const qualityGauge = new JustGage({
        id: "qualityGauge",
        value: 0,
        min: 0,
        max: 100,
        label: "%",
        customSectors: {
            percents: true,
            ranges: [
                {color: "#ff4048", lo: 0, hi: 33.99},
                {color: "#ffe716", lo: 34, hi: 66.99},
                {color: "#2df726", lo: 67, hi: 100}
            ]
        }
    });

    setInterval(() => {
        const availability = (operationTime / loadingTime) * 100;
        availabilityGauge.refresh(availability.toFixed(2));
    }, 1000);
});

// Define variables to keep track of stop times for each category
let stopTimes = {
    'Breakdown': 0,
    'Quality': 0,
    'Start Up': 0,
    'Tool': 0,
    'Others': 0
};

// Function to update the chart data
function updateChartData() {
    stopCategoryChart.data.datasets[0].data = [
        stopTimes['Breakdown'],
        stopTimes['Quality'],
        stopTimes['Start Up'],
        stopTimes['Tool'],
        stopTimes['Others']
    ];
    stopCategoryChart.update();
}

function updateStopTimes() {
    document.getElementById('breakdown-time').innerText = stopTimes['Breakdown'].toFixed(1) + ' min';
    document.getElementById('quality-time').innerText = stopTimes['Quality'].toFixed(1) + ' min';
    document.getElementById('start-up-time').innerText = stopTimes['Start Up'].toFixed(1) + ' min';
    document.getElementById('tool-time').innerText = stopTimes['Tool'].toFixed(1) + ' min';
    document.getElementById('others-time').innerText = stopTimes['Others'].toFixed(1) + ' min';
}

// Tabel Summary Stop Category
const ctx = document.getElementById('stopCategoryChart').getContext('2d');
const stopCategoryChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Breakdown', 'Quality', 'Start Up', 'Tool', 'Others'],
        datasets: [{
            label: 'Time (minutes)',
            data: [0, 0, 0, 0, 0],
            backgroundColor: '#2279e3',
        }]
    },
    options: {
        indexAxis: 'y',
        scales: {
            x: {
                display: false,
                grid: {
                    display: false
                }
            },
            y: {
                ticks: {
                    color: '#ffffff'
                },
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        },
        maintainAspectRatio: false
    }
});

// Chart OEE vs Loss
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('OEElossPieChart').getContext('2d');
    const data = {
        labels: ['Stop Loss', 'Speed Loss', 'OEE'],
        datasets: [{
            data: [45, 8, 43],
            backgroundColor: [
                '#ff4048',
                '#ffe716',
                '#2df726'
            ],
            borderColor: '#333333'
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return tooltipItem.label + ': ' + tooltipItem.raw + '%';
                    }
                }
            }
        }
    };

    new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
});