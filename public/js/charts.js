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

// Tabel Summary Stop Category
const ctx = document.getElementById('stopCategoryChart').getContext('2d');
const stopCategoryChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Breakdown', 'Dandori', 'Start Up', 'Tool', 'Others'],
        datasets: [{
            label: 'Time (minutes)',
            data: [14.30, 1.14, 0.812, 3.50, 4.3],
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