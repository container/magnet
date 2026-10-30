# Namestitev in zagon

Potrebujete Node.js 22.13.0 ali novejši z npm ter internetno povezavo za namestitev odvisnosti.

1. Razpakirajte ZIP.
2. V terminalu odprite razpakirano mapo `mag-net-prototip`.
3. Namestite odvisnosti:

   ```sh
   npm ci
   ```

4. Zaženite aplikacijo:

   ```sh
   npm run dev
   ```

5. V brskalniku odprite http://127.0.0.1:5173. Administracija je na http://127.0.0.1:5173/admin.

Zaustavitev: v terminalu pritisnite `Ctrl+C`.

Če so vrata 5173 zasedena, uporabite `npm run dev -- --port 5174` in odprite http://127.0.0.1:5174.

Za zagon sestavljene različice:

```sh
npm run build
npm start
```

Nato odprite http://127.0.0.1:4173. Datoteke `index.html` ne odpirajte neposredno z dvoklikom; aplikacija potrebuje lokalni strežnik.

Za lokalni zagon niso potrebni račun pri ponudniku gostovanja, podatkovna baza ali datoteka `.env`.
