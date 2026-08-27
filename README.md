# Logic Agnostic — Hugo site

## Local setup
1. Install Hugo (extended version): https://gohugo.io/installation/
2. `hugo server -D` to preview locally at http://localhost:1313

## Publishing a new post
`hugo new content posts/my-post-title.md`
Edit the file in content/posts/, set draft: false when ready, fill in description/tags/featured_image/audio as needed.

## Deploy
- Push this repo to GitHub
- Enable GitHub Pages (or connect GitHub Actions — workflow to be added)
- Update baseURL in hugo.yaml to your real domain once DNS is connected

## Structure
- content/posts/     -> blog posts (Markdown)
- content/about/      -> about page
- static/images/      -> images referenced in posts
- static/audio/       -> audio files (small ones only — use archive.org for large files)
- layouts/            -> all page templates (custom-built, no external theme dependency)
- static/css/style.css -> the Matrix green-on-black look
