const fs = require('fs');
const path = require('path');
const { chromium } = require('/Users/danijelkurincic/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async () => {
  const dir = __dirname;
  const browser = await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
  const page = await browser.newPage({viewport:{width:1800,height:1800},deviceScaleFactor:3});
  await page.setContent('<html><head><meta charset="utf-8"><style>body{margin:0;background:white}#diagram{display:inline-block;padding:24px;background:white}svg{max-width:none!important;display:block}</style></head><body><div id="diagram"></div></body></html>');
  await page.addScriptTag({path:'/private/tmp/magnet-mermaid-10.9.3.min.js'});
  const source=fs.readFileSync(path.join(dir,'website-main.mmd'),'utf8');
  await page.evaluate(async source => {
    mermaid.initialize({startOnLoad:false,securityLevel:'strict'});
    const {svg}=await mermaid.render('websiteia',source);
    document.getElementById('diagram').innerHTML=svg;
    const el=document.querySelector('svg');
    const v=el.viewBox.baseVal;el.setAttribute('width',v.width);el.setAttribute('height',v.height);
  },source);
  await page.locator('#diagram').screenshot({path:path.join(dir,'website-main.png')});
  fs.writeFileSync(path.join(dir,'website-main.svg'),await page.locator('#diagram').innerHTML());
  console.log(await page.locator('#diagram').boundingBox());
  await browser.close();
})();
