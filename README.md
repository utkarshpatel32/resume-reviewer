# AI Resume Reviewer

A mobile-friendly resume review app with a React + Vite frontend and a Python FastAPI backend.

## What it does

- Upload a text-based PDF resume (up to 5 MB) or paste resume text.
- Generates an overall score out of 100.
- Reviews professional summary, skills, experience, projects, education, and formatting.
- Lists resume strengths and prioritised, actionable improvements.
- Optionally compares the resume with a job description and highlights matched / missing keywords.
- Uses Groq AI when `GROQ_API_KEY` is configured. Without a key, it uses a clearly labelled local demo review so the full interface can be tested.
- Does not store uploaded resumes or analysis results in a database.

> The score is an automated writing aid, not a hiring decision or a promise of ATS performance. Always verify suggested edits and never add skills or achievements that are not true.

## Requirements

- Python 3.10 or newer
- Node.js 18 or newer (Node.js 20 LTS recommended)
- npm
- A Groq API key for AI-powered reviews (optional for demo mode)

## 1. Backend setup

Open a terminal in the project folder:

```bash
cd backend
python -m venv .venv
```

Activate the environment:

**Windows PowerShell**

```powershell
.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, use Command Prompt instead:

```bat
.venv\Scripts\activate.bat
```

**macOS / Linux**

```bash
source .venv/bin/activate
```

Install packages:

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Create your local environment file:

**Windows PowerShell**

```powershell
Copy-Item .env.example .env
```

**macOS / Linux**

```bash
cp .env.example .env
```

Edit `backend/.env` and add your own Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-20b
```

Leave `GROQ_API_KEY` blank to run in demo mode. The example model is configurable through `GROQ_MODEL`; check Groq's supported-models page if you want to use another model.

Start the backend from the `backend` folder (do not run `main.py` directly; FastAPI is started by Uvicorn):

```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Backend health check: http://127.0.0.1:8000/api/health  
Interactive API docs: http://127.0.0.1:8000/docs

## 2. Frontend setup

Open a **second terminal** in the project folder:

```bash
cd frontend
npm install
npm run dev
```

Open the local address printed by Vite, normally:

http://localhost:5173

## 3. Windows quick start

You can also double-click `run_windows.bat` from the project root. It creates the backend virtual environment if needed, installs/verifies **all** backend requirements in that exact environment, installs frontend packages if needed, and opens separate terminals for the API and frontend.

**Important on Windows:** Do not use the VS Code **Run Python File** button on `backend/main.py`, and do not install packages with a standalone `pip install ...` command. VS Code, `uv`, and the Windows Python launcher can point to different Python installations. The launcher uses `backend\.venv\Scripts\python.exe` for both dependency installation and Uvicorn, so the packages and app run in the same environment.

## 4. Optional: change API address

The frontend defaults to `http://127.0.0.1:8000`. To use a different backend URL, create `frontend/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Restart the Vite development server after changing this file.

## 5. Publish the app online

See [DEPLOYMENT.md](DEPLOYMENT.md) for the deployment walkthrough. This project is designed to use Vercel for the React frontend and Render for the FastAPI backend. The backend CORS allowlist is configured with `ALLOWED_ORIGINS`, and the frontend API address is configured with `VITE_API_BASE_URL`.

## Project structure

```text
ai_resume_reviewer/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── run_windows.bat
├── .gitignore
└── README.md
```

## Notes and limitations

- PDF extraction uses selectable text. Scanned/image-only PDFs need OCR first; the app will ask you to paste text or use a text-based PDF.
- The API has a 5 MB PDF limit and a 45,000-character resume-text limit.
- The demo mode checks basic resume structure and performs a lightweight keyword scan. It is not an AI model and should only be used to test the workflow.
- The Groq key is read by the backend from `backend/.env`; never put it in frontend code, commit it to GitHub, or share it in screenshots.
- For deployment, configure HTTPS, restrict CORS to your own frontend domain, add rate limiting and authentication as appropriate, and review your AI provider's data-retention terms before processing real resumes.

## API

`POST /api/analyze` accepts multipart form fields:

- `file`: optional PDF file
- `resume_text`: optional resume text
- `job_description`: optional job description

Provide either `file` or `resume_text`.
