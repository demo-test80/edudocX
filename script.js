// Global variables
let currentUser = null;
let documentHistory = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('edudocsX_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    }
    
    // Load document history
    const savedHistory = localStorage.getItem('edudocsX_history');
    if (savedHistory) {
        documentHistory = JSON.parse(savedHistory);
    }
    
    // Set up form event listeners
    setupFormListeners();
});

// Page navigation functions
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
}

function showLogin() {
    closeAllModals();
    document.getElementById('login-modal').style.display = 'block';
}

function showSignup() {
    closeAllModals();
    document.getElementById('signup-modal').style.display = 'block';
}

function showDashboard() {
    if (currentUser) {
        document.getElementById('user-name').textContent = `Welcome, ${currentUser.name}!`;
    }
    closeAllModals();
    showPage('dashboard');
}

function showMarksheetForm() {
    showPage('marksheet-form');
}

function showCertificateForm() {
    showPage('certificate-form');
}

function showAdmitCardForm() {
    showPage('admit-card-form');
}

function showIdCardForm() {
    showPage('id-card-form');
}

function showHistory() {
    showPage('history-page');
    loadHistory();
}

// Modal functions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Click outside modal to close
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Authentication functions
function setupFormListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Simple validation (in real app, this would be server-side)
        const users = JSON.parse(localStorage.getItem('edudocsX_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = user;
            localStorage.setItem('edudocsX_user', JSON.stringify(user));
            showDashboard();
        } else {
            alert('Invalid email or password');
        }
    });
    
    // Signup form
    document.getElementById('signup-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        // Get existing users
        const users = JSON.parse(localStorage.getItem('edudocsX_users') || '[]');
        
        // Check if user already exists
        if (users.find(u => u.email === email)) {
            alert('User with this email already exists');
            return;
        }
        
        // Create new user
        const newUser = { name, email, password, id: Date.now() };
        users.push(newUser);
        localStorage.setItem('edudocsX_users', JSON.stringify(users));
        
        // Login the new user
        currentUser = newUser;
        localStorage.setItem('edudocsX_user', JSON.stringify(newUser));
        showDashboard();
    });
    
    // Document generation forms
    document.getElementById('marksheet-data').addEventListener('submit', generateMarksheet);
    document.getElementById('certificate-data').addEventListener('submit', generateCertificate);
    document.getElementById('admit-card-data').addEventListener('submit', generateAdmitCard);
    document.getElementById('id-card-data').addEventListener('submit', generateIdCard);
    
    // Setup dropdown handlers
    setupDropdownHandlers();
}

// Setup dropdown handlers for all forms
function setupDropdownHandlers() {
    // Marksheet form dropdowns
    const classSelect = document.getElementById('class-name');
    const classManual = document.getElementById('class-manual');
    const examSelect = document.getElementById('exam-name');
    const examManual = document.getElementById('exam-name-manual');
    
    if (classSelect && classManual) {
        classSelect.addEventListener('change', function() {
            if (this.value === 'add-manually') {
                classManual.style.display = 'block';
                classManual.required = true;
            } else {
                classManual.style.display = 'none';
                classManual.required = false;
                classManual.value = '';
            }
        });
    }
    
    if (examSelect && examManual) {
        examSelect.addEventListener('change', function() {
            if (this.value === 'add-manually') {
                examManual.style.display = 'block';
                examManual.required = true;
            } else {
                examManual.style.display = 'none';
                examManual.required = false;
                examManual.value = '';
            }
        });
    }
}

// Handle subject dropdown change for "Add Manually" functionality
function handleSubjectChange(selectElement) {
    const manualInput = selectElement.parentElement.querySelector('.subject-name-manual');
    
    if (selectElement.value === 'add-manually') {
        manualInput.style.display = 'block';
        manualInput.required = true;
    } else {
        manualInput.style.display = 'none';
        manualInput.required = false;
        manualInput.value = '';
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('edudocsX_user');
    showPage('landing-page');
}

// Subject management for marksheet
function addSubject() {
    const container = document.getElementById('subjects-container');
    const subjectRow = document.createElement('div');
    subjectRow.className = 'subject-row';
    subjectRow.innerHTML = `
        <div class="subject-dropdown-container">
            <select class="subject-name dropdown-select" onchange="handleSubjectChange(this)" required>
                <option value="">Select Subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="History">History</option>
                <option value="Geography">Geography</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Physical Education">Physical Education</option>
                <option value="Art & Craft">Art & Craft</option>
                <option value="Music">Music</option>
                <option value="Hindi">Hindi</option>
                <option value="Sanskrit">Sanskrit</option>
                <option value="Social Studies">Social Studies</option>
                <option value="add-manually">Add Manually</option>
            </select>
            <input type="text" class="subject-name-manual manual-input" placeholder="Enter subject name" style="display: none;">
        </div>
        <div class="marks-container">
            <select class="out-of-marks dropdown-select" required>
                <option value="">Out Of</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30">30</option>
                <option value="35">35</option>
                <option value="40">40</option>
                <option value="45">45</option>
                <option value="50">50</option>
                <option value="55">55</option>
                <option value="60">60</option>
                <option value="65">65</option>
                <option value="70">70</option>
                <option value="75">75</option>
                <option value="80">80</option>
                <option value="85">85</option>
                <option value="90">90</option>
                <option value="95">95</option>
                <option value="100">100</option>
            </select>
            <input type="number" class="obtained-marks manual-input" placeholder="Obtained" min="0" required>
        </div>
        <button type="button" class="btn btn-danger btn-small" onclick="removeSubject(this)">Remove</button>
    `;
    container.appendChild(subjectRow);
}

function removeSubject(button) {
    const container = document.getElementById('subjects-container');
    if (container.children.length > 1) {
        button.parentElement.remove();
    } else {
        alert('At least one subject is required');
    }
}

// PDF Generation functions
function generateMarksheet(e) {
    e.preventDefault();
    
    const instituteName = document.getElementById('institute-name').value;
    const studentName = document.getElementById('student-name').value;
    const rollNo = document.getElementById('roll-no').value;
    
    // Get class name (either from dropdown or manual input)
    const classSelect = document.getElementById('class-name');
    const classManual = document.getElementById('class-manual');
    let className = '';
    if (classSelect.value && classSelect.value !== 'add-manually') {
        className = classSelect.value;
    } else if (classManual.value) {
        className = classManual.value;
    }
    
    // Get exam name (either from dropdown or manual input)
    const examSelect = document.getElementById('exam-name');
    const examManual = document.getElementById('exam-name-manual');
    let examName = '';
    if (examSelect.value && examSelect.value !== 'add-manually') {
        examName = examSelect.value;
    } else if (examManual.value) {
        examName = examManual.value;
    }
    
    const template = document.getElementById('marksheet-template').value;
    
    // Get subjects
    const subjects = [];
    const subjectRows = document.querySelectorAll('.subject-row');
    subjectRows.forEach(row => {
        // Get subject name (either from dropdown or manual input)
        const subjectSelect = row.querySelector('.subject-name');
        const subjectManual = row.querySelector('.subject-name-manual');
        let subjectName = '';
        
        if (subjectSelect.value && subjectSelect.value !== 'add-manually') {
            subjectName = subjectSelect.value;
        } else if (subjectManual.value) {
            subjectName = subjectManual.value;
        }
        
        // Get marks (out of and obtained)
        const outOfMarks = row.querySelector('.out-of-marks').value;
        const obtainedMarks = row.querySelector('.obtained-marks').value;
        
        if (subjectName && outOfMarks && obtainedMarks) {
            subjects.push({ 
                name: subjectName, 
                outOf: parseInt(outOfMarks),
                obtained: parseInt(obtainedMarks),
                marks: parseInt(obtainedMarks) // Keep for backward compatibility
            });
        }
    });
    
    if (subjects.length === 0) {
        alert('Please add at least one subject');
        return;
    }
    
    // Generate PDF based on template
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Apply template-specific styling
    switch(template) {
        case 'classic':
            generateClassicTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects);
            break;
        case 'modern':
            generateModernTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects);
            break;
        case 'elegant':
            generateElegantTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects);
            break;
        case 'minimal':
            generateMinimalTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects);
            break;
        case 'academic':
            generateAcademicTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects);
            break;
        case 'professional':
            generateProfessionalTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects);
            break;
        case 'premium':
            generatePremiumTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects);
            break;
        case 'university':
            generateUniversityTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects);
            break;
        case 'creative':
            generateCreativeMarksheetTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects);
            break;
        default:
            generateClassicTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects);
    }
    
    // Save to history
    const docData = {
        type: 'Marksheet',
        instituteName,
        studentName,
        rollNo,
        className,
        examName,
        subjects,
        template,
        date: new Date().toLocaleDateString(),
        id: Date.now()
    };
    
    documentHistory.push(docData);
    localStorage.setItem('edudocsX_history', JSON.stringify(documentHistory));
    
    // Download PDF
    doc.save(`${studentName}_Marksheet_${template}.pdf`);
    
    alert(`Professional ${template} marksheet generated successfully!`);
}

// Template 1: Classic Professional
function generateClassicTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects) {
    // Cream background
    doc.setFillColor(250, 248, 245);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Elegant outer border
    doc.setLineWidth(3);
    doc.setDrawColor(139, 69, 19);
    doc.rect(10, 10, 190, 277);
    
    // Inner decorative border
    doc.setLineWidth(1);
    doc.setDrawColor(218, 165, 32);
    doc.rect(15, 15, 180, 267);
    
    // Header section
    doc.setFillColor(139, 69, 19);
    doc.rect(20, 20, 170, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(instituteName.toUpperCase(), 105, 32, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Academic Excellence • Character Building • Future Leaders', 105, 40, { align: 'center' });
    
    // Document title
    doc.setTextColor(139, 69, 19);
    doc.setFontSize(24);
    doc.text('STUDENT MARKSHEET', 105, 60, { align: 'center' });
    
    // Decorative line
    doc.setLineWidth(2);
    doc.setDrawColor(218, 165, 32);
    doc.line(60, 65, 150, 65);
    
    // Student details
    doc.setFillColor(248, 248, 255);
    doc.rect(25, 75, 160, 20, 'F');
    doc.setDrawColor(139, 69, 19);
    doc.setLineWidth(1);
    doc.rect(25, 75, 160, 20);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`Name: ${studentName}`, 30, 85);
    doc.text(`Class: ${className}`, 30, 92);
    doc.text(`Roll Number: ${rollNo}`, 120, 85);
    doc.text(`Examination: ${examName}`, 120, 92);
    
    generateSubjectsTable(doc, subjects, 105, 'classic');
}

// Template 2: Modern Corporate
function generateModernTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects) {
    // White background with blue accent
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Modern header with gradient effect
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, 210, 50, 'F');
    
    // Institution name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text(instituteName.toUpperCase(), 105, 25, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Excellence in Education • Innovation • Leadership', 105, 35, { align: 'center' });
    
    // Document title
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(22);
    doc.text('ACADEMIC TRANSCRIPT', 105, 65, { align: 'center' });
    
    // Modern line
    doc.setLineWidth(3);
    doc.setDrawColor(52, 152, 219);
    doc.line(20, 70, 190, 70);
    
    // Student info in modern cards
    doc.setFillColor(236, 240, 241);
    doc.rect(20, 80, 75, 25, 'F');
    doc.rect(115, 80, 75, 25, 'F');
    
    doc.setTextColor(44, 62, 80);
    doc.setFontSize(10);
    doc.text(`Name: ${studentName}`, 25, 90);
    doc.text(`Class: ${className}`, 25, 98);
    doc.text(`Roll: ${rollNo}`, 120, 90);
    doc.text(`Exam: ${examName}`, 120, 98);
    
    generateSubjectsTable(doc, subjects, 115, 'modern');
}

// Template 3: Elegant Academic
function generateElegantTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects) {
    // Light gray background
    doc.setFillColor(248, 249, 250);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Elegant border
    doc.setLineWidth(2);
    doc.setDrawColor(108, 117, 125);
    doc.rect(15, 15, 180, 267);
    
    // Inner border
    doc.setLineWidth(1);
    doc.setDrawColor(173, 181, 189);
    doc.rect(20, 20, 170, 257);
    
    // Header
    doc.setFillColor(52, 58, 64);
    doc.rect(25, 25, 160, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(instituteName.toUpperCase(), 105, 38, { align: 'center' });
    doc.setFontSize(9);
    doc.text('Nurturing Minds • Building Character • Shaping Future', 105, 48, { align: 'center' });
    
    // Title with elegant font
    doc.setTextColor(52, 58, 64);
    doc.setFontSize(20);
    doc.text('ACADEMIC RECORD', 105, 70, { align: 'center' });
    
    // Elegant underline
    doc.setLineWidth(1);
    doc.setDrawColor(108, 117, 125);
    doc.line(70, 75, 140, 75);
    
    // Student details in elegant box
    doc.setFillColor(255, 255, 255);
    doc.rect(30, 85, 150, 18, 'F');
    doc.setDrawColor(173, 181, 189);
    doc.rect(30, 85, 150, 18);
    
    doc.setTextColor(33, 37, 41);
    doc.setFontSize(10);
    doc.text(`Name: ${studentName}`, 35, 95);
    doc.text(`Class: ${className}`, 35, 100);
    doc.text(`Roll: ${rollNo}`, 120, 95);
    doc.text(`Exam: ${examName}`, 120, 100);
    
    generateSubjectsTable(doc, subjects, 113, 'elegant');
}

// Template 4: Minimal Clean
function generateMinimalTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects) {
    // Pure white background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Minimal header
    doc.setTextColor(33, 37, 41);
    doc.setFontSize(20);
    doc.text(instituteName.toUpperCase(), 105, 30, { align: 'center' });
    
    // Simple line
    doc.setLineWidth(1);
    doc.setDrawColor(108, 117, 125);
    doc.line(30, 35, 180, 35);
    
    // Document title
    doc.setFontSize(18);
    doc.text('MARKSHEET', 105, 50, { align: 'center' });
    
    // Clean student info
    doc.setFontSize(11);
    doc.text(`Name: ${studentName}`, 30, 70);
    doc.text(`Roll: ${rollNo}`, 120, 70);
    doc.text(`Class: ${className}`, 30, 80);
    doc.text(`Exam: ${examName}`, 120, 80);
    
    // Simple line separator
    doc.line(30, 85, 180, 85);
    
    generateSubjectsTable(doc, subjects, 95, 'minimal');
}

// Template 5: Formal Government
function generateFormalTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects) {
    // Official background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Government style border
    doc.setLineWidth(4);
    doc.setDrawColor(0, 0, 0);
    doc.rect(10, 10, 190, 277);
    
    doc.setLineWidth(1);
    doc.rect(15, 15, 180, 267);
    
    // Official header
    doc.setFillColor(0, 0, 0);
    doc.rect(20, 20, 170, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(instituteName.toUpperCase(), 105, 32, { align: 'center' });
    doc.setFontSize(10);
    doc.text('DEPARTMENT OF EDUCATION', 105, 40, { align: 'center' });
    
    // Official title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text('OFFICIAL MARKSHEET', 105, 60, { align: 'center' });
    
    // Official seal placeholder
    doc.setDrawColor(0, 0, 0);
    doc.circle(40, 75, 12);
    doc.setFontSize(8);
    doc.text('OFFICIAL', 40, 72, { align: 'center' });
    doc.text('SEAL', 40, 78, { align: 'center' });
    
    // Student details in official format
    doc.setFontSize(11);
    doc.text(`Student Name: ${studentName}`, 70, 75);
    doc.text(`Roll Number: ${rollNo}`, 70, 83);
    doc.text(`Class/Grade: ${className}`, 70, 91);
    doc.text(`Examination: ${examName}`, 70, 99);
    
    generateSubjectsTable(doc, subjects, 110, 'formal');
}

// Template 6: Luxury Premium
function generateLuxuryTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects) {
    // Luxury gradient background
    doc.setFillColor(138, 43, 226);
    doc.rect(0, 0, 210, 297, 'F');
    
    // White content area
    doc.setFillColor(255, 255, 255);
    doc.rect(15, 15, 180, 267, 'F');
    
    // Luxury border with gold accent
    doc.setLineWidth(3);
    doc.setDrawColor(255, 215, 0);
    doc.rect(20, 20, 170, 257);
    
    doc.setLineWidth(1);
    doc.setDrawColor(138, 43, 226);
    doc.rect(22, 22, 166, 253);
    
    // Premium header
    doc.setFillColor(138, 43, 226);
    doc.rect(25, 25, 160, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text(instituteName.toUpperCase(), 105, 38, { align: 'center' });
    doc.setFontSize(12);
    doc.text('PREMIUM ACADEMIC EXCELLENCE', 105, 48, { align: 'center' });
    
    // Luxury title with decorative elements
    doc.setTextColor(138, 43, 226);
    doc.setFontSize(20);
    doc.text('✦ MARKSHEET ✦', 105, 70, { align: 'center' });
    
    // Premium student details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Student Name: ${studentName}`, 30, 85);
    doc.text(`Roll Number: ${rollNo}`, 30, 95);
    doc.text(`Class/Grade: ${className}`, 30, 105);
    doc.text(`Examination: ${examName}`, 30, 115);
    
    generateSubjectsTable(doc, subjects, 130, 'luxury');
}

// Template 7: Creative Artistic
function generateCreativeTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects) {
    // Creative background
    doc.setFillColor(255, 248, 220);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Artistic border
    doc.setLineWidth(2);
    doc.setDrawColor(255, 140, 0);
    doc.rect(10, 10, 190, 277);
    
    // Creative wavy lines
    doc.setDrawColor(255, 165, 0);
    doc.setLineWidth(1);
    for (let i = 0; i < 5; i++) {
        doc.line(15 + i * 35, 15, 25 + i * 35, 25);
        doc.line(15 + i * 35, 272, 25 + i * 35, 282);
    }
    
    // Creative header
    doc.setFillColor(255, 140, 0);
    doc.rect(20, 20, 170, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(instituteName.toUpperCase(), 105, 32, { align: 'center' });
    doc.setFontSize(10);
    doc.text('CREATIVE LEARNING INSTITUTE', 105, 42, { align: 'center' });
    doc.text('~ Inspiring Excellence ~', 105, 50, { align: 'center' });
    
    // Artistic title
    doc.setTextColor(255, 140, 0);
    doc.setFontSize(18);
    doc.text('◆ ACADEMIC MARKSHEET ◆', 105, 70, { align: 'center' });
    
    // Creative student details with icons
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`★ Student: ${studentName}`, 30, 85);
    doc.text(`★ Roll No: ${rollNo}`, 30, 95);
    doc.text(`★ Class: ${className}`, 30, 105);
    doc.text(`★ Exam: ${examName}`, 30, 115);
    
    generateSubjectsTable(doc, subjects, 130, 'creative');
}

