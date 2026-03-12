# How to Set Up the AI Safety App — Step by Step

> These instructions are written for someone who is NOT a developer.
> Follow them exactly, one step at a time. If something goes wrong, stop and ask Claude.

---

## What You Need Before Starting

- **Git** installed (you already have this since you use GitHub)
- **Node.js** installed (you already have this from Chronos)
- **Android Studio** installed (you already have this)
- **Claude Code** (the CLI tool you use)
- A terminal/command prompt open

---

## Step 1: Create a folder for the new project

Open your terminal (Command Prompt, PowerShell, or Git Bash on Windows).

Pick a location where you want the project. For example, next to your Chronos folder:

```bash
cd ~
```

This takes you to your home folder (e.g., `C:\Users\YourName` on Windows).

---

## Step 2: Clone the new repo

```bash
git clone https://github.com/ElsaDonnat/AI-Safety-.git
```

This creates a new folder called `AI-Safety-`. Now enter it:

```bash
cd AI-Safety-
```

---

## Step 3: Copy the Chronos source code into the new repo

You need to copy files from your Chronos project into this new folder. Replace `/path/to/Chronos_App` below with the **actual path** to your Chronos folder.

**On Windows (PowerShell):**

```powershell
# First, figure out your Chronos path. It might be something like:
# C:\Users\YourName\Chronos_App
# or wherever you cloned it. Let's call it $CHRONOS

$CHRONOS = "C:\Users\YourName\Chronos_App"   # <-- CHANGE THIS to your actual path

# Copy the source code folder
Copy-Item -Recurse "$CHRONOS\src" -Destination ".\src"

# Copy the public assets folder
Copy-Item -Recurse "$CHRONOS\public" -Destination ".\public"

# Copy the resources folder (app icons, splash screens)
Copy-Item -Recurse "$CHRONOS\resources" -Destination ".\resources"

# Copy the icons folder
Copy-Item -Recurse "$CHRONOS\icons" -Destination ".\icons"

# Copy the GitHub Actions deploy workflow
Copy-Item -Recurse "$CHRONOS\.github" -Destination ".\.github"

# Copy configuration files (one by one)
Copy-Item "$CHRONOS\index.html" -Destination ".\index.html"
Copy-Item "$CHRONOS\vite.config.js" -Destination ".\vite.config.js"
Copy-Item "$CHRONOS\capacitor.config.ts" -Destination ".\capacitor.config.ts"
Copy-Item "$CHRONOS\eslint.config.js" -Destination ".\eslint.config.js"
Copy-Item "$CHRONOS\package.json" -Destination ".\package.json"
Copy-Item "$CHRONOS\package-lock.json" -Destination ".\package-lock.json"
```

**On Windows (Git Bash) or Mac/Linux:**

```bash
# Set your Chronos path (CHANGE THIS to your actual path)
CHRONOS="/c/Users/YourName/Chronos_App"

# Copy folders
cp -r "$CHRONOS/src" ./src
cp -r "$CHRONOS/public" ./public
cp -r "$CHRONOS/resources" ./resources
cp -r "$CHRONOS/icons" ./icons
cp -r "$CHRONOS/.github" ./.github

# Copy config files
cp "$CHRONOS/index.html" ./index.html
cp "$CHRONOS/vite.config.js" ./vite.config.js
cp "$CHRONOS/capacitor.config.ts" ./capacitor.config.ts
cp "$CHRONOS/eslint.config.js" ./eslint.config.js
cp "$CHRONOS/package.json" ./package.json
cp "$CHRONOS/package-lock.json" ./package-lock.json
```

---

## Step 4: Copy the CLAUDE.md file

Copy the `CLAUDE.md` file that was prepared for you (it's in the `ai-safety-bootstrap/` folder in your Chronos repo):

**PowerShell:**
```powershell
Copy-Item "$CHRONOS\ai-safety-bootstrap\CLAUDE.md" -Destination ".\CLAUDE.md"
```

**Git Bash / Mac / Linux:**
```bash
cp "$CHRONOS/ai-safety-bootstrap/CLAUDE.md" ./CLAUDE.md
```

---

## Step 5: Create a .gitignore file

Create a file called `.gitignore` in the project root. You can do this by running:

**PowerShell:**
```powershell
@"
node_modules
dist
android
.DS_Store
*.local
"@ | Out-File -Encoding utf8 .gitignore
```

**Git Bash / Mac / Linux:**
```bash
cat > .gitignore << 'EOF'
node_modules
dist
android
.DS_Store
*.local
EOF
```

---

## Step 6: Install dependencies

This downloads all the packages the app needs:

```bash
npm install
```

Wait for it to finish. You might see some warnings — that's normal.

---

## Step 7: Verify it runs

```bash
npm run dev
```

This starts a local development server. Open the URL it shows (usually `http://localhost:5173`) in your browser. You should see **the Chronos app** — that's expected! We copied the whole thing, and Claude will transform it into the AI Safety app.

Press `Ctrl+C` in the terminal to stop the server.

---

## Step 8: Start Claude Code

Open Claude Code in the `AI-Safety-` directory:

```bash
claude
```

Then paste the prompt from `INITIAL_PROMPT.md` (the other file prepared for you).

---

## Step 9: After Claude finishes Phase 1

Claude will transform the app. When it's done:

1. Run `npm run dev` to verify the app works
2. Check that it looks like a new AI Safety app (not Chronos)
3. If everything looks good, tell Claude to commit and push

---

## Later: Setting up Android

When you're ready to test on Android:

1. Open Android Studio
2. Tell Claude to run the Capacitor setup (`npx cap init` and `npx cap add android`)
3. Claude will guide you through the rest — it knows the Capacitor workflow from Chronos
