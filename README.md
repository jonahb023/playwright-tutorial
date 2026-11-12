# Playwright Tutorial with Hospital Web Testing

**Repo:** https://github.com/jonahb023/hospital-web-testing  
**Tool:** [Playwright](https://playwright.dev) (JavaScript / Node.js) — free, open source, by Microsoft  
**Total time:** about 40 minutes

## What is this?

Playwright is a **web testing tool**: it opens a real browser (Chrome, Firefox, Safari's engine), clicks and types like a user, and checks that the page behaves correctly. Once a test is written, it can be rerun in seconds, every time the code changes.

This repo contains a small fake **hospital prescription form** (`app/index.html`). You will use Playwright to test it. No prior testing experience needed.

The form has: patient name, a drug dropdown (each drug has a maximum safe dose), a dose field, and a submit button.

| Drug | Max safe dose |
|---|---|
| Amoxicillin | 1000 mg |
| Ibuprofen | 800 mg |
| Paracetamol | 1000 mg |
| Warfarin | 10 mg |

- Empty fields → red warning: *"Warning: please fill in all fields."*
- Dose over the maximum → red warning: *"Warning: 50 mg exceeds the maximum safe dose of 10 mg for Warfarin."*
- Valid entry → green confirmation: *"Prescription submitted: 500 mg Amoxicillin for Jane Doe."*

## Repo layout

```
hospital-web-testing/
├── README.md             ← this handout
├── app/index.html        ← the sample prescription form
├── tests/starter.spec.js ← starter test (Exercise 1); your new tests go here too
├── solutions/            ← working answers for Exercises 2–4
├── package.json          ← project dependencies
└── playwright.config.js  ← Playwright settings (browsers, auto-starts the app)
```

---

## Prerequisites

| Software | Version | Get it |
|---|---|---|
| **Node.js** | LTS version 22 or newer (24 LTS recommended) | https://nodejs.org → "LTS" installer |
| **Git** | any recent (2.x) | https://git-scm.com/downloads |
| VS Code *(optional)* | any | https://code.visualstudio.com |

Also needed: about **1 GB free disk space** (for the test browsers).

**Opening a terminal**
- **Windows:** press Start, type `PowerShell`, open *Windows PowerShell*.
- **Mac:** press `Cmd + Space`, type `Terminal`, press Enter.

Check your installs (same on Windows and Mac):

```bash
node -v
```
```bash
git --version
```

You should see something like `v26.13.1` and `git version 2.47.0`. If you get "command not found" / "not recognized", install that program, then **close and reopen** the terminal.

---

## Setup 

Run these one at a time. They are the same on Windows and Mac.

**1. Download the repo**
```bash
git clone https://github.com/jonahb023/hospital-web-testing.git
```
```bash
cd hospital-web-testing
```

**2. Install Playwright and the other project tools** (reads `package.json`)
```bash
npm install
```

**3. Download the test browsers** (takes a few minutes)
```bash
npx playwright install
```
> **Linux only:** use `npx playwright install --with-deps` instead.

### Check if...

```bash
npx playwright --version
```
prints `Version 1.65.0` (or newer), **and** there were no red `Error` lines at the end of steps 2–3. Warnings (`npm warn …`) are fine.

---

## Exercise 1 — First test run

**Goal:** Run the provided starter test and view the report.

**Why this matters** A test that runs in seconds can be repeated after every code change and is far faster and more consistent than a person re-clicking through a drug database screen by hand.

**Steps**
1. Open `tests/starter.spec.js` and read it. It opens the form and checks the title, heading, and submit button exist.
2. Run it in Chrome only:
   ```bash
   npx playwright test --project=chromium
   ```
   Playwright starts the sample app on http://localhost:3000 by itself, runs the test, then stops the app.
3. Open the HTML report:
   ```bash
   npx playwright show-report
   ```
   A browser tab opens. Click the test name to see each step. Press `Ctrl + C` in the terminal to close the report server.

**Expected outcome**
```
  ✓  1 [chromium] › tests/starter.spec.js:5:1 › prescription form loads
  1 passed
```
The report shows 1 passed test (green).

---

## Exercise 2 — Record a test with Codegen

**Goal:** Create a test without writing code, by clicking through the form while Playwright records.

**Why this matters:** Staff who are new to testing can build tests for complex data-entry screens just by using them, then hand the recordings to developers to refine.

**Steps**
1. Start the app yourself:
   ```bash
   npm start
   ```
   Leave this terminal open. You should see `Available on:` followed by `http://127.0.0.1:3000`.
2. Open a **second** terminal, `cd` into the `hospital-web-testing` folder, and run:
   ```bash
   npx playwright codegen http://localhost:3000
   ```
   Two windows open: a browser showing the form, and the **Playwright Inspector** showing code.
3. In the test browser window, fill in a **valid** prescription, something like this:
   - Patient name: `Jane Doe`
   - Drug: `Amoxicillin`
   - Dose: `500`
   - Click **Submit prescription**
4. Add a check: in the small toolbar at the top of the browser window, click **Assert text** (the icon with "ab"), then click the green confirmation message, then click the checkmark to accept. This adds an `expect(...)` line.
5. In the Inspector window, click the **Copy** button.
6. In VS Code (or any editor), create a new file `tests/recorded.spec.js`, paste, and save.
7. Close the Codegen windows. In the second terminal, replay your test:
   ```bash
   npx playwright test recorded --project=chromium
   ```
8. Go back to the first terminal and press `Ctrl + C` to stop the app.

**Expected outcome**
- Your file looks similar to `solutions/ex2-recorded.spec.js` (selectors may differ slightly — that's fine).
- Terminal shows: `1 passed`.

---

## Exercise 3 — Write a validation test, run on 3 browsers

**Goal:** Write a test by hand that proves an **unsafe dose is blocked**, then run it on Chromium, Firefox, and WebKit (Safari's engine).

**Why this matters** A rule-based prescribing system has to reject dangerous doses. An automated test guarantees this safety rule still works after every change, in every browser the hospital uses.

**Steps**
1. Create a new file `tests/validation.spec.js` and paste:
   ```js
   const { test, expect } = require('@playwright/test');

   test('unsafe Warfarin dose shows a warning', async ({ page }) => {
     await page.goto('/');

     // Fill the form with a dose above Warfarin's 10 mg limit
     await page.getByLabel('Patient name').fill('John Smith');
     await page.getByLabel('Drug').selectOption('Warfarin');
     await page.locator('#dose').fill('50');
     await page.getByRole('button', { name: 'Submit prescription' }).click();

     // The warning must appear, and the prescription must NOT be accepted
     const alert = page.getByRole('alert');
     await expect(alert).toBeVisible();
     await expect(alert).toContainText('exceeds the maximum safe dose of 10 mg');
     await expect(alert).not.toContainText('Prescription submitted');
   });
   ```
2. Save, then run it on **all three browsers** (no `--project` flag = all browsers):
   ```bash
   npx playwright test validation
   ```
3. **Try breaking it (optional, 1 min):** change `'50'` to `'5'` and rerun. The test should now **fail**, because 5 mg is safe and no warning appears. Change it back to `'50'`.

**Expected outcome**
```
  ok  [chromium] › tests/validation.spec.js › unsafe Warfarin dose shows a warning
  ok  [firefox]  › tests/validation.spec.js › unsafe Warfarin dose shows a warning
  ok  [webkit]   › tests/validation.spec.js › unsafe Warfarin dose shows a warning
  3 passed
```
Answer: `solutions/ex3-validation.spec.js`.

---

## Exercise 4 — Accessibility scan with axe-core 

**Goal:** Automatically scan the form for accessibility problems, find the **one planted bug**, fix it, and confirm the fix.

**Why this matters** Clinicians and patients include people using screen readers. An unlabeled dose field means a blind user can't tell what to type — a usability and patient-safety risk, and a legal compliance issue.

**Steps**
1. Create a new file `tests/accessibility.spec.js` and paste:
   ```js
   const { test, expect } = require('@playwright/test');
   const { AxeBuilder } = require('@axe-core/playwright');

   test('prescription form has no accessibility violations', async ({ page }) => {
     await page.goto('/');

     // Scan the page against legal rules
     const results = await new AxeBuilder({ page })
       .withTags(['wcag2a', 'wcag2aa'])
       .analyze();

     // Print what axe found
     console.log(`Violations found: ${results.violations.length}`);
     for (const v of results.violations) {
       console.log(`- ${v.id}: ${v.help}`);
       v.nodes.forEach((n) => console.log(`    element: ${n.html}`));
     }

     expect(results.violations.length).toBe(0);
   });
   ```
2. Run it:
   ```bash
   npx playwright test accessibility --project=chromium
   ```
   **Expected: the test FAILS** — this is correct, it found the bug:
   ```
   Violations found: 1
   - label: Form elements must have labels
       element: <input id="dose" name="dose" type="number" min="0">
   ...
   Expected: 0
   Received: 1
   1 failed
   ```
3. Fix the bug. Open `app/index.html` and find this line (line 40):
   ```html
   <span>Dose (mg)</span>
   ```
   The text *looks* like a label but isn't connected to the input. Replace it with:
   ```html
   <label for="dose">Dose (mg)</label>
   ```
   Save the file.
4. Rerun:
   ```bash
   npx playwright test accessibility --project=chromium
   ```

**Expected outcome**
- Before fix: **1 violation** (`label`), `1 failed`.
- After fix: `Violations found: 0`, `1 passed`.

Answer: `solutions/ex4-accessibility.spec.js`.

---

## Final check (optional)

Run every test on every browser:
```bash
npx playwright test
```
After finishing all four exercises: **12 passed** (4 test files × 3 browsers).

## Troubleshooting

| Problem | Fix |
|---|---|
| `node` / `npm` / `git` "is not recognized" or "command not found" | Install it (see Prerequisites), then **close and reopen** the terminal. |
| **Windows:** `npx : File ...\npx.ps1 cannot be loaded because running scripts is disabled` | Run once: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` and answer `Y`. Or use *Command Prompt* instead of PowerShell. |
| `Executable doesn't exist at ...` / "Looks like Playwright was just installed or updated" | Browsers aren't downloaded. Run `npx playwright install`. |
| `npx playwright install` fails / times out | Check internet; on a school/hospital network a firewall may block `cdn.playwright.dev` — try another network. Rerun the command (it resumes). |
| `Error: http://localhost:3000 is already used` or `EADDRINUSE` | Something is already on port 3000 (often a leftover `npm start`). Close it with `Ctrl + C`, or kill it: **Mac:** `lsof -ti :3000 \| xargs kill` · **Windows (PowerShell):** `Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force` |
| `Error: No tests found` | You're in the wrong folder (run `cd hospital-web-testing`), or the file name doesn't end in `.spec.js`, or it isn't inside `tests/`. |
| Codegen: page shows "This site can't be reached" | You forgot step 1 of Exercise 2 — run `npm start` in another terminal first. |
| Test times out at `page.goto` | Same as above for Codegen tests; for others, check nothing else is using port 3000. |
| `Cannot find module '@playwright/test'` or `'@axe-core/playwright'` | Run `npm install` inside the `hospital-web-testing` folder. |
| Accessibility test still fails after fixing | Make sure you saved `app/index.html` and that `for="dose"` exactly matches the input's `id="dose"`. |
| Linux: browser fails with missing library errors | `npx playwright install --with-deps` |

## Useful commands

| Command | What it does |
|---|---|
| `npx playwright test` | Run all tests, all browsers |
| `npx playwright test --project=chromium` | Run in Chrome only |
| `npx playwright test validation` | Run only files whose name contains "validation" |
| `npx playwright test --headed` | Watch the browser while tests run |
| `npx playwright test --ui` | Interactive UI mode — step through tests visually |
| `npx playwright show-report` | Open the last HTML report |
| `npm start` | Serve the sample app at http://localhost:3000 |
