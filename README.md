# Halosun Energy Systems — Website

A static website with a solar savings calculator and a lead capture form,
built to run entirely free on GitHub Pages.

## What's in here

```
index.html          → the whole site
css/styles.css       → all styling
js/calculator.js     → savings calculator logic (edit pricing assumptions here)
js/form.js            → lead form submission (paste your Apps Script URL here)
js/main.js            → mobile menu + footer year
apps-script/Code.gs   → backend script that emails you AND logs leads to a Sheet
assets/favicon.svg    → placeholder logo mark
```

---

## 1. What's already filled in

Your logo, phone, email, address and taglines from the visiting card are already
wired into the site:

- **Logo mark** — cropped from your card and saved as `assets/logo-mark-square.png`
  (header/footer) and `assets/logo-mark-wide.png` (hero). These are photo crops on
  a matched navy background, not a vector file — fine for web use at these sizes,
  but if you get a proper transparent-background logo file (AI/SVG/PNG) from your
  designer later, swap these two files out for a cleaner result at large sizes.
- **Contact details** — +91 92506 78826, contact.halosunenergy@gmail.com,
  743/7 Tilak Nagar, Raebareli, and proprietor Shishir Srivastava — all in the
  Contact section and footer.
- **Taglines** — "Design. Build. Power." in the hero, and "Design · Execute ·
  Energized" in the footer, matching the card.

Still worth doing:

- **Gallery photos** — the six tiles under "Projects" are placeholders. Replace them
  with `<img>` tags pointing at photos in `assets/` once you have installation
  photos to upload.
- **Calculator assumptions** — open `js/calculator.js` and adjust `CALC_CONFIG`:
  cost per kW, units generated per kW, and subsidy slabs. These are reasonable
  India-wide defaults but your actual installed cost will be more accurate.

---

## 2. Connect the lead form (free — email + Google Sheet)

The form posts to a small Google Apps Script that both **emails you** and
**logs the lead as a row in a Google Sheet** — one free endpoint does both.

1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank sheet.
   Name it something like "Halo Sun — Leads".
2. In row 1, add headers: `Timestamp | Name | Phone | Email | City | Property Type | Monthly Bill | Message`
3. In the Sheet, click **Extensions → Apps Script**.
4. Delete the placeholder code, and paste in the entire contents of `apps-script/Code.gs`.
5. At the top of the script, change `NOTIFY_EMAIL` to the inbox that should get lead alerts.
6. Click **Deploy → New deployment**, choose type **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy**, then approve the Google permissions prompt (it needs access to
   send email and edit the sheet — that's expected, since it's your own script).
8. Copy the **Web app URL** you're given.
9. Open `js/form.js` and paste that URL into `FORM_CONFIG.endpointUrl`, replacing the
   placeholder text.
10. Commit and push — the form is now live.

**Test it:** submit the form on your live site once, then check that a row appeared
in the Sheet and an email arrived. If not, in Apps Script check **Executions** (left
sidebar) to see the error.

If you ever edit `Code.gs` later, you need to create a new deployment version
(**Deploy → Manage deployments → Edit → New version**) for the change to take effect.

---

## 3. Publish it on GitHub Pages (free)

1. Create a new **public** GitHub repository, e.g. `halosun-website`.
2. Upload all the files in this folder to the repo (keep the folder structure —
   `css/`, `js/`, `apps-script/`, `assets/` should stay as subfolders).
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source** to `Deploy from a branch`, branch
   `main`, folder `/ (root)`. Save.
5. GitHub gives you a URL like `https://yourusername.github.io/halosun-website/`
   within a minute or two.

### Using your own domain (optional, costs only the domain itself)

1. Buy a domain (e.g. `halosunenergy.com`) from any registrar.
2. In the GitHub repo's **Settings → Pages**, enter it under "Custom domain."
3. At your domain registrar, add a `CNAME` record pointing to
   `yourusername.github.io`.
4. Wait for DNS to propagate (can take a few hours) and check "Enforce HTTPS"
   once it's available.

---

## 4. Local preview before publishing

You can just open `index.html` directly in a browser to preview it. For the
calculator this is fine; for the form, GitHub Pages or any local server works
the same since it's all client-side JavaScript talking to your Apps Script URL.

---

## Notes on the calculator

The estimator is intentionally simple and clearly labeled as an estimate, not a
quote — it assumes ~4 generation-hours/day and applies the current PM Surya Ghar
residential subsidy slabs. Update `CALC_CONFIG` in `js/calculator.js` whenever your
real installed costs or subsidy rules change, since government subsidy amounts
and your equipment pricing can shift over time.
