# NSS Blood Donation Registration Application

## Overview
This application is designed to manage the registration and confirmation process for blood donations. It features three main components: Entry, Exit and Statistics. Multiple admins can use these components to handle incoming and outgoing donors, as well as view and export donation statistics.

## Features
- **Entry Form**: Admins fill in the details of incoming donors and submit the form to store the information in the database.
- **Exit Form**: After donating, donors provide their register number or phone number to the exit admin. The admin fetches the donor details from the database, confirms the donation status. The donation status is also updated in the database.
- **Statistics**: Displays the count of registered donors and donors who have donated. It also includes an export feature to download the data as an Excel file.

### Entry Form
- **Purpose**: Admins use this form to enter the details of incoming donors.
- **Functionality**: When the form is submitted, the details are stored in the database.

### Exit Form
- **Purpose**: After donating, donors provide their register number or phone number to the exit admin.
- **Functionality**:
  - The admin fetches the donor details from the database using the register number or phone number.
  - Confirms the donation status and updates it in the database.

### Statistics
- **Purpose**: Provides an overview of the donation statistics.
- **Functionality**:
  - Displays the count of registered donors and donors who have donated.
  - Includes an export feature to download the data as an Excel file.