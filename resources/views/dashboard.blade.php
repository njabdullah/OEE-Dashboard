<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OEE Monitoring System</title>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <script src="{{ asset('js/dateTime.js') }}" defer></script>
    <script src="{{ asset('js/machinestatus.js') }}" defer></script>
    <script src="{{ asset('js/machinedetail.js') }}" defer></script>
    <script src="{{ asset('js/charts.js') }}" defer></script>
    <script src="{{ asset('js/1database.js') }}" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/raphael/2.3.0/raphael.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/justgage/1.3.1/justgage.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body onload="fetchData();">
    <div class="dashboard">
        <div class="header">
            <h1>OEE Monitoring System</h1>
            <div class="date-time">
                <div class="date" id="date" ></div>
                <div class="time" id="time"></div>
            </div>
        </div>
        <div class="basic-info">
            <div class="machine-info">
                <div class="machine-title">
                    <div>Machine Information</div>
                </div>
                <div class="machine-detail">
                    <div id="line"></div>
                    <div id="linedesc"></div>
                    <div id="shift"></div>
                </div>
            </div>
            <div class="status-machine">
                <div class="label">Machine Status</div>
                <div class="value" id="machine-status">STOP</div>
            </div>
            <div class="trouble-info">
                <div class="label">Trouble Information</div>
                <div class="value" id="trouble-information">- - -</div>
            </div>
        </div>
        <div class="metrics">
            <div class="metric total-loading-time">
                <div class="label">Loading Time</div>
                <div class="value" id="loading-time">0.0 min</div>
            </div>
            <div class="metric total-stop-time">
                <div class="label">Total Stop Time</div>
                <div class="value" id="total-stop-time">0.0 min</div>
            </div>
            <div class="metric total-operation-time">
                <div class="label">Operation Time</div>
                <div class="value" id="operation-time">0.0 min</div>
            </div>
        </div>
        <div class="gauge-charts">
            <div class="gauge">
                <div class="gauge-title">Availability</div>
                <div id="availabilityGauge"></div>
            </div>
            <div class="gauge">
                <div class="gauge-title">Performance</div>
                <div id="performanceGauge"></div>
            </div>
            <div class="gauge">
                <div class="gauge-title">Quality</div>
                <div id="qualityGauge"></div>
            </div>
            <div class="gauge oee">
                <div class="gauge-title">OEE</div>
                <div id="OEEGauge"></div>
            </div>
        </div>
        <div class="summary">
            <div class="summary-stop">
                <h2>Summary Stop Category</h2>
                <div class="summary-stop-detail">
                    <div class="summary-stop-container">
                        <canvas id="stopCategoryChart"></canvas>
                    </div>
                    <div class="summary-stop-timer">
                        <table>
                            <tr>
                                <td id="breakdown-time">0.0 min</td>
                            </tr>
                            <tr>
                                <td id="quality-time">0.0 min</td>
                            </tr>
                            <tr>
                                <td id="startup-time">0.0 min</td>
                            </tr>
                            <tr>
                                <td id="tool-time">0.0 min</td>
                            </tr>
                            <tr>
                                <td id="others-time">0.0 min</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div class="summary-output">
                <div class="output-time">
                    <h2>Output Time</h2>
                    <table>
                        <tr>
                            <th>Type</th>
                            <th>Output</th>
                            <th>Cycle Time</th>
                            <th>Qty Cycle</th>
                            <th>Output Time</th>
                        </tr>
                        <tr>
                            <td>B234</td>
                            <td>35</td>
                            <td>24</td>
                            <td>1</td>
                            <td>14</td>
                        </tr>
                    </table>
                </div>
                <div class="quality-loss-time">
                    <h2>Quality Loss Time</h2>
                    <table>
                        <tr>
                            <th>Type</th>
                            <th>Qty NG</th>
                            <th>Cycle Time</th>
                            <th>Qty Cycle</th>
                            <th>Defect Time</th>
                        </tr>
                        <tr>
                            <td>B234</td>
                            <td>3</td>
                            <td>24</td>
                            <td>1</td>
                            <td>1.20</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="summary-oee-loss">
                <h2>OEE vs Loss</h2>
                <div class="oee-vs-loss">
                    <div class="oee-vs-loss-chart">
                        <canvas id="OEElossPieChart"></canvas>
                    </div>
                    <div class="oee-vs-loss-legend">
                        <table class="legend-detail">
                            <tr>
                                <th></th>
                                <th></th>
                                <th>Time</th>
                                <th>Percentage</th>
                            </tr>
                            <tr>
                                <td style="background-color: #2df726;"></td>
                                <td class="type">OEE</td>
                                <td>35 min</td>
                                <td>24%</td>
                            </tr>
                            <tr>
                                <td style="background-color: #ff4048;"></td>
                                <td class="type">Stop Loss</td>
                                <td>35 min</td>
                                <td>24%</td>
                            </tr>
                            <tr>
                                <td style="background-color: #ffe716;"></td>
                                <td class="type">Speed Loss</td>
                                <td>35 min</td>
                                <td>24%</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>