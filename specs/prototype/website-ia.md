# MAG-NETic Platform - Website IA

Purpose: single current information architecture source for the public website prototype.

Status: working notes

---

## Meniji

### Main menu

| Ime | Slug |
| --- | --- |
| Predstavitev | `/predstavitev` |
| Prostori | `/prostori` |
| Dogodki | `/dogodki` |
| Programi | `/programi` |
| Skupnost | `/skupnost` |
| Novice | `/novice` |

### Secondary menu: Predstavitev

Shown on the overview and all presentation subpages, with the current page marked active.

| Ime | Slug |
| --- | --- |
| Predstavitev | `/predstavitev` |
| Zgodovina DOMA | `/predstavitev/zgodovina-doma` |
| Kontakt | `/predstavitev/kontakt` |
| Dostop | `/predstavitev/dostop` |
| Prenova | `/predstavitev/prenova` |
| Kavarna | `/predstavitev/kavarna` |
| Partnerji | `/predstavitev/partnerji` |
| Mediji | `/predstavitev/mediji` |

### Aux menu

| Ime | Slug | Prikaz |
| --- | --- | --- |
| Prijava za člane | `/clani/prijava` | Ko uporabnik ni prijavljen |
| Moj DOM | `/moj-dom` | Ko je uporabnik prijavljen |
| Članstvo | `/clani` | Javna pot |
| Trgovina | `/trgovina` | Noga |
| Pogoji uporabe | `/pogoji-uporabe` | Footer |
| Zasebnost | `/zasebnost` | Footer |

---

## Path Tree

| Ime | Slug |
| --- | --- |
| Naslovka | `/` |
| Predstavitev | `/predstavitev` |
| Zgodovina DOMA | `/predstavitev/zgodovina-doma` |
| Kontakt | `/predstavitev/kontakt` |
| Dostop | `/predstavitev/dostop` |
| Prenova | `/predstavitev/prenova` |
| Kavarna | `/predstavitev/kavarna` |
| Partnerji | `/predstavitev/partnerji` |
| Mediji | `/predstavitev/mediji` |
| Prostori | `/prostori` |
| Najem prostora | `/prostori/najem` |
| Zahtevek za najem prostora | `/prostori/najem/obrazec` |
| Zahtevek poslan | `/prostori/najem/poslano` |
| Podrobnost prostora | `/prostori/:slug` |
| Dogodki | `/dogodki` |
| Arhiv dogodkov | `/dogodki/arhiv` |
| Podrobnost dogodka | `/dogodki/:slug` |
| Karte za dogodek | `/dogodki/:slug/karte` |
| Programi | `/programi` |
| Podrobnost programa | `/programi/:slug` |
| Skupnost | `/skupnost` |
| Predstavitev skupnosti | `/skupnost/predstavitev` |
| Ljudje | `/skupnost/ljudje` |
| Članstvo | `/skupnost/clanstvo` |
| Organizacije | `/skupnost/organizacije` |
| Novice | `/novice` |
| Podrobnost novice | `/novice/:slug` |
| Trgovina | `/trgovina` |
| Podrobnost izdelka | `/trgovina/:slug` |
| Košarica | `/trgovina/kosarica` |
| Nakup | `/trgovina/nakup` |
| Nakup potrjen | `/trgovina/nakup/potrjeno` |
| Članstvo | `/clani` |
| Pridruži se | `/clani/pridruzi-se` |
| Prijava za člane | `/clani/prijava` |
| Koledar članov | `/clani/koledar` |
| Moj DOM | `/moj-dom` |
| Rezervacije prostorov | `/moj-dom/rezervacije` |
| Prijave na programe | `/moj-dom/programi` |
| Podrobnost prijave na program | `/moj-dom/programi/:applicationId` |
| Karte za dogodke | `/moj-dom/karte` |
| Podrobnost karte | `/moj-dom/karte/:ticketId` |
| Komunikacija | `/moj-dom/komunikacija` |
| Podrobnost komunikacije | `/moj-dom/komunikacija/:requestId` |
| Članstvo | `/moj-dom/clanstvo` |
| Profil | `/moj-dom/profil` |
| Pogoji uporabe | `/pogoji-uporabe` |
| Zasebnost | `/zasebnost` |

---

## Section Content

### Predstavitev

- kaj je DOM
- ekipa
- hiša: zgodovina, prenova
- lokacija in dostop
- kontakt za program: obrazec, emaili
- evropski programi
- kavarna: storitve, fotografije, ponudba, meni
- kontakt
- media / press
- partnerji

### Prostori

- pregled prostorov
- predstavitev vsakega prostora posebej
- CTA block at the bottom of the listing: `Najemi prostor`
- how rental works page
- inquiry step after rental explanation
- tehnična podpora
- pogoji najema
- oprema: opis in najem
- kontakt tehničnega vodje / podpore

### Dogodki

- list-first event discovery
- monthly calendar view
- category filters by public space/context group
- archive
- posamezen dogodek

### Programi

- programme overview and detail pages
- programme application entry points
- DOM Šola
- DOM Zbornica
- DOM Inkubator dogodkov
- DOM Srečališče skupnosti
- DOM Rezidenca
- DOM Galerija

### Skupnost

- community presentation
- connected organisations
- mentor, creator, or person editorial profile cards
- membership and joining the community

The secondary navigation contains Predstavitev, Ljudje and Članstvo. Programi is a separate primary section. Trgovina is linked from the footer at `/trgovina`.
