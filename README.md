# AI-Powered Resume Builder (End-to-End Project)

An advanced, premium-tier AI-powered Resume Builder application built with a Python FastAPI backend orchestrating a multi-agent **CrewAI** workflow (featuring Gemini and OpenAI LLM models) and a modern **React.js** responsive dashboard frontend.

---

## 🚀 Key Features

### Phase 1: AI Resume Generation (CrewAI Workflow)
- **Resume Writer Agent**: Tailors student profiles to target job descriptions, refining bullet points with active verbs and impact metrics.
- **ATS Compliance Auditor Agent**: Simulates modern Applicant Tracking Systems, outputting keyword alignment and formatting reports.
- **Career Coach Agent**: Audits skills gaps, suggests online courses/certifications, and drafts a 3-month roadmap.
- Outputs are saved automatically to the `/output` folder:
  - `resume.md`
  - `ats_report.md`
  - `improvement_plan.md`

### Phase 2: React Dashboard Interface
- **Premium Light/Dark Mode**: Tailored dark blue UI palette with responsive sidebar navigation.
- **Resume Generation Studio**: Offers Drag & Drop file uploads for profile and job description `.txt` files.
- **ATS Compliance Hub**: Features an animated circular score gauge, keyword audit checklist, and rating highlights.
- **Career Coach Panel**: Displays skills gaps alongside a visual vertical 3-month roadmap timeline.
- **Mock Login Screen**: Elegant mock authentication screen with pre-filled test credentials for evaluation.

### Phase 3: AI Job Search
- **Simulated LinkedIn Job Search**: Matches target keywords against an live vacancy list.
- **Relevance Scoring**: Dynamically calculates a match percentage score based on skills overlay.
- **Filters & Sorting**: Sort jobs by relevance or title, and filter by locations (e.g. Remote, NY, SF) and experience levels (e.g. Junior, Internship, Mid, Senior).

### 🌟 Bonus Features
- **Cover Letter Writer**: Tailors professional letters to the target position.
- **LinkedIn About Section**: Drafts professional LinkedIn profiles.
- **Interactive Interview Prep**: Generates mock technical and behavioral Q&A inside clickable accordion folders.
- **Document Exporting Engine**: Converts generated Markdown resume or cover letters into **PDF** and **Word (DOCX)** documents directly from the dashboard.

---

## 📂 Project Structure

```
ai_resume_builder/
├── main.py                     # FastAPI backend endpoints & export routes
├── agents.py                   # CrewAI Agent definitions
├── tasks.py                    # CrewAI Task definitions
├── crew.py                     # Crew orchestration setup
├── requirements.txt            # Python dependencies
├── README.md                   # Setup documentation
├── inputs/                     # Sample input profile and job files
│   ├── student_profile.txt
│   └── job_description.txt
├── output/                     # Saved generated markdown files
│   ├── resume.md
│   ├── ats_report.md
│   └── improvement_plan.md
└── resume-builder-ui/          # Vite-React frontend application
    ├── src/
    │   ├── components/         # Page components (Auth, ResumeStudio, JobSearch, etc.)
    │   ├── App.jsx             # Main dashboard controller
    │   ├── index.css           # Premium vanilla CSS styling system
    │   └── main.jsx
    └── package.json            # Frontend packages & build scripts
```

---

## 🛠️ Installation & Setup

### Prerequisites
- **Python 3.12** (Stable release recommended due to CrewAI binary wheels dependencies)
- **Node.js (LTS)** and **npm**

---

### Step 1: Backend Setup
1. Open a terminal in the root project folder:
   ```bash
   cd "Resume Builder"
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   # On Windows (PowerShell):
   .\.venv\Scripts\Activate.ps1
   # On macOS/Linux:
   source .venv/bin/activate
   ```
3. Upgrade pip and install requirements:
   ```bash
   python -m pip install --upgrade pip
   python -m pip install -r requirements.txt
   ```
4. Create a `.env` file in the root folder and add your LLM API keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   *(Note: You can also supply the API key directly through the React UI input fields for convenience).*

5. Start the backend FastAPI server:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```
   The API will be available at `http://localhost:8000`. You can inspect endpoints in the interactive docs at `http://localhost:8000/docs`.

---

### Step 2: Frontend Setup
1. Open a new terminal in the `resume-builder-ui` folder:
   ```bash
   cd resume-builder-ui
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React local development server:
   ```bash
   npm run dev
   ```
4. Access the web dashboard in your browser at `http://localhost:5173`.

---

## 📑 Sample Input Files
We have pre-filled sample text files in `/inputs` for testing:
1. `inputs/student_profile.txt`: Sample profile for Jane Doe (State University graduate, Software engineering internship, React/Python skills).
2. `inputs/job_description.txt`: Sample target role for a Junior Full Stack Developer vacancy at InnovateTech Systems.

You can drag and drop these files directly into the **Resume Studio** upload card or copy-paste their text contents.

---

## ⚡ Build & Verification
To test build correctness of the React client:
```bash
npm run build
```
The output assets will be generated in `resume-builder-ui/dist/` without linting or bundler warnings.
