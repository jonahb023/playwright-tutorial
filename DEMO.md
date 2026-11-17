## Step 1: Codegen (~1 min)

**Do:** Run in the terminal:
```
npx playwright codegen http://localhost:3000
```

**Say:**
> "First, the easiest way in. Remember, nobody at this company has used a testing tool. Codegen records you using the app and writes the test for you."

**Do:** In the Codegen window, slowly fill in **Jane Doe / Amoxicillin / 500** and click **Submit prescription**.

**Say:**
> "Watch the window on the right. Every click and every field I type becomes a line of code. It's finding fields by their label, the same way a person reads the screen."

**Do:** Point at the green confirmation message.

**Say:**
> "Valid prescription, confirmation shows. A new hire could make this test on day one, then a developer adds the checks."

**Do:** Close both Codegen windows.

---

## Step 2: Class picks a drug and dose (~1.5 min)

**Do:** Open `tests/validation.spec.js` in VS Code.

**Say:**
> "Here's a test we wrote by hand. It enters a prescription and checks that the dose warning appears, and that the prescription does *not* go through. Someone give us a drug: Amoxicillin, Ibuprofen, Paracetamol, or Warfarin. And a dose."

**Do:** Change the values in `selectOption('...')` and `fill('...')`, save, then run:
```
npx playwright test validation
```

**Say:**
> "One command, and it runs in Chrome, Firefox, and Safari's engine at the same time."

**If 3 passed, say:**
> "Warning showed in all three browsers. That's a check that hospitals running different browsers would otherwise need a person to click through three times."

**If it failed (they picked a safe dose), say:**
> "It failed, because that dose is safe, so no warning showed up. The test is strict. It only passes if the exact thing we expect happens."

---

## Step 3: Break the dose check (~1 min)

**Do:** Set the test back to **Warfarin / 50** and save. Open `app/index.html` and on the Warfarin line change `data-max="10"` to `data-max="1000"`.

**Say:**
> "Now let's pretend a developer makes a mistake. Maybe a bad drug database update sets Warfarin's max to 1000 milligrams instead of 10. That's a dangerous bug, and nothing on the screen looks wrong."

**Do:** Save, then rerun:
```
npx playwright test validation
```

**Say:**
> "Red on all three browsers. The test tells us exactly what it expected and what it got. This is the main point: this runs on every code change, so the bug gets caught before it ships, not by a nurse."

**Do:** Press `Ctrl+Z` in `app/index.html` to put `data-max="10"` back, and save.
