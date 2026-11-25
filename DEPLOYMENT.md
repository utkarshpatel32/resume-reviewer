# Publish AI Resume Reviewer (Vercel + Render)

This project uses a React/Vite frontend and a Python/FastAPI backend. Deploy them as two services: Vercel hosts the static frontend, and Render hosts the API.

## Before you start

- Create accounts at GitHub, Render, and Vercel.
- Make sure `backend/.env` is not committed. The repository `.gitignore` excludes `.env` files.
- Have your Groq API key ready. It belongs only in the Render backend environment, never in Vercel or frontend source code.

## 1. Push the project to GitHub

Open PowerShell in the main project folder (`ai_resume_reviewer`) and run:

```powershell
git init
git add .
git status
```

Check that `backend/.env` is NOT listed. If it appears, stop and remove it from the staging area before continuing. Then run:

```powershell
git commit -m "Prepare AI Resume Reviewer for deployment"
git branch -M main
```

Create an empty repository on GitHub, copy its HTTPS repository address, and connect it:

```powershell
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the example address with your actual GitHub repository URL.

## 2. Deploy the FastAPI backend on Render

1. Sign in at https://render.com/.
2. Choose **New +** → **Web Service** and connect the GitHub repository.
3. Set **Root Directory** to `backend`.
4. Set **Runtime** to `Python 3`.
5. Set **Build Command** to:

   ```bash
   pip install -r requirements.txt
   ```

6. Set **Start Command** to:

   ```bash
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

7. For a student demo, you may choose the Free plan if it is offered to your account. Free services can sleep when idle, so the first request after inactivity can be slow. For regular public use, choose an appropriate paid service plan.
8. Under **Environment Variables**, add:

   | Key | Value |
   |---|---|
   | `GROQ_API_KEY` | Your actual Groq API key |
   | `GROQ_MODEL` | `openai/gpt-oss-20b` |
   | `ALLOWED_ORIGINS` | Temporarily leave as `http://localhost:5173` until you have the Vercel URL; update it in step 4 |

9. Set the service **Health Check Path** to `/api/health` if the option is available.
10. Create the service and wait for the deploy to finish. Copy the Render service URL, for example `https://your-api-name.onrender.com`. Do not add `/api` to the end of the base URL.
11. Test this address in your browser:

   `https://YOUR-RENDER-SERVICE.onrender.com/api/health`

   It should return JSON with `"status": "ok"` and `"ai_enabled": true` when a valid Groq key is configured. If it says false, check the Render environment variable and redeploy/restart the service.

## 3. Deploy the React frontend on Vercel

1. Sign in at https://vercel.com/ and choose **Add New** → **Project**.
2. Import the same GitHub repository.
3. Set **Root Directory** to `frontend`.
4. Select the **Vite** framework preset if Vercel does not detect it automatically.
5. Use these build settings:

   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. Before deploying, add this environment variable in Vercel project settings:

   | Key | Value |
   |---|---|
   | `VITE_API_BASE_URL` | Your Render service base URL, e.g. `https://your-api-name.onrender.com` |

   Do not add `/api` to this value.
7. Deploy and copy the public Vercel URL, for example `https://your-app.vercel.app`.

## 4. Allow the Vercel website to call the Render API

Go back to Render → your backend service → **Environment**. Set:

```env
ALLOWED_ORIGINS=https://YOUR-APP.vercel.app
```

Use your exact Vercel production origin (scheme + hostname only; no path and no trailing slash). If you later add a custom domain, include it too, separated by a comma:

```env
ALLOWED_ORIGINS=https://YOUR-APP.vercel.app,https://www.yourdomain.com
```

Save the variable and redeploy/restart the Render service.

## 5. Test the complete live application

1. Open the Vercel public website.
2. Check that the header shows **AI ready** if the Groq key is configured.
3. Test with a non-sensitive sample resume first. Try both pasted text and a text-based PDF.
4. Test optional job-description matching.
5. Check the browser developer console and Render logs if requests fail.

## Important production notes

- Never put `GROQ_API_KEY` in a `VITE_` variable. Vite variables are exposed in the browser bundle. Keep the key only in Render's backend environment.
- Do not commit `.env` files, API keys, or real resumes to GitHub.
- The current app does not save resumes or review results in a database. However, when Groq analysis is enabled, resume text is sent to Groq. Review the provider's current privacy/data terms before inviting users to upload sensitive documents.
- This starter project has no user login or API rate limiting. Before sharing widely, add rate limiting/abuse controls and consider authentication and request quotas to protect the public endpoint and AI usage budget.
- Render Free web services spin down after inactivity and can take around a minute to wake up. A paid always-on plan is better for a smoother public demo.
- Keep the CORS allowlist restricted to your Vercel/custom website origin. Do not use `*` for a public app that accepts resume uploads.
