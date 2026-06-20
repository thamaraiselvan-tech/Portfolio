# 🌌 Premium Interactive Portfolio — Cyberpunk Edition (v3.6)

Welcome to your personal portfolio project! This repository contains a premium, highly interactive, and visually stunning developer portfolio. It is styled with a sleek cyberpunk-neon aesthetic, featuring custom-curated dark/light themes, 3D perspective tilt animations, scroll parallax, an interactive particle constellation canvas, custom cursors, a circular logo navbar, and an achievements grid popup modal.

This guide provides a detailed walkthrough of every single section, highlighting exactly which files, lines, and attributes you need to modify to customize the content and behaviors.

---

## 📁 1. Project Directory Structure

Your portfolio is built using standard, framework-free web technologies (**HTML5**, **Vanilla CSS**, and **Vanilla JS**). This keeps loading times instantaneous and modifications extremely simple.

```
portfolio/
├── index.html          # Main HTML structure (all content & sections)
├── css/
│   └── style.css       # Complete design system, theme variables, animations, layouts
├── js/
│   └── main.js         # Interactive particles canvas, custom cursor, modal JSON parser, EmailJS
├── assets/             # Media and images (headshots, project banners, logos)
│   ├── loader-logo.png # Circular portrait logo shown in the loading screen and navbar
│   ├── hero-portrait.png # Transparent portrait of yourself for the Hero section
│   └── about-portrait.jpg # Squared portrait of yourself for the About Me section
└── README.md           # This comprehensive guide
```

---

## ⚡ 2. Global Styling & Core Design System