// Template 8: Technical Standard
function generateTechnicalTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects) {
    // Technical grid background
    doc.setFillColor(240, 248, 255);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Grid pattern
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    for (let i = 0; i <= 210; i += 10) {
        doc.line(i, 0, i, 297);
    }
    for (let i = 0; i <= 297; i += 10) {
        doc.line(0, i, 210, i);
    }
    
    // Technical border
    doc.setLineWidth(2);
    doc.setDrawColor(70, 130, 180);
    doc.rect(15, 15, 180, 267);
    
    // Technical header
    doc.setFillColor(70, 130, 180);
    doc.rect(20, 20, 170, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(instituteName.toUpperCase(), 105, 30, { align: 'center' });
    doc.setFontSize(10);
    doc.text('TECHNICAL EDUCATION BOARD', 105, 38, { align: 'center' });
    doc.text('Standard Assessment Report', 105, 45, { align: 'center' });
    
    // Technical title
    doc.setTextColor(70, 130, 180);
    doc.setFontSize(16);
    doc.text('TECHNICAL MARKSHEET', 105, 65, { align: 'center' });
    
    // Technical student details in structured format
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('STUDENT INFORMATION:', 25, 80);
    doc.text(`Name: ${studentName}`, 25, 90);
    doc.text(`ID: ${rollNo}`, 25, 100);
    doc.text(`Level: ${className}`, 120, 90);
    doc.text(`Assessment: ${examName}`, 120, 100);
    
    generateSubjectsTable(doc, subjects, 115, 'technical');
}

// Helper function to calculate grade from percentage
function calculateGrade(percentage) {
    if (percentage >= 90) return 'A+';
    else if (percentage >= 80) return 'A';
    else if (percentage >= 70) return 'B+';
    else if (percentage >= 60) return 'B';
    else if (percentage >= 50) return 'C';
    else if (percentage >= 40) return 'D';
    else return 'F';
}

// Helper function to get overall grade description
function getOverallGradeDescription(percentage) {
    if (percentage >= 90) return 'A+ (Distinction)';
    else if (percentage >= 80) return 'A (Excellent)';
    else if (percentage >= 70) return 'B+ (Very Good)';
    else if (percentage >= 60) return 'B (Good)';
    else if (percentage >= 50) return 'C (Average)';
    else if (percentage >= 40) return 'D (Pass)';
    else return 'F (Fail)';
}

// Special function for bulk generation with oral/practical marks
function generateBulkSubjectsTable(doc, subjects, startY, templateType) {
    let yPos = startY;
    
    // Table styling based on template
    const styles = {
        classic: { headerBg: [139, 69, 19], headerText: [255, 255, 255], rowBg1: [255, 255, 255], rowBg2: [248, 248, 255] },
        modern: { headerBg: [41, 128, 185], headerText: [255, 255, 255], rowBg1: [255, 255, 255], rowBg2: [236, 240, 241] },
        elegant: { headerBg: [52, 58, 64], headerText: [255, 255, 255], rowBg1: [255, 255, 255], rowBg2: [248, 249, 250] },
        creative: { headerBg: [255, 140, 0], headerText: [255, 255, 255], rowBg1: [255, 255, 255], rowBg2: [255, 248, 220] }
    };
    
    const style = styles[templateType];
    
    // Table header
    doc.setFillColor(...style.headerBg);
    doc.rect(25, yPos, 160, 12, 'F');
    doc.setTextColor(...style.headerText);
    doc.setFontSize(12);
    doc.text('SUBJECTS & GRADES', 105, yPos + 8, { align: 'center' });
    
    yPos += 15;
    
    // Column headers for bulk generation (with oral/practical)
    doc.setFillColor(...style.headerBg);
    doc.rect(25, yPos, 160, 10, 'F');
    doc.setTextColor(...style.headerText);
    doc.setFontSize(8);
    doc.text('SUBJECT', 30, yPos + 7);
    doc.text('WRITTEN', 85, yPos + 7);
    doc.text('ORAL/PRAC', 120, yPos + 7);
    doc.text('TOTAL', 155, yPos + 7);
    doc.text('GRADE', 175, yPos + 7);
    
    yPos += 12;
    
    // Subject rows
    let totalObtained = 0;
    let totalMaxMarks = 0;
    
    subjects.forEach((subject, index) => {
        if (index % 2 === 0) {
            doc.setFillColor(...style.rowBg1);
        } else {
            doc.setFillColor(...style.rowBg2);
        }
        doc.rect(25, yPos, 160, 10, 'F');
        
        // Ensure we have valid numbers for calculation
        const obtained = subject.obtained || subject.marks || 0;
        const outOf = subject.outOf || subject.total || 100;
        const oralObtained = subject.oralObtained || subject.oralMarks || 0;
        const oralOutOf = subject.oralOutOf || subject.oralTotal || 10;
        
        // Calculate total marks including oral/practical
        const totalObtainedMarks = obtained + oralObtained;
        const subjectTotalMarks = outOf + oralOutOf;
        
        // Calculate percentage and grade based on total
        const percentage = (totalObtainedMarks / subjectTotalMarks) * 100;
        const grade = calculateGrade(percentage);
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(7);
        doc.text(subject.name, 30, yPos + 7);
        doc.text(`${obtained}/${outOf}`, 85, yPos + 7);
        doc.text(`${oralObtained}/${oralOutOf}`, 120, yPos + 7);
        doc.text(`${totalObtainedMarks}/${subjectTotalMarks}`, 155, yPos + 7);
        doc.text(grade, 175, yPos + 7);
        
        totalObtained += totalObtainedMarks;
        totalMaxMarks += subjectTotalMarks;
        yPos += 10;
    });
    
    // Summary section
    yPos += 10;
    doc.setFillColor(...style.headerBg);
    doc.rect(25, yPos, 160, 25, 'F');
    
    doc.setTextColor(...style.headerText);
    doc.setFontSize(12);
    doc.text('TOTAL MARKS:', 30, yPos + 10);
    doc.text(`${totalObtained}/${totalMaxMarks}`, 120, yPos + 10);
    
    const percentage = ((totalObtained / totalMaxMarks) * 100).toFixed(1);
    doc.text('PERCENTAGE:', 30, yPos + 20);
    doc.text(`${percentage}%`, 130, yPos + 20);
    
    // Overall grade
    const overallGrade = getOverallGradeDescription(percentage);
    doc.text(`Grade: ${overallGrade}`, 120, yPos + 15);
    
    // Footer with signatures
    yPos += 40;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 30, yPos);
    
    // Signature lines
    doc.line(30, yPos + 15, 80, yPos + 15);
    doc.line(130, yPos + 15, 180, yPos + 15);
    doc.text('Class Teacher', 55, yPos + 20, { align: 'center' });
    doc.text('Principal', 155, yPos + 20, { align: 'center' });
}

// Common function to generate subjects table for all templates
function generateSubjectsTable(doc, subjects, startY, templateType, logoData = null) {
    let yPos = startY;
    
    // Table styling based on template
    const styles = {
        classic: { headerBg: [139, 69, 19], headerText: [255, 255, 255], rowBg1: [255, 255, 255], rowBg2: [248, 248, 255] },
        modern: { headerBg: [41, 128, 185], headerText: [255, 255, 255], rowBg1: [255, 255, 255], rowBg2: [236, 240, 241] },
        elegant: { headerBg: [52, 58, 64], headerText: [255, 255, 255], rowBg1: [255, 255, 255], rowBg2: [248, 249, 250] },
        minimal: { headerBg: [108, 117, 125], headerText: [255, 255, 255], rowBg1: [255, 255, 255], rowBg2: [248, 249, 250] },
        formal: { headerBg: [0, 0, 0], headerText: [255, 255, 255], rowBg1: [255, 255, 255], rowBg2: [240, 240, 240] },
        luxury: { headerBg: [138, 43, 226], headerText: [255, 255, 255], rowBg1: [255, 255, 255], rowBg2: [248, 248, 255] },
        creative: { headerBg: [255, 140, 0], headerText: [255, 255, 255], rowBg1: [255, 255, 255], rowBg2: [255, 248, 220] },
        technical: { headerBg: [70, 130, 180], headerText: [255, 255, 255], rowBg1: [255, 255, 255], rowBg2: [240, 248, 255] }
    };
    
    const style = styles[templateType];
    
    // Table header
    doc.setFillColor(...style.headerBg);
    doc.rect(25, yPos, 160, 12, 'F');
    doc.setTextColor(...style.headerText);
    doc.setFontSize(12);
    doc.text('SUBJECTS & GRADES', 105, yPos + 8, { align: 'center' });
    
    yPos += 15;
    
    // Column headers
    doc.setFillColor(...style.headerBg);
    doc.rect(25, yPos, 160, 10, 'F');
    doc.setTextColor(...style.headerText);
    doc.setFontSize(10);
    doc.text('SUBJECT', 30, yPos + 7);
    doc.text('MARKS', 120, yPos + 7);
    doc.text('GRADE', 160, yPos + 7);
    
    yPos += 12;
    
    // Subject rows
    let totalObtained = 0;
    let totalMaxMarks = 0;
    
    subjects.forEach((subject, index) => {
        if (index % 2 === 0) {
            doc.setFillColor(...style.rowBg1);
        } else {
            doc.setFillColor(...style.rowBg2);
        }
        doc.rect(25, yPos, 160, 10, 'F');
        
        // Ensure we have valid numbers for calculation
        const obtained = subject.obtained || subject.marks || 0;
        const outOf = subject.outOf || subject.total || 100;
        
        // Calculate percentage and grade
        const percentage = (obtained / outOf) * 100;
        const grade = calculateGrade(percentage);
        
        doc.setTextColor(0, 0, 0);
        doc.text(subject.name, 30, yPos + 7);
        doc.text(`${obtained}/${outOf}`, 120, yPos + 7);
        doc.text(grade, 165, yPos + 7);
        
        totalObtained += obtained;
        totalMaxMarks += outOf;
        yPos += 10;
    });
    
    // Summary section
    yPos += 10;
    doc.setFillColor(...style.headerBg);
    doc.rect(25, yPos, 160, 25, 'F');
    
    doc.setTextColor(...style.headerText);
    doc.setFontSize(12);
    doc.text('TOTAL MARKS:', 30, yPos + 10);
    doc.text(`${totalObtained}/${totalMaxMarks}`, 120, yPos + 10);
    
    const percentage = ((totalObtained / totalMaxMarks) * 100).toFixed(1);
    doc.text('PERCENTAGE:', 30, yPos + 20);
    doc.text(`${percentage}%`, 130, yPos + 20);
    
    // Overall grade
    const overallGrade = getOverallGradeDescription(percentage);
    doc.text(`Grade: ${overallGrade}`, 120, yPos + 15);
    
    // Footer with signatures
    yPos += 40;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 30, yPos);
    
    // Signature lines
    doc.line(30, yPos + 15, 80, yPos + 15);
    doc.line(130, yPos + 15, 180, yPos + 15);
    doc.text('Class Teacher', 55, yPos + 20, { align: 'center' });
    doc.text('Principal', 155, yPos + 20, { align: 'center' });
    
    // School seal
    doc.setDrawColor(0, 0, 0);
    doc.circle(105, yPos + 15, 8);
    doc.setFontSize(8);
    doc.text('SCHOOL', 105, yPos + 12, { align: 'center' });
    doc.text('SEAL', 105, yPos + 18, { align: 'center' });
}

function generateCertificate(e) {
    e.preventDefault();
    
    const instituteName = document.getElementById('cert-institute-name').value;
    const studentName = document.getElementById('cert-student-name').value;
    const title = document.getElementById('cert-title').value;
    const date = document.getElementById('cert-date').value;
    const remarks = document.getElementById('cert-remarks').value;
    const template = document.getElementById('certificate-template').value;
    
    // Generate PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');
    
    // Apply template-specific styling
    switch(template) {
        case 'classic':
            generateClassicCertificate(doc, instituteName, studentName, title, date, remarks);
            break;
        case 'modern':
            generateModernCertificate(doc, instituteName, studentName, title, date, remarks);
            break;
        case 'elegant':
            generateElegantCertificate(doc, instituteName, studentName, title, date, remarks);
            break;
        case 'minimal':
            generateMinimalCertificate(doc, instituteName, studentName, title, date, remarks);
            break;
        case 'formal':
            generateFormalCertificate(doc, instituteName, studentName, title, date, remarks);
            break;
        case 'luxury':
            generateLuxuryCertificate(doc, instituteName, studentName, title, date, remarks);
            break;
        case 'creative':
            generateCreativeCertificate(doc, instituteName, studentName, title, date, remarks);
            break;
        case 'achievement':
            generateAchievementCertificate(doc, instituteName, studentName, title, date, remarks);
            break;
        default:
            generateClassicCertificate(doc, instituteName, studentName, title, date, remarks);
    }
    
    // Save to history
    const docData = {
        type: 'Certificate',
        instituteName,
        studentName,
        title,
        date,
        remarks,
        template,
        generatedDate: new Date().toLocaleDateString(),
        id: Date.now()
    };
    
    documentHistory.push(docData);
    localStorage.setItem('edudocsX_history', JSON.stringify(documentHistory));
    
    // Download PDF
    doc.save(`${studentName}_Certificate_${template}.pdf`);
    
    alert(`Professional ${template} certificate generated successfully!`);
}

// Certificate Template 1: Classic Professional
function generateClassicCertificate(doc, instituteName, studentName, title, date, remarks) {
    // Classic background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 297, 210, 'F');
    
    // Decorative border
    doc.setLineWidth(5);
    doc.setDrawColor(139, 69, 19);
    doc.rect(10, 10, 277, 190);
    
    doc.setLineWidth(2);
    doc.setDrawColor(218, 165, 32);
    doc.rect(15, 15, 267, 180);
    
    // Header
    doc.setTextColor(139, 69, 19);
    doc.setFontSize(24);
    doc.text(instituteName.toUpperCase(), 148.5, 40, { align: 'center' });
    
    doc.setFontSize(28);
    doc.text('CERTIFICATE OF ACHIEVEMENT', 148.5, 60, { align: 'center' });
    
    // Main content
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('This is to certify that', 148.5, 85, { align: 'center' });
    
    doc.setFontSize(22);
    doc.setTextColor(139, 69, 19);
    doc.text(studentName.toUpperCase(), 148.5, 105, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`has successfully completed`, 148.5, 125, { align: 'center' });
    doc.text(title, 148.5, 140, { align: 'center' });
    
    if (remarks) {
        doc.text(remarks, 148.5, 155, { align: 'center' });
    }
    
    doc.text(`Date: ${date}`, 148.5, 175, { align: 'center' });
    
    // Signature lines
    doc.setLineWidth(1);
    doc.line(50, 185, 120, 185);
    doc.line(177, 185, 247, 185);
    
    doc.setFontSize(14);
    doc.text(`for outstanding achievement in ${title}`, 148.5, 150, { align: 'center' });
}

