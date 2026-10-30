const fs = require('fs');
const path = require('path');
const {chromium} = require('/Users/danijelkurincic/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=__dirname;
const ds=JSON.parse(fs.readFileSync(path.join(root,'visual-system.json')));
const flow=JSON.parse(fs.readFileSync(path.join(root,'booking-flow.json')));
const c=ds.colors;
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const font=(name,file)=>`@font-face{font-family:'${name}';src:url(data:font/ttf;base64,${fs.readFileSync(path.join(root,'assets',file)).toString('base64')}) format('truetype');font-weight:100 900;}`;
const css=font(ds.titleFont,'RobotoCondensed.ttf')+font(ds.bodyFont,'NotoSans.ttf');
function text(x,y,lines,{size=21,color=c.text,weight=400,title=false,anchor='start',line=30}={}){
  return `<text x="${x}" y="${y}" fill="${color}" font-family="${title?ds.titleFont:ds.bodyFont}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${(Array.isArray(lines)?lines:[lines]).map((s,i)=>`<tspan x="${x}" dy="${i?line:0}">${esc(s)}</tspan>`).join('')}</text>`;
}
const rect=(x,y,w,h,fill,stroke='none',rx=0,dash='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="1.5" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
const edge=(d,{dash=false}={})=>`<path d="${d}" fill="none" stroke="${c.purple}" stroke-width="2.3" ${dash?'stroke-dasharray="7 7"':''} marker-end="url(#arrow)"/>`;
function svg(h,content,w=1080){return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><style>${css}</style><marker id="arrow" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto"><path d="M1 1 L7 4 L1 7" fill="none" stroke="${c.purple}" stroke-width="1.5"/></marker></defs>${rect(0,0,w,h,c.paper)}${content}</svg>`;}
function card(n){
  const fill=n.kind==='system'?c.system:n.kind==='touchpoint'?c.touchpoint:n.kind==='end'?c.light:c.paper;
  const stroke=n.kind==='optional'?c.purple:c.line;
  return rect(n.x,n.y,n.w||310,n.h,fill,stroke,2,n.kind==='optional'?'7 6':'')+
    (n.step?text(n.x+(n.w||310)-18,n.y+23,n.step,{size:15,color:c.blue,weight:700,anchor:'end'}):'')+
    text(n.x+18,n.y+40,n.title,{size:n.w?26:28,title:true,weight:700})+
    text(n.x+18,n.y+70,n.body,{size:n.w?17:19,line:26});
}
let main=text(42,44,'KLJUČNI UPORABNIŠKI TOKOVI',{size:16,color:c.blue,weight:700})+
text(42,112,flow.title.join(' '),{size:48,title:true,weight:700,color:c.blue})+
rect(2130,64,148,38,c.purple,'none',19)+text(2204,89,'TOK 01',{title:true,size:22,weight:700,color:'white',anchor:'middle'})+
text(42,168,'Uporabnik: gost / registriran uporabnik   ·   Storitev: uporaba prostora',{size:21,color:c.muted});
flow.lanes.forEach((label,i)=>{
 const y=240+i*210;
 main+=rect(42,y,145,170,c.phase)+text(114,y+78,label==='Povezani sistemi'?['Povezani','sistemi']:label==='Uprava DOMA'?['Uprava','DOMA']:label,{size:28,title:true,weight:700,anchor:'middle',line:34});
});
main+=`<path d="M205 435H2278 M205 645H2278" stroke="${c.line}" stroke-width="1.5" stroke-dasharray="8 9"/>`;
main+=edge('M490 331 H530')+edge('M800 331 H820 V541 H840')+edge('M1110 541 H1145');
main+=`<path d="M1240 477 L1335 541 L1240 605 L1145 541Z" fill="${c.paper}" stroke="${c.purple}" stroke-width="2"/>`+
text(1240,533,['Zahtevek','odobren?'],{title:true,size:26,weight:700,anchor:'middle',line:30});
main+=edge('M1240 477 V331 H1390')+text(1270,318,'NE',{size:17,color:c.purple,weight:700});
main+=edge('M1335 541 H1390')+text(1363,527,'DA',{size:17,color:c.purple,weight:700,anchor:'middle'});
main+=edge('M1660 541 H1680 V751 H1700')+edge('M1970 751 H1990 V331 H2010')+edge('M1990 751 H2010',{dash:true});
main+=flow.cards.map(card).join('');
main+=rect(42,868,2236,74,c.paper,c.purple,8,'7 6')+text(62,899,flow.note,{size:19,line:27});
fs.writeFileSync(path.join(root,'booking-flow.svg'),svg(980,main,2320));
let board=text(42,48,'M3 POROČILO · SISTEM ZA UPORABNIŠKE TOKOVE',{size:16,color:c.blue,weight:700})+
text(42,117,'Vizualni sistem',{title:true,size:56,color:c.blue,weight:700})+
text(42,160,'Povzeto po referenčnih ekranih; prilagojeno diagramom v poročilu.',{size:21,color:c.muted});
board+=text(42,225,'01  Barve',{title:true,size:32,weight:700,color:c.blue});
const swatches=[['blue','Glavna modra'],['purple','Poudarek'],['phase','Faze / pasovi'],['touchpoint','Stična točka'],['system','Sistem']];
swatches.forEach(([key,name],i)=>{const x=42+i*202;board+=rect(x,249,188,67,c[key])+text(x,343,name,{size:18,weight:600})+text(x,371,c[key],{size:17,color:c.muted});});
board+=text(42,434,'02  Tipografija',{title:true,size:32,weight:700,color:c.blue})+
text(42,489,'Roboto Condensed Bold',{title:true,size:37,weight:700})+text(42,526,'Naslovi strani, pasov in korakov',{size:19,color:c.muted})+
text(565,483,'Noto Sans Regular',{size:27})+text(565,522,'Opisi, oznake in opombe. Č Š Ž č š ž',{size:20,color:c.muted});
board+=text(42,588,'03  Gradniki in povezave',{title:true,size:32,weight:700,color:c.blue});
board+=card({x:42,y:618,h:108,title:'Aktivnost',body:['Kratek, jasen opis koraka']})+
rect(387,618,310,108,c.touchpoint,c.line,2)+text(405,658,'Stična točka',{title:true,size:28,weight:700})+text(405,688,'Spletno mesto / Moj DOM',{size:19})+
rect(730,618,308,108,c.system,c.line,2)+text(748,658,'Povezani sistem',{title:true,size:28,weight:700})+text(748,688,'Koledar / Prima / obračun',{size:19});
board+=edge('M42 773 H182')+text(201,779,'Zaporedje',{size:19})+
edge('M390 773 H530',{dash:true})+text(550,779,'Pogojna povezava',{size:19})+
rect(42,821,996,80,'white',c.purple,8,'7 6')+text(62,853,['Vijoličen črtkan okvir označuje pojasnilo ali pogojni korak.', 'Barva vedno dopolnjuje besedilo; pomen ni odvisen samo od barve.'],{size:19,line:27});
board+=text(42,950,'04  Postavitev',{title:true,size:32,weight:700,color:c.blue})+
text(42,991,['Tri vrstice odgovornosti · potek od leve proti desni · bele površine', 'En tok na sliko · razločne puščice · brez dekorativnih elementov'],{size:21,line:34})+
text(42,1092,'Potrjeno: #2142CB, Roboto Condensed, Noto Sans. Drugi odtenki so povzeti po slikah.',{size:17,color:c.muted});
fs.writeFileSync(path.join(root,'visual-system.svg'),svg(1130,board));
(async()=>{
 const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 for(const name of ['visual-system','booking-flow']){
  const page=await browser.newPage({viewport:{width:name==='booking-flow'?2320:1080,height:1130},deviceScaleFactor:2});
  await page.setContent(`<html><head><meta charset="utf-8"><style>body{margin:0}svg{display:block}</style></head><body>${fs.readFileSync(path.join(root,name+'.svg'),'utf8')}</body></html>`);
  await page.evaluate(async()=>{await document.fonts.ready;});
  const checks=await page.evaluate(()=>({fonts:[document.fonts.check('700 28px "Roboto Condensed"'),document.fonts.check('19px "Noto Sans"')],overflow:[...document.querySelectorAll('text')].map(t=>({text:t.textContent,b:t.getBBox()})).filter(t=>t.b.x<0||t.b.x+t.b.width>document.querySelector('svg').viewBox.baseVal.width).map(t=>t.text)}));
  if(checks.overflow.length||checks.fonts.includes(false))throw new Error(JSON.stringify(checks));
  await page.locator('svg').screenshot({path:path.join(root,name+'.png')});
  console.log(name,JSON.stringify(checks));await page.close();
 }
 await browser.close();
})();
