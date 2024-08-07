# OEE Dashboard

## Cloning and Setup Instructions

To clone and set up the OEE Dashboard, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```

2. **Create a database in pgAdmin4:**
   - Open pgAdmin4
   - Create a new database for the project

3. **Configure the `.env` file:**
   - Update the `.env` file with your PostgreSQL connection details:
     ```dotenv
     DB_CONNECTION=pgsql
     DB_HOST=127.0.0.1
     DB_PORT=5432
     DB_DATABASE=your_database_name
     DB_USERNAME=your_username
     DB_PASSWORD=your_password
     ```

4. **Run database migrations:**
   ```bash
   php artisan migrate
   ```

5. **Start the development server:**
   ```bash
   php artisan serve
   ```

## Database Structure

1. **data_header**
   - Columns: `line`, `linedesc`, `tanggal`, `shift`, `start_prod`, `finish_prod`, `worktime`

2. **data_linestop**
   - Columns: `downtimeid`, `downtimedesc`, `mulai`, `selesai`, `duration`, `docnumber`, `mtcnumber`, `partremark`, `remarks`

3. **data_produksi**
   - Columns: `line_produksi`, `nama_line`, `tgl_produksi`, `shift_produksi`, `tipe_barang`, `timestamp_capture`

4. **data_qualityloss**
   - Columns: `line`, `shift`, `tipe_barang`, `ratio` (setiap n barang di ratio akan ada 1 barang dengan quality bad)

5. **data_standard**
   - Columns: `line`, `tipe_barang`, `standard_cycle`

## File Information

| Description                        | File Path                                      |
|------------------------------------|------------------------------------------------|
| HTML View                          | `resources\views\dashboard.blade.php`          |
| CSS Styles                         | `resources\css\style.css`                      |
| JavaScript for Database Definition | `resources\js\1.database.js`                   |
| JavaScript for Dynamic Functions   | `public\js\dashboard.js`                       |
| Routes Path                        | `routes\web.php`                               |
| Model Definitions                  | `app\Models`                                   |
| Controller Definition              | `app\Http\Controllers\DashboardController.php` |

## Bug

1. Sometimes counting time stops when not focused on windows due to the set time in JavaScript (SOLVED)