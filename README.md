# **GST Billing Software**

A responsive web application designed for small businesses to generate GST-compliant invoices. This application allows users to register, log in, add products with GST rates, calculate CGST/SGST, and generate downloadable PDF invoices.

---

## **Table of Contents**
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [File Structure](#file-structure)
4. [How to Run](#how-to-run)
5. [Team Roles](#team-roles)

---

## **Features**
- **User Authentication**: Register and log in with shop details and GSTIN.
- **GST Calculation**: Automatically calculates CGST and SGST based on product GST rates.
- **Invoice Generation**: Generates downloadable PDF invoices with a breakdown of GST.
- **Product Management**: Add and manage products with prices and GST rates.
- **Bill History**: View and manage previously generated bills.
- **Responsive Design**: Works seamlessly on both desktop and mobile devices.

---

## **Tech Stack**
| Tool               | Purpose                                                                 |
|--------------------|-------------------------------------------------------------------------|
| **HTML5**          | Structure and content of the web pages.                                 |
| **CSS3**           | Styling and layout of the application.                                  |
| **JavaScript**     | Core functionality, dynamic updates, and interactivity.                |
| **Bootstrap 5**    | Responsive design and pre-built UI components.                         |
| **jQuery**         | DOM manipulation and event handling.                                   |
| **jsPDF**          | PDF generation for invoices.                                           |
| **LocalStorage**   | Persistent data storage for users, products, and bills.                |

---

## **File Structure**
```
gst-billing/
├── auth.html            # Authentication page (login/register)
├── billing.html         # Main billing interface
├── css/
│   ├── auth.css         # Styles for authentication page
│   └── billing.css      # Styles for billing interface
├── js/
│   ├── auth.js          # Authentication logic
│   ├── billing.js       # Core billing functionality
│   └── pdfGenerator.js  # PDF generation logic
├── assets/
│   └── logo.png         # Application logo
└── README.md            # Project documentation
```

---

## **How to Run**
### Prerequisites
- A modern web browser (Chrome, Firefox, or Edge).
- Internet connection (for loading CDN dependencies).

### Steps to Run
1. **Download the Project**:
   - Clone or download the repository to your local machine.

2. **Open the Application**:
   - Navigate to the project folder and open `auth.html` in your browser.

3. **Register a New User**:
   - Fill in the registration form with shop details, email, password, and GSTIN.
   - Example GSTIN: `22AAAAA0000A1Z5`.

4. **Log In**:
   - Use your registered email and password to log in.

5. **Use the Billing System**:
   - Add products with prices and GST rates.
   - Generate and download PDF invoices.

6. **View Bill History**:
   - Access previously generated bills from the history section.

---

## **Team Roles**
The project is divided into **6 roles**, each with specific responsibilities:

| Role                            | Assigned to                   | Responsibilities                                                                                            |
|---------------------------------|-------------------------------|-------------------------------------------------------------------------------------------------------------|
| **JavaScript Developer/Hosting**| Aadi                          | Develops core functionality (authentication, billing logic, GST calculations) and hosts the app on Vercel   |
| **Frontend Developer**          | Anas                          | Implements the HTML structure and ensures responsive design.                                                |
| **CSS Styling Expert**          | Shambhavi                     | Designs and maintains the CSS for both authentication and billing interfaces.                               |
| **Base Code Creation**          | Aadi                          | Creates the base code for the files                                                                         |
| **PDF Generation**              | Manav                         | Implements PDF generation using jsPDF.                                                                      |
| **Testing & Debugging Lead**    | Sujal                         | Tests the application, identifies bugs, and ensures smooth functionality.                                   |

---

## **Acknowledgments**
- **Bootstrap** for providing a responsive design framework.
- **jsPDF** for enabling PDF generation.
- **jQuery** for simplifying DOM manipulation.

