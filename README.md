# Chopline

Chopline is a responsive, editable UI prototype for a multi-vendor food ordering and delivery platform. It uses original branding, generated food photography, and illustrative Lagos demo data.

Open `dist/index.html` in a browser to view the showcase. To preview over HTTP, run `python3 -m http.server 8080 --directory dist` from this folder and open `http://localhost:8080`.

- Choose a role and board from the showcase navigation.
- Select a screen caption to open the interactive version, or choose **Play prototype** to start the role's journey.
- Use the screen selector to jump between views. **Back to boards** returns to the corresponding board.
- Open **Design system** for shared components, the product palette and the twelve-reference color study.
- Use the presentation control to show the current board full-screen. The browser's print dialog can export the displayed board.

Edit `dist/styles.css` for tokens and layouts, `dist/content.js` for sample content and boards, or `dist/customer.js` and `dist/operations.js` for the individual screens. `dist/app.js` wires navigation and demo interactions. The prototype runs in the browser with local assets and in-memory state.

The food photos were generated for the prototype. Bricolage Grotesque and DM Sans are distributed under the SIL Open Font License. Their license files are in `dist/assets`.

## Deploy to Render

Connect the GitHub repository from **New → Blueprint** in Render. The included `render.yaml` defines a static site that serves `dist/`. Alternatively, create a **Static Site** with the build command `test -s dist/index.html` and publish directory `dist`. No environment variables or build dependencies are required.
