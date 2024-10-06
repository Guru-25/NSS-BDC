# NSS Blood Donation Registration Application
## Overview
This application is designed to manage the registration and confirmation process for blood donations. It features two main components: Entry and Exit. Multiple admins can use these components to handle incoming and outgoing donors.

## Features
- **Entry Form**: Admins fill in the details of incoming people and submit the form to store the information in the database.
- **Exit Form**: After donating, people provide their email ID to the exit admin. The admin fetches the user details from the database, confirms the donation status, and sends a thank-you email to the donor. The donation status is also updated in the database.

### Entry Form
- **Purpose**: Admins use this form to enter the details of incoming people.
- **Functionality**: When the form is submitted, the details are stored in the database.

### Exit Form
- **Purpose**: After donating, people provide their email ID to the exit admin.
- **Functionality**:
  - The admin fetches the user details from the database using the email ID.
  - The admin confirms the donation status using a "yes/no" option.
  - Upon confirmation, a thank-you email is sent to the donor.
  - The donation status is updated in the database.