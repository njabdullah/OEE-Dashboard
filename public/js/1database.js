let data_header;
let data_Linestop;
let data_Produksi;

async function fetchData() {
    try {
        // data_header
        let response = await fetch('/api/data-header');
        data_header = await response.json();

        if (!Array.isArray(data_header)) {
            data_header = [data_header];
        }

        // data_linestop
        response = await fetch('/api/data-linestop');
        data_Linestop = await response.json();

        if (!Array.isArray(data_Linestop)) {
            data_Linestop = [data_Linestop];
        }

        // data_produksi (including joined data_standard and data_qualityloss)
        response = await fetch('/api/data-produksi');
        data_Produksi = await response.json();

        if (!Array.isArray(data_Produksi)) {
            data_Produksi = [data_Produksi];
        }

    } catch (error) {
        console.error('Error fetching data:', error);
    }

    updateDateTime();
}