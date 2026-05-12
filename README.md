# GitHub Pages + Supabase Architecture

GitHub Pages is a "static host", meaning it cannot run backend code like Next.js API routes, Python, or Node.js. It only serves HTML, CSS, and JS files.

To build a dynamic search app on GitHub Pages, we use a **Backend-as-a-Service (BaaS)** architecture. 

1. **Frontend**: Plain HTML and JavaScript hosted on GitHub Pages.
2. **Backend/Database**: Supabase.
3. **The Connection**: The frontend JavaScript uses the Supabase CDN library to make API calls *directly* from the user's browser to the Supabase database.

No servers, no API routes needed.