// Certificate Template 2: Modern Corporate
function generateModernCertificate(doc, instituteName, studentName, title, date, remarks) {
    // Modern gradient background
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, 297, 210, 'F');
    
    // White content area
    doc.setFillColor(255, 255, 255);
    doc.rect(20, 20, 257, 170, 'F');
    
    // Modern border
    doc.setLineWidth(3);
    doc.setDrawColor(52, 152, 219);
    doc.rect(25, 25, 247, 160);
    
    // Header
    doc.setFillColor(41, 128, 185);
    doc.rect(30, 30, 237, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text(instituteName.toUpperCase(), 148.5, 45, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Excellence in Education', 148.5, 58, { align: 'center' });
    
    // Modern title
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(24);
    doc.text('CERTIFICATE OF COMPLETION', 148.5, 85, { align: 'center' });
    
    // Content
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('This certifies that', 148.5, 105, { align: 'center' });
    
    doc.setFontSize(20);
    doc.setTextColor(41, 128, 185);
    doc.text(studentName.toUpperCase(), 148.5, 125, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`has successfully completed ${title}`, 148.5, 145, { align: 'center' });
    
    if (remarks) {
        doc.text(remarks, 148.5, 160, { align: 'center' });
    }
    
    doc.text(`Issued on: ${date}`, 148.5, 175, { align: 'center' });
}

// Certificate Template 3: Elegant Academic
function generateElegantCertificate(doc, instituteName, studentName, title, date, remarks) {
    // Elegant background
    doc.setFillColor(248, 249, 250);
    doc.rect(0, 0, 297, 210, 'F');
    
    // Elegant border
    doc.setLineWidth(2);
    doc.setDrawColor(52, 58, 64);
    doc.rect(15, 15, 267, 180);
    
    doc.setLineWidth(1);
    doc.setDrawColor(108, 117, 125);
    doc.rect(20, 20, 257, 170);
    
    // Elegant header
    doc.setTextColor(52, 58, 64);
    doc.setFontSize(22);
    doc.text(instituteName.toUpperCase(), 148.5, 45, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text('~ Academic Excellence ~', 148.5, 55, { align: 'center' });
    
    // Elegant title
    doc.setFontSize(26);
    doc.text('Certificate of Merit', 148.5, 80, { align: 'center' });
    
    // Decorative line
    doc.setLineWidth(1);
    doc.line(100, 90, 197, 90);
    
    // Content
    doc.setFontSize(14);
    doc.text('This is to certify that', 148.5, 110, { align: 'center' });
    
    doc.setFontSize(18);
    doc.text(studentName, 148.5, 130, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text(`has demonstrated excellence in ${title}`, 148.5, 150, { align: 'center' });
    
    if (remarks) {
        doc.text(remarks, 148.5, 180, { align: 'center' });
    }
    
    doc.text(date, 148.5, 195, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text('Principal Signature', 85, 195, { align: 'center' });
    doc.text('Director Signature', 212, 195, { align: 'center' });
}

// Certificate Template 4: Minimal Clean
function generateMinimalCertificate(doc, instituteName, studentName, title, date, remarks) {
    // Clean white background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 297, 210, 'F');
    
    // Minimal border
    doc.setLineWidth(1);
    doc.setDrawColor(108, 117, 125);
    doc.rect(30, 30, 237, 150);
    
    // Simple header
    doc.setTextColor(108, 117, 125);
    doc.setFontSize(18);
    doc.text(instituteName, 148.5, 55, { align: 'center' });
    
    // Clean title
    doc.setFontSize(24);
    doc.text('CERTIFICATE', 148.5, 80, { align: 'center' });
    
    // Content
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Awarded to', 148.5, 105, { align: 'center' });
    
    doc.setFontSize(20);
    doc.text(studentName, 148.5, 125, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`For completion of ${title}`, 148.5, 145, { align: 'center' });
    
    if (remarks) {
        doc.text(remarks, 148.5, 160, { align: 'center' });
    }
    
    doc.text(date, 148.5, 175, { align: 'center' });
}

// Certificate Template 5: Formal Government
function generateFormalCertificate(doc, instituteName, studentName, title, date, remarks) {
    // Official background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 297, 210, 'F');
    
    // Government style border
    doc.setLineWidth(4);
    doc.setDrawColor(0, 0, 0);
    doc.rect(10, 10, 277, 190);
    
    doc.setLineWidth(1);
    doc.rect(15, 15, 267, 180);
    
    // Official header
    doc.setFillColor(0, 0, 0);
    doc.rect(20, 20, 257, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text(instituteName.toUpperCase(), 148.5, 32, { align: 'center' });
    doc.setFontSize(10);
    doc.text('DEPARTMENT OF EDUCATION', 148.5, 42, { align: 'center' });
    
    // Official title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(22);
    doc.text('OFFICIAL CERTIFICATE', 148.5, 70, { align: 'center' });
    
    // Official seal
    doc.setDrawColor(0, 0, 0);
    doc.circle(50, 90, 15);
    doc.setFontSize(8);
    doc.text('OFFICIAL', 50, 87, { align: 'center' });
    doc.text('SEAL', 50, 93, { align: 'center' });
    
    // Content
    doc.setFontSize(14);
    doc.text('This is to officially certify that', 148.5, 100, { align: 'center' });
    
    doc.setFontSize(18);
    doc.text(studentName.toUpperCase(), 148.5, 120, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text(`has successfully completed ${title}`, 148.5, 140, { align: 'center' });
    
    if (remarks) {
        doc.text(remarks, 148.5, 170, { align: 'center' });
    }
    
    doc.text(`Official Date: ${date}`, 148.5, 185, { align: 'center' });
}

// Certificate Template 6: Luxury Premium
function generateLuxuryCertificate(doc, instituteName, studentName, title, date, remarks) {
    // Luxury background
    doc.setFillColor(138, 43, 226);
    doc.rect(0, 0, 297, 210, 'F');
    
    // White content area
    doc.setFillColor(255, 255, 255);
    doc.rect(15, 15, 267, 180, 'F');
    
    // Gold border
    doc.setLineWidth(3);
    doc.setDrawColor(255, 215, 0);
    doc.rect(20, 20, 257, 170);
    
    doc.setLineWidth(1);
    doc.setDrawColor(138, 43, 226);
    doc.rect(25, 25, 247, 160);
    
    // Luxury header
    doc.setFillColor(138, 43, 226);
    doc.rect(30, 30, 237, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text(instituteName.toUpperCase(), 148.5, 45, { align: 'center' });
    doc.setFontSize(12);
    doc.text('✦ PREMIUM EXCELLENCE ✦', 148.5, 58, { align: 'center' });
    
    // Luxury title
    doc.setTextColor(138, 43, 226);
    doc.setFontSize(26);
    doc.text('✦ CERTIFICATE OF DISTINCTION ✦', 148.5, 85, { align: 'center' });
    
    // Content
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('This premium certificate is awarded to', 148.5, 110, { align: 'center' });
    
    doc.setFontSize(20);
    doc.setTextColor(138, 43, 226);
    doc.text(studentName.toUpperCase(), 148.5, 130, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`for exceptional achievement in ${title}`, 148.5, 150, { align: 'center' });
    
    if (remarks) {
        doc.text(remarks, 148.5, 180, { align: 'center' });
    }
}

// Certificate Template 7: Creative Artistic
function generateCreativeCertificate(doc, instituteName, studentName, title, date, remarks) {
    // Creative background
    doc.setFillColor(255, 248, 220);
    doc.rect(0, 0, 297, 210, 'F');
    
    // Artistic border
    doc.setLineWidth(3);
    doc.setDrawColor(255, 140, 0);
    doc.rect(15, 15, 267, 180);
    
    // Creative decorations
    doc.setDrawColor(255, 165, 0);
    doc.setLineWidth(2);
    for (let i = 0; i < 8; i++) {
        doc.circle(30 + i * 35, 25, 3);
        doc.circle(30 + i * 35, 185, 3);
    }
    
    // Creative header
    doc.setFillColor(255, 140, 0);
    doc.rect(25, 35, 247, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text(instituteName.toUpperCase(), 148.5, 47, { align: 'center' });
    doc.setFontSize(10);
    doc.text('~ Creative Excellence Institute ~', 148.5, 58, { align: 'center' });
    
    // Creative title
    doc.setTextColor(255, 140, 0);
    doc.setFontSize(24);
    doc.text('◆ CREATIVE ACHIEVEMENT AWARD ◆', 148.5, 85, { align: 'center' });
    
    // Content
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('★ This creative certificate is proudly presented to ★', 148.5, 110, { align: 'center' });
    
    doc.setFontSize(20);
    doc.setTextColor(255, 140, 0);
    doc.text(`★ ${studentName.toUpperCase()} ★`, 148.5, 130, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`has creatively mastered ${title}`, 148.5, 150, { align: 'center' });
    
    if (remarks) {
        doc.text(`★ ${remarks} ★`, 148.5, 180, { align: 'center' });
    }
}

// Certificate Template 8: Achievement Award
function generateAchievementCertificate(doc, instituteName, studentName, title, date, remarks) {
    // Achievement background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 297, 210, 'F');
    
    // Achievement border with medal design
    doc.setLineWidth(4);
    doc.setDrawColor(218, 165, 32);
    doc.rect(10, 10, 277, 190);
    
    doc.setLineWidth(2);
    doc.setDrawColor(255, 215, 0);
    doc.rect(15, 15, 267, 180);
    
    // Medal/trophy design
    doc.setFillColor(255, 215, 0);
    doc.circle(148.5, 45, 20);
    doc.setTextColor(218, 165, 32);
    doc.setFontSize(16);
    doc.text('★', 148.5, 50, { align: 'center' });
    
    // Achievement header
    doc.setTextColor(218, 165, 32);
    doc.setFontSize(20);
    doc.text(instituteName.toUpperCase(), 148.5, 75, { align: 'center' });
    
    // Achievement title
    doc.setFontSize(26);
    doc.text('ACHIEVEMENT AWARD', 148.5, 95, { align: 'center' });
    
    // Ribbon design
    doc.setFillColor(218, 165, 32);
    doc.rect(120, 105, 57, 8, 'F');
    
    // Content
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('In recognition of outstanding achievement', 148.5, 125, { align: 'center' });
    
    doc.setFontSize(20);
    doc.setTextColor(218, 165, 32);
    doc.text(studentName.toUpperCase(), 148.5, 145, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`has excelled in ${title}`, 148.5, 165, { align: 'center' });
    
    if (remarks) {
        doc.text(remarks, 148.5, 180, { align: 'center' });
    }
    
    doc.text(`Achievement Date: ${date}`, 148.5, 195, { align: 'center' });
}

// Preview Functions
let currentPreviewDoc = null;
let currentPreviewType = null;

function previewMarksheet() {
    const instituteName = document.getElementById('institute-name').value;
    const studentName = document.getElementById('student-name').value;
    const rollNo = document.getElementById('roll-no').value;
    const className = document.getElementById('class-name').value;
    const examName = document.getElementById('exam-name').value;
    const template = document.getElementById('marksheet-template').value;
    
    // Validate required fields
    if (!instituteName || !studentName || !rollNo || !className || !examName) {
        alert('Please fill in all required fields before previewing.');
        return;
    }
    
    // Get subjects data
    const subjectRows = document.querySelectorAll('.subject-row');
    const subjects = [];
    
    for (let row of subjectRows) {
        const subjectName = row.querySelector('.subject-name').value;
        const marks = row.querySelector('.subject-marks').value;
        
        if (subjectName && marks) {
            subjects.push({ name: subjectName, marks: parseInt(marks) });
        }
    }
    
    if (subjects.length === 0) {
        alert('Please add at least one subject with marks.');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Generate the document based on template
    switch(template) {
        case 'classic':
            generateClassicTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects);
            break;
        case 'modern':
            generateModernTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects);
            break;
        case 'elegant':
            generateElegantTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects);
            break;
        case 'minimal':
            generateMinimalTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects);
            break;
        case 'formal':
            generateFormalTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects);
            break;
        case 'luxury':
            generateLuxuryTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects);
            break;
        case 'creative':
            generateCreativeTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects);
            break;
        case 'technical':
            generateTechnicalTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects);
            break;
        default:
            generateClassicTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects);
    }
    
    currentPreviewDoc = doc;
    currentPreviewType = 'marksheet';
    showPreview('Marksheet Preview');
}

function previewCertificate() {
    const instituteName = document.getElementById('cert-institute-name').value;
    const studentName = document.getElementById('cert-student-name').value;
    const title = document.getElementById('cert-title').value;
    const date = document.getElementById('cert-date').value;
    const remarks = document.getElementById('cert-remarks').value;
    const template = document.getElementById('certificate-template').value;
    
    // Validate required fields
    if (!instituteName || !studentName || !title || !date) {
        alert('Please fill in all required fields before previewing.');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');
    
    // Generate the document based on template
    switch(template) {
        case 'classic':
            generateClassicCertificate(doc, instituteName, studentName, title, date, remarks);
            break;
        case 'modern':
            generateModernCertificate(doc, instituteName, studentName, title, date, remarks);
            break;
        case 'elegant':
            generateElegantCertificate(doc, instituteName, studentName, title, date, remarks);
            break;
        case 'minimal':
            generateMinimalCertificate(doc, instituteName, studentName, title, date, remarks);
            break;
        case 'formal':
            generateFormalCertificate(doc, instituteName, studentName, title, date, remarks);
            break;
        case 'luxury':
            generateLuxuryCertificate(doc, instituteName, studentName, title, date, remarks);
            break;
        case 'creative':
            generateCreativeCertificate(doc, instituteName, studentName, title, date, remarks);
            break;
        case 'achievement':
            generateAchievementCertificate(doc, instituteName, studentName, title, date, remarks);
            break;
        default:
            generateClassicCertificate(doc, instituteName, studentName, title, date, remarks);
    }
    
    currentPreviewDoc = doc;
    currentPreviewType = 'certificate';
    showPreview('Certificate Preview');
}

function previewAdmitCard() {
    const instituteName = document.getElementById('admit-institute-name').value;
    const studentName = document.getElementById('admit-student-name').value;
    const rollNo = document.getElementById('admit-roll-no').value;
    const examCenter = document.getElementById('exam-center').value;
    const examDate = document.getElementById('exam-date').value;
    const template = document.getElementById('admit-card-template').value;
    
    // Validate required fields
    if (!instituteName || !studentName || !rollNo || !examCenter || !examDate) {
        alert('Please fill in all required fields before previewing.');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Generate preview based on template
    switch(template) {
        case 'classic':
            generateClassicAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, admitPhotoData);
            break;
        case 'modern':
            generateModernAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, admitPhotoData);
            break;
        case 'elegant':
            generateElegantAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, admitPhotoData);
            break;
        case 'minimal':
            generateMinimalAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, admitPhotoData);
            break;
        case 'formal':
            generateFormalAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, admitPhotoData);
            break;
        case 'luxury':
            generateLuxuryAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, admitPhotoData);
            break;
        case 'security':
            generateSecurityAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, admitPhotoData);
            break;
        case 'compact':
            generateCompactAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, admitPhotoData);
            break;
        default:
            generateClassicAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, admitPhotoData);
    }
    
    currentPreviewDoc = doc;
    currentPreviewType = 'admit-card';
    showPreview('Admit Card Preview');
}

function previewIdCard() {
    const instituteName = document.getElementById('id-institute-name').value;
    const studentName = document.getElementById('id-student-name').value;
    const idNumber = document.getElementById('id-number').value;
    const template = document.getElementById('id-card-template').value;
    
    if (!instituteName || !studentName || !idNumber) {
        alert('Please fill in all required fields before preview');
        return;
    }
    
    // Get dropdown or manual input values
    const idDepartmentSelect = document.getElementById('id-department');
    const idDepartmentManual = document.getElementById('id-department-manual');
    const idDesignationSelect = document.getElementById('id-designation');
    const idDesignationManual = document.getElementById('id-designation-manual');
    
    const department = idDepartmentSelect.value === 'add-manually' ? idDepartmentManual.value : idDepartmentSelect.value;
    const designation = idDesignationSelect.value === 'add-manually' ? idDesignationManual.value : idDesignationSelect.value;
    
    // Create preview document
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 54]
    });
    
    // Generate preview based on template
    switch(template) {
        case 'corporate':
            generateCorporateIdCard(doc, instituteName, studentName, idNumber, department, designation, null);
            break;
        case 'modern':
            generateModernIdCard(doc, instituteName, studentName, idNumber, department, designation, null);
            break;
        case 'academic':
            generateAcademicIdCard(doc, instituteName, studentName, idNumber, department, designation, null);
            break;
        case 'minimal':
            generateMinimalIdCard(doc, instituteName, studentName, idNumber, department, designation, null);
            break;
        case 'creative':
            generateCreativeIdCard(doc, instituteName, studentName, idNumber, department, designation, null);
            break;
        case 'security':
            generateSecurityIdCard(doc, instituteName, studentName, idNumber, department, designation, null);
            break;
        default:
            generateCorporateIdCard(doc, instituteName, studentName, idNumber, department, designation, null);
    }
    
    currentPreviewDoc = doc;
    currentPreviewType = 'id-card';
    showPreview('ID Card Preview');
}

function showPreview(title) {
    if (!currentPreviewDoc) return;
    
    const modal = document.getElementById('preview-modal');
    const previewTitle = document.getElementById('preview-title');
    const canvas = document.getElementById('preview-canvas');
    
    previewTitle.textContent = title;
    
    // Simple fallback preview - show a preview message and document info
    canvas.width = 600;
    canvas.height = 400;
    const context = canvas.getContext('2d');
    
    // Background
    context.fillStyle = '#f8f9fa';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Border
    context.strokeStyle = '#dee2e6';
    context.lineWidth = 2;
    context.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    // Title
    context.fillStyle = '#333';
    context.font = 'bold 24px Arial';
    context.textAlign = 'center';
    context.fillText(title, canvas.width/2, 60);
    
    // Document icon
    context.fillStyle = '#007bff';
    context.fillRect(canvas.width/2 - 30, 100, 60, 80);
    context.fillStyle = '#fff';
    context.font = '16px Arial';
    context.fillText('PDF', canvas.width/2, 145);
    
    // Info text
    context.fillStyle = '#666';
    context.font = '16px Arial';
    context.fillText('✓ Document generated successfully!', canvas.width/2, 220);
    context.fillText('✓ Template applied with your data', canvas.width/2, 250);
    context.fillText('✓ Ready for download', canvas.width/2, 280);
    
    // Instructions
    context.fillStyle = '#28a745';
    context.font = 'bold 14px Arial';
    context.fillText('Click "Download PDF" to save your document', canvas.width/2, 340);
    
    modal.style.display = 'block';
}

function closePreview() {
    const modal = document.getElementById('preview-modal');
    modal.style.display = 'none';
    currentPreviewDoc = null;
    currentPreviewType = null;
}

function downloadFromPreview() {
    if (!currentPreviewDoc || !currentPreviewType) return;
    
    let filename = 'document.pdf';
    
    if (currentPreviewType === 'marksheet') {
        const studentName = document.getElementById('student-name').value;
        const template = document.getElementById('marksheet-template').value;
        filename = `${studentName}_Marksheet_${template}.pdf`;
    } else if (currentPreviewType === 'certificate') {
        const studentName = document.getElementById('cert-student-name').value;
        const template = document.getElementById('certificate-template').value;
        filename = `${studentName}_Certificate_${template}.pdf`;
    } else if (currentPreviewType === 'admit-card') {
        const studentName = document.getElementById('admit-student-name').value;
        const template = document.getElementById('admit-card-template').value;
        filename = `${studentName}_AdmitCard_${template}.pdf`;
    } else if (currentPreviewType === 'id-card') {
        const studentName = document.getElementById('id-student-name').value;
        const template = document.getElementById('id-card-template').value;
        filename = `${studentName}_IdCard_${template}.pdf`;
    }
    
    currentPreviewDoc.save(filename);
    closePreview();
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('preview-modal');
    if (event.target === modal) {
        closePreview();
    }
}

