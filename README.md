# A Walk with Logic — Operations Manual

This is the reference for keeping the site running and publishing new posts, without needing to think like a developer. Written so you (or Claude, in a future session) can follow it without re-deriving anything.

---

## 1. The division of labor

- **You** write and edit everything in Google Docs, exactly as you already do. All creative decisions, all copy, are yours.
- **Claude** handles frontmatter formatting, file creation, troubleshooting, and any structural/technical changes. Claude does not write or invent site copy unless given exact text and placement.

---

## 2. Publishing a new post — the recurring workflow

**Step 1 — Finish writing in Google Docs**, as usual.

**Step 2 — Export**: File → Download → Markdown (.md). This keeps your normal writing process untouched; it's just the final export format.

**Step 3 — Get it converted into a post file.** Paste the exported text to Claude along with:
- Title
- Whether it's **script** format (dialogue with speaker names) or **prose**
- Any audio file (see Section 4)
- Any tags you want
- Whether it should ever become the **featured** post (see Section 5)

Claude will build the complete Markdown file with correct frontmatter, matching the pattern of the six launch posts already in `content/posts/`.

**Step 4 — Get the file onto GitHub using GitHub Desktop** (not the website's drag-and-drop upload — that method proved unreliable during launch and lost files/folder structure repeatedly):
1. Open GitHub Desktop
2. Make sure you're on the `a-walk-with-logic` repository
3. Copy the new post's `.md` file into the local repo folder, inside `content/posts/`
4. GitHub Desktop will show it under "Changed files"
5. Type a short summary (e.g. "Add [post title]")
6. Click **"Commit to main"**, then **"Push origin"**

**Step 5 — Wait for the build.** GitHub Actions rebuilds the site automatically within about a minute of every push. Check the **Actions** tab on GitHub — a green checkmark means it's live.

**Step 6 — If it's dated for the future**, it won't appear until that date/time passes *and* the next scheduled rebuild runs. The site rebuilds automatically once daily. If you don't want to wait, trigger it manually: **Actions tab → "Build and deploy site" → "Run workflow" button.**

---

## 3. Frontmatter reference

Every post file starts with a block like this:

```
---
title: "Post Title Here"
date: 2026-09-10T16:00:00-07:00
description: "One sentence description, shown in previews and search results."
tags: ["chapter 2"]
format: "script"
featured: false
audio_file: "some-filename.mp3"
---
```

- **date** — controls both ordering and whether it's "published" yet. Format must be exact: `YYYY-MM-DDTHH:MM:SS-07:00` (the `-07:00` is Pacific time; stays the same except during daylight saving changes, which Claude can flag if relevant).
- **format** — `"script"` triggers bold centered speaker names and italicized stage directions automatically. `"prose"` leaves formatting plain.
- **featured** — `true` for the one permanent front-door post (currently TPfF). Only one post should ever have this set to `true` at a time.
- **audio_file** — just the filename (e.g. `chapter2-segment1-doggy-standoff.mp3`), not a full URL. The site automatically builds the full link using the R2 base URL already set in `hugo.yaml`.
- **tags** — optional, shown under the post title and linkable into the search page.

---

## 4. Publishing audio

1. Send the audio file (WAV or MP3) to Claude — Claude will convert it to a clean MP3 with proper metadata if needed.
2. Upload the MP3 to the Cloudflare R2 bucket (`awwl-audio`): **Cloudflare dashboard → R2 → awwl-audio → Objects → Upload.**
3. Use the **exact same filename** as the post's `audio_file` frontmatter field.
4. That's it — no code changes needed per post, since the base URL is already configured once in `hugo.yaml`.

---

## 5. Changing the featured post

The featured post is permanent until manually changed — it does not rotate automatically.

To swap it:
1. In the old featured post's file, change `featured: true` to `featured: false`
2. In the new post's file, change `featured: false` to `featured: true`
3. Commit and push both changes together

---

## 6. Release schedule

New posts publish every **2 weeks, Thursdays, 4:00 PM Pacific**. As of launch (Aug 27, 2026), the schedule runs:

| Date | Post |
|---|---|
| Aug 27, 2026 | TPfF (featured) + Praise Humans (launch pair) |
| Sep 10, 2026 | Doggy Standoff |
| Sep 24, 2026 | Words Evolve |
| Oct 8, 2026 | I Like People in Small Groups |
| Oct 22, 2026 | Just Asking Questions |

After Oct 22, new pieces continue on the same cadence as you provide them.

---

## 7. Where everything lives

| Thing | Where |
|---|---|
| Site code | GitHub — `logicagnostic/a-walk-with-logic` |
| Live site | `logicagnostic.com` |
| DNS / Analytics / Audio storage | Cloudflare dashboard (`dash.cloudflare.com`) |
| Domain registrar | Hover (registration only; DNS is managed via Cloudflare) |
| Payment | Ko-fi (`ko-fi.com/logicagnostic`) |
| Email signups | A Google Sheet, connected via Google Apps Script |
| Analytics | Cloudflare → Analytics → Web Analytics |

---

## 8. Things that run automatically — no action needed

- Site build & deploy (GitHub Actions, on every push + once daily)
- SSL / HTTPS (Cloudflare + GitHub Pages)
- Analytics tracking (Cloudflare, automatic injection)
- Email collection (Google Apps Script → Sheet)
- Sitemap / RSS feed generation (Hugo)

---

## 9. Known quirks worth remembering

- **GitHub's web "Add file → Upload files" is unreliable** for multi-file/folder uploads — it can flatten folder structure or silently skip folders like `.github` that start with a dot. **Use GitHub Desktop for any file changes involving folders.** Editing a single existing file directly on GitHub's website (via the pencil/edit icon) is fine and reliable.
- **Browser caching**: after a fix goes live, if it doesn't appear to work, try a hard refresh (Ctrl+Shift+R / Cmd+Shift+R) before assuming something's broken.
- **Google Apps Script deployments**: editing the script's code does *not* update the live URL automatically — you must redeploy via **Deploy → Manage deployments → edit (pencil) → New version → Deploy**, or it creates a *new* separate URL rather than updating the existing one. Always double check the Web app URL matches what's in `hugo.yaml` after any script change.

---

## 10. If something breaks

Check **GitHub → Actions tab** first. A red X means the last change broke the build — click into it, then into the failed "build" step, and it'll show the specific error line. Common causes so far have been: a missing closing `{{ end }}` tag in a template file, or an incorrectly formatted YAML line in `hugo.yaml`. Paste the error to Claude in a new conversation; the site's full history and structure can be explained from context.
