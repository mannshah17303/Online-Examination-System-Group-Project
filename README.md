# Online Examination System

## Overview
The Online Examination System is a web-based platform designed to facilitate the creation, management, and conduction of exams for educational institutions or organizations. The system supports three types of users: **Admin**, **Candidate**, and **Super Admin**, each with specific roles and functionalities. It provides a comprehensive solution for managing categories, exams, batches, and results, with features like plagiarism detection, automatic grading for MCQs, and detailed analytics.

## Stakeholders and Modules
The system is divided into modules tailored to the needs of each stakeholder:

### Admin
- **Login**: Secure login (AL1) and forgot password functionality (AL2).
- **Profile Management**: View (AP3) and edit (AP4) personal information.
- **Dashboard**: View total students (AD5), categories (AD6), past exams (AD7), and analytics via graphs/pie charts (AD8).
- **Category Management**: View categories as cards (AC9), edit (AC10), delete (AC11), add new categories (AC12), add questions (AC13), and manage question types (AC14).
- **Manage Exams**: View current (AME15), upcoming (AME16), and completed exams (AME17); create exams (AME18), select question categories (AME19), select batches (AME20), preview (AME21), and edit exams (AME22).
- **Exam Assessment**: View total attended (AEA23) and invited candidates (AEA24), auto-assessed MCQs (AEA25), and pending subjective assessments (AEA26).
- **Result Database**: List completed exams (AR27), view specific exam results (AR28), and search functionality (AR29).
- **Batch/Class Management**: Add (AB30), view (AB31), update (AB32), delete (AB33), map (AB34), update mapping (AB35), and delete mapping (AB36) for batches.

### Candidate
- **Register**: Create an account (CL37).
- **Login**: Secure login (CD38).
- **Profile Management**: View (CP39) and edit (CP40) personal information.
- **Dashboard**: View total exams (CD41), average marks (CD42), passed exams (CD43), failed exams (CD44), percentage graph (CD45), and exam results overview (CD46).
- **Exams**: View current (CE47), upcoming (CE48), and completed exams (CE49).
- **Exam Conduction**: Access instruction page (CEC50), question display (CEC51), navigation (CEC52, CEC53), plagiarism detection (CEC54), data submission (CEC55), MCQ auto-grading (CEC56), and subjective answer assessment (CEC57).
- **Result**: View past exam results (CR58) and compare answers (CR59).

### Super Admin
- **Authentication & Profile Management**: Secure login (SAA60), create admins (SAA61), manage profile (SAA62), view admins (SAA63), soft delete/hold admins (SAA64), and reset password via email (SAA65).

## Features
- **Admin Features**:
  - Comprehensive dashboard with analytics.
  - Flexible category and question management (MCQ and subjective).
  - Exam creation with batch and category selection.
  - Batch management with CSV import support.
  - Auto-assessment for MCQs and manual assessment for subjective answers.
  - Searchable result database.

- **Candidate Features**:
  - User-friendly dashboard with performance metrics.
  - Seamless exam navigation and submission.
  - Plagiarism detection for integrity.
  - Detailed result analysis with answer comparison.

- **Super Admin Features**:
  - Admin account management with soft delete functionality.
  - Secure password reset process.

## Installation
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   ```
2. **Install Dependencies**:
   - Ensure Node.js required environments are installed based on the tech stack.
   - Run:
     ```bash
     npm install
     ```
3. **Run the Application**:
   - Start the backend server:
     ```bash
     npm start
     ```

## Usage
1. **Super Admin**:
   - Log in to create and manage admin accounts.
   - Use the admin hold feature for access control.
2. **Admin**:
   - Log in to manage categories, questions, exams, and batches.
   - Create exams, assign batches, and assess results.
3. **Candidate**:
   - Register and log in to access the dashboard.
   - Take exams, view results, and compare answers.

## Technologies
- **Frontend**: React.js, CSS, JavaScript
- **Backend**: Node.js/Express
- **Database**: MySQL
- **Additional Tools**: Plagiarism detection APIs, charting libraries (e.g., Chart.js).

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit changes (`git commit -m "Add feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License
This project is licensed under the MIT License.

## Contact
For inquiries, reach out to the project maintainers at `onlineexaminationcenter@support.com` or open an issue in the repository.