// Enhanced Auth Modal Functions
function initializeAuthModals() {
    // Password strength checker
    const signupPassword = document.getElementById('signup-password');
    if (signupPassword) {
        signupPassword.addEventListener('input', checkPasswordStrength);
    }
    
    // Floating label animations
    const authInputs = document.querySelectorAll('.auth-input');
    authInputs.forEach(input => {
        input.addEventListener('blur', handleFloatingLabel);
        input.addEventListener('focus', handleFloatingLabel);
    });
    
    // Button ripple effect
    const authButtons = document.querySelectorAll('.auth-submit');
    authButtons.forEach(button => {
        button.addEventListener('click', createRippleEffect);
    });
}

function checkPasswordStrength(e) {
    const password = e.target.value;
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthBar || !strengthText) return;
    
    let strength = 0;
    let feedback = '';
    
    // Check password criteria
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    
    // Update strength bar
    strengthBar.style.width = Math.min(strength, 100) + '%';
    
    // Update feedback text
    if (strength < 25) {
        feedback = 'Very weak';
        strengthBar.style.background = '#dc3545';
    } else if (strength < 50) {
        feedback = 'Weak';
        strengthBar.style.background = '#fd7e14';
    } else if (strength < 75) {
        feedback = 'Good';
        strengthBar.style.background = '#ffc107';
    } else {
        feedback = 'Strong';
        strengthBar.style.background = '#28a745';
    }
    
    strengthText.textContent = `Password strength: ${feedback}`;
}

function handleFloatingLabel(e) {
    const input = e.target;
    const label = input.nextElementSibling;
    
    if (input.value || input === document.activeElement) {
        label.classList.add('active');
    } else {
        label.classList.remove('active');
    }
}

function createRippleEffect(e) {
    const button = e.currentTarget;
    const ripple = button.querySelector('.btn-ripple');
    
    if (ripple) {
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        ripple.style.animation = 'none';
        ripple.offsetHeight; // Trigger reflow
        ripple.style.animation = 'ripple 0.6s linear';
    }
}

// Initialize auth modals when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAuthModals);

function generateAdmitCard(e) {
    e.preventDefault();
    
    const instituteName = document.getElementById('admit-institute-name').value;
    const studentName = document.getElementById('admit-student-name').value;
    const rollNo = document.getElementById('admit-roll-no').value;
    const examCenter = document.getElementById('exam-center').value;
    const examDate = document.getElementById('exam-date').value;
    const template = document.getElementById('admit-card-template').value;
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [148, 210] // A5 size
    });
    
    // Apply template-specific styling
    switch(template) {
        case 'classic':
            generateClassicAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, admitPhotoData);
            break;
        case 'modern':
            generateModernAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, admitPhotoData);
            break;
        case 'elegant':
            generateElegantAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, admitPhotoData);
            break;
        case 'minimal':
            generateMinimalAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, admitPhotoData);
            break;
        case 'formal':
            generateFormalAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, admitPhotoData);
            break;
        case 'luxury':
            generateLuxuryAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, admitPhotoData);
            break;
        case 'security':
            generateSecurityAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, admitPhotoData);
            break;
        case 'compact':
            generateCompactAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, admitPhotoData);
            break;
        default:
            generateClassicAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, admitPhotoData);
    }
    
    // Save to history
    const docData = {
        type: 'Admit Card',
        instituteName,
        studentName,
        rollNo,
        examCenter,
        examDate,
        template,
        generatedDate: new Date().toLocaleDateString(),
        id: Date.now()
    };
    
    documentHistory.push(docData);
    localStorage.setItem('edudocsX_history', JSON.stringify(documentHistory));
    
    // Download PDF
    doc.save(`${studentName}_AdmitCard_${template}.pdf`);
    
    alert(`Professional ${template} admit card generated successfully!`);
}

// Admit Card Template 1: Classic Professional
function generateClassicAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, photoData) {
    // Classic background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 148, 210, 'F');
    
    // Classic border
    doc.setLineWidth(2);
    doc.setDrawColor(139, 69, 19);
    doc.rect(8, 8, 132, 194);
    
    // Header
    doc.setTextColor(139, 69, 19);
    doc.setFontSize(14);
    doc.text(instituteName.toUpperCase(), 74, 25, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text('ADMIT CARD', 74, 38, { align: 'center' });
    
    // Student photo
    doc.setLineWidth(1);
    doc.setDrawColor(0, 0, 0);
    doc.rect(100, 50, 30, 38);
    
    if (photoData) {
        try {
            doc.addImage(photoData, 'JPEG', 100, 50, 30, 38);
        } catch (error) {
            // Fallback to placeholder if image fails
            doc.setFontSize(6);
            doc.text('STUDENT', 115, 67, { align: 'center' });
            doc.text('PHOTO', 115, 73, { align: 'center' });
        }
    } else {
        doc.setFontSize(6);
        doc.text('STUDENT', 115, 67, { align: 'center' });
        doc.text('PHOTO', 115, 73, { align: 'center' });
    }
    
    // Student details
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(`Student Name: ${studentName}`, 15, 55);
    doc.text(`Roll Number: ${rollNo}`, 15, 65);
    doc.text(`Exam Center: ${examCenter}`, 15, 75);
    doc.text(`Exam Date: ${examDate}`, 15, 85);
    
    // Instructions
    doc.setFontSize(10);
    doc.text('INSTRUCTIONS:', 15, 105);
    doc.setFontSize(7);
    doc.text('1. Bring this admit card to the examination center', 15, 115);
    doc.text('2. Carry a valid photo ID proof', 15, 122);
    doc.text('3. Report to the center 30 minutes before exam time', 15, 129);
    doc.text('4. Mobile phones are strictly prohibited', 15, 136);
    
    // Signature section
    doc.setLineWidth(1);
    doc.line(15, 170, 60, 170);
    doc.line(88, 170, 133, 170);
    
    doc.setFontSize(7);
    doc.text('Student Signature', 37.5, 178, { align: 'center' });
    doc.text('Invigilator Signature', 110.5, 178, { align: 'center' });
}

// Admit Card Template 2: Modern Corporate
function generateModernAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, photoData) {
    // Modern background
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, 148, 210, 'F');
    
    // White content area
    doc.setFillColor(255, 255, 255);
    doc.rect(8, 8, 132, 194, 'F');
    
    // Modern border
    doc.setLineWidth(2);
    doc.setDrawColor(52, 152, 219);
    doc.rect(12, 12, 124, 186);
    
    // Header
    doc.setFillColor(41, 128, 185);
    doc.rect(16, 16, 116, 20, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text(instituteName.toUpperCase(), 74, 24, { align: 'center' });
    doc.setFontSize(7);
    doc.text('Excellence in Education', 74, 31, { align: 'center' });
    
    // Modern title
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(14);
    doc.text('EXAMINATION ADMIT CARD', 74, 48, { align: 'center' });
    
    // Photo section
    doc.setFillColor(236, 240, 241);
    doc.rect(100, 55, 28, 36, 'F');
    doc.setDrawColor(41, 128, 185);
    doc.rect(100, 55, 28, 36);
    
    if (photoData) {
        try {
            doc.addImage(photoData, 'JPEG', 100, 55, 28, 36);
        } catch (error) {
            doc.setTextColor(41, 128, 185);
            doc.setFontSize(6);
            doc.text('PHOTO', 114, 75, { align: 'center' });
        }
    } else {
        doc.setTextColor(41, 128, 185);
        doc.setFontSize(6);
        doc.text('PHOTO', 114, 75, { align: 'center' });
    }
    
    // Student details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text(`Name: ${studentName}`, 20, 60);
    doc.text(`Roll No: ${rollNo}`, 20, 70);
    doc.text(`Center: ${examCenter}`, 20, 80);
    doc.text(`Date: ${examDate}`, 20, 90);
    
    // Instructions
    doc.setFillColor(41, 128, 185);
    doc.rect(16, 105, 116, 55, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text('EXAMINATION GUIDELINES', 74, 115, { align: 'center' });
    doc.setFontSize(6);
    doc.text('• Report 30 minutes early', 20, 125);
    doc.text('• Bring valid ID and this admit card', 20, 132);
    doc.text('• No electronic devices allowed', 20, 139);
    doc.text('• Follow examination protocols', 20, 146);
    doc.text('• Maintain examination discipline', 20, 153);
}

// Admit Card Template 3: Elegant Academic
function generateElegantAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, photoData) {
    // Elegant background
    doc.setFillColor(248, 249, 250);
    doc.rect(0, 0, 148, 210, 'F');
    
    // Elegant border
    doc.setLineWidth(1.5);
    doc.setDrawColor(155, 89, 182);
    doc.rect(10, 10, 128, 190);
    
    // Inner decorative border
    doc.setLineWidth(0.5);
    doc.setDrawColor(142, 68, 173);
    doc.rect(14, 14, 120, 182);
    
    // Elegant header
    doc.setTextColor(52, 58, 64);
    doc.setFontSize(12);
    doc.text(instituteName.toUpperCase(), 74, 28, { align: 'center' });
    doc.setFontSize(7);
    doc.text('~ Academic Excellence ~', 74, 36, { align: 'center' });
    
    // Elegant title
    doc.setFontSize(14);
    doc.text('Examination Admit Card', 74, 50, { align: 'center' });
    
    // Decorative line
    doc.setLineWidth(0.5);
    doc.line(40, 55, 108, 55);
    
    // Photo section
    doc.setDrawColor(108, 117, 125);
    doc.rect(100, 62, 28, 36);
    
    if (photoData) {
        try {
            doc.addImage(photoData, 'JPEG', 100, 62, 28, 36);
        } catch (error) {
            doc.setTextColor(108, 117, 125);
            doc.setFontSize(6);
            doc.text('Photograph', 114, 82, { align: 'center' });
        }
    } else {
        doc.setTextColor(108, 117, 125);
        doc.setFontSize(6);
        doc.text('Photograph', 114, 82, { align: 'center' });
    }
    
    // Student details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text(`Candidate Name: ${studentName}`, 18, 68);
    doc.text(`Roll Number: ${rollNo}`, 18, 78);
    doc.text(`Examination Center: ${examCenter}`, 18, 88);
    doc.text(`Examination Date: ${examDate}`, 18, 98);
    
    // Instructions
    doc.setTextColor(52, 58, 64);
    doc.setFontSize(9);
    doc.text('Important Instructions:', 18, 115);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(6);
    doc.text('1. Arrive at the examination center 30 minutes before the scheduled time', 18, 125);
    doc.text('2. Present this admit card along with valid photo identification', 18, 132);
    doc.text('3. Electronic devices and mobile phones are strictly prohibited', 18, 139);
    doc.text('4. Follow all examination rules and regulations', 18, 146);
    
    // Signature section
    doc.line(18, 170, 60, 170);
    doc.line(88, 170, 130, 170);
    doc.setFontSize(6);
    doc.text('Candidate Signature', 39, 178, { align: 'center' });
    doc.text('Invigilator Signature', 109, 178, { align: 'center' });
}

// Admit Card Template 4: Minimal Clean
function generateMinimalAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, photoData) {
    // Clean background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 148, 210, 'F');
    
    // Minimal border
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.rect(12, 12, 124, 186);
    
    // Simple header
    doc.setTextColor(108, 117, 125);
    doc.setFontSize(11);
    doc.text(instituteName, 74, 25, { align: 'center' });
    
    // Clean title
    doc.setFontSize(14);
    doc.text('ADMIT CARD', 74, 40, { align: 'center' });
    
    // Photo section
    doc.setDrawColor(108, 117, 125);
    doc.rect(100, 50, 28, 36);
    
    if (photoData) {
        try {
            doc.addImage(photoData, 'JPEG', 100, 50, 28, 36);
        } catch (error) {
            doc.setFontSize(6);
            doc.text('Photo', 114, 70, { align: 'center' });
        }
    } else {
        doc.setFontSize(6);
        doc.text('Photo', 114, 70, { align: 'center' });
    }
    
    // Student details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text(`Name: ${studentName}`, 18, 55);
    doc.text(`Roll: ${rollNo}`, 18, 65);
    doc.text(`Center: ${examCenter}`, 18, 75);
    doc.text(`Date: ${examDate}`, 18, 85);
    
    // Simple instructions
    doc.setFontSize(7);
    doc.text('Instructions:', 18, 105);
    doc.setFontSize(6);
    doc.text('• Bring this card and valid ID', 18, 115);
    doc.text('• Arrive 30 minutes early', 18, 122);
    doc.text('• No electronic devices', 18, 129);
    
    // Signature lines
    doc.line(18, 160, 60, 160);
    doc.line(88, 160, 130, 160);
    doc.setFontSize(6);
    doc.text('Student', 39, 168, { align: 'center' });
    doc.text('Authority', 109, 168, { align: 'center' });
}

