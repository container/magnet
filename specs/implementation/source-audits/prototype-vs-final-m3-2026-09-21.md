# Analiza skladnosti prototipa DOM s končno konceptualno zasnovo

Datum pregleda: 21. september 2026  
Status: analiza obstoječega prototipa; brez sprememb kode in brez novih zahtev
Lokalna osnova Git: `a761259` in trenutno delovno drevo, vključno z obstoječimi spremembami.
Revizija Google dokumenta pri obeh branjih: `ANLCKQkukPjzD2EDkwtVVbd6jEC5EtFyD69nGKOlut6JaBjLXAXTdnRqrbkwVE3FiqJviuPlm7bcnuH7cygRAsmGXpWUfjsv5BV4lOXjPx8`.

## 1. Vir, obseg in merilo

Edini normativni vir je [M3 poročilo – Konceptualna zasnova](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0), pridobljen neposredno iz Google Docs. Prebrana sta oba zavihka: Naslovka in Vsebina. Na naslovnici je navedena verzija 1.0 z datumom 22. september 2026. To je datum dokumenta, ne datum izvedbe tega pregleda. Uporabnik je dokument določil kot končni in edini veljavni vir; stare lokalne specifikacije niso uporabljene za upravičevanje funkcij.

Pregledana je trenutna lokalna koda v mapi `prototype`, vključno z obstoječimi neshranjenimi spremembami v Git. Pregled zajema usmerjanje, javne strani, Moj DOM, administracijo, podatkovne tipe, vzorčne podatke, shranjevanje v localStorage in vgrajeni pregledovalnik dokumentacije. Objavljena različica na chatgpt.site ni bila primerjana z lokalno, zato ugotovitev ne gre brez preverjanja prenesti na stanje objave.

Merilo sledi uporabnikovemu navodilu in poglavju [Rezultat načrtovanja](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.3uq18i2o2hf0):

- **Presežek:** prototip dodaja funkcionalnost ali poslovno omejitev, za katero v dokumentu ni podlage.
- **Nasprotje:** funkcionalnost je predvidena, vendar prototip prikazuje drugačna pravila, odgovornosti, vidnost ali potek.
- **Dovoljena vrzel:** zahteva obstaja v specifikaciji, prototip je še ne prikazuje. Sama po sebi ni razlog za širitev prototipa.
- **Nedoločeno oziroma priporočeno:** dokument dopušča več izvedb ali vsebuje neskladna priporočila. Tega ni pravilno predstavljati kot nedvoumno kršitev.

Specifikacija dopušča tehnične alternative, vzorčne vsebine, različne postavitve in postopno izvedbo. Zato vsak dodaten gumb, primer zapisa, ime statusa ali drugačna komponenta še ni nova poslovna zahteva. Ključna meja je, ali izvedba spreminja pomen zahteve, pravice, veljavnost podatkov ali obseg storitve. Funkcije s prioriteto »priporočeno« ali »zaželeno« so v specifikaciji in zato niso presežek že zato, ker niso nujne.

**Pomembno:** lokalni podatki, navidezna prijava in odsotnost dejanskih plačil oziroma pošiljanja e-pošte so lahko sprejemljiva prototipna poenostavitev. To pa ne upraviči drugačnega poslovnega izida, npr. aktivnega članstva brez potrjenega plačila.

## 2. Glavna ugotovitev

Osnovni javni sklopi in velik del podatkovnih področij imajo podlago v dokumentu. Glavni problem ni premajhna pokritost specifikacije, temveč mešanica starejših poslovnih predpostavk, preobsežnih nakupnih tokov in prikazov, ki delujejo kot zaključene funkcije, vendar ne spoštujejo pravil objave, dostopa in povezovanja zapisov.

Za uskladitev ni treba izdelati vseh manjkajočih modulov. Najprej je treba odstraniti neupravičene razširitve in popraviti pomen že prikazanih procesov.

Prioritete v tem poročilu pomenijo **vrstni red usklajevanja prototipa**, ne novih prioritet zahtev:

- **P1:** napačen obseg, poslovni izid, dostop ali vidnost.
- **P2:** napačna organizacija, vsebinski prikaz ali nedosledna predstavitev procesa.
- **P3:** priporočena navigacija, dokumentacija in manjše razlike.

## 3. Presežki obsega in neutemeljene omejitve

### A01 — Celoten nakupni tok trgovine in lastna administracija izdelkov

**Presoja: presežek; P1.**

Specifikacija v sklopu Skupnost predvideva vstopno točko v zunanjo trgovino, lahko s prikazom enega ali več izdelkov. Poglavje Integracije kot možno izvedbo omenja zunanji sistem trgovine. Ne definira lastnega DOM kataloga s produktnimi variantami, košarice, zbiranja dostavnih podatkov, postopka naročila in lastnega urejanja cen.

Prototip vsebuje `/trgovina`, detajl izdelka, košarico, tristopenjski nakup, potrditev naročila ter `/admin/trgovina`, dodajanje in urejanje izdelkov. Administrativne poti ostanejo dosegljive tudi brez postavke Trgovina v glavnem meniju. Besedilo, da se bo tok pozneje povezal z zunanjim modulom, ne odpravi dejstva, da DOM že prikazuje in določa ta dodatni proces.

**Najmanjša uskladitev:** ohraniti predstavitev in vstop v zunanjo trgovino; umakniti lastno košarico, checkout in administracijo prodajnega kataloga iz prikazanega obsega DOM. Tehničnega ponudnika ni treba izbrati.

Vir: [Sklop: Skupnost](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.h3abh58s7mw2), odstavki pri indeksih 49308–49644; [Integracije](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.y9yjkm58fxz).  
Koda: [App.tsx:735](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:735>), [App.tsx:2256](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:2256>), [App.tsx:2451](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:2451>), [App.tsx:7822](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:7822>).

### A02 — Lastni sistem prodaje in izdaje vstopnic

**Presoja: presežek in nasprotje; P1.**

Dokument določa prehod k zunanjemu prodajalcu, z jasno označenim odhodom in možnostjo vrnitve. Interna prijava na dogodek je dovoljena alternativa za prijave; to ni isto kot lastna prodaja kart. Tudi scenarij 1 nakup in izdajo vstopnice umešča v zunanji sistem.

Prototip vsak prodajni CTA usmeri na interni `/dogodki/:slug/karte`. Tam sam določa tipe kart iz razpona cen, količine 1–6, plačilo s kartico ali predračunom, oznako uspešnega nakupa in QR prikaze. Ne uporablja `ticketUrl` za predvideni izhod. V urejevalniku je privzeti ponudnik »lastni modul«, med izbirami je tudi Eventim. Eventim sam po sebi ni prepovedan z dokumentom, vendar njegova izbira tu ne predstavlja delujoče zunanje poti.

**Najmanjša uskladitev:** pokazati zunanji prehod oziroma jasno omejen prikaz integracije. Odstraniti lastna pravila nakupa in izdaje kart. Pregled povezanih kart v Moj DOM ali administraciji lahko ostane, ker ima podlago v dokumentu.

Vir: [Sklop: dogodki](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.knyy6j22j2de), 45411, 46534–47049; [Modul: dogodki](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.1iepmamg2ue6); [Uporabniški scenariji](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.tziwjx2v5q33), scenarij 1.  
Koda: [App.tsx:2108](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:2108>), [App.tsx:2122](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:2122>), [App.tsx:5317](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:5317>), [types.ts:171](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/types.ts:171>).

### A03 — Najem samo za 30 minut do 3 ure in samo ob polnih urah

**Presoja: neutemeljena poslovna omejitev; P1.**

Dokument zahteva začetni čas in trajanje ter podpira redno in enkratno uporabo. Ne določa omejitve na največ tri ure, najmanj pol ure ali začetka izključno ob polni uri.

Prototip to neposredno uveljavlja z zaprtimi izbirami trajanja in ur. Zato ni mogoče izraziti npr. štiriurnega dogodka ali začetka ob 17.30. To presega neobvezno izbiro UI komponente in spreminja dovoljeni obseg povpraševanja.

**Najmanjša uskladitev:** odstraniti te omejitve iz obrazca, dokler niso določene v veljavnem viru. Ne nadomestiti jih z novimi izmišljenimi mejami.

Vir: [Sklop: prostori](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.f4u4arkjidn6), 41140–41702; [Modul: prostori](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.aihoszi29o1n).  
Koda: [App.tsx:1604](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:1604>).

### A04 — Splošna prepoved izključne uporabe in izločitev HUB iz povpraševanj

**Presoja: neutemeljeno pravilo in nedosledna omejitev; P2.**

Javne strani trdijo, da noben prostor ni zamišljen kot zaprta soba enega uporabnika. Dokument takšnega splošnega pravila ne določa; nasprotno opisuje različne namene prostorov, rezidence in dolgoročno uporabo, konkretne pogoje pa prepušča posameznemu prostoru.

Obenem privzeti javni seznam vključuje HUB, obrazec za najem pa sprejema samo prostore z `sourceGroup === "DOM"`. Ne gre zgolj za manjkajoče HUB podatke: prikazani prostori so iz možnosti povpraševanja izločeni s trdim pravilom.

**Najmanjša uskladitev:** umakniti splošno prepoved; izbor za povpraševanje vezati na dejansko javno ponudbo in določene pogoje. Ne izpeljevati prepovedi iz same skupine DOM/HUB.

Vir: [Sklop: prostori](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.f4u4arkjidn6), zlasti 38389–38698 in 39414–41702.  
Koda: [App.tsx:1388](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:1388>), [App.tsx:1546](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:1546>), [App.tsx:1604](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:1604>).

## 4. Nasprotja pri že prikazanih funkcionalnostih

### B01 — Včlanitev zamenja registracijo in aktivira članstvo brez plačila

**Presoja: neposredno nasprotje; P1.**

Dokument loči registracijo računa in sklenitev članstva. Članstvo je vezano na obstoječi račun; aktivno postane po izpolnjenih pogojih in evidentiranem plačilu. Registriran uporabnik lahko uporablja Moj DOM tudi brez članstva.

Prototip prikazuje zaporedje Podatki → Pogoji → Članarina → Profil in izrecno pravi, da se profil ustvari po plačilu. Ob zaključku ustvari novega uporabnika s statusom `član`, začetkom na simulirani današnji datum in avtomatično enoletno veljavnostjo. Ne preveri plačila, soglasij ali obstoječega računa; plačilni korak celo kaže »plačilo še ni izvedeno«. Korake je mogoče preskakovati prek stepperja.

**Najmanjša uskladitev:** razločiti obstoječi račun in članstvo; brez simulirane potrditve pogojev/plačila ne prikazati aktivnega članstva. Če postopek ostane nedodelan, zaključiti pri pravilnem vmesnem stanju. Manjkajoča polna registracija je dovoljena vrzel; napačno zaporedje in aktivacija nista.

Vir: [Sklop: Skupnost](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.h3abh58s7mw2), 51883–54099; [Registracija in prijava](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.wpbq5mt3e6s4); [Prehodi med skupinami](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.9yll4gcnx4vd).  
Koda: [App.tsx:2685](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:2685>), [App.tsx:2728](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:2728>), [App.tsx:2773](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:2773>).

### B02 — Privzete ravni in trajanje članstva učinkujejo kot potrjena ponudba

**Presoja: nepodprta konkretizacija; P2.**

Dokument dovoljuje več ravni članstva, če obstajajo, ne določa pa njihovega konkretnega nabora, enoletnega obdobja in cen. Javni obrazec ponuja posameznika, organizacijo in mlade/študente; admin pa posameznika, organizacijo in podpornega člana. Mladi/študenti se shranijo kot posameznik. Plačilni povzetek ne sledi izbrani ravni in vedno kaže osnovno članstvo.

Vzorčne ravni in cene niso same po sebi dodatna funkcija. Problem je njihova predstavitev kot veljavnih pravil in medsebojno neskladno obnašanje.

**Najmanjša uskladitev:** jasno obravnavati kot simulirane podatke ter uskladiti izbiro, povzetek in shranjeno vrednost; ne določiti dejanske članske ponudbe skozi prototip.

Vir: [Sklop: Skupnost](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.h3abh58s7mw2), 52115–53519.  
Koda: [App.tsx:2778](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:2778>), [App.tsx:2838](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:2838>), [App.tsx:2901](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:2901>), [App.tsx:8941](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:8941>), [data.ts:2628](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/data.ts:2628>).

### B03 — Osnutki dogodkov in interni prostor se odprejo na javnem URL-ju

**Presoja: neposredno nasprotje z mejo javno/interno; P1.**

Seznami sicer filtrirajo objavo, detajla dogodka in prostora pa preverita samo obstoj zapisa. Pot neposredno razkrije tudi osnutek. To je dokazano z izrisom `/dogodki/januarski-programski-zagon` in `/prostori/direktorjeva-pisarna`; pisarna je označena kot `draft` in `operator`.

**Najmanjša uskladitev:** enaka pravila vidnosti na seznamu in detajlu. Pri dogodkih ohraniti podprti javni arhiv; ne enačiti vseh arhiviranih zapisov z internimi.

Vir: [Admin](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.gn15m1w9q089), 67820; [Principi delovanja admin vmesnika](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.pxx1ae380op6); [Sklop: dogodki](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.knyy6j22j2de), javni arhiv.  
Koda: [App.tsx:1443](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:1443>), [App.tsx:2002](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:2002>), [data.ts:2640](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/data.ts:2640>), [data/spaces.ts:190](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/data/spaces.ts:190>).  
Preverjanje: potrjeno z dejanskim izrisom React komponent.

### B04 — Moj DOM prikazuje naslove rezervacij drugih prosilcev

**Presoja: nasprotje z omejitvijo dostopa do lastnih podatkov; P1.**

Dokument dovoljuje pregled prostih terminov in lastnih rezervacij, ne daje pa vsakemu uporabniku splošnega dostopa do vsebine tujih rezervacij. Koledar v prototipu izbere vse rezervacije dovoljenega prostora in pokaže njihove naslove/status; ni preverjanja dovoljenja za konkretni zapis.

Za demo račun Kulturno društvo Most se med naslednjimi termini pokaže rezervacija »Odprta delavnica za ustvarjalce« drugega prosilca »DOM ekipa«. Sam prikaz zasedenosti je dopusten; nefiltrirani naslovi vseh zapisov niso utemeljeni.

**Najmanjša uskladitev:** ločiti lasten zapis od prikaza zasedenosti brez tujih podrobnosti oziroma pokazati podrobnosti le, ko obstaja izrecna podlaga za dostop.

Vir: [Registracija in prijava](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.wpbq5mt3e6s4), 59151; [Uporabniške skupine](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.vo3ej6tqc698); scenarij 8 v [Uporabniški scenariji](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.tziwjx2v5q33).  
Koda: [App.tsx:3470](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:3470>), [App.tsx:3525](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:3525>), [App.tsx:3594](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:3594>).  
Preverjanje: potrjeno z izrisom Moj DOM.

### B05 — Interna navodila administratorju se prikazujejo uporabniku

**Presoja: nasprotje javno/interno; P1.**

Polje `nextStep` je skupno administraciji in Moj DOM. Funkcija za spremembo statusa vanj zapisuje navodila »Kontaktiraj uporabnika …«, »Vnesi ali sinhroniziraj …« in »Po potrebi pošlji obrazložitev …«. Moj DOM jih izpiše kot naslednji korak uporabnika in trenutni odgovor.

To ni prikaz internih opomb iz ločenega seznama, temveč drug kanal razkritja operativnih navodil. Specifikacija zahteva informacije o obravnavi, namenjene uporabniku.

**Najmanjša uskladitev:** ločiti uporabniku namenjeno sporočilo od internega naslednjega opravila. Obstoječih internih navodil ne predstavljati kot komunikacijo uprave z uporabnikom.

Vir: [Komunikacija in obvestila vodstva](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.5hrlcffca7w0), 65507; [Admin](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.gn15m1w9q089), 67820.  
Koda: [App.tsx:3035](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:3035>), [App.tsx:3289](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:3289>), [App.tsx:3329](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:3329>), [App.tsx:9523](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:9523>).

### B06 — Pravice sodelavca vključujejo nastavitve integracij

**Presoja: nasprotje matriki dostopov; P1.**

Specifikacija določa, da nastavitve platforme, vključno z integracijami, sodijo med funkcije administratorja. Dostopi do zunanjih sistemov se dodeljujejo posebej.

Prototip ima »Integracije« v istem naboru modulov, ki jih je mogoče dodeliti sodelavcu. V seznamu je tudi Trgovina, čeprav njen lastni modul presega prikazani obseg. Poimenovanje pravice »Prostori in rezervacije« dodatno ne sledi trenutni razdelitvi menija.

**Najmanjša uskladitev:** uskladiti prikaz dodeljivih pravic z matriko in razlikovati upravljanje integracije od uporabe zunanjega orodja.

Vir: [Pravice in dostop do modulov](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.zarfq6grkmpr), 112526; [Matrika dostopov](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.d7om15nbqp80), 123614–123993.  
Koda: [App.tsx:126](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:126>), [App.tsx:9009](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:9009>), [types.ts:307](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/types.ts:307>).

Ločeno: `/admin` se odpre brez prijave in vedno kaže »Maja Admin«. To je trenutno simulacija admin persone, ne dokaz uvedene varnostne kontrole. Prava avtentikacija je lahko zunaj obsega prototipa; prikazanega urejanja pravic pa ni mogoče šteti za preverjeno izvajanje teh pravic.

### B07 — Rezervacije so primarno umeščene v Dogodke

**Presoja: nasprotje lastništvu modula; P2.**

Dokument umešča upravljanje rezervacij v modul Prostori. Dogodek se na povezane rezervacije sklicuje; rezervacije obstajajo tudi brez dogodkov.

Prototip ima »Dogodki in rezervacije«, glavni koledar ter seznam vseh rezervacij pod `/admin/dogodki`. Modul Prostori ima katalog, povpraševanja in opremo. To ni le drugačno ime menija: spreminja mesto urejanja in se ne ujema z dodeljevanjem pravic za prostore/rezervacije.

**Najmanjša uskladitev:** glavno upravljanje rezervacij umestiti k Prostori in rezervacije; v dogodku ohraniti povezane rezervacije. Koledarski pogled dogodkov je še naprej dopusten.

Vir: [Modul: prostori](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.aihoszi29o1n), 77850, 80244–83440; [Principi delovanja admin vmesnika](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.pxx1ae380op6).  
Koda: [App.tsx:42](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:42>), [App.tsx:69](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:69>), [App.tsx:81](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:81>), [App.tsx:4414](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:4414>).

### B08 — Preprečevanje konfliktov je prikazano kot izbirna možnost brez učinka

**Presoja: nasprotje pri aktivnem ustvarjanju rezervacij; P1.**

Dokument zahteva aktivno preprečevanje oziroma jasno razreševanje prekrivanj. Prototip ima potrditveno polje »Preveri konflikte v koledarju«, ki ga je mogoče odznačiti, vendar ga ob shranjevanju sploh ne prebere. Termin neposredno shrani; ne primerja ga z drugimi rezervacijami in ne preveri niti vrstnega reda začetka/konca.

**Najmanjša uskladitev:** ne predstavljati preverjanja kot uporabniške izbire in uspešnega preverjanja, če ga ni. Pri ohranjenem aktivnem shranjevanju simulirati pravilno obravnavo konflikta ali jasno omejiti interakcijo na nedokončan prikaz.

Vir: [Modul: prostori](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.aihoszi29o1n), 81858–82334.  
Koda: [App.tsx:6513](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:6513>), [App.tsx:6660](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:6660>), [App.tsx:6439](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:6439>).

### B09 — Prikazana polja rezervacije se ob shranjevanju izgubijo

**Presoja: neskladna simulacija postopka; P1.**

Obrazec omogoča ponavljanje, kontaktno osebo, telefon, e-pošto, število oseb in priponke, vendar `onSubmit` teh vrednosti ne shrani. Ponavljajočo rezervacijo pretvori v en termin. Opis, tehnične potrebe in interne opombe združi v eno polje `note`, s čimer izgubi razločevanje njihovega namena in vidnosti.

**Najmanjša uskladitev:** prikazati le ohranjene podatke ali minimalno ohraniti njihov pomen. Možnost ponavljanja ne sme zaključiti postopka kot uspešno ustvarjena serija, če nastane en sam termin.

Vir: [Modul: prostori](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.aihoszi29o1n), 80244–81250; [Principi delovanja admin vmesnika](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.pxx1ae380op6).  
Koda: [App.tsx:6513](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:6513>), [App.tsx:6570](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:6570>), [types.ts:211](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/types.ts:211>).

### B10 — Odobritev zahtevka uvaja nedoločeno predajo v zunanji koledar

**Presoja: neutemeljena arhitekturna predpostavka; P2.**

Dokument loči zahtevek od rezervacije ter opisuje ustvarjanje povezane rezervacije v modulu Prostori. Zunanji rezervacijski sistem je lahko tehnična izvedba; njegova izbira ni zaključena.

Prototip pa na zahtevku prikazuje posebej »Predaja v koledar« in »Zunanja ref.«, po odobritvi zahteva vnos ali sinhronizacijo v izbrani zunanji koledar. Povezave do dejanske rezervacije ni. Tako interna odločitev o odobritvi postane korak v domnevno izbrani arhitekturi.

**Najmanjša uskladitev:** ostati pri odobritvi za pripravo rezervacije. Če pretvorba še ni izvedena, jo pustiti kot vrzel; ne nadomestiti je z obveznim zunanjim postopkom.

Vir: [Integracije](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.y9yjkm58fxz); [Modul: prostori](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.aihoszi29o1n), 84836–87323.  
Koda: [App.tsx:9396](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:9396>), [App.tsx:9490](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:9490>), [App.tsx:9523](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:9523>), [data.ts:2501](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/data.ts:2501>).

### B11 — Sprememba statusa zahtevka izbriše podatek o Prima kartici

**Presoja: neutemeljeno povezovanje procesov; P1.**

Polje Prima kartice se pojavi samo pri statusu »odobreno za koledar«. Shranjevanje drugega statusa številko izbriše in nastavi `hasPrimaCard: false`. Dokument loči fizični dostop, račun in članstvo; nima pravila, da se lastništvo kartice izgubi ob arhiviranju ali drugi spremembi povpraševanja.

**Najmanjša uskladitev:** ne brisati identitete kartice na podlagi statusa povpraševanja. Ne dodajati novega postopka za dostop; le odstraniti napačno odvisnost.

Vir: [Uporabniki in uporabniške pravice](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.vv80k5x5dme2), 108416; [Modul sodelavci](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.2g75d7n8ayor), 103736.  
Koda: [App.tsx:9409](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:9409>), [App.tsx:9477](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:9477>).

### B12 — Povpraševanje in prijava na program zaključita oddajo mimo predvidenih pogojev

**Presoja: nasprotje prikazanemu postopku; P2.**

Dokument pri najemu in programu določa sprejem pogojev/zasebnosti, kontaktne podatke in potrjevanje kontaktov. Prototip pri obeh obrazcih nima koraka soglasij ali potrjevanja e-naslova. Najem je mogoče oddati brez imena in e-pošte; koda ustvari »Neznan kontakt« in »brez emaila«. Vneseni telefon se izgubi. Izbira prostora je samo enojna, dokument pa predvideva enega ali več.

Pri programu se po oddaji izpiše, da je prijava zabeležena, čeprav se spremeni samo lokalni `submitted` in ne nastane zapis prijave.

**Najmanjša uskladitev:** pri ohranjenem procesu ponazoriti potrebne podatke, soglasje in potrditveni korak ter ne trditi, da je zapis nastal, če ni. Dejanske e-pošte ni treba implementirati. Več prostorov in popolnejša polja lahko ostanejo jasno prepoznana delna pokritost.

Vir: [Sklop: prostori](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.f4u4arkjidn6), 41140–41989; [Sklop: Skupnost](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.h3abh58s7mw2), 51086–51843; [Uporabnikov nadzor, stanje sistema in odzivnost](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.3u6caaqlyxs2).  
Koda: [App.tsx:602](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:602>), [App.tsx:1598](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:1598>), [App.tsx:3954](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:3954>).

### B13 — Vsak objavljen program samodejno sprejema prijave

**Presoja: neutemeljena posplošitev; P2.**

Dokument govori o prijavi, kadar program sprejema prijave, in o pripadajočem prijavnem postopku. Prototip na vsakem javnem programu brezpogojno izriše isti obrazec. Model ne vsebuje pogoja za odprte prijave ali povezave do konkretnega toka.

**Najmanjša uskladitev:** obrazec prikazati le pri programu, za katerega je tak postopek predviden. Odsotnost obrazca pri drugih programih je dopustna in ustreznejša od splošne predpostavke.

Vir: [Sklop: Skupnost](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.h3abh58s7mw2), 50690–51086; [Modul: programi](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.25leqp8kiczl), 88391.  
Koda: [App.tsx:3927](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:3927>), [types.ts:48](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/types.ts:48>).  
Preverjanje: izris javnega programa potrdi obrazec; brezpogojnost je razvidna iz kode.

### B14 — Komunikacija v Moj DOM ima drugačen osrednji pomen

**Presoja: vsebinsko odstopanje in delna pokritost; P2.**

Dokument kot namen Komunikacije določa obvestila vodstva in naročanje nanje. Hkrati dovoljuje pregled oddaj obrazcev v Moj DOM. Prototip Komunikacijo v celoti predstavi kot seznam povpraševanj, tehnične podpore in partnerstev; dejansko bere samo zahtevke za prostor. Rezervacije pa ne združijo zahtevkov, njihovih statusov in potrjenih rezervacij, kot je opisano.

Povpraševanja v Moj DOM niso dodatna nedovoljena funkcija. Odstopanje je zamenjava opisanega namena razdelka in razdrobljena uporabniška pot.

**Najmanjša uskladitev:** pravilno poimenovati in umestiti že prikazane vsebine. Obvestil vodstva ni treba razviti zgolj zato, da bi bila pokritost popolna.

Vir: [Vsebinski sklopi v Moj DOM](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.olhtg17xocih), 59975–60656; [Komunikacija in obvestila vodstva](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.5hrlcffca7w0); [Modul: obrazci](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.h1nlh62ysyy7), 96024.  
Koda: [App.tsx:3053](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:3053>), [App.tsx:3229](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:3229>), [App.tsx:3470](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:3470>).

### B15 — Skupni podatki med adminom, javnim delom in Moj DOM niso skupni

**Presoja: nasprotje pri že povezanih tokovih; P1.**

Dokument izrecno določa en zapis in povezano uporabo podatkov med tremi deli platforme.

Prototip nove dogodke/programske zapise/rezervacije shranjuje v localStorage, številne javne strani in Moj DOM pa berejo prvotne uvožene sezname. Zato nov dogodek obstaja v admin seznamu, njegov javni URL pa vrne »Stran ni najdena«. Status prijave na program je mogoče spremeniti v adminu, uporabniški seznam pa še bere statični `programmeApplications`. Podobno je pri rezervacijah.

Urejanje dogodka in programa v večini polj samo označi stanje kot shranjeno; celoten spremenjeni zapis se ne posodobi. Uporabniški profil je generični MockForm.

**Najmanjša uskladitev:** za prikazane povezane scenarije uporabiti isto simulirano stanje ali jasno označiti, da je posamezni zaslon ločen prikaz. Ni potreben pravi backend ali razširitev funkcionalnega obsega.

Vir: [Srž platforme](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.181woutosxtb), 29142; [Principi delovanja admin vmesnika](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.pxx1ae380op6).  
Koda: [App.tsx:301](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:301>), [App.tsx:365](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:365>), [App.tsx:1815](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:1815>), [App.tsx:3408](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:3408>), [App.tsx:3927](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:3927>), [App.tsx:5188](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:5188>), [App.tsx:7005](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:7005>), [App.tsx:7248](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:7248>).  
Preverjanje: zapis dodan v pomnilniško simulacijo localStorage je vidljiv v adminu, njegov javni detajl pa ne obstaja. Dejanski uporabnikov localStorage ni bil spremenjen.

### B16 — Detajli različnih obrazcev kažejo iste oddaje

**Presoja: nasprotje pripadnosti oddaje obrazcu; P2.**

Dokument zahteva pregled oddaj posameznega obrazca. Prototip pri Kontakt, Oglaševanje in Partnerstvo uporablja iste prve dve oddaji `submissions.slice(0, 2)`, brez filtra po `flowId`.

Obstoj primerov obrazcev ni samodejno presežek, ker dokument dovoljuje sestavljanje obrazcev. Napačno je, da so njihove oddaje prikazane pod napačnim obrazcem.

**Najmanjša uskladitev:** povezati prikaz z izbranim obrazcem ali prikazati prazen seznam.

Vir: [Modul: obrazci](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.h1nlh62ysyy7), 95432–96198.  
Koda: [App.tsx:5714](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:5714>), [App.tsx:5760](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:5760>).

### B17 — Info ekrani »trenutni dogodek« izberejo po vrstnem redu podatkov

**Presoja: nasprotje pomenu prikazanih informacij; P2.**

Dokument določa trenutni dogodek po objavljenem urniku ter naslednje dogodke po datumu in uri. Prototip za »Zdaj v veliki dvorani« vzame prvo rezervacijo, za program prve štiri dogodke, za novice prve tri novice. Ne preverja trenutnega časa, objave ali kronologije. Predogled monitorja vsebuje dodatno trdo zapisano besedilo.

Manjkajoči urejevalnik sekvenc in prava integracija sta dovoljeni vrzeli. Napačno prikazani »zdaj« in »prihajajoče« pa spreminjajo zahtevano obnašanje.

**Najmanjša uskladitev:** uporabiti konsistenten simulirani čas in objavljene zapise ali odstraniti trditev, da predogled predstavlja dejansko trenutno stanje. Predpisanih pet dogodkov je priporočilo, zato štirih samo po sebi ne označujem za kršitev.

Vir: [Modul: informacijski zasloni](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.7lb78llsq6vn), 98205–100184.  
Koda: [App.tsx:8143](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:8143>).

### B18 — Noga zamenja razločene vloge identitet z eno skupino partnerjev

**Presoja: nasprotje vsebinski hierarhiji; P2.**

Primarna oznaka DOM v glavi je ustrezna. Noga pa pod »Partnerji« združi EU, MOC in MAG-NET ter ne navede MCC kot upravljalca. Dokument zahteva razločevanje projektne, upravljavske, institucionalne in finančne vloge. To ni vprašanje grafične dodelanosti ali končnih logotipov.

**Najmanjša uskladitev:** že z navadnim besedilom pravilno imenovati vloge in navesti upravljalca. Iz analize ne izhaja nova odločitev o obveznih mestih ali trajanju označevanja EU/EUI; dokument ju še pušča odprta.

Vir: [Pravila uporabe identitet](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.lnscqen953dx); [Stalni elementi spletnega mesta](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.qfm8pvprf7s5).  
Koda: [App.tsx:788](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:788>).

### B19 — Izbira EN ustvari mešan jezik, admin pa vsebuje angleške operativne oznake

**Presoja: delna izvedba, ki ne izpolni pomena že prikazane funkcije; P2.**

Dokument določa prevod vsebine in UI v izbrani jezik ter slovenska uporabniška besedila. Prototip prevede omejen slovar navigacije in drugih oznak, glavnina vsebine pa ostane slovenska. Na `/prostori?lang=en` se tako izpišeta angleška navigacija in slovenski naslov »Sodobni prostori za ustvarjanje«.

V adminu so med drugim »Main menu«, »Aux menu«, »DOM owner«, »Task reference« in angleški statusi objave.

**Najmanjša uskladitev:** ne predstavljati delnega prevoda kot celotne angleške različice; obdržati slovenski prikaz ali jasno omejeno demonstracijo jezika. Angleščino v admin oznakah nadomestiti s slovenskimi izrazi. Strojni prevod ni obvezna izbrana tehnika.

Vir: [Jezik in prevodi spletne strani](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.6hmpcgt7jvbo); [Kakovostna vsebina v slovenščini](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.jwahmmml2cin).  
Koda: [App.tsx:1353](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:1353>), [App.tsx:4371](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:4371>), [App.tsx:5335](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:5335>), [App.tsx:5450](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:5450>), [i18n.tsx:135](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/i18n.tsx:135>).  
Preverjanje: mešan jezik potrjen z izrisom.

## 5. Navigacijska priporočila in nasprotujoči si viri v prototipu

### C01 — Tri priporočene javne poti nimajo ustreznih aliasov

**Presoja: odstopanje priporočeni IA; P3.**

| Vsebina | Dokument | Prototip |
| --- | --- | --- |
| Mediji | `/predstavitev/mediji` | `/predstavitev/media` |
| Detajl programa | `/skupnost/programi/:slug` | `/skupnost/:slug` |
| Začetek včlanitve | `/skupnost/pridruzi-se` | `/clani/pridruzi-se` |

Priporočene poti trenutno vrnejo »Stran ni najdena«. Dokument izrecno dopušča drugačno poimenovanje po predhodnem posvetu, zato tega ne označujem kot dodatne nedovoljene funkcije ali absolutne prepovedi obstoječih URL-jev.

Pri prijavi je dokument sam nedosleden: drevo URL uporablja `/moj-dom/prijava`, poglavje Registracija in prijava pa `/clani/prijava`. Prototip uporablja drugo, ki ima zato neposredno podlago. Odsotnost prve ni nedvoumna kršitev.

**Najmanjša uskladitev:** za tri jasne razlike slediti priporočenim potem oziroma po potrebi uporabiti preusmeritve. Pri prijavi ne izmišljati nove odločitve na podlagi nejasnega vira.

Vir: [Informacijska arhitektura in navigacija spletnega mesta](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.8ddbd54s0rhs); [Drevo URL naslovov spletne strani](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.thyj1m1s4ief); [Registracija in prijava](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.wpbq5mt3e6s4).  
Koda: [App.tsx:724](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:724>), [App.tsx:741](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:741>), [App.tsx:742](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:742>), [App.tsx:762](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:762>).  
Preverjanje: štiri alternativne poti preverjene z izrisom; prijavna razlika razvrščena kot nejasnost vira.

### C02 — Vgrajena dokumentacija predstavlja stare specifikacije kot potrjeno avtoriteto

**Presoja: nasprotje novo določeni avtoriteti vira; P1 za nadaljnje delo.**

`/documentation` še prikazuje lokalne generirane specifikacije. Uvod jih imenuje »Šest potrjenih specifikacij platforme«; ob slovenskem prevodu uporabniku naroča, naj za natančne odločitve preveri angleški izvirnik. S tem prototip kaže drugo avtoriteto, kot jo je uporabnik določil za to analizo.

Orodji `/documentation` in `/prototype` sami po sebi nista nujno nedovoljeni poslovni funkciji: sta lahko ločeni delovni orodji. Problem je vsebina trditve o veljavnosti in njuno mešanje s produktno površino, npr. povezava na prototip iz admin nastavitev.

**Najmanjša uskladitev:** stare dokumente označiti kot zgodovinske in pregledovalnik jasno usmeriti na veljavni vir, če ostane v uporabi. To poročilo obstoječih dokumentov ne spreminja.

Vir: uporabnikovo navodilo o edinem viru; [Rezultat načrtovanja](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.3uq18i2o2hf0).  
Koda: [App.tsx:4210](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:4210>), [App.tsx:4296](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:4296>), [App.tsx:9180](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/App.tsx:9180>), [docs/specDocuments.ts:1](</Users/danijelkurincic/Documents/2026 MAG-NET/prototype/src/docs/specDocuments.ts:1>).

## 6. Dovoljene vrzeli: ne spreminjati jih samodejno v razvojne naloge

Spodnje zahteve imajo podlago v specifikaciji, vendar so v prototipu odsotne ali le delno prikazane. Po uporabnikovem merilu jih ni treba dopolniti samo zaradi skladnosti. Kjer že prikazani del daje napačen izid, velja ustrezna ugotovitev iz poglavja 4.

| Področje | Kaj je neizvedeno oziroma delno | Presoja |
| --- | --- | --- |
| Registracija in prijava | Samostojna registracija, potrjevanje e-naslova, dejanska identiteta, upravljanje gesla, prava kontrola admin dostopa | Dovoljena vrzel; demonstracija mora ločiti račun od članstva. |
| Prostori javno | Filtriranje, bogate galerije, ceniki, dodatne storitve, popolni kontakti in mere | Dovoljena delna pokritost. |
| Arhiv dogodkov | Filtriranje po datumu; seznam je zgolj po statusu `archived` | Filtri so vrzel; to ni razlog za odstranitev arhiva. |
| Novice javno | Celovit seznam in filtri; trenutno izbor novic, obvestil in pozivov | Dovoljena delna pokritost, ne nova nedovoljena kategorija. |
| Uporabniški zahtevki | Naknadno urejanje/brisanje pred odločitvijo, filtri, povezava do nastale rezervacije | Dovoljena vrzel. |
| Rezervacije v Moj DOM | Opomniki, urejanje lastnih rezervacij, popoln seznam zahtevkov | Dovoljena vrzel; prikaz tujih podrobnosti je ločeno nasprotje. |
| Programi | Datumi, mediji, organizacije, prilagodljivi obrazci, uporabniška gradiva | Dovoljena vrzel. |
| Dodatne storitve | Samostojen katalog; v dogodku so le besedilno polje | Dovoljena vrzel. |
| Oprema | Koledar zasedenosti in konfliktnost opreme, prava vezava rezervacij | Dovoljena vrzel; popis opreme je podprt. |
| CMS | WYSIWYG, sestavljanje/razvrščanje blokov, pravi predogled, urejanje hierarhije in profilov | Dovoljena vrzel; obstoječi tekstovni nadomestek ne dokazuje končne rešitve urejevalnika. |
| Obrazci | Poln sestavljalnik polj in korakov, transakcijska e-pošta, celovita obravnava oddaj | Dovoljena vrzel. |
| Mediji | Dodajanje/urejanje, datotečne pravice, avtorstvo, opisi in alternative | Dovoljena vrzel. |
| Info ekrani | Urejanje sekvenc, trajanja, objava, zaščita trenutnega dogodka, odpornost ob izpadu | Dovoljena vrzel. |
| Naloge | Modul lastnih in dodeljenih nalog, komentiranje in statusi | Dovoljena vrzel; modul je v specifikaciji izrecno dovoljen. |
| Interni imenik in obvestila vodstva | Ločen imenik ter priprava/pošiljanje obvestil | Dovoljena vrzel; ne enačiti z javnimi profili oseb/organizacij. |
| Integracije | MOC objave novic in dogodkov, Prima, računovodstvo, ponudniki newsletterja/trgovine/vstopnic | Dovoljena vrzel; ni treba vzpostavljati resničnih povezav. |
| Revizijska sled | Izvajalec, čas, predhodno/novo stanje in komentar; trenutna zgodovina je predvsem vzorčna | Dovoljena vrzel; prikaz zgodovine ne dokazuje delujočega beleženja. |
| Dostopnost in zasebnost | Celovit pregled WCAG, končna pravna besedila, upravljanje relevantnih piškotkov | Ločeno preverjanje še ni opravljeno; to poročilo ni pravna ali celovita dostopnostna presoja. |

Podlage: [Sklop: prostori](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.f4u4arkjidn6), [Sklop: dogodki](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.knyy6j22j2de), [Sklop: novice](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.gl9y7pxjq1hd), [Moj DOM](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.d3w1p7umecue), [Modul: prostori](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.aihoszi29o1n), [Modul: programi](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.25leqp8kiczl), [Modul: uredniška vsebina](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.wltlt9umygkj), [Modul: obrazci](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.h1nlh62ysyy7), [Modul: informacijski zasloni](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.7lb78llsq6vn), [Modul naloge](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.t04w1atg57bq), [Ostale admin funkcionalnosti](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.f1ajfqvj624z), [Modul sodelavci](https://docs.google.com/document/d/1-GCdhE1OAoFoeRUkDLHpens8mXQqqWiorRzxIh43ikY/edit?tab=t.0#heading=h.2g75d7n8ayor).

## 7. Česa ne bi odstranjeval na podlagi te analize

Naslednje stvari imajo dovolj jasno podlago v dokumentu:

- pet glavnih javnih sklopov in podnavigacija Skupnosti;
- skupine prostorov po uporabi ter vključevanje HUB, rezidenc in ateljejev;
- ločitev zahtevka od rezervacije in status odobritve za koledar;
- ločene rezervacije brez dogodka in več rezervacij povezanih z dogodkom;
- članstvo, njegove ravni, evidence plačil in Moj DOM kot koncept;
- skupni statusi aktiven/neaktiven/član: dokument jih izrecno dovoljuje;
- skupine registriran uporabnik, sodelavec in administrator;
- prikaz povezanih vstopnic ter podatkov o prijavah iz zunanjega sistema;
- različne vsebinske oznake novic, pozivi in pripeti obrazci;
- uredniške predstavitve oseb in organizacij, ločene od uporabniških računov;
- popis opreme, povezovanje z dogodki, programi in prostori;
- poročila, finance ali naloge kot povezani zapisi, kadar so zgolj sklici na predvidene postopke;
- stopenjska oziroma nizka vizualna dodelanost prototipa in izmišljeni demonstracijski zapisi.

Polje ali primer brez dobesedno enakega imena v dokumentu ni samodejno nov modul. Dokument pri več podatkovnih modelih uporablja odprte formulacije »lahko vsebuje« ali »med drugim«. Strogo merilo je treba uporabljati za vsebinske razširitve, ne za vsako tehnično podrobnost.

Prav tako ne bi samodejno izločil samostojne rezervacije brez ročne potrditve: dokument jo izrecno navaja kot varianto scenarija 5 in pri razširjenih skupinah. Prototip pa ne sme poljubno predpostaviti, da to velja za vse člane.

## 8. Razlike v samem viru, ki jih analiza ne razrešuje z ugibanjem

Dokument je kljub internim delovnim ostankom edini veljavni vir:

1. Prijavna pot je na dveh mestih različna: `/moj-dom/prijava` in `/clani/prijava`.
2. Naloge so opisane kot modul in v matriki dostopov, niso pa posebej navedene v priporočenem glavnem admin meniju. Manjkajoča postavka v enem seznamu ne izniči opisa funkcionalnosti.
3. Pri zahtevi »Urejanje obrazca za prijavo na programe« je opis očitno o rezervaciji prostorov. Za obseg programov so uporabljeni okoliški odstavki, ne domnevno nove zahteve iz napačnega opisa.
4. Uvod opisuje dokument kot usklajen osnutek za naslednje faze, uporabnik pa ga je izrecno določil kot končni vir za trenutno usklajevanje. Pri tej analizi velja uporabnikova določitev.
5. Integracije so praviloma možnosti, ne vse dokončno izbrani ponudniki. Prima je izrecno že izbrana; Olaii ima konkretno oporo pri nakupu kart. Iz primerov CMS, newsletter ali trgovine ne izpeljujem obvezne izbire ponudnika.
6. Končna mesta in trajanje prikaza EU/EUI ostajajo označena kot odprta vprašanja. Analiza zato ocenjuje pomen prikazanih vlog, ne njihove pravne ustreznosti.

## 9. Predlagani vrstni red uskladitve

To je predlog na podlagi ugotovitev, ne izvedeno delo in ne dopolnitev specifikacije.

1. **Odstraniti presežni obseg:** lastni checkout trgovine, lastno prodajo/izdajo kart in neupravičene omejitve najema (A01–A04).
2. **Popraviti napačne poslovne izide in vidnost:** članstvo, javne osnutke, tuje rezervacije, interna navodila, pravice integracij in odvisnost Prima kartice (B01–B06, B11).
3. **Uskladiti rezervacije:** mesto urejanja, konflikte, shranjevanje prikazanih podatkov in pomen odobritve (B07–B10).
4. **Uskladiti povezane tokove:** javni obrazci, prijave na programe, Moj DOM in skupno simulirano stanje (B12–B16).
5. **Popraviti prikaz:** info ekrane, vloge identitet, jezike, priporočene URL-je in staro dokumentacijo (B17–B19, C01–C02).
6. Manjkajoče funkcije iz poglavja 6 razvijati samo na podlagi nadaljnje izrecne odločitve o obsegu prototipa.

## 10. Preverjanje in omejitve dokazov

Poleg vsebinskega pregleda dokumenta in kode je bilo izvedenih **14 ciljnih preverjanj dejanskega izrisa React komponent** z MemoryRouter in pomnilniško simulacijo localStorage. Vseh 14 je potrdilo preverjano opažanje:

- javni detajl osnutka dogodka;
- javni detajl interne pisarne;
- neposredni admin prikaz brez simulirane prijave;
- tri nedelujoče priporočene javne poti in alternativna prijavna pot;
- mešan jezik na angleški strani;
- prijavni obrazec na programu;
- omejitve trajanja in začetnih ur najema;
- naslov rezervacije drugega prosilca v Moj DOM;
- lokalno dodan dogodek v admin seznamu;
- odsotnost javnega detajla tega dogodka.

To ni brskalniški test klikov, vizualna presoja ali preverjanje objavljene strani. Ugotovitve o shranjevanju, plačilnem stanju, soglasjih, konfliktih in odvisnostih statusov temeljijo na neposrednem pregledu obdelovalnikov dogodkov v kodi. Dejanske transakcije ali zunanje storitve niso bile izvedene.

V okviru analize niso bili spremenjeni prototip, končne specifikacije, Google dokument ali referenčna gradiva. Ustvarjeno je samo to poročilo in začasni lokalni pripomočki za preverjanje.
