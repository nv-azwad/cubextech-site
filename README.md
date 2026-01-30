# CubeX Tech Website

Official website for CubeX Technology - Smart Solutions for Modern Businesses.

## 🚀 Quick Start (Local Development with VS Code)

### Prerequisites
- Node.js 18+ installed (download from https://nodejs.org)
- VS Code (or any code editor)

### Installation Steps

1. **Extract the zip file** to your desired location (e.g., `C:\Projects\cubextech-site`)

2. **Open VS Code**, then File → Open Folder → select the extracted folder

3. **Open the integrated terminal** in VS Code (View → Terminal, or press `` Ctrl+` ``)

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser** and go to `http://localhost:5173`

You should now see your website running locally! 🎉

---

## 📦 Tech Stack

- **React 18** - UI Framework
- **Vite** - Build Tool (super fast!)
- **Tailwind CSS** - Styling
- **Framer Motion** - Smooth scroll animations
- **Lucide React** - Icons

---

## ✏️ Making Changes

### Edit in VS Code:
1. Open `src/App.jsx` - this is the main website file
2. Make your changes
3. Save the file (Ctrl+S)
4. The browser will auto-refresh to show your changes!

### Common edits in App.jsx:

| What to Change | Search for (Ctrl+F) |
|----------------|---------------------|
| Company email | `info@cubextech.net` |
| Location | `Selangor, Malaysia` |
| Phone number | `Contact us for inquiries` |
| Hero tagline | `Innovating Tomorrow` |
| Hero headline | `Transforming Ideas into` |
| Services list | `const services = [` |
| Partners list | `const partners = [` |
| Stats numbers | `value={50}` (Projects), `value={10}` (Team), etc. |

---

## 🎨 Customization Tips

### Change Colors
The site uses Tailwind CSS with emerald green as the primary color. To change:
- Search for `emerald` in App.jsx and replace with another Tailwind color (e.g., `blue`, `violet`, `rose`)

### Add Your Logo
1. Replace the text logo in the navbar with an image:
   ```jsx
   <img src="/logo.png" alt="CubeX Tech" className="h-8" />
   ```
2. Upload `logo.png` to the `public` folder before building

### Add New Pages
For a multi-page site, consider upgrading to React Router or Next.js.

---

## 🆘 Troubleshooting

**Blank page after deployment?**
- Make sure you uploaded the contents OF the `dist` folder, not the folder itself
- Check that `.htaccess` file exists in `public_html`

**Styles not loading?**
- Clear your browser cache (Ctrl+Shift+R)
- Check browser console for errors

**Build fails?**
- Delete `node_modules` folder and run `npm install` again
- Make sure Node.js is version 18 or higher

---

## 📞 Support

For website-related questions, contact your development team.

Built with ❤️ using React, Vite, and Tailwind CSS