// Admit Card Template 5: Formal Government
function generateFormalAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, photoData) {
    // Official background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 148, 210, 'F');
    
    // Government style border
    doc.setLineWidth(2);
    doc.setDrawColor(34, 139, 34);
    doc.rect(8, 8, 132, 194);
    
    doc.setLineWidth(0.5);
    doc.rect(12, 12, 124, 186);
    
    // Official header
    doc.setFillColor(0, 0, 0);
    doc.rect(16, 16, 116, 18, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text(instituteName.toUpperCase(), 74, 23, { align: 'center' });
    doc.setFontSize(6);
    doc.text('DEPARTMENT OF EDUCATION', 74, 29, { align: 'center' });
    
    // Official title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text('OFFICIAL ADMIT CARD', 74, 45, { align: 'center' });
    
    // Official seal
    doc.setDrawColor(0, 0, 0);
    doc.circle(28, 55, 8);
    doc.setFontSize(4);
    doc.text('OFFICIAL', 28, 53, { align: 'center' });
    doc.text('SEAL', 28, 57, { align: 'center' });
    
    // Photo section
    doc.rect(100, 50, 28, 36);
    
    if (photoData) {
        try {
            doc.addImage(photoData, 'JPEG', 100, 50, 28, 36);
        } catch (error) {
            doc.setFontSize(5);
            doc.text('OFFICIAL', 114, 66, { align: 'center' });
            doc.text('PHOTOGRAPH', 114, 71, { align: 'center' });
        }
    } else {
        doc.setFontSize(5);
        doc.text('OFFICIAL', 114, 66, { align: 'center' });
        doc.text('PHOTOGRAPH', 114, 71, { align: 'center' });
    }
    
    // Official details
    doc.setFontSize(8);
    doc.text(`Candidate Name: ${studentName}`, 50, 55);
    doc.text(`Roll Number: ${rollNo}`, 50, 63);
    doc.text(`Examination Center: ${examCenter}`, 50, 71);
    doc.text(`Examination Date: ${examDate}`, 50, 79);
    
    // Official instructions
    doc.setFontSize(8);
    doc.text('OFFICIAL INSTRUCTIONS:', 16, 95);
    doc.setFontSize(6);
    doc.text('1. This is an official document - handle with care', 16, 105);
    doc.text('2. Present this card with government-issued photo ID', 16, 112);
    doc.text('3. Report to examination center 30 minutes early', 16, 119);
    doc.text('4. Electronic devices strictly prohibited by law', 16, 126);
    doc.text('5. Violation of rules may result in legal action', 16, 133);
    
    // Official signatures
    doc.line(16, 160, 60, 160);
    doc.line(88, 160, 132, 160);
    doc.setFontSize(6);
    doc.text('Candidate Signature', 38, 168, { align: 'center' });
    doc.text('Controller of Examinations', 110, 168, { align: 'center' });
}

// Admit Card Template 6: Luxury Premium
function generateLuxuryAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, photoData) {
    // Luxury background
    doc.setFillColor(138, 43, 226);
    doc.rect(0, 0, 148, 210, 'F');
    
    // White content area
    doc.setFillColor(255, 255, 255);
    doc.rect(12, 12, 124, 186, 'F');
    
    // Gold border
    doc.setLineWidth(1.5);
    doc.setDrawColor(255, 215, 0);
    doc.rect(16, 16, 116, 178);
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(138, 43, 226);
    doc.rect(20, 20, 108, 170);
    
    // Luxury header
    doc.setFillColor(138, 43, 226);
    doc.rect(24, 24, 100, 20, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text(instituteName.toUpperCase(), 74, 32, { align: 'center' });
    doc.setFontSize(6);
    doc.text('✦ PREMIUM EXAMINATION BOARD ✦', 74, 38, { align: 'center' });
    
    // Luxury title
    doc.setTextColor(138, 43, 226);
    doc.setFontSize(14);
    doc.text('✦ PREMIUM ADMIT CARD ✦', 74, 52, { align: 'center' });
    
    // Photo section
    doc.setFillColor(248, 248, 255);
    doc.rect(100, 58, 28, 36, 'F');
    doc.setDrawColor(255, 215, 0);
    doc.setLineWidth(1);
    doc.rect(100, 58, 28, 36);
    
    if (photoData) {
        try {
            doc.addImage(photoData, 'JPEG', 100, 58, 28, 36);
        } catch (error) {
            doc.setTextColor(138, 43, 226);
            doc.setFontSize(6);
            doc.text('PREMIUM', 114, 74, { align: 'center' });
            doc.text('PHOTO', 114, 80, { align: 'center' });
        }
    } else {
        doc.setTextColor(138, 43, 226);
        doc.setFontSize(6);
        doc.text('PREMIUM', 114, 74, { align: 'center' });
        doc.text('PHOTO', 114, 80, { align: 'center' });
    }
    
    // Premium details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8);
    doc.text(`✦ Name: ${studentName}`, 24, 65);
    doc.text(`✦ Roll: ${rollNo}`, 24, 73);
    doc.text(`✦ Center: ${examCenter}`, 24, 81);
    doc.text(`✦ Date: ${examDate}`, 24, 89);
    
    // Premium instructions
    doc.setFillColor(138, 43, 226);
    doc.rect(24, 105, 100, 50, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('✦ PREMIUM GUIDELINES ✦', 74, 115, { align: 'center' });
    doc.setFontSize(6);
    doc.text('• Premium service - arrive early for VIP treatment', 26, 125);
    doc.text('• Present this premium card with valid ID', 26, 132);
    doc.text('• Exclusive premium examination facilities', 26, 139);
    doc.text('• Contact premium support for assistance', 26, 146);
    
    // Premium signatures
    doc.setFillColor(255, 255, 255);
    doc.rect(24, 165, 100, 20, 'F');
    doc.setTextColor(0, 0, 0);
    doc.line(28, 175, 60, 175);
    doc.line(88, 175, 120, 175);
    doc.setFontSize(6);
    doc.text('Premium Candidate', 44, 182, { align: 'center' });
    doc.text('Premium Authority', 104, 182, { align: 'center' });
}

// Admit Card Template 7: Security Enhanced
function generateSecurityAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, photoData) {
    // Security background
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 148, 210, 'F');
    
    // Security pattern
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    for (let i = 0; i < 148; i += 8) {
        doc.line(i, 0, i, 210);
    }
    for (let i = 0; i < 210; i += 8) {
        doc.line(0, i, 148, i);
    }
    
    // Main content area
    doc.setFillColor(255, 255, 255);
    doc.rect(10, 10, 128, 190, 'F');
    
    // Security border
    doc.setLineWidth(2);
    doc.setDrawColor(220, 20, 60);
    doc.rect(14, 14, 120, 182);
    
    // Security header
    doc.setFillColor(220, 20, 60);
    doc.rect(18, 18, 112, 18, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(instituteName.toUpperCase(), 74, 25, { align: 'center' });
    doc.setFontSize(6);
    doc.text('SECURE EXAMINATION SYSTEM', 74, 31, { align: 'center' });
    
    // Security title
    doc.setTextColor(220, 20, 60);
    doc.setFontSize(12);
    doc.text('🔒 SECURE ADMIT CARD 🔒', 74, 45, { align: 'center' });
    
    // Security ID
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(6);
    doc.text(`Security ID: SEC${Date.now().toString().slice(-6)}`, 20, 52);
    
    // Photo section with security frame
    doc.setFillColor(255, 240, 240);
    doc.rect(100, 58, 28, 36, 'F');
    doc.setDrawColor(220, 20, 60);
    doc.setLineWidth(1);
    doc.rect(100, 58, 28, 36);
    
    if (photoData) {
        try {
            doc.addImage(photoData, 'JPEG', 100, 58, 28, 36);
        } catch (error) {
            doc.setTextColor(220, 20, 60);
            doc.setFontSize(5);
            doc.text('SECURE', 114, 74, { align: 'center' });
            doc.text('PHOTO', 114, 80, { align: 'center' });
        }
    } else {
        doc.setTextColor(220, 20, 60);
        doc.setFontSize(5);
        doc.text('SECURE', 114, 74, { align: 'center' });
        doc.text('PHOTO', 114, 80, { align: 'center' });
    }
    
    // Secure details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(7);
    doc.text(`🔐 Name: ${studentName}`, 20, 63);
    doc.text(`🔐 Roll: ${rollNo}`, 20, 71);
    doc.text(`🔐 Center: ${examCenter}`, 20, 79);
    doc.text(`🔐 Date: ${examDate}`, 20, 87);
    
    // Security barcode
    doc.setFillColor(0, 0, 0);
    for (let i = 0; i < 18; i++) {
        const width = Math.random() > 0.5 ? 1 : 1.5;
        doc.rect(20 + (i * 1.5), 105, width, 10, 'F');
    }
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(5);
    doc.text('Security Barcode - Do Not Tamper', 20, 120);
    
    // Security instructions
    doc.setFillColor(220, 20, 60);
    doc.rect(20, 130, 108, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text('🔒 SECURITY PROTOCOLS 🔒', 74, 140, { align: 'center' });
    doc.setFontSize(5);
    doc.text('• This card contains security features', 22, 148);
    doc.text('• Any tampering will void the card', 22, 154);
    doc.text('• Biometric verification may be required', 22, 160);
    doc.text('• Report suspicious activity immediately', 22, 166);
    
    // Security signatures
    doc.setTextColor(220, 20, 60);
    doc.line(20, 180, 60, 180);
    doc.line(88, 180, 128, 180);
    doc.setFontSize(6);
    doc.text('Secure Candidate', 40, 188, { align: 'center' });
    doc.text('Security Officer', 108, 188, { align: 'center' });
}

// Admit Card Template 8: Compact Standard
function generateCompactAdmitCard(doc, instituteName, studentName, rollNo, examCenter, examDate, photoData) {
    // Compact background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 148, 210, 'F');
    
    // Compact border
    doc.setLineWidth(1);
    doc.setDrawColor(70, 130, 180);
    doc.rect(8, 8, 132, 194);
    
    // Compact header
    doc.setFillColor(70, 130, 180);
    doc.rect(12, 12, 124, 15, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(instituteName.toUpperCase(), 74, 18, { align: 'center' });
    doc.setFontSize(6);
    doc.text('Compact Examination Card', 74, 23, { align: 'center' });
    
    // Compact title
    doc.setTextColor(70, 130, 180);
    doc.setFontSize(11);
    doc.text('ADMIT CARD', 74, 35, { align: 'center' });
    
    // Compact photo
    doc.setDrawColor(70, 130, 180);
    doc.rect(100, 42, 25, 32);
    
    if (photoData) {
        try {
            doc.addImage(photoData, 'JPEG', 100, 42, 25, 32);
        } catch (error) {
            doc.setFontSize(5);
            doc.text('PHOTO', 112.5, 60, { align: 'center' });
        }
    } else {
        doc.setFontSize(5);
        doc.text('PHOTO', 112.5, 60, { align: 'center' });
    }
    
    // Compact details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(7);
    doc.text(`Name: ${studentName}`, 15, 47);
    doc.text(`Roll: ${rollNo}`, 15, 54);
    doc.text(`Center: ${examCenter}`, 15, 61);
    doc.text(`Date: ${examDate}`, 15, 68);
    
    // Compact instructions
    doc.setFontSize(6);
    doc.text('Instructions:', 15, 85);
    doc.setFontSize(5);
    doc.text('• Arrive 30 minutes early', 15, 92);
    doc.text('• Bring valid ID', 15, 98);
    doc.text('• No electronic devices', 15, 104);
    
    // Compact signatures
    doc.line(15, 120, 50, 120);
    doc.line(98, 120, 133, 120);
    doc.setFontSize(5);
    doc.text('Student', 32.5, 127, { align: 'center' });
    doc.text('Authority', 115.5, 127, { align: 'center' });
    
    // Compact footer
    doc.setTextColor(70, 130, 180);
    doc.setFontSize(4);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 74, 140, { align: 'center' });
}

// Dropdown handler functions
function handleClassChange(select) {
    const manualInput = document.getElementById('class-manual');
    if (select.value === 'add-manually') {
        manualInput.style.display = 'block';
        manualInput.required = true;
        select.required = false;
    } else {
        manualInput.style.display = 'none';
        manualInput.required = false;
        select.required = true;
        manualInput.value = '';
    }
}

function handleExamNameChange(select) {
    const manualInput = document.getElementById('exam-name-manual');
    if (select.value === 'add-manually') {
        manualInput.style.display = 'block';
        manualInput.required = true;
        select.required = false;
    } else {
        manualInput.style.display = 'none';
        manualInput.required = false;
        select.required = true;
        manualInput.value = '';
    }
}

function handleSubjectChange(select) {
    const subjectRow = select.closest('.subject-row');
    const manualInput = subjectRow.querySelector('.subject-name-manual');
    
    if (select.value === 'add-manually') {
        manualInput.style.display = 'block';
        manualInput.required = true;
        select.required = false;
    } else {
        manualInput.style.display = 'none';
        manualInput.required = false;
        select.required = true;
        manualInput.value = '';
    }
}

// Validate obtained marks against out of marks
function validateMarks(obtainedInput) {
    const subjectRow = obtainedInput.closest('.subject-row');
    const outOfSelect = subjectRow.querySelector('.out-of-marks');
    const obtainedValue = parseInt(obtainedInput.value);
    const outOfValue = parseInt(outOfSelect.value);
    
    if (obtainedValue && outOfValue && obtainedValue > outOfValue) {
        obtainedInput.style.borderColor = '#dc3545';
        obtainedInput.setCustomValidity(`Obtained marks cannot exceed ${outOfValue}`);
    } else {
        obtainedInput.style.borderColor = '#007bff';
        obtainedInput.setCustomValidity('');
    }
}

// Add event listeners for marks validation when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add validation to existing obtained marks inputs
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('obtained-marks')) {
            validateMarks(e.target);
        }
    });
    
    // Add validation when out of marks changes
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('out-of-marks')) {
            const subjectRow = e.target.closest('.subject-row');
            const obtainedInput = subjectRow.querySelector('.obtained-marks');
            if (obtainedInput.value) {
                validateMarks(obtainedInput);
            }
        }
    });
});

// Photo upload functionality
let uploadedPhoto = null;

function triggerPhotoUpload() {
    document.getElementById('photo-upload').click();
}

document.addEventListener('DOMContentLoaded', function() {
    const photoUpload = document.getElementById('photo-upload');
    const photoPreview = document.getElementById('photo-preview');
    const previewImage = document.getElementById('preview-image');
    const removePhotoBtn = document.getElementById('remove-photo');
    
    if (photoUpload) {
        photoUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file size (2MB max)
                if (file.size > 2 * 1024 * 1024) {
                    alert('File size must be less than 2MB');
                    return;
                }
                
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert('Please select a valid image file');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    uploadedPhoto = e.target.result;
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';
                    photoPreview.querySelector('.photo-placeholder').style.display = 'none';
                    removePhotoBtn.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Make photo preview clickable
    if (photoPreview) {
        photoPreview.addEventListener('click', triggerPhotoUpload);
    }
    
    // Setup admit card photo upload
    const admitPhotoUpload = document.getElementById('admit-photo-upload');
    const admitPhotoPreview = document.getElementById('admit-photo-preview');
    const admitPreviewImage = document.getElementById('admit-preview-image');
    const admitRemovePhotoBtn = document.getElementById('admit-remove-photo');
    
    if (admitPhotoUpload) {
        admitPhotoUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file size (2MB max)
                if (file.size > 2 * 1024 * 1024) {
                    alert('File size must be less than 2MB');
                    return;
                }
                
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert('Please select a valid image file');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    admitPhotoData = e.target.result;
                    admitPreviewImage.src = e.target.result;
                    admitPreviewImage.style.display = 'block';
                    admitPhotoPreview.querySelector('.photo-placeholder').style.display = 'none';
                    admitRemovePhotoBtn.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Make admit photo preview clickable
    if (admitPhotoPreview) {
        admitPhotoPreview.addEventListener('click', triggerAdmitPhotoUpload);
    }
});

function removePhoto() {
    uploadedPhoto = null;
    const previewImage = document.getElementById('preview-image');
    const photoPreview = document.getElementById('photo-preview');
    const removePhotoBtn = document.getElementById('remove-photo');
    const photoUpload = document.getElementById('photo-upload');
    
    previewImage.style.display = 'none';
    photoPreview.querySelector('.photo-placeholder').style.display = 'block';
    removePhotoBtn.style.display = 'none';
    photoUpload.value = '';
}

// ID Card Generation
function generateIdCard(e) {
    e.preventDefault();
    
    const instituteName = document.getElementById('id-institute-name').value;
    const cardType = document.getElementById('id-card-type').value;
    const fullName = document.getElementById('id-full-name').value;
    const idNumber = document.getElementById('id-number').value;
    const idDepartmentSelect = document.getElementById('id-department');
    const idDepartmentManual = document.getElementById('id-department-manual');
    const idDesignationSelect = document.getElementById('id-designation');
    const idDesignationManual = document.getElementById('id-designation-manual');
    
    if (idDepartmentSelect) {
        idDepartmentSelect.addEventListener('change', function() {
            if (this.value === 'add-manually') {
                idDepartmentManual.style.display = 'block';
                idDepartmentManual.required = true;
            } else {
                idDepartmentManual.style.display = 'none';
                idDepartmentManual.required = false;
                idDepartmentManual.value = '';
            }
        });
    }
    
    if (idDesignationSelect) {
        idDesignationSelect.addEventListener('change', function() {
            if (this.value === 'add-manually') {
                idDesignationManual.style.display = 'block';
                idDesignationManual.required = true;
            } else {
                idDesignationManual.style.display = 'none';
                idDesignationManual.required = false;
                idDesignationManual.value = '';
            }
        });
    }
    
    const department = idDepartmentSelect.value === 'add-manually' ? idDepartmentManual.value : idDepartmentSelect.value;
    const designation = idDesignationSelect.value === 'add-manually' ? idDesignationManual.value : idDesignationSelect.value;
    const bloodGroup = document.getElementById('id-blood-group').value;
    const contact = document.getElementById('id-contact').value;
    const validFrom = document.getElementById('id-valid-from').value;
    const validUntil = document.getElementById('id-valid-until').value;
    const template = document.getElementById('id-card-template').value;
    
    if (!uploadedPhoto) {
        alert('Please upload a photo for the ID card');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape', 'mm', [85.6, 54]); // Standard ID card size
    
    // Generate ID card based on template
    switch(template) {
        case 'corporate':
            generateCorporateIdCard(doc, instituteName, cardType, fullName, idNumber, department, designation, bloodGroup, contact, validFrom, validUntil, uploadedPhoto);
            break;
        case 'modern':
            generateModernIdCard(doc, instituteName, cardType, fullName, idNumber, department, designation, bloodGroup, contact, validFrom, validUntil, uploadedPhoto);
            break;
        case 'academic':
            generateAcademicIdCard(doc, instituteName, cardType, fullName, idNumber, department, designation, bloodGroup, contact, validFrom, validUntil, uploadedPhoto);
            break;
        case 'minimal':
            generateMinimalIdCard(doc, instituteName, cardType, fullName, idNumber, department, designation, bloodGroup, contact, validFrom, validUntil, uploadedPhoto);
            break;
        case 'colorful':
            generateColorfulIdCard(doc, instituteName, cardType, fullName, idNumber, department, designation, bloodGroup, contact, validFrom, validUntil, uploadedPhoto);
            break;
        case 'security':
            generateSecurityIdCard(doc, instituteName, cardType, fullName, idNumber, department, designation, bloodGroup, contact, validFrom, validUntil, uploadedPhoto);
            break;
        default:
            generateCorporateIdCard(doc, instituteName, cardType, fullName, idNumber, department, designation, bloodGroup, contact, validFrom, validUntil, uploadedPhoto);
    }
    
    // Save to history
    const docData = {
        type: 'ID Card',
        instituteName,
        fullName,
        idNumber,
        cardType,
        template,
        generatedDate: new Date().toLocaleDateString(),
        id: Date.now()
    };
    
    documentHistory.push(docData);
    localStorage.setItem('edudocsX_history', JSON.stringify(documentHistory));
    
    // Download PDF
    doc.save(`${fullName}_IDCard_${template}.pdf`);
    
    alert(`Professional ${template} ID card generated successfully!`);
}

// ID Card Template 1: Corporate Professional
function generateCorporateIdCard(doc, instituteName, cardType, fullName, idNumber, department, designation, bloodGroup, contact, validFrom, validUntil, photo) {
    // Corporate blue background
    doc.setFillColor(0, 51, 102);
    doc.rect(0, 0, 85.6, 54, 'F');
    
    // White content area
    doc.setFillColor(255, 255, 255);
    doc.rect(2, 2, 81.6, 50, 'F');
    
    // Header
    doc.setFillColor(0, 51, 102);
    doc.rect(2, 2, 81.6, 12, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(instituteName.toUpperCase(), 42.8, 6, { align: 'center' });
    doc.setFontSize(6);
    doc.text(cardType.toUpperCase() + ' CARD', 42.8, 10, { align: 'center' });
    
    // Photo
    if (photo) {
        doc.addImage(photo, 'JPEG', 5, 16, 15, 20);
    }
    
    // Photo border
    doc.setDrawColor(0, 51, 102);
    doc.setLineWidth(0.5);
    doc.rect(5, 16, 15, 20);
    
    // Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(7);
    doc.text('Name:', 22, 18);
    doc.setFontSize(6);
    doc.text(fullName, 22, 21);
    
    doc.setFontSize(7);
    doc.text('ID:', 22, 25);
    doc.setFontSize(6);
    doc.text(idNumber, 22, 28);
    
    doc.setFontSize(7);
    doc.text('Dept:', 22, 32);
    doc.setFontSize(6);
    doc.text(department, 22, 35);
    
    if (bloodGroup) {
        doc.setFontSize(7);
        doc.text('Blood:', 55, 18);
        doc.setFontSize(6);
        doc.text(bloodGroup, 55, 21);
    }
    
    if (contact) {
        doc.setFontSize(7);
        doc.text('Contact:', 55, 25);
        doc.setFontSize(6);
        doc.text(contact, 55, 28);
    }
    
    // Validity
    doc.setFontSize(5);
    doc.text(`Valid: ${validFrom} to ${validUntil}`, 22, 40);
    
    // Footer
    doc.setFillColor(0, 51, 102);
    doc.rect(2, 44, 81.6, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(5);
    doc.text('This card is property of ' + instituteName, 42.8, 48, { align: 'center' });
}

// ID Card Template 2: Modern Gradient
function generateModernIdCard(doc, instituteName, cardType, fullName, idNumber, department, designation, bloodGroup, contact, validFrom, validUntil, photo) {
    // Modern gradient background
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, 85.6, 54, 'F');
    
    // Gradient effect simulation
    doc.setFillColor(52, 152, 219);
    doc.rect(0, 0, 85.6, 27, 'F');
    
    // White content area
    doc.setFillColor(255, 255, 255);
    doc.rect(3, 3, 79.6, 48, 'F');
    
    // Modern header
    doc.setFillColor(52, 152, 219);
    doc.rect(3, 3, 79.6, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text(instituteName, 42.8, 7, { align: 'center' });
    doc.setFontSize(5);
    doc.text(cardType + ' Identification', 42.8, 10, { align: 'center' });
    
    // Photo with modern border
    if (photo) {
        doc.addImage(photo, 'JPEG', 6, 15, 14, 18);
    }
    
    doc.setDrawColor(52, 152, 219);
    doc.setLineWidth(1);
    doc.rect(6, 15, 14, 18);
    
    // Modern details layout
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(6);
    doc.text(fullName.toUpperCase(), 22, 17);
    doc.setFontSize(5);
    doc.text('ID: ' + idNumber, 22, 20);
    doc.text(department, 22, 23);
    doc.text(designation, 22, 26);
    
    if (bloodGroup) {
        doc.text('Blood Group: ' + bloodGroup, 22, 30);
    }
    
    if (contact) {
        doc.text('Contact: ' + contact, 22, 33);
    }
    
    // Modern validity section
    doc.setFillColor(236, 240, 241);
    doc.rect(6, 36, 73.6, 8, 'F');
    doc.setTextColor(52, 73, 94);
    doc.setFontSize(4);
    doc.text(`Valid From: ${validFrom}`, 8, 39);
    doc.text(`Valid Until: ${validUntil}`, 8, 42);
    
    // Modern footer
    doc.setTextColor(149, 165, 166);
    doc.setFontSize(4);
    doc.text('Authorized ID Card', 42.8, 47, { align: 'center' });
}

// ID Card Template 3: Academic Classic
function generateAcademicIdCard(doc, instituteName, cardType, fullName, idNumber, department, designation, bloodGroup, contact, validFrom, validUntil, photo) {
    // Classic academic background
    doc.setFillColor(139, 69, 19);
    doc.rect(0, 0, 85.6, 54, 'F');
    
    // Cream content area
    doc.setFillColor(255, 248, 220);
    doc.rect(2, 2, 81.6, 50, 'F');
    
    // Academic border
    doc.setDrawColor(139, 69, 19);
    doc.setLineWidth(1);
    doc.rect(3, 3, 79.6, 48);
    
    // Header
    doc.setTextColor(139, 69, 19);
    doc.setFontSize(8);
    doc.text(instituteName, 42.8, 8, { align: 'center' });
    doc.setFontSize(5);
    doc.text('Academic ' + cardType + ' Card', 42.8, 12, { align: 'center' });
    
    // Decorative line
    doc.setLineWidth(0.5);
    doc.line(10, 14, 75.6, 14);
    
    // Photo with classic border
    if (photo) {
        doc.addImage(photo, 'JPEG', 6, 17, 13, 17);
    }
    
    doc.setDrawColor(139, 69, 19);
    doc.setLineWidth(1);
    doc.rect(6, 17, 13, 17);
    
    // Academic details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(6);
    doc.text('Name: ' + fullName, 21, 19);
    doc.text('ID Number: ' + idNumber, 21, 22);
    doc.text('Department: ' + department, 21, 25);
    doc.text('Year/Position: ' + designation, 21, 28);
    
    if (bloodGroup) {
        doc.text('Blood Group: ' + bloodGroup, 21, 31);
    }
    
    // Validity in classic style
    doc.setTextColor(139, 69, 19);
    doc.setFontSize(5);
    doc.text('Valid Period:', 6, 38);
    doc.setTextColor(0, 0, 0);
    doc.text(`${validFrom} to ${validUntil}`, 6, 41);
    
    // Academic seal placeholder
    doc.setDrawColor(139, 69, 19);
    doc.circle(70, 40, 6);
    doc.setFontSize(4);
    doc.text('SEAL', 70, 40, { align: 'center' });
    
    // Footer
    doc.setTextColor(139, 69, 19);
    doc.setFontSize(4);
    doc.text('Property of ' + instituteName, 42.8, 47, { align: 'center' });
}

// ID Card Template 4: Minimal Clean
function generateMinimalIdCard(doc, instituteName, cardType, fullName, idNumber, department, designation, bloodGroup, contact, validFrom, validUntil, photo) {
    // Clean white background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 85.6, 54, 'F');
    
    // Minimal border
    doc.setDrawColor(108, 117, 125);
    doc.setLineWidth(1);
    doc.rect(2, 2, 81.6, 50);
    
    // Simple header
    doc.setTextColor(108, 117, 125);
    doc.setFontSize(8);
    doc.text(instituteName, 42.8, 8, { align: 'center' });
    doc.setFontSize(5);
    doc.text(cardType, 42.8, 12, { align: 'center' });
    
    // Simple line
    doc.setLineWidth(0.5);
    doc.line(10, 14, 75.6, 14);
    
    // Photo with minimal border
    if (photo) {
        doc.addImage(photo, 'JPEG', 6, 17, 12, 16);
    }
    
    doc.setDrawColor(108, 117, 125);
    doc.setLineWidth(0.5);
    doc.rect(6, 17, 12, 16);
    
    // Clean details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(6);
    doc.text(fullName, 20, 19);
    doc.setFontSize(5);
    doc.text('ID: ' + idNumber, 20, 22);
    doc.text(department, 20, 25);
    doc.text(designation, 20, 28);
    
    if (bloodGroup) {
        doc.text('Blood: ' + bloodGroup, 20, 31);
    }
    
    // Simple validity
    doc.setFontSize(4);
    doc.text(`Valid: ${validFrom} - ${validUntil}`, 6, 38);
    
    // Minimal footer
    doc.setTextColor(108, 117, 125);
    doc.setFontSize(4);
    doc.text(instituteName, 42.8, 47, { align: 'center' });
}

// ID Card Template 5: Colorful Creative
function generateColorfulIdCard(doc, instituteName, cardType, fullName, idNumber, department, designation, bloodGroup, contact, validFrom, validUntil, photo) {
    // Colorful gradient background
    doc.setFillColor(155, 89, 182);
    doc.rect(0, 0, 85.6, 54, 'F');
    
    // Rainbow effect
    doc.setFillColor(52, 152, 219);
    doc.rect(0, 0, 85.6, 18, 'F');
    doc.setFillColor(46, 204, 113);
    doc.rect(0, 18, 85.6, 18, 'F');
    doc.setFillColor(241, 196, 15);
    doc.rect(0, 36, 85.6, 18, 'F');
    
    // White content overlay
    doc.setFillColor(255, 255, 255);
    doc.rect(3, 3, 79.6, 48, 'F');
    
    // Colorful header
    doc.setFillColor(155, 89, 182);
    doc.rect(3, 3, 79.6, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text('✦ ' + instituteName + ' ✦', 42.8, 7, { align: 'center' });
    doc.setFontSize(5);
    doc.text('Creative ' + cardType + ' Card', 42.8, 10, { align: 'center' });
    
    // Photo with colorful border
    if (photo) {
        doc.addImage(photo, 'JPEG', 6, 15, 13, 17);
    }
    
    doc.setDrawColor(155, 89, 182);
    doc.setLineWidth(2);
    doc.rect(6, 15, 13, 17);
    
    // Colorful details
    doc.setTextColor(155, 89, 182);
    doc.setFontSize(6);
    doc.text('★ ' + fullName, 21, 17);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(5);
    doc.text('ID: ' + idNumber, 21, 20);
    doc.text('✦ ' + department, 21, 23);
    doc.text('✦ ' + designation, 21, 26);
    
    if (bloodGroup) {
        doc.text('♥ Blood: ' + bloodGroup, 21, 29);
    }
    
    if (contact) {
        doc.text('☎ ' + contact, 21, 32);
    }
    
    // Colorful validity section
    doc.setFillColor(241, 196, 15);
    doc.rect(6, 35, 73.6, 8, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(4);
    doc.text(`★ Valid: ${validFrom} to ${validUntil}`, 8, 39);
    
    // Creative footer
    doc.setTextColor(155, 89, 182);
    doc.setFontSize(4);
    doc.text('✦ Creative Identity Card ✦', 42.8, 47, { align: 'center' });
}

// ID Card Template 6: Security Enhanced
function generateSecurityIdCard(doc, instituteName, cardType, fullName, idNumber, department, designation, bloodGroup, contact, validFrom, validUntil, photo) {
    // Security background pattern
    doc.setFillColor(220, 220, 220);
    doc.rect(0, 0, 85.6, 54, 'F');
    
    // Security pattern
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    for (let i = 0; i < 85.6; i += 2) {
        for (let j = 0; j < 54; j += 2) {
            if ((i + j) % 4 === 0) {
                doc.circle(i, j, 0.3);
            }
        }
    }
    
    // Main card area
    doc.setFillColor(255, 255, 255);
    doc.rect(2, 2, 81.6, 50, 'F');
    
    // Security header
    doc.setFillColor(220, 20, 60);
    doc.rect(2, 2, 81.6, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6);
    doc.text('🔒 ' + instituteName + ' 🔒', 42.8, 6, { align: 'center' });
    doc.setFontSize(4);
    doc.text('SECURE ' + cardType.toUpperCase() + ' CARD', 42.8, 9, { align: 'center' });
    
    // Security ID
    doc.setTextColor(220, 20, 60);
    doc.setFontSize(4);
    doc.text(`Security ID: SEC${Date.now().toString().slice(-6)}`, 4, 15);
    
    // Photo with security frame
    if (photo) {
        doc.addImage(photo, 'JPEG', 6, 17, 12, 16);
    }
    
    doc.setDrawColor(220, 20, 60);
    doc.setLineWidth(1);
    doc.rect(6, 17, 12, 16);
    
    // Security details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(5);
    doc.text('🔒 ' + fullName, 20, 19);
    doc.text('🔒 ID: ' + idNumber, 20, 22);
    doc.text('🔒 Dept: ' + department, 20, 25);
    doc.text('🔒 Role: ' + designation, 20, 28);
    
    if (bloodGroup) {
        doc.text('🔒 Blood: ' + bloodGroup, 20, 31);
    }
    
    // Security barcode
    doc.setFillColor(0, 0, 0);
    for (let i = 0; i < 15; i++) {
        const width = Math.random() > 0.5 ? 0.5 : 1;
        doc.rect(6 + (i * 1.2), 35, width, 4, 'F');
    }
    
    // Security validity
    doc.setFillColor(220, 20, 60);
    doc.rect(6, 41, 73.6, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(4);
    doc.text(`🔒 SECURE VALIDITY: ${validFrom} - ${validUntil}`, 8, 44);
    
    // Security footer
    doc.setTextColor(220, 20, 60);
    doc.setFontSize(3);
    doc.text('🔒 TAMPER EVIDENT - AUTHORIZED PERSONNEL ONLY 🔒', 42.8, 49, { align: 'center' });
}

// New Professional Marksheet Templates

// Academic Template - Gold theme for educational institutions
function generateAcademicTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects) {
    // Academic gold background
    doc.setFillColor(218, 165, 32);
    doc.rect(0, 0, 210, 297, 'F');
    
    // White content area
    doc.setFillColor(255, 255, 255);
    doc.rect(10, 10, 190, 277, 'F');
    
    // Header with academic styling
    doc.setFillColor(184, 134, 11);
    doc.rect(10, 10, 190, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text(instituteName, 105, 25, { align: 'center' });
    doc.setFontSize(14);
    doc.text('ACADEMIC MARKSHEET', 105, 35, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Excellence in Education', 105, 42, { align: 'center' });
    
    // Student details section
    doc.setFillColor(252, 243, 207);
    doc.rect(15, 55, 180, 25, 'F');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text('Student Name: ' + studentName, 20, 65);
    doc.text('Roll Number: ' + rollNo, 20, 72);
    doc.text('Class: ' + className, 120, 65);
    doc.text('Examination: ' + examName, 120, 72);
    
    // Subjects table with academic styling
    let yPos = 90;
    doc.setFillColor(184, 134, 11);
    doc.rect(15, yPos, 180, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('Subject', 20, yPos + 7);
    doc.text('Max Marks', 120, yPos + 7);
    doc.text('Obtained', 150, yPos + 7);
    doc.text('Grade', 175, yPos + 7);
    
    yPos += 12;
    let totalMarks = 0;
    let totalObtained = 0;
    
    subjects.forEach((subject, index) => {
        if (index % 2 === 0) {
            doc.setFillColor(252, 243, 207);
            doc.rect(15, yPos - 2, 180, 8, 'F');
        }
        
        // Ensure we have valid numbers for calculation
        const obtained = subject.obtained || subject.marks || 0;
        const outOf = subject.outOf || subject.total || 100;
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.text(subject.name, 20, yPos + 4);
        doc.text(outOf.toString(), 125, yPos + 4);
        doc.text(obtained.toString(), 155, yPos + 4);
        
        const percentage = (obtained / outOf) * 100;
        const grade = calculateGrade(percentage);
        
        doc.text(grade, 178, yPos + 4);
        
        totalMarks += outOf;
        totalObtained += obtained;
        yPos += 8;
    });
    
    // Total and percentage
    doc.setFillColor(184, 134, 11);
    doc.rect(15, yPos + 5, 180, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text('TOTAL', 20, yPos + 12);
    doc.text(totalMarks.toString(), 125, yPos + 12);
    doc.text(totalObtained.toString(), 155, yPos + 12);
    
    const overallPercentage = ((totalObtained / totalMarks) * 100).toFixed(2);
    doc.text(overallPercentage + '%', 175, yPos + 12);
    
    // Footer
    doc.setTextColor(184, 134, 11);
    doc.setFontSize(8);
    doc.text('This is a computer generated marksheet', 105, 270, { align: 'center' });
    doc.text('Date: ' + new Date().toLocaleDateString(), 105, 277, { align: 'center' });
}

// Professional Template - Navy theme for corporate look
function generateProfessionalTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects) {
    // Professional navy background
    doc.setFillColor(25, 55, 109);
    doc.rect(0, 0, 210, 297, 'F');
    
    // White content area
    doc.setFillColor(255, 255, 255);
    doc.rect(8, 8, 194, 281, 'F');
    
    // Header with professional styling
    doc.setFillColor(25, 55, 109);
    doc.rect(8, 8, 194, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text(instituteName.toUpperCase(), 105, 22, { align: 'center' });
    doc.setFontSize(12);
    doc.text('PROFESSIONAL MARKSHEET', 105, 30, { align: 'center' });
    doc.setFontSize(8);
    doc.text('Excellence • Innovation • Success', 105, 37, { align: 'center' });
    
    // Student info with modern layout
    doc.setFillColor(240, 248, 255);
    doc.rect(12, 48, 186, 22, 'F');
    
    doc.setTextColor(25, 55, 109);
    doc.setFontSize(10);
    doc.text('STUDENT INFORMATION', 15, 55);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text('Name: ' + studentName, 15, 62);
    doc.text('Roll No: ' + rollNo, 15, 67);
    doc.text('Class: ' + className, 110, 62);
    doc.text('Exam: ' + examName, 110, 67);
    
    // Modern table design
    let yPos = 80;
    doc.setFillColor(25, 55, 109);
    doc.rect(12, yPos, 186, 12, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text('SUBJECT', 15, yPos + 8);
    doc.text('MAX', 130, yPos + 8);
    doc.text('OBTAINED', 150, yPos + 8);
    doc.text('PERCENTAGE', 175, yPos + 8);
    
    yPos += 14;
    let totalMarks = 0;
    let totalObtained = 0;
    
    subjects.forEach((subject, index) => {
        if (index % 2 === 0) {
            doc.setFillColor(248, 249, 250);
            doc.rect(12, yPos - 1, 186, 10, 'F');
        }
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        doc.text(subject.name, 15, yPos + 6);
        doc.text(subject.outOf.toString(), 135, yPos + 6);
        doc.text(subject.obtained.toString(), 160, yPos + 6);
        
        const percentage = ((subject.obtained / subject.outOf) * 100).toFixed(1);
        doc.text(percentage + '%', 180, yPos + 6);
        
        totalMarks += subject.outOf;
        totalObtained += subject.obtained;
        yPos += 10;
    });
    
    // Professional summary
    doc.setFillColor(25, 55, 109);
    doc.rect(12, yPos + 5, 186, 18, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('OVERALL PERFORMANCE', 15, yPos + 12);
    doc.text('Total: ' + totalObtained + '/' + totalMarks, 15, yPos + 18);
    
    const overallPercentage = ((totalObtained / totalMarks) * 100).toFixed(2);
    doc.text('Percentage: ' + overallPercentage + '%', 110, yPos + 18);
    
    let result = 'FAIL';
    if (parseFloat(overallPercentage) >= 40) result = 'PASS';
    if (parseFloat(overallPercentage) >= 75) result = 'DISTINCTION';
    
    doc.text('Result: ' + result, 160, yPos + 18);
    
    // Professional footer
    doc.setTextColor(25, 55, 109);
    doc.setFontSize(7);
    doc.text('Generated on: ' + new Date().toLocaleDateString(), 105, 275, { align: 'center' });
    doc.text('This document is digitally generated and verified', 105, 282, { align: 'center' });
}

// Premium Template - Luxury design
function generatePremiumTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects) {
    // Premium gradient background
    doc.setFillColor(139, 69, 19);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Elegant content area
    doc.setFillColor(255, 248, 220);
    doc.rect(5, 5, 200, 287, 'F');
    
    // Premium header with gold accents
    doc.setFillColor(139, 69, 19);
    doc.rect(5, 5, 200, 45, 'F');
    
    doc.setTextColor(255, 215, 0);
    doc.setFontSize(22);
    doc.text('✦ ' + instituteName + ' ✦', 105, 20, { align: 'center' });
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('PREMIUM ACADEMIC RECORD', 105, 30, { align: 'center' });
    doc.setFontSize(10);
    doc.text('◆ Excellence in Education ◆', 105, 40, { align: 'center' });
    
    // Student details with premium styling
    doc.setTextColor(139, 69, 19);
    doc.setFontSize(12);
    doc.text('◆ STUDENT DETAILS ◆', 105, 63, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text('Name: ' + studentName, 15, 70);
    doc.text('Roll Number: ' + rollNo, 15, 75);
    doc.text('Class: ' + className, 120, 70);
    doc.text('Examination: ' + examName, 120, 75);
    
    // Premium table with gold headers
    let yPos = 90;
    doc.setFillColor(255, 215, 0);
    doc.rect(10, yPos, 190, 12, 'F');
    
    doc.setTextColor(139, 69, 19);
    doc.setFontSize(10);
    doc.text('◆ SUBJECT', 15, yPos + 8);
    doc.text('MAX ◆', 130, yPos + 8);
    doc.text('◆ SCORED', 155, yPos + 8);
    doc.text('GRADE ◆', 180, yPos + 8);
    
    yPos += 14;
    let totalMarks = 0;
    let totalObtained = 0;
    
    subjects.forEach((subject, index) => {
        if (index % 2 === 0) {
            doc.setFillColor(255, 250, 240);
            doc.rect(10, yPos - 1, 190, 10, 'F');
        }
        
        // Ensure we have valid numbers for calculation
        const obtained = subject.obtained || subject.marks || 0;
        const outOf = subject.outOf || subject.total || 100;
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.text(subject.name, 15, yPos + 6);
        doc.text(outOf.toString(), 135, yPos + 6);
        doc.text(obtained.toString(), 165, yPos + 6);
        
        const percentage = (obtained / outOf) * 100;
        const grade = calculateGrade(percentage);
        
        doc.text(grade, 185, yPos + 6);
        
        totalMarks += outOf;
        totalObtained += obtained;
        yPos += 10;
    });
    
    // Premium summary with gold styling
    doc.setFillColor(255, 215, 0);
    doc.rect(10, yPos + 5, 190, 20, 'F');
    doc.setTextColor(139, 69, 19);
    doc.setFontSize(12);
    doc.text('◆ FINAL RESULT ◆', 105, yPos + 12, { align: 'center' });
    
    const overallPercentage = ((totalObtained / totalMarks) * 100).toFixed(2);
    doc.text('Total Score: ' + totalObtained + '/' + totalMarks + ' (' + overallPercentage + '%)', 105, yPos + 20, { align: 'center' });
    
    // Premium footer
    doc.setTextColor(139, 69, 19);
    doc.setFontSize(8);
    doc.text('◆ This premium certificate is issued by ' + instituteName + ' ◆', 105, 275, { align: 'center' });
    doc.text('Date of Issue: ' + new Date().toLocaleDateString(), 105, 285, { align: 'center' });
}

// University Template - Traditional academic style
function generateUniversityTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects) {
    // University traditional background
    doc.setFillColor(0, 32, 96);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Academic white area
    doc.setFillColor(255, 255, 255);
    doc.rect(15, 15, 180, 267, 'F');
    
    // University crest area
    doc.setFillColor(0, 32, 96);
    doc.rect(15, 15, 180, 50, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text(instituteName.toUpperCase(), 105, 30, { align: 'center' });
    doc.setFontSize(12);
    doc.text('UNIVERSITY TRANSCRIPT', 105, 40, { align: 'center' });
    doc.setFontSize(8);
    doc.text('Established for Academic Excellence', 105, 50, { align: 'center' });
    doc.text('Veritas • Scientia • Virtus', 105, 57, { align: 'center' });
    
    // Student information in traditional format
    doc.setTextColor(0, 32, 96);
    doc.setFontSize(14);
    doc.text('ACADEMIC RECORD', 105, 80, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text('This is to certify that', 20, 95);
    doc.setFontSize(12);
    doc.text(studentName, 105, 105, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Roll Number: ' + rollNo + ', Class: ' + className, 105, 115, { align: 'center' });
    doc.text('has appeared in the ' + examName + ' and obtained the following marks:', 105, 125, { align: 'center' });
    
    // Traditional academic table
    let yPos = 140;
    doc.setDrawColor(0, 32, 96);
    doc.setLineWidth(1);
    doc.rect(20, yPos, 150, 12);
    
    doc.setFillColor(240, 248, 255);
    doc.rect(20, yPos, 150, 12, 'F');
    
    doc.setTextColor(0, 32, 96);
    doc.setFontSize(10);
    doc.text('Subject', 25, yPos + 8);
    doc.text('Maximum Marks', 90, yPos + 8);
    doc.text('Marks Obtained', 135, yPos + 8);
    
    yPos += 12;
    let totalMarks = 0;
    let totalObtained = 0;
    
    subjects.forEach((subject) => {
        doc.rect(20, yPos, 150, 10);
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.text(subject.name, 25, yPos + 7);
        doc.text(subject.outOf.toString(), 105, yPos + 7);
        doc.text(subject.obtained.toString(), 150, yPos + 7);
        
        totalMarks += subject.outOf;
        totalObtained += subject.obtained;
        yPos += 10;
    });
    
    // Total marks with traditional styling
    doc.setFillColor(0, 32, 96);
    doc.rect(20, yPos, 150, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('GRAND TOTAL', 25, yPos + 8);
    doc.text(totalMarks.toString(), 105, yPos + 8);
    doc.text(totalObtained.toString(), 150, yPos + 8);
    
    const overallPercentage = ((totalObtained / totalMarks) * 100).toFixed(2);
    
    // University certification
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text('Percentage Obtained: ' + overallPercentage + '%', 105, yPos + 25, { align: 'center' });
    
    let classification = 'Pass';
    if (parseFloat(overallPercentage) >= 75) classification = 'First Class with Distinction';
    else if (parseFloat(overallPercentage) >= 60) classification = 'First Class';
    else if (parseFloat(overallPercentage) >= 50) classification = 'Second Class';
    else if (parseFloat(overallPercentage) >= 40) classification = 'Third Class';
    else classification = 'Fail';
    
    doc.text('Classification: ' + classification, 105, yPos + 35, { align: 'center' });
    
    // University footer with signatures
    doc.setTextColor(0, 32, 96);
    doc.setFontSize(8);
    doc.text('Controller of Examinations', 50, 260);
    doc.text('Registrar', 160, 260);
    doc.text('Date: ' + new Date().toLocaleDateString(), 105, 275, { align: 'center' });
}

// Creative Marksheet Template - Modern artistic design
function generateCreativeMarksheetTemplate(doc, instituteName, studentName, rollNo, className, examName, subjects) {
    // Purple gradient background
    doc.setFillColor(155, 89, 182);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Artistic corner shapes using lines
    doc.setFillColor(52, 152, 219);
    doc.setDrawColor(52, 152, 219);
    doc.setLineWidth(0);
    // Top-left triangle
    doc.lines([[50, 0], [0, 50], [0, 0]], 0, 0, [1, 1], 'F');
    
    doc.setFillColor(46, 204, 113);
    doc.setDrawColor(46, 204, 113);
    // Top-right triangle  
    doc.lines([[-50, 0], [0, 50], [0, 0]], 210, 0, [1, 1], 'F');
    
    doc.setFillColor(241, 196, 15);
    doc.setDrawColor(241, 196, 15);
    // Bottom-left triangle
    doc.lines([[50, 0], [0, -50], [0, 0]], 0, 297, [1, 1], 'F');
    
    doc.setFillColor(231, 76, 60);
    doc.setDrawColor(231, 76, 60);
    // Bottom-right triangle
    doc.lines([[-50, 0], [0, -50], [0, 0]], 210, 297, [1, 1], 'F');
    
    // Main content area
    doc.setFillColor(255, 255, 255);
    doc.rect(20, 20, 170, 257, 'F');
    
    // Creative header
    doc.setFillColor(155, 89, 182);
    doc.rect(20, 20, 170, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('✨ ' + instituteName + ' ✨', 105, 32, { align: 'center' });
    doc.setFontSize(12);
    doc.text('🎨 CREATIVE MARKSHEET 🎨', 105, 42, { align: 'center' });
    doc.setFontSize(8);
    doc.text('🌟 Innovation • Creativity • Excellence 🌟', 105, 52, { align: 'center' });
    
    // Colorful student info
    doc.setFillColor(52, 152, 219);
    doc.rect(25, 70, 160, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('🎓 STUDENT PROFILE 🎓', 105, 78, { align: 'center' });
    
    doc.setFontSize(9);
    doc.text('👤 ' + studentName, 30, 85);
    doc.text('🆔 ' + rollNo, 30, 90);
    doc.text('📚 ' + className, 120, 85);
    doc.text('📝 ' + examName, 120, 90);
    
    // Creative subjects table
    let yPos = 105;
    const colors = [
        [155, 89, 182], [52, 152, 219], [46, 204, 113], 
        [241, 196, 15], [231, 76, 60], [230, 126, 34]
    ];
    
    doc.setFillColor(52, 73, 94);
    doc.rect(25, yPos, 160, 12, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text('📖 SUBJECT', 30, yPos + 8);
    doc.text('🎯 MAX', 120, yPos + 8);
    doc.text('⭐ SCORED', 145, yPos + 8);
    doc.text('🏆 GRADE', 170, yPos + 8);
    
    yPos += 14;
    let totalMarks = 0;
    let totalObtained = 0;
    
    subjects.forEach((subject, index) => {
        const color = colors[index % colors.length];
        doc.setFillColor(color[0], color[1], color[2]);
        doc.rect(25, yPos - 1, 160, 10, 'F');
        
        // Ensure we have valid numbers for calculation
        const obtained = subject.obtained || subject.marks || 0;
        const outOf = subject.outOf || subject.total || 100;
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text(subject.name, 30, yPos + 6);
        doc.text(outOf.toString(), 125, yPos + 6);
        doc.text(obtained.toString(), 150, yPos + 6);
        
        const percentage = (obtained / outOf) * 100;
        let grade = '😞';
        if (percentage >= 90) grade = '🏆';
        else if (percentage >= 80) grade = '🥇';
        else if (percentage >= 70) grade = '🥈';
        else if (percentage >= 60) grade = '🥉';
        else if (percentage >= 50) grade = '👍';
        else if (percentage >= 40) grade = '👌';
        
        doc.text(grade, 175, yPos + 6);
        
        totalMarks += outOf;
        totalObtained += obtained;
        yPos += 10;
    });
    
    // Creative summary
    doc.setFillColor(46, 204, 113);
    doc.rect(25, yPos + 5, 160, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text('🎉 FINAL SCORE 🎉', 105, yPos + 12, { align: 'center' });
    
    const overallPercentage = ((totalObtained / totalMarks) * 100).toFixed(2);
    doc.text('📊 ' + totalObtained + '/' + totalMarks + ' (' + overallPercentage + '%) 📊', 105, yPos + 20, { align: 'center' });
    
    // Creative footer
    doc.setTextColor(155, 89, 182);
    doc.setFontSize(8);
    doc.text('🌈 Creative Education for Creative Minds 🌈', 105, 260, { align: 'center' });
    doc.text('✨ Generated with Love on ' + new Date().toLocaleDateString() + ' ✨', 105, 270, { align: 'center' });
}

// Admit Card Photo Upload Functions
let admitPhotoData = null;

function triggerAdmitPhotoUpload() {
    document.getElementById('admit-photo-upload').click();
}


function removeAdmitPhoto() {
    admitPhotoData = null;
    const previewImage = document.getElementById('admit-preview-image');
    const photoPreview = document.getElementById('admit-photo-preview');
    const removePhotoBtn = document.getElementById('admit-remove-photo');
    const photoUpload = document.getElementById('admit-photo-upload');
    
    previewImage.style.display = 'none';
    photoPreview.querySelector('.photo-placeholder').style.display = 'block';
    removePhotoBtn.style.display = 'none';
    photoUpload.value = '';
}

// Preview functions are implemented above in their respective sections

// History management
function loadHistory() {
    const historyList = document.getElementById('history-list');
    
    if (documentHistory.length === 0) {
        historyList.innerHTML = '<div class="empty-history">No documents generated yet</div>';
        return;
    }
    
    historyList.innerHTML = documentHistory.map(doc => `
        <div class="history-item">
            <div class="history-info">
                <h4>${doc.type} - ${doc.studentName}</h4>
                <p>Generated on ${doc.date}</p>
            </div>
            <div class="history-actions">
                <button class="btn btn-outline btn-small" onclick="downloadFromHistory('${doc.id}')">Download</button>
                <button class="btn btn-danger btn-small" onclick="deleteFromHistory('${doc.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function downloadFromHistory(docId) {
    const doc = documentHistory.find(d => d.id == docId);
    if (doc) {
        alert(`Downloading ${doc.type} for ${doc.studentName}...`);
        // In a real app, this would regenerate and download the PDF
    }
}

function deleteFromHistory(docId) {
    if (confirm('Are you sure you want to delete this document from history?')) {
        documentHistory = documentHistory.filter(d => d.id != docId);
        localStorage.setItem('edudocsX_history', JSON.stringify(documentHistory));
        loadHistory();
    }
}

// Bulk Generation Functions
let bulkData = [];
let currentStep = 1;
let generatedDocuments = [];

function showBulkGenerationForm() {
    showPage('bulk-generation-form');
    resetBulkForm();
    initializeBulkGenerationEvents();
}

function resetBulkForm() {
    currentStep = 1;
    bulkData = [];
    generatedDocuments = [];
    
    // Reset all steps
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.toggle('active', index === 0);
    });
    
    // Reset navigation
    updateBulkNavigation();
    
    // Reset file upload
    document.getElementById('bulk-file-input').value = '';
    document.getElementById('file-info').style.display = 'none';
    document.getElementById('upload-zone').style.display = 'block';
    
    // Reset form fields
    document.getElementById('bulk-institution').value = '';
    document.getElementById('bulk-exam').value = '';
    document.getElementById('bulk-template').value = 'classic';
    
    // Reset logo upload
    removeLogo();
    
    // Reset data preview
    document.getElementById('data-preview').innerHTML = '';
    
    // Reset progress and results
    document.getElementById('generation-progress').style.display = 'none';
    document.getElementById('generation-results').style.display = 'none';
}

function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < 4) {
            // Deactivate current step
            document.getElementById(`step-${currentStep}`).classList.remove('active');
            
            currentStep++;
            
            // Activate next step
            document.getElementById(`step-${currentStep}`).classList.add('active');
            
            if (currentStep === 4) {
                showDataPreview();
            }
            
            updateBulkNavigation();
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        // Deactivate current step
        document.getElementById(`step-${currentStep}`).classList.remove('active');
        
        currentStep--;
        
        // Activate previous step
        document.getElementById(`step-${currentStep}`).classList.add('active');
        
        updateBulkNavigation();
    }
}

function updateBulkNavigation() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const generateBtn = document.getElementById('generate-btn');
    
    prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
    nextBtn.style.display = currentStep < 4 ? 'block' : 'none';
    generateBtn.style.display = currentStep === 4 ? 'block' : 'none';
    
    // Update exam settings visibility
    const docType = document.querySelector('input[name="bulk-doc-type"]:checked')?.value;
    const examSettings = document.getElementById('exam-settings');
    if (examSettings) {
        examSettings.style.display = (docType === 'marksheet' || docType === 'admit-card') ? 'block' : 'none';
    }
}

function validateCurrentStep() {
    switch (currentStep) {
        case 1:
            return document.querySelector('input[name="bulk-doc-type"]:checked') !== null;
        case 2:
            return bulkData.length > 0;
        case 3:
            const institution = document.getElementById('bulk-institution').value.trim();
            const docType = document.querySelector('input[name="bulk-doc-type"]:checked')?.value;
            const exam = document.getElementById('bulk-exam').value.trim();
            
            if (!institution) {
                alert('Please enter institution name');
                return false;
            }
            
            if ((docType === 'marksheet' || docType === 'admit-card') && !exam) {
                alert('Please enter exam name');
                return false;
            }
            
            return true;
        default:
            return true;
    }
}

function triggerFileUpload() {
    document.getElementById('bulk-file-input').click();
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const fileSize = (file.size / 1024 / 1024).toFixed(2); // MB
    const fileName = file.name;
    
    // Show file info
    document.getElementById('file-name').textContent = fileName;
    document.getElementById('file-size').textContent = `${fileSize} MB`;
    document.getElementById('upload-zone').style.display = 'none';
    document.getElementById('file-info').style.display = 'flex';
    
    // Parse file
    parseFile(file);
}

function removeFile() {
    document.getElementById('bulk-file-input').value = '';
    document.getElementById('file-info').style.display = 'none';
    document.getElementById('upload-zone').style.display = 'block';
    bulkData = [];
}

function parseFile(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            if (file.name.endsWith('.csv')) {
                parseCSV(e.target.result);
            } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                parseExcel(e.target.result);
            }
        } catch (error) {
            alert('Error parsing file: ' + error.message);
            removeFile();
        }
    };
    
    if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
    } else {
        reader.readAsArrayBuffer(file);
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
        throw new Error('CSV file must have at least a header row and one data row');
    }
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];
    
    for (let i = 1; i < lines.length && i <= 100; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const row = {};
        
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        
        data.push(row);
    }
    
    bulkData = data;
    updateRecordCount();
    validateDataStructure();
}

function parseExcel(arrayBuffer) {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (jsonData.length < 2) {
        throw new Error('Excel file must have at least a header row and one data row');
    }
    
    const headers = jsonData[0];
    const data = [];
    
    for (let i = 1; i < jsonData.length && i <= 100; i++) {
        const row = {};
        headers.forEach((header, index) => {
            row[header] = jsonData[i][index] || '';
        });
        data.push(row);
    }
    
    bulkData = data;
    updateRecordCount();
    validateDataStructure();
}

function updateRecordCount() {
    document.getElementById('record-count').textContent = `${bulkData.length} records found`;
}

function validateDataStructure() {
    const docType = document.querySelector('input[name="bulk-doc-type"]:checked')?.value || 'marksheet';
    const requiredFields = getRequiredFields(docType);
    const headers = Object.keys(bulkData[0] || {});
    
    const missingFields = requiredFields.filter(field => !headers.includes(field));
    
    if (missingFields.length > 0) {
        alert(`Missing required columns: ${missingFields.join(', ')}\n\nPlease ensure your file has all required columns.`);
        removeFile();
        return false;
    }
    
    return true;
}

function getRequiredFields(docType) {
    const baseFields = ['studentName', 'rollNo', 'className'];
    
    switch (docType) {
        case 'marksheet':
            return [...baseFields, 'subject1', 'marks1', 'subject2', 'marks2'];
        case 'certificate':
            return [...baseFields, 'achievement', 'date'];
        case 'admit-card':
            return [...baseFields, 'examDate', 'examTime', 'examCenter'];
        default:
            return baseFields;
    }
}

function showDataPreview() {
    const previewContainer = document.getElementById('data-preview');
    
    if (bulkData.length === 0) {
        previewContainer.innerHTML = '<p>No data to preview</p>';
        return;
    }
    
    const headers = Object.keys(bulkData[0]);
    const previewData = bulkData.slice(0, 5); // Show first 5 records
    
    let html = `
        <h4>Data Preview (showing first ${previewData.length} of ${bulkData.length} records)</h4>
        <table class="preview-table">
            <thead>
                <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
                ${previewData.map(row => `
                    <tr>${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    if (bulkData.length > 5) {
        html += `<p class="text-muted">... and ${bulkData.length - 5} more records</p>`;
    }
    
    previewContainer.innerHTML = html;
}

async function startBulkGeneration() {
    const docType = document.querySelector('input[name="bulk-doc-type"]:checked').value;
    const institution = document.getElementById('bulk-institution').value;
    const template = document.getElementById('bulk-template').value;
    const examName = document.getElementById('bulk-exam').value;
    
    // Show progress
    document.getElementById('data-preview').style.display = 'none';
    document.getElementById('generation-progress').style.display = 'block';
    document.getElementById('generate-btn').disabled = true;
    
    generatedDocuments = [];
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < bulkData.length; i++) {
        const record = bulkData[i];
        
        // Update progress
        const progress = ((i + 1) / bulkData.length) * 100;
        document.getElementById('progress-fill').style.width = progress + '%';
        document.getElementById('progress-text').textContent = `Generating document ${i + 1} of ${bulkData.length}...`;
        
        try {
            const pdf = await generateDocumentFromData(docType, record, institution, template, examName);
            generatedDocuments.push({
                filename: `${docType}_${record.studentName}_${record.rollNo}.pdf`,
                data: pdf.output('blob')
            });
            successCount++;
        } catch (error) {
            console.error('Error generating document:', error);
            errorCount++;
        }
        
        // Small delay to prevent browser freezing
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Show results
    document.getElementById('generation-progress').style.display = 'none';
    document.getElementById('generation-results').style.display = 'block';
    document.getElementById('success-count').textContent = successCount;
    
    if (errorCount > 0) {
        document.getElementById('error-count').textContent = errorCount;
        document.getElementById('error-count').style.display = 'inline';
    }
    
    document.getElementById('generate-btn').disabled = false;
}

async function generateDocumentFromData(docType, data, institution, template, examName) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    switch (docType) {
        case 'marksheet':
            await generateBulkMarksheet(doc, data, institution, template, examName);
            break;
        case 'certificate':
            await generateBulkCertificate(doc, data, institution, template);
            break;
        case 'admit-card':
            await generateBulkAdmitCard(doc, data, institution, template, examName);
            break;
    }
    
    return doc;
}

async function generateBulkMarksheet(doc, data, institution, template, examName) {
    // Extract subjects and marks from data
    const subjects = [];
    const keys = Object.keys(data);
    
    for (let i = 1; i <= 10; i++) {
        const subjectKey = `subject${i}`;
        const marksKey = `marks${i}`;
        const oralMarksKey = `oralMarks${i}`;
        
        if (data[subjectKey] && data[marksKey]) {
            subjects.push({
                name: data[subjectKey],
                obtained: parseInt(data[marksKey]) || 0,
                outOf: parseInt(data[`total${i}`]) || 100,
                oralObtained: parseInt(data[oralMarksKey]) || 0,
                oralOutOf: 10, // Fixed at 10 for oral/practical
                marks: parseInt(data[marksKey]) || 0, // Keep for backward compatibility
                total: parseInt(data[`total${i}`]) || 100, // Keep for backward compatibility
                oralMarks: parseInt(data[oralMarksKey]) || 0 // Keep for backward compatibility
            });
        }
    }
    
    // Use existing marksheet generation functions based on template
    switch (template) {
        case 'modern':
            generateModernTemplateWithLogo(doc, institution, data.studentName, data.rollNo, data.className, examName, subjects, institutionLogo);
            break;
        case 'elegant':
            generateElegantTemplateWithLogo(doc, institution, data.studentName, data.rollNo, data.className, examName, subjects, institutionLogo);
            break;
        case 'creative':
            generateCreativeTemplateWithLogo(doc, institution, data.studentName, data.rollNo, data.className, examName, subjects, institutionLogo);
            break;
        default:
            generateClassicTemplateWithLogo(doc, institution, data.studentName, data.rollNo, data.className, examName, subjects, institutionLogo);
    }
}

async function generateBulkCertificate(doc, data, institution, template) {
    // Use existing certificate generation functions
    const studentName = data.studentName;
    const achievement = data.achievement;
    const date = data.date || new Date().toLocaleDateString();
    const remarks = data.remarks || 'Congratulations on your achievement!';
    
    switch (template) {
        case 'modern':
            generateModernCertificate(doc, institution, studentName, achievement, date, remarks);
            break;
        case 'elegant':
            generateElegantCertificate(doc, institution, studentName, achievement, date, remarks);
            break;
        default:
            generateClassicCertificate(doc, institution, studentName, achievement, date, remarks);
    }
}

async function generateBulkAdmitCard(doc, data, institution, template, examName) {
    // Use existing admit card generation functions
    const studentName = data.studentName;
    const rollNo = data.rollNo;
    const examCenter = data.examCenter;
    const examDate = data.examDate;
    const photoData = null; // No photo for bulk generation
    
    switch (template) {
        case 'modern':
            generateModernAdmitCard(doc, institution, studentName, rollNo, examCenter, examDate, photoData);
            break;
        case 'elegant':
            generateElegantAdmitCard(doc, institution, studentName, rollNo, examCenter, examDate, photoData);
            break;
        default:
            generateClassicAdmitCard(doc, institution, studentName, rollNo, examCenter, examDate, photoData);
    }
}

async function downloadAllDocuments() {
    if (generatedDocuments.length === 0) {
        alert('No documents to download');
        return;
    }
    
    const zip = new JSZip();
    
    generatedDocuments.forEach(doc => {
        zip.file(doc.filename, doc.data);
    });
    
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk_documents_${new Date().getTime()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function downloadTemplate() {
    const docType = document.querySelector('input[name="bulk-doc-type"]:checked')?.value || 'marksheet';
    const template = generateCSVTemplate(docType);
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docType}_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function generateCSVTemplate(docType) {
    let headers = ['studentName', 'rollNo', 'className'];
    let sampleData = ['John Doe', 'R001', 'Class 10'];
    
    switch (docType) {
        case 'marksheet':
            headers.push('subject1', 'marks1', 'total1', 'subject2', 'marks2', 'total2', 'subject3', 'marks3', 'total3');
            sampleData.push('Mathematics', '85', '100', 'Science', '92', '100', 'English', '78', '100');
            break;
        case 'certificate':
            headers.push('achievement', 'date');
            sampleData.push('Excellence in Studies', '2024-01-15');
            break;
        case 'admit-card':
            headers.push('examDate', 'examTime', 'examCenter');
            sampleData.push('2024-03-15', '10:00 AM', 'Main Campus');
            break;
    }
    
    return headers.join(',') + '\n' + sampleData.join(',');
}

// Test function to verify marksheet generation
function testMarksheetGeneration() {
    console.log('Testing marksheet generation...');
    
    const testData = {
        instituteName: 'Test School',
        studentName: 'John Doe',
        rollNo: 'T001',
        className: 'Class 10',
        examName: 'Final Exam',
        subjects: [
            { name: 'Mathematics', obtained: 85, outOf: 100 },
            { name: 'Science', obtained: 92, outOf: 100 },
            { name: 'English', obtained: 78, outOf: 100 }
        ]
    };
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Test classic template
    generateClassicTemplate(doc, testData.instituteName, testData.studentName, 
                          testData.rollNo, testData.className, testData.examName, testData.subjects);
    
    // Download the test PDF
    doc.save('test_marksheet.pdf');
    console.log('Test marksheet generated successfully!');
}

// Logo upload functionality
let institutionLogo = null;

// Template functions with logo support for bulk generation
function generateClassicTemplateWithLogo(doc, instituteName, studentName, rollNo, className, examName, subjects, logoData) {
    // Cream background
    doc.setFillColor(250, 248, 245);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Add logo if provided (top-left corner)
    if (logoData) {
        try {
            doc.addImage(logoData, 'JPEG', 15, 15, 30, 30);
        } catch (e) {
            console.warn('Could not add logo to PDF:', e);
        }
    }
    
    // Elegant outer border
    doc.setLineWidth(3);
    doc.setDrawColor(139, 69, 19);
    doc.rect(10, 10, 190, 277);
    
    // Inner decorative border
    doc.setLineWidth(1);
    doc.setDrawColor(218, 165, 32);
    doc.rect(15, 15, 180, 267);
    
    // Header section (adjusted for logo)
    doc.setFillColor(139, 69, 19);
    doc.rect(logoData ? 50 : 20, 20, logoData ? 140 : 170, 25, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(instituteName.toUpperCase(), 105, 32, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Academic Excellence • Character Building • Future Leaders', 105, 40, { align: 'center' });
    
    // Document title
    doc.setTextColor(139, 69, 19);
    doc.setFontSize(24);
    doc.text('STUDENT MARKSHEET', 105, 60, { align: 'center' });
    
    // Decorative line
    doc.setLineWidth(2);
    doc.setDrawColor(218, 165, 32);
    doc.line(60, 65, 150, 65);
    
    // Student details
    doc.setFillColor(248, 248, 255);
    doc.rect(25, 75, 160, 20, 'F');
    doc.setDrawColor(139, 69, 19);
    doc.setLineWidth(1);
    doc.rect(25, 75, 160, 20);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`Name: ${studentName}`, 30, 85);
    doc.text(`Class: ${className}`, 30, 92);
    doc.text(`Roll Number: ${rollNo}`, 120, 85);
    doc.text(`Examination: ${examName}`, 120, 92);
    
    generateBulkSubjectsTable(doc, subjects, 105, 'classic');
}

function generateModernTemplateWithLogo(doc, instituteName, studentName, rollNo, className, examName, subjects, logoData) {
    // White background with blue accent
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Modern header with gradient effect (adjusted for logo)
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, 210, 50, 'F');
    
    // Add logo if provided (top-left corner on blue header)
    if (logoData) {
        try {
            doc.addImage(logoData, 'JPEG', 15, 10, 30, 30);
        } catch (e) {
            console.warn('Could not add logo to PDF:', e);
        }
    }
    
    // Institution name (adjusted position if logo exists)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text(instituteName.toUpperCase(), logoData ? 55 : 105, 25, { align: logoData ? 'left' : 'center' });
    doc.setFontSize(10);
    doc.text('Excellence in Education • Innovation • Leadership', logoData ? 55 : 105, 35, { align: logoData ? 'left' : 'center' });
    
    // Document title
    doc.setTextColor(41, 128, 185);
    doc.setFontSize(22);
    doc.text('ACADEMIC TRANSCRIPT', 105, 65, { align: 'center' });
    
    // Modern line
    doc.setLineWidth(3);
    doc.setDrawColor(52, 152, 219);
    doc.line(20, 70, 190, 70);
    
    // Student info in modern cards
    doc.setFillColor(236, 240, 241);
    doc.rect(20, 80, 75, 25, 'F');
    doc.rect(115, 80, 75, 25, 'F');
    
    doc.setTextColor(44, 62, 80);
    doc.setFontSize(10);
    doc.text(`Name: ${studentName}`, 25, 90);
    doc.text(`Class: ${className}`, 25, 98);
    doc.text(`Roll: ${rollNo}`, 120, 90);
    doc.text(`Exam: ${examName}`, 120, 98);
    
    generateBulkSubjectsTable(doc, subjects, 115, 'modern');
}

function generateElegantTemplateWithLogo(doc, instituteName, studentName, rollNo, className, examName, subjects, logoData) {
    // Light gray background
    doc.setFillColor(248, 249, 250);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Elegant border
    doc.setLineWidth(2);
    doc.setDrawColor(52, 58, 64);
    doc.rect(15, 15, 180, 267);
    
    // Add logo if provided (top-left corner)
    if (logoData) {
        try {
            doc.addImage(logoData, 'JPEG', 20, 20, 30, 30);
        } catch (e) {
            console.warn('Could not add logo to PDF:', e);
        }
    }
    
    // Header section (adjusted for logo)
    doc.setFillColor(52, 58, 64);
    doc.rect(logoData ? 55 : 25, 25, logoData ? 130 : 160, 20, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text(instituteName.toUpperCase(), 105, 35, { align: 'center' });
    doc.setFontSize(9);
    doc.text('Excellence • Integrity • Innovation', 105, 42, { align: 'center' });
    
    // Document title
    doc.setTextColor(52, 58, 64);
    doc.setFontSize(20);
    doc.text('ACADEMIC RECORD', 105, 60, { align: 'center' });
    
    // Elegant line
    doc.setLineWidth(1);
    doc.setDrawColor(108, 117, 125);
    doc.line(40, 65, 170, 65);
    
    // Student information
    doc.setFillColor(255, 255, 255);
    doc.rect(25, 75, 160, 20, 'F');
    doc.setDrawColor(52, 58, 64);
    doc.setLineWidth(1);
    doc.rect(25, 75, 160, 20);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Student: ${studentName}`, 30, 85);
    doc.text(`Roll: ${rollNo}`, 30, 92);
    doc.text(`Class: ${className}`, 120, 85);
    doc.text(`Exam: ${examName}`, 120, 92);
    
    generateBulkSubjectsTable(doc, subjects, 105, 'elegant');
}

function generateCreativeTemplateWithLogo(doc, instituteName, studentName, rollNo, className, examName, subjects, logoData) {
    // Purple gradient background
    doc.setFillColor(155, 89, 182);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Add logo if provided (top-left corner with white background)
    if (logoData) {
        try {
            // Add white circle background for logo
            doc.setFillColor(255, 255, 255);
            doc.circle(30, 30, 18, 'F');
            doc.addImage(logoData, 'JPEG', 20, 20, 20, 20);
        } catch (e) {
            console.warn('Could not add logo to PDF:', e);
        }
    }
    
    // Creative header with emoji decorations (adjusted for logo)
    doc.setFillColor(142, 68, 173);
    doc.rect(logoData ? 55 : 15, 15, logoData ? 140 : 180, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text('🎓 ' + instituteName.toUpperCase() + ' 🎓', 105, 28, { align: 'center' });
    doc.setFontSize(10);
    doc.text('✨ Creative Learning • Bright Futures ✨', 105, 38, { align: 'center' });
    
    // Fun title with emojis
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('📋 STUDENT MARKSHEET 📋', 105, 65, { align: 'center' });
    
    // Colorful decorative elements
    doc.setFillColor(231, 76, 60);
    doc.circle(25, 75, 3, 'F');
    doc.setFillColor(46, 204, 113);
    doc.circle(185, 75, 3, 'F');
    doc.setFillColor(241, 196, 15);
    doc.circle(25, 85, 3, 'F');
    doc.setFillColor(52, 152, 219);
    doc.circle(185, 85, 3, 'F');
    
    // Student info with creative styling
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(25, 80, 160, 25, 5, 5, 'F');
    doc.setDrawColor(142, 68, 173);
    doc.setLineWidth(2);
    doc.roundedRect(25, 80, 160, 25, 5, 5);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`👤 ${studentName}`, 30, 90);
    doc.text(`🎯 ${className}`, 30, 98);
    doc.text(`🆔 ${rollNo}`, 120, 90);
    doc.text(`📝 ${examName}`, 120, 98);
    
    generateBulkSubjectsTable(doc, subjects, 115, 'creative');
}

function triggerLogoUpload() {
    document.getElementById('bulk-logo-input').click();
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('Logo file size must be less than 2MB');
        return;
    }
    
    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (PNG, JPG, GIF)');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        institutionLogo = e.target.result;
        
        // Show preview
        const logoPreview = document.getElementById('logo-preview');
        const logoPlaceholder = document.getElementById('logo-placeholder');
        const logoImage = document.getElementById('logo-image');
        
        logoImage.src = institutionLogo;
        logoPreview.style.display = 'flex';
        logoPlaceholder.style.display = 'none';
    };
    
    reader.readAsDataURL(file);
}

function removeLogo() {
    institutionLogo = null;
    
    // Hide preview and show placeholder
    const logoPreview = document.getElementById('logo-preview');
    const logoPlaceholder = document.getElementById('logo-placeholder');
    const logoInput = document.getElementById('bulk-logo-input');
    
    logoPreview.style.display = 'none';
    logoPlaceholder.style.display = 'flex';
    logoInput.value = '';
}

// Initialize bulk generation events when the form is shown
function initializeBulkGenerationEvents() {
    const uploadZone = document.getElementById('upload-zone');
    
    if (uploadZone && !uploadZone.hasAttribute('data-events-initialized')) {
        uploadZone.setAttribute('data-events-initialized', 'true');
        
        uploadZone.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        
        uploadZone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
        });
        
        uploadZone.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const fileInput = document.getElementById('bulk-file-input');
                if (fileInput) {
                    fileInput.files = files;
                    handleFileUpload({ target: fileInput });
                }
            }
        });
    }
    
    // Add event listeners for document type changes
    document.querySelectorAll('input[name="bulk-doc-type"]').forEach(radio => {
        if (!radio.hasAttribute('data-events-initialized')) {
            radio.setAttribute('data-events-initialized', 'true');
            radio.addEventListener('change', updateBulkNavigation);
        }
    });
}
