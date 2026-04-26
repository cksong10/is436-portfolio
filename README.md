# Chris Song - is436-portfolio

Personal portfolio website built with HTML, CSS, JavaScript, and Bootstrap 5.
Designed as an interaction designer's portfolio with a dark theme, animated background, and accessible color contrast.

---

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — intro, featured work, IS 436 skills |
| `about.html` | About Me — bio, education timeline, hobbies |
| `portfolio.html` | Work / Projects — all 6 IS 436 deliverables |
| `skills.html` | Skills & Resume — proficiency bars, competencies, resume download |
| `contact.html` | Contact — form with validation, map embed |

---

## Project Structure

```
portfolio/
├── index.html
├── about.html
├── portfolio.html
├── skills.html
├── contact.html
├── css/
│   └── styles.css
└── js/
    └── main.js
```

---

## Tech Stack

- **Bootstrap 5.3** — grid, components, utilities
- **Bootstrap Icons 1.11** — icon set
- **Google Fonts** — Outfit, DM Sans, JetBrains Mono
- **Vanilla JavaScript** — animations, form validation, canvas background
- **HTML5 / CSS3** — semantic markup, CSS custom properties

---

## Features

- Animated blob background (canvas) that responds to mouse position
- Scroll progress bar across the top
- Scroll-reveal animations on all sections
- Animated skill bars with shimmer effect
- 3D tilt + shine effect on buttons
- Card glow that follows the cursor
- Bootstrap form validation with inline error messages
- Success alert on form submission
- Google Maps embed (dark-filtered to match theme)
- Fully responsive — mobile, tablet, desktop

---

## IS 436 Projects Included

1. **System Requirements Document** — functional/non-functional requirements
2. **Use Case Diagrams** — UML modeling, user stories
3. **Data Flow Diagrams** — context-level and level-1 DFDs
4. **Entity-Relationship Diagram** — normalized database schema (3NF)
5. **Prototype / Mockup** — low-fidelity wireframes, usability testing
6. **Complete System Proposal** — full capstone report and presentation

---


## Deployment (GitHub Pages)

1. Push this folder to a GitHub repository
2. Go to **Settings → Pages**
3. Set source to `main` branch, root folder
4. Your site will be live at `https://yourusername.github.io/repo-name`

---

## Accessibility

- All contrast ratios meet WCAG 2.1 AA (4.5:1 body text, 3:1 UI elements)
- Semantic HTML with `aria-label` and `aria-labelledby` throughout
- Focus-visible outlines on all interactive elements
- Animations skip on touch devices via `(hover: hover)` media query

---

*IS 436 — Systems Design & Development · Spring 2026*
