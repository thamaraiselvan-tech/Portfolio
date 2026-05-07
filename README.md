# Thamarai Selvan — Personal Portfolio

A modern, premium personal portfolio website built with HTML, CSS & JavaScript.

## 📁 Project Structure

```
portfolio/
├── index.html          # Main HTML (all sections)
├── css/
│   └── style.css       # All styles, dark/light theme
├── js/
│   └── main.js         # Interactions, animations, EmailJS
├── assets/             # Images (add your photo here)
└── README.md           # This file
```

## 🚀 Quick Start (Local)

Simply open `index.html` in your browser. No build step needed!

---

## 📧 EmailJS Setup (Contact Form)

Follow these steps to make the contact form send emails to your inbox:

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com](https://www.emailjs.com)
2. Sign up with your Google account

### Step 2: Add Email Service
1. Dashboard → **Email Services** → **Add New Service**
2. Select **Gmail**
3. Connect `thamaraiselvan.tech@gmail.com`
4. Click **Create Service**
5. Copy the **Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template
1. Dashboard → **Email Templates** → **Create New Template**
2. Set the **Subject**: `New Portfolio Message from {{from_name}}`
3. Set the **Content**:
   ```
   Name: {{from_name}}
   Email: {{from_email}}
   Message: {{message}}
   ```
4. Click **Save**
5. Copy the **Template ID** (e.g., `template_xyz789`)

### Step 4: Get Public Key
1. Dashboard → **Account** → **General**
2. Copy the **Public Key**

### Step 5: Update Your Code
1. Open `js/main.js`
2. Replace these three lines near the bottom:
   ```js
   const EMAILJS_PUBLIC_KEY = 'your_actual_public_key';
   const EMAILJS_SERVICE_ID = 'your_actual_service_id';
   const EMAILJS_TEMPLATE_ID = 'your_actual_template_id';
   ```
3. Open `index.html`, find this line in `<head>`:
   ```js
   emailjs.init('YOUR_PUBLIC_KEY');
   ```
   Replace `YOUR_PUBLIC_KEY` with your actual public key.

---

## 🌐 Deployment Guide

### Option A: Deploy on Vercel (Recommended)

1. Push your portfolio folder to a GitHub repo
2. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub
3. Click **"Add New Project"**
4. Select your portfolio repository
5. Framework Preset: **Other**
6. Click **Deploy**
7. Your site will be live at `https://your-project.vercel.app`

**No environment variables needed** — everything is client-side!

### Option B: Deploy on Render

1. Push to GitHub
2. Go to [https://render.com](https://render.com) and sign in
3. Click **New** → **Static Site**
4. Connect your GitHub repo
5. Set **Publish Directory** to `.` (root)
6. Click **Create Static Site**

### Option C: Deploy on Netlify

1. Go to [https://netlify.com](https://netlify.com)
2. Drag and drop the entire `portfolio` folder
3. Done! Instant deployment.

### Option D: Deploy on GitHub Pages

1. Push code to a GitHub repo
2. Go to repo **Settings** → **Pages**
3. Source: **Deploy from a branch**
4. Branch: `main`, folder: `/ (root)`
5. Save — your site goes live at `https://username.github.io/repo-name`

### Connecting a Custom Domain

1. Buy a domain (Namecheap, GoDaddy, etc.)
2. In your hosting platform (Vercel/Netlify):
   - Go to **Settings** → **Domains**
   - Add your custom domain
3. Update DNS records at your domain registrar:
   - **A Record**: Point to the platform's IP
   - **CNAME**: Point `www` to your deployment URL
4. Wait for DNS propagation (up to 48 hours)

---

## ✏️ How to Edit

### Add a New Project
Open `index.html`, find the Projects section, and copy a project card:
```html
<div class="project-card reveal">
  <div class="project-header" style="background:linear-gradient(135deg,#COLOR1,#COLOR2)">EMOJI</div>
  <div class="project-body">
    <h3>Project Name</h3>
    <p>Description here.</p>
    <div class="project-tags">
      <span>Tech1</span>
      <span>Tech2</span>
    </div>
    <div class="project-links">
      <a href="GITHUB_URL" target="_blank">🔗 GitHub</a>
    </div>
  </div>
</div>
```

### Add a New Skill Category
Copy a `.skill-card` block in the Skills section and modify.

### Add an Achievement
Copy an `.achievement-card` block and modify.

### Change Theme Colors
Edit the CSS variables at the top of `css/style.css`.

---

## 📋 Features

- ✅ Responsive (desktop & mobile)
- ✅ Dark / Light theme toggle
- ✅ Smooth scroll animations
- ✅ Active section highlighting
- ✅ Sticky navbar with blur effect
- ✅ Typing animation effect
- ✅ Functional contact form (EmailJS)
- ✅ Form validation
- ✅ Production-ready code
- ✅ SEO optimized

---

Built with ❤️ by Thamarai Selvan
