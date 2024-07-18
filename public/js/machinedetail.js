function updateMachineDetails() {
    document.getElementById('line').innerText = data_header[0].line;
    document.getElementById('linedesc').innerText = data_header[0].linedesc;
    document.getElementById('shift').innerText = data_header[0].shift;
    updateDateTime();
}