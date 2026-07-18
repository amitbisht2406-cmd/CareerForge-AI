# CareerForge AI

A full-stack career platform that helps job seekers build a professional resume, create a shareable portfolio, and get instant AI-powered feedback — all in one place.

**Live Demo:** _add your deployed URL here once live_
**Repository:** https://github.com/amitbisht2406-cmd/fresh

---

## 📌 Problem Statement

Job seekers, especially students and early-career professionals, often struggle to:
- Build a well-structured, ATS-friendly resume without design/formatting experience
- Create an online portfolio to showcase their projects alongside their resume
- Get objective feedback on their resume before applying to jobs

Most existing tools solve only one of these problems in isolation, forcing users to juggle multiple platforms. **CareerForge AI** brings resume building, portfolio building, and AI-driven resume review together into a single, unified dashboard.

---

## ✨ Features

- **Authentication** — Secure register/login with JWT-based auth
- **Dashboard** — At-a-glance overview of profile completion and quick access to every tool
- **Resume Builder** — Multi-section resume form (Personal Info, Education, Skills, Projects, Certificates, Languages) with a **live preview** and one-click **PDF export**
- **Portfolio Builder** — Build a shareable portfolio (Hero, About, Skills, Projects, Contact) with live preview
- **Templates** — Choose a resume layout
- **AI Resume Review** — Get an instant AI-generated score (Overall, Grammar, ATS Compatibility, Skills) and written feedback, powered by Google Gemini
- **Downloads** — Central place to revisit and re-download everything you've built
- **Settings** — Update profile details and change password
- **Dark Mode** — App-wide theme toggle, persisted across sessions
- **Notifications** — In-app notification center for key actions (resume saved, PDF downloaded, portfolio saved)
- **Responsive Design** — Sidebar collapses into a bottom navigation bar on mobile

---

## 🛠 Tech Stack

**Frontend**
- Angular (standalone components, Reactive Forms, SSR)
- TypeScript
- html2canvas + jsPDF (PDF generation)

**Backend**
- ASP.NET Core Web API
- Entity Framework Core
- JWT Bearer Authentication
- BCrypt (password hashing)

**Database**
- Microsoft SQL Server

**AI**
- Google Gemini API (resume review / scoring)

**Tools**
- Visual Studio (backend)
- Visual Studio Code (frontend)
- SQL Server Management Studio (SSMS)
- Postman (API testing)
- Git & GitHub (version control)

---

## 📸 Screenshots

> _Add screenshots here — Landing page, Login, Dashboard, Resume Builder, Portfolio Builder, AI Suggestions._

| Landing Page | Dashboard |
|---|---|
| _screenshot_ | _screenshot_ |

| Resume Builder | AI Suggestions |
|---|---|
| _screenshot_ | _screenshot_ |

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js and Angular CLI
- .NET SDK
- SQL Server + SQL Server Management Studio (SSMS)
- A free Gemini API key from [aistudio.google.com](https://aistudio.google.com)

### 1. Clone the repository
```bash
git clone https://github.com/amitbisht2406-cmd/fresh.git
cd fresh
```

### 2. Database setup
In SSMS, create the database:
```sql
CREATE DATABASE CareerForgeDB;
```

### 3. Backend setup
```bash
cd Backend/CareerForge.API
```
Update `appsettings.json` with your connection string:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=CareerForgeDB;Trusted_Connection=True;TrustServerCertificate=True"
}
```
Add your Gemini API key to `appsettings.Development.json`:
```json
"Gemini": {
  "ApiKey": "YOUR_GEMINI_API_KEY"
}
```
Run migrations and start the API:
```bash
dotnet ef database update
dotnet run
```

### 4. Frontend setup
```bash
cd Frontend/careerforge-ui
npm install
```
Update `src/environments/environment.ts` with your backend URL:
```typescript
export const environment = {
  apiUrl: 'https://localhost:<your-backend-port>/api'
};
```
Run the app:
```bash
ng serve
```
Visit `http://localhost:4200`

---

## 🚀 Future Scope

- Multiple resumes/portfolios per user, with the ability to switch between them
- Public, shareable portfolio links (no login required to view)
- AI-powered resume rewriting (not just scoring)
- AI career roadmap generator (skill-gap analysis + learning path)
- Multiple resume template designs with visual switching
- Push notifications (not just in-app)
- Production deployment with CI/CD

---

## 👤 Author

**Amit Singh Bisht**
GitHub: [@amitbisht2406-cmd](https://github.com/amitbisht2406-cmd)

Built as part of a TuxAcademy internship project.

---

## 📄 License

This project is for educational purposes as part of an internship submission.
