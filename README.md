# edudocsX - Educational Document Generator

A simple web application for generating educational documents like marksheets, certificates, and admit cards with PDF export functionality.

## Features

- **Landing Page**: Professional landing page with features showcase and pricing plans
- **User Authentication**: Simple sign up/login system using localStorage
- **Dashboard**: Clean interface with three main document generation options
- **Marksheet Generator**: Create student marksheets with subjects and marks
- **Certificate Generator**: Generate certificates with custom titles and remarks
- **Admit Card Generator**: Create exam admit cards with student details
- **Bulk Generation**: Upload CSV/Excel files to generate up to 100 documents at once
- **Template Selection**: Choose from different templates (Classic, Modern, Elegant, Creative)
- **PDF Generation**: Instant PDF generation and download using jsPDF
- **Document History**: View and manage previously generated documents
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required - runs entirely in the browser

### Installation

1. Clone or download the project files to your local machine
2. Ensure you have the following files in your project directory:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`

### Running the Application

1. Open `index.html` in your web browser
2. The application will load with the landing page
3. Click "Sign Up" to create a new account or "Login" if you already have one

## Usage

### Creating an Account

1. Click "Sign Up" on the landing page
2. Fill in your full name, email, and password
3. Click "Sign Up" to create your account
4. You'll be automatically logged in and redirected to the dashboard

### Generating Documents

#### Marksheet
1. From the dashboard, click "Generate Marksheet"
2. Fill in student details (name, roll number, class, exam name)
3. Add subjects and their respective marks
4. Select a template
5. Click "Generate PDF" to download

#### Certificate
1. From the dashboard, click "Generate Certificate"
2. Fill in student name, certificate title, date, and remarks
3. Select a template
4. Click "Generate PDF" to download

#### Admit Card
1. From the dashboard, click "Generate Admit Card"
2. Fill in student name, roll number, exam center, and exam date
3. Select a template
4. Click "Generate PDF" to download

#### Bulk Generation
1. From the dashboard, click "Bulk Generation"
2. Choose document type (Marksheet, Certificate, or Admit Card)
3. Upload CSV or Excel file with student data (or download template)
4. Configure institution settings and template
5. Preview data and click "Generate All"
6. Download all documents as a ZIP file

**CSV Format Requirements:**
- **Marksheets**: studentName, rollNo, className, subject1, marks1, total1, subject2, marks2, total2, etc.
- **Certificates**: studentName, rollNo, className, achievement, date
- **Admit Cards**: studentName, rollNo, className, examDate, examTime, examCenter

### Managing History

1. Click "My History" from the dashboard
2. View all previously generated documents
3. Download or delete documents as needed

## Technical Details

### Technologies Used

- **HTML5**: Structure and layout
- **CSS3**: Styling and responsive design
- **JavaScript (ES6+)**: Application logic and interactivity
- **jsPDF**: PDF generation library
- **SheetJS (XLSX)**: Excel file parsing for bulk generation
- **JSZip**: ZIP file creation for bulk downloads
- **localStorage**: Client-side data persistence

### File Structure

```
edudocsX/
├── index.html          # Main HTML file with all pages
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript application logic
└── README.md           # This file
```

### Data Storage

The application uses browser localStorage to store:
- User accounts and authentication data
- Document generation history
- User preferences

**Note**: Data is stored locally in your browser and will be lost if you clear browser data.

### Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Features in Detail

### Authentication System
- Simple email/password registration
- Secure login (client-side validation)
- Session persistence using localStorage
- User-friendly error handling

### PDF Generation
- Uses jsPDF library for client-side PDF creation
- Professional document layouts
- Automatic calculations (percentage, totals)
- Instant download functionality

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interface
- Optimized for various screen sizes

### Template System
- Multiple template options for each document type
- Consistent branding and styling
- Easy to extend with new templates

## Customization

### Adding New Templates
1. Add new option to template select dropdowns in HTML
2. Modify PDF generation functions in `script.js` to handle new template styles
3. Update CSS if needed for preview functionality

### Styling Changes
- Modify `styles.css` to change colors, fonts, and layouts
- CSS variables can be added for easier theme management
- All styles are contained in a single file for simplicity

### Adding New Document Types
1. Add new form page in HTML
2. Create corresponding navigation functions
3. Implement PDF generation logic
4. Update dashboard with new option

## Troubleshooting

### Common Issues

**PDFs not generating**
- Ensure jsPDF library is loaded (check browser console)
- Verify all required form fields are filled
- Check browser's download settings

**Login not working**
- Clear browser localStorage and try again
- Ensure JavaScript is enabled
- Check browser console for errors

**Responsive issues**
- Clear browser cache
- Try different browser
- Check viewport meta tag

### Browser Console
Press F12 to open developer tools and check the console for any error messages.

## Future Enhancements

Potential features that could be added:
- Server-side authentication and data storage
- Email integration for document sharing
- Advanced template customization
- Photo upload support for bulk admit cards
- Integration with school management systems
- Digital signatures
- QR code generation for verification
- Export to different formats (Word, Excel)
- Advanced data validation and error reporting

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please check the troubleshooting section above or review the code comments in the JavaScript files.
