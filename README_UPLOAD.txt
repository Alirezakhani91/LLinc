LANDMARK LIVING — V9 GLOBAL CURSOR + PROJECT TITLE FIX

UPDATE ONLY FILES IN THIS ZIP. NOT THE ENTIRE WEBSITE.
1. Backup the current GitHub LLinc repository / download a ZIP first.
2. Extract this ZIP. Drag its CONTENTS (not the parent folder) onto
   LLinc repository root > Add file > Upload files.
3. GitHub should show 13 modified index.html pages in their ORIGINAL
   directories plus one NEW file: landmark-cursor.js at repository root.
4. Commit changes, then refresh website Ctrl+Shift+R.

IMPORTANT: Do not move files out of their folders. Example:
about/index.html must stay in about/, projects/index.html in projects/.
Keep site-patches.css and all cdn-assets/ unchanged.

Cursor: desktop fine pointer only, 32px shadow; 64px over interactive elements.
No cursor on touch screens or for prefers-reduced-motion users.
Home: removes old hero-only cursor to avoid double shadows; keeps original
hero autoplay and cinematic Our Projects slider V8. Long Millennium Drive
name is sized to fit inside the black panel (including custom font changes).

Expected test: all 13 HTML pages updated and landmark-cursor.js loaded.
If your site has other new HTML pages, add the shared script to them too.
