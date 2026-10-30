# Vizualni sistem in uporabniški tokovi za M3

Prvi vzorec, pripravljen na izrecno naročilo uporabnika iz treh priloženih referenčnih slik. Vsebinska podlaga je dogovorjeni osnutek toka povpraševanja in rezervacije prostora ter specifikaciji Prostori in Admin, povezani v `booking-flow.json`.

## Potrjena izhodišča

- Glavna modra: **#2142CB**.
- Naslovi: **Roboto Condensed Bold**.
- Običajno besedilo: **Noto Sans Regular**.
- Podporni vijolični in modri odtenki so interpretacija priloženih slik; niso izmerjene ali potrjene uradne barve znamke.
- Tri vrstice odgovornosti: uporabnik zgoraj, uprava DOMA na sredini, povezani sistemi spodaj. Branje od leve proti desni.
- Bele kartice: aktivnosti; svetlo turkizna: stična točka; modra: povezani sistem. Vijolične puščice kažejo zaporedje. Črtkan okvir označuje pogoj ali pojasnilo.

## Datoteke

- `visual-system.json`: barve in tipografija.
- `visual-system.png` / `.svg`: pregled vizualnega sistema.
- `booking-flow.json`: besedilo in položaji prvega toka.
- `booking-flow.png` / `.svg`: prvi diagram za pregled in vključitev v Google Docs.
- `render.cjs`: ponovljiv izris obeh slik.
- `assets/`: izvorni pisavi Google Fonts in licenci SIL OFL.

PNG je izrisan pri dvojni ločljivosti. SVG vključuje pisavi, da se tipografija ohrani tudi na drugem računalniku. Zaradi predvidljive geometrije in razporeditve vodoravnih pasov izris uporablja SVG iz JSON namesto samodejne postavitve Mermaid.

Zagon:

```sh
/Users/danijelkurincic/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node project-management/user-flows/render.cjs
```

Izris uporablja ločen brezglavi Chrome s začasnim profilom. Ne upravlja odprtih uporabnikovih zavihkov. Oba PNG sta vizualno pregledana; preverjeno je nalaganje obeh pisav in besedilo zunaj roba slike.

## Obseg vzorca

Diagram prikazuje javni zahtevek za uporabo prostora. Dopolnitev je povzeta v koraku pregleda; posebna zanka dopolnjevanja in neposreden ročni vnos rezervacije nista podrobno narisana. Moj DOM se nanaša na registriranega uporabnika. Dostop prek sistema Prima in obračun sta pogojna koraka. Odobritev zahtevka je izrecno ločena od potrditve rezervacije.

Datoteke so pripravljene za pregled. V Google Docs še niso vstavljene.
