# AncodeTeamtrack

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.1.

Angular-based employee management application that supports viewing, filtering, paginating, and exporting employee records. It features a light/dark mode toggle and uses local storage for data persistence.

## Live Server
[https://team-track.netlify.app/](https://team-track.netlify.app/)
## Development server

To start a local development server, run:

**Clone the Repository**
   ```bash
   git clone https://github.com/AnkurNayak/ancode-teamtrack
   cd <your-project-directory>
```

**Install Dependency**
   ```bash
   npm install
```

**Run the Project**
   ```bash
   ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### LocalStorage Used as a Mock Backend
Data is stored and managed in localStorage to mimic a real server-based structure. Although pagination and server-like logic are implemented, they don't provide performance benefits with local storage, as the entire dataset is always available on the client.

### Real Server Simulation
The app structure is built to allow easy switching to a real API in the future with minimal changes.

### Features Implemented
#### ✅ Create Employee
Add new employees using a validated form.

#### ✏️ Edit Employee
Update existing employee details.

#### 🔍 Filter by Department
Filter employees based on one or more departments.

#### ↕️ Sort Employees
Sort employee list by name or date of joining.

#### 🛠 Update Employee Details
Modify employee records with real-time validation.

#### 🧾 Form Validation
All forms include validation for required fields, formats, and logical consistency.

#### 🌗 Light/Dark Mode
Toggle between light and dark themes for better UX.

#### 📱 Responsive UI Design
Fully responsive design that works well on desktops, tablets, and mobile devices.

#### 🧩 Custom Components
Modular and reusable components for clean and maintainable code.

#### 📤 Export to Excel
Export all or filtered employee data to an Excel file.