All layout settings, borders, typography, and colors are defined dynamically in [css/style.css](file:///d:/portfolio/css/style.css).

### Modifying Fonts
At the top of the stylesheet (lines 12–18), the global fonts are imported:
```css
:root {
  --font: 'Inter', sans-serif;
  --mono: 'JetBrains Mono', monospace;
  --transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```
* **To change the main font**: Modify the `--font` variable.
* **To change the code/accent font**: Modify the `--mono` variable.
* *Note: If using a new Google Font, update the font `<link>` tags in the `<head>` of [index.html](file:///d:/portfolio/index.html).*

### Customizing Theme Colors
The design supports both Dark Mode and Light Mode, toggled automatically by the navbar button. Edit these values in [style.css](file:///d:/portfolio/css/style.css) to change colors:

| Theme Attribute | Dark Mode Variables (`[data-theme="dark"]`) | Light Mode Variables (`[data-theme="light"]`) | Description |
| :--- | :--- | :--- | :--- |
| **Primary Background** | `--bg: #060610;` | `--bg: #f6f6fc;` | The main background color |
| **Secondary Background** | `--bg-2: #0a0a18;` | `--bg-2: #ffffff;` | Used for alternating sections |
| **Card Background** | `--bg-card: rgba(10, 10, 28, 0.88);` | `--bg-card: rgba(255, 255, 255, 0.92);` | Semi-transparent card styling |
| **Primary Text** | `--text: #e8e8f4;` | `--text: #0e0e20;` | Default readable copy |
| **Primary Accent Color**| `--accent: #00d4ff;` | `--accent: #6366f1;` | Highlights, badges, active states |
| **Secondary Accent** | `--accent-2: #a855f7;` | `--accent-2: #8b5cf6;` | Gradients, border highlights |
| **Glow Effect** | `--glow: 0 0 30px rgba(0, 212, 255, 0.2);` | `--glow: 0 0 30px rgba(99, 102, 241, 0.12);` | Shadow/bloom intensity |

---

## 🔄 3. Preventing Browser Caching (Cache Busting)

When editing files locally and deploying online, modern web browsers often cache stylesheet and JavaScript files. This means your visitors might not see color or script changes immediately.

To prevent this, we use **cache-busting query strings** on file imports. Inside [index.html](file:///d:/portfolio/index.html):
* **Stylesheet import**: `<link rel="stylesheet" href="css/style.css?v=3.6"/>`
* **JavaScript import**: `<script src="js/main.js?v=3.6"></script>`

> [!TIP]
> **Action required when updating style.css or main.js**: Change the version query suffix (e.g. change `?v=3.6` to `?v=3.7`) in both lines inside [index.html](file:///d:/portfolio/index.html). If you do not see updates locally, press **Ctrl + F5** (Windows) or **Cmd + Shift + R** (Mac) to force-reload your browser.

---

## ✏️ 4. Detailed Section Customization Guide

### 🎬 4.1 Loader Logo
The loading screen features a split-curtain animation, an SVG loading ring, progress percentage tracking, and an animated logo.

* **Replacing the Loader Image**: The loader logo is fetched from `assets/loader-logo.png`. To use a different portrait image or company logo:
  1. Prepare a square image (e.g., 500x500 pixels, preferably transparent PNG).
  2. Overwrite the file at `assets/loader-logo.png` with your new image.
* **Modifying Loader Brand Styles**:
  In [style.css](file:///d:/portfolio/css/style.css), you can tweak size, animations, and shadows of the circular loader logo:
  ```css
  .loader-brand-img {
    width: 120px;      /* Image diameter */
    height: 120px;
    animation: logo-pulse 2s ease-in-out infinite; /* Breath pulse */
  }
  ```

### 🎬 4.2 Hero Section (Home)
The top section includes particle constellations, animated background mesh blobs, scrolling stats counters, and typing roles.

#### Editing Text, Badges & Social Links
In [index.html](file:///d:/portfolio/index.html):
* **Available Status Badge** (lines 84–87): Edit `Available for opportunities` to change your status badge.
* **Main Titles** (lines 88–91): Edit the text inside the `<h1>` blocks. Keep the `gradient-text` class for the neon highlight.
* **Sub-description** (line 93): Update your bio summary text.
* **Resume Link** (line 97): Replace `#` with the link to your Google Drive resume or local file (e.g., `assets/Resume.pdf`).

#### Customizing the Typing Subtitle
In [js/main.js](file:///d:/portfolio/js/main.js) (lines 320–321):
```javascript
const roles = ['AI & DS Student', 'Aspiring Full Stack Developer', 'AI Enthusiast', 'Problem Solver'];
```
* **Modification**: Add, delete, or replace strings in the `roles` array. The typing script automatically loops through them, backspaces, and cycles indefinitely.

#### Changing the Portrait Image
Your profile portrait photo in the Hero section is active and fetched from [assets/hero-portrait.png](file:///d:/portfolio/assets/hero-portrait.png). To update it in the future:
1. Prepare a new transparent background image of yourself (500x500 pixels is recommended).
2. Save it as `hero-portrait.png` inside the `assets` folder (overwriting the existing one).
3. If you want to change styling backdrops, edit the `.portrait-img` rules in [style.css](file:///d:/portfolio/css/style.css) (where a responsive radial glow is applied).

#### Scrolling Stats Counters
In [index.html](file:///d:/portfolio/index.html) (lines 99–103):
```html
<div class="stat"><span class="stat-number" data-count="3" data-suffix="+">0</span><span class="stat-label">Projects</span></div>
```
* **How to change**: Change `data-count` to the integer value you want to count up to. Change `data-suffix` to append symbols like `+` or `%`. Change the inner text inside the `.stat-label` span. The JavaScript counter animates this automatically when scrolled into view.

---

### 👤 4.3 About Me Section
This contains a structured grid detailing your education focus, career targets, and key interest tags.

* **About Image**: Your profile portrait photo in the About section is active and fetched from [assets/about-portrait.jpg](file:///d:/portfolio/assets/about-portrait.jpg). To update it in the future, simply overwrite the file at `assets/about-portrait.jpg` with a new photo (the container handles sizing automatically).
* **Personal Copy** (lines 134–137): Modify the paragraphs to match your voice. Add details about your current B.Tech studies, college name, and target companies.
* **Interest Tags** (lines 138–144): Copy and paste `<span class="interest-tag">...</span>` elements. Customize the text and emoji inside to showcase your specific interests (e.g., `🤖 AI`, `📊 Data Analytics`).

---

### 🎟️ 4.4 Scrolling Text Marquee
A fast, continuous text banner separating About Me and Skills.
In [index.html](file:///d:/portfolio/index.html) (lines 151–164):
* **Customization**: Keep the duplicate spans inside `.marquee-track` identical. If you change a phrase, make sure to change its duplicates so the infinite horizontal scroll doesn't glitch when looping.

---

### 📊 4.5 Skills Section
Skills are organized as cards using a modern grid.
In [index.html](file:///d:/portfolio/index.html) (lines 174–195):
* **To add a Skill Category (Card)**: Copy any `.skill-card` block and paste it inside `.skills-grid`.
* **Card Structure**:
  ```html
  <div class="skill-card glow-card shine-card animate-on-scroll">
    <div class="skill-card-header">
      <div class="skill-icon">🎨</div> <!-- Emoji icon -->
      <h3>Frontend</h3>              <!-- Category title -->
    </div>
    <div class="skill-tags">
      <span class="skill-tag">HTML5</span> <!-- Tag items -->
      <span class="skill-tag">CSS3</span>
    </div>
  </div>
  ```
* **Adding Specific Skills**: Simply insert `<span class="skill-tag">SkillName</span>` inside the `.skill-tags` container of that card.

---

### 💻 4.6 Projects Section
Displays project cards with image overlays, tech tags, and 3D card tilt behaviors.
In [index.html](file:///d:/portfolio/index.html) (lines 207–247):

#### Adding a Project Card
To add a new project, copy an existing project card and customize it:
```html
<div class="project-card glow-card shine-card animate-on-scroll" data-tilt>
  <div class="project-image">
    <!-- Inline gradient backdrops can represent projects, or use img tags -->
    <div class="project-image-placeholder" style="background:linear-gradient(135deg,#00d4ff,#6366f1)">📄</div>
    <div class="project-overlay"><a href="GITHUB_LINK" target="_blank" class="project-link">🔗</a></div>
  </div>
  <div class="project-info">
    <span class="project-number">04</span> <!-- Incremental numbering -->
    <h3>Project Name</h3>
    <p>Brief summary describing the project, tech solutions, and outcomes.</p>
    <div class="project-tech"><span>Python</span><span>FastAPI</span></div>
    <a href="GITHUB_LINK" target="_blank" class="project-btn">View Code →</a>
  </div>
</div>
```
* **Interactive 3D Tilt**: The script looks for the `data-tilt` attribute on the card. By adding `data-tilt` to the element, the interactive 3D perspective mouse hover is applied automatically.

---

### 💼 4.7 Experience & Education Sections
Chronological vertical timelines tracking internships and academics.
In [index.html](file:///d:/portfolio/index.html) (lines 251–294):
* **Adding a Timeline Entry**: Copy a `.timeline-item` block and paste it inside the respective `.timeline` parent.
* **Customizing**:
  ```html
  <div class="timeline-item">
    <div class="timeline-dot">💼</div> <!-- Emoji representing the milestone -->
    <div class="timeline-content">
      <span class="timeline-date">Summer 2026</span> <!-- Date range -->
      <h3>Role or Degree Title</h3>
      <h4>Company or Institution Name</h4>
      <p>Description of duties, learnings, or grades achieved.</p>
      <!-- Optional: Add tags container inside the timeline body -->
      <div class="timeline-tags"><span>AWS</span><span>DevOps</span></div>
    </div>
  </div>
  ```

---

### 🏆 4.8 Achievements & Certifications (Dynamic Grid Modal Popup)
This is an advanced section. Clicking on an Achievement card pops open a modal displaying details, highlights, and a structured grid gallery of certificates/projects.

#### HTML Configuration (Data Attributes)
In [index.html](file:///d:/portfolio/index.html) (lines 304–337):
Instead of writing separate modals for each card, the card values are stored in HTML custom `data-*` attributes. The JavaScript in [js/main.js](file:///d:/portfolio/js/main.js) reads these attributes on click and builds the modal dynamically.

| Attribute | Purpose | Value Example |
| :--- | :--- | :--- |
| `data-icon` | Modal icons and graphics | `"🏆"` or `"📜"` |
| `data-title` | Header title of the popup | `"Hackathon Participation"` |
| `data-date` | Dates displayed in modal subtitle | `"2024 – Present"` |
| `data-description` | Main descriptive paragraph text | `"Actively participating in national hackathons..."` |
| `data-image` | Background gradient of the modal graphic header | `"linear-gradient(135deg,#6366f1,#e040fb)"` |
| `data-grid` | JSON array of child certificates (Optional) | `'[{"title": "A", "desc": "B", "icon": "📜", "bg": "..."}]'` |

#### Configuring the `data-grid` JSON (Certificates Gallery)
The `data-grid` attribute allows you to display a grid of accomplishments/certificates inside the popup. It expects a **valid JSON array of objects**.

> [!WARNING]
> **JSON Formatting Warning**: HTML data attributes are wrapped in single quotes (`'`), while the JSON keys and string values inside **must** be wrapped in double quotes (`"`). Do not use single quotes inside the JSON string or it will break parsing.

Here is an example format to copy and modify:
```html
data-grid='[
  {
    "title": "Smart India Hackathon 2024",
    "desc": "National finalist certificate for MindShield AI manipulation detector.",
    "icon": "🏆",
    "bg": "linear-gradient(135deg,#6366f1,#e040fb)"
  },
  {
    "title": "College Hackathon 2025",
    "desc": "First prize certificate for DocFy AI verification tool.",
    "icon": "💻",
    "bg": "linear-gradient(135deg,#00d4ff,#6366f1)"
  }
]'
```

* **Linking Certificate Images**: To link a certificate image, set the `"bg"` property to a CSS url format, e.g. `"url(assets/Hackwell.jpeg)"`. This will serve as both the thumbnail and the target for the lightbox overlay.
* **Click-to-Popup (Lightbox)**: Any item with a `"url(...)"` image set in the `"bg"` field is automatically configured as clickable. When clicked, it opens a responsive, fullscreen certificate preview lightbox popup modal.
* **Fallback Icons & Gradients**: If no image background is specified, the card defaults to a gradient background backdrop and displays the text/emoji specified in the `"icon"` field (or a `📜` fallback).
* **To add an item to the grid popup**: Append a new JSON object `{"title": "...", "desc": "...", "icon": "...", "bg": "..."}` inside the brackets, separated by a comma.
* **If you do not want a grid gallery in a card**: Simply omit the `data-grid` attribute from that `.achievement-card` (like in the *Open Source* card). The modal popup will intelligently hide the gallery header.

---

### 📧 4.9 Contact Form & EmailJS Integration
The form in the contact section uses **EmailJS** to send messages directly from the webpage to your email address without needing a backend server.

#### Step 1: Create an EmailJS Account
1. Visit [EmailJS](https://www.emailjs.com) and sign up for a free account.

#### Step 2: Add your Email Service
1. In the EmailJS Dashboard, click **Email Services** → **Add New Service**.
2. Select **Gmail** (or your preferred provider).
3. Click **Connect Account**, log into your Google Account, and authorize EmailJS.
4. Click **Create Service**.
5. Copy your **Service ID** (looks like `service_yt8xf1l`).

#### Step 3: Create an Email Template
1. Go to **Email Templates** → **Create New Template**.
2. Customize your email layout. Ensure the variables match your form inputs:
   * Subject: `New Portfolio Message from {{from_name}}`
   * Body content:
     ```
     You have received a new message from your portfolio site:

     Name: {{from_name}}
     Email: {{from_email}}

     Message:
     {{message}}
     ```
3. Click **Save**.
4. Copy your **Template ID** (looks like `template_kegp27r`).

#### Step 4: Get your Public Key
1. Go to **Account** → **API Keys** (or **General**).
2. Copy your **Public Key** (looks like `tEMj75LhaUCDRm58J`).

#### Step 5: Update references in the Code
Open [index.html](file:///d:/portfolio/index.html) and find line 12:
```javascript
emailjs.init('YOUR_PUBLIC_KEY');
```
* Replace `YOUR_PUBLIC_KEY` with your actual Public Key.

Open [js/main.js](file:///d:/portfolio/js/main.js) and find lines 437–439:
```javascript
const EJS_KEY = 'tEMj75LhaUCDRm58J';
const EJS_SVC = 'service_yt8xf1l';
const EJS_TPL = 'template_kegp27r';
```
* Replace these values with your actual Public Key, Service ID, and Template ID.

---

### 💬 4.10 Quote Section & Footer
The quote at the bottom of the page highlights your development philosophy.
In [index.html](file:///d:/portfolio/index.html) (line 429):
* **Customization**: Update the text inside `span.footer-quote` to whatever slogan or quote fits your personal journey. The styling is already matched to the Inter font and cyberpunk background colors.

---

## 🎨 5. Interactive & Canvas Tuning

### Particle Constellation Canvas
The drifting starfield background in the Hero section is computed inside [js/main.js](file:///d:/portfolio/js/main.js) under the `2. INTERACTIVE PARTICLE CONSTELLATION` block (lines 72–78):
* **`PARTICLE_COUNT`**: Modify this value (default `70`) to add or remove floating stars. Keep it under `120` to prevent slowing down older devices.
* **`CONNECTION_DIST`**: The max distance in pixels where line connectors draw between nodes (default `140`).
* **`MOUSE_RADIUS`**: The distance from your cursor where particles begin to push away (default `130`).

### Background Orb Scroll Parallax
Floating purple/blue blurred background bubbles drift at different speeds as the page scrolls.
In [index.html](file:///d:/portfolio/index.html) (lines 74–76):
* **Velocity controls**: Modify the inline speed custom property:
  ```html
  <div class="mesh-parallax" style="--speed: 0.15">
  ```
  * Positive numbers (e.g. `0.15`) move the orb *down* slower than the scroll rate.
  * Negative numbers (e.g. `-0.1`) scroll the orb *upwards* in the opposite direction.

---

## 🌐 6. Deployment Guide

Once you've made your changes, deploy your portfolio to the web for free using any of these simple options:

### Option A: Deploy on Vercel (Recommended)
1. Commit and push your code to a repository on **GitHub**.
2. Log in to [Vercel](https://vercel.com) using your GitHub account.
3. Click **Add New** → **Project**.
4. Import your portfolio repository.
5. Under Build & Development settings, keep Framework Preset as **Other** (since it is static HTML).
6. Click **Deploy**. Vercel will instantly generate a live URL for your site.

### Option B: Deploy on Netlify
1. Log into [Netlify](https://www.netlify.com).
2. Go to the dashboard page.
3. Drag the entire `portfolio` folder from your desktop into the **"Drag and drop your site folder here"** upload box.
4. Netlify will deploy it instantly!

### Option C: Deploy on GitHub Pages
1. Push your project files to a public GitHub repository.
2. In your repository on GitHub, go to **Settings** (top menu bar).
3. On the left sidebar, click **Pages**.
4. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
5. Set the **Branch** to `main` (or `master`) and folder to `/ (root)`.
6. Click **Save**. Your site will build and go live within 1–2 minutes at `https://<your-username>.github.io/<your-repo-name>/`.

---

*Built with ❤️ and designed for visual excellence.*
