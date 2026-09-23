/* Smart Elektro battery story — dependency-free, scoped, fixed illustrative values. */
(() => {
  if (customElements.get('smart-battery-story')) return;
  const assetBase = new URL('.', document.currentScript.src);
  const icons = {
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    home:'<path d="m3 11 9-8 9 8M5 10v10h14V10M10 20v-7h4v7"/>',
    battery:'<rect x="3" y="6" width="17" height="12" rx="2"/><path d="M23 10v4M7 10v4m4-4v4m4-4v4"/>',
    grid:'<path d="m12 2-6 20m6-20 6 20M8 7h8M6 12h12M4 17h16M4 7h16M3 12h18"/>',
    inverter:'<rect x="5" y="2" width="14" height="20" rx="3"/><path d="M9 7h6m-7 8c2-6 6 6 8 0"/>',
    shield:'<path d="m12 3-9 3v6c0 5 9 9 9 9s9-4 9-9V6Z"/><path d="m8 12 3 3 5-6"/>',
    trade:'<path d="M3 7h17m-5-5 5 5-5 5M21 17H4m5-5-5 5 5 5"/>'
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
  const chapters = [
    {name:'Mer egenbruk',icon:'sun',title:'Dagens sol. Kveldens strøm.',copy:'Solcellene forsyner huset først. Batteriet tar vare på overskuddet, så du kan bruke mer av din egen strøm etter at solen har gått ned.'},
    {name:'Nødstrøm',icon:'shield',title:'Strøm til det viktigste.',copy:'Med en egnet backup-løsning kan batteriet holde utvalgte kurser i gang når strømmen går. Solcellene kan fylle på igjen når forholdene tillater det.'},
    {name:'Smart strømhandel',icon:'trade',title:'Lagre billig. Bruk eller selg dyrere.',copy:'Smart styring kan lade fra nettet når strømmen er billig. Når prisen stiger, kan energien brukes i huset eller selges tilbake til nettet.'}
  ];
  const scenes = [
    {mode:0,name:'Solrik dag',time:'12:00',title:'Huset får strøm. Resten lagres.',sub:'6 kW fra taket fordeles mellom huset og batteriet.',solar:6,home:2,battery:4,grid:0,soc:80,dir:1,flow:'charge',metric:'4 kW',label:'solstrøm lades inn i batteriet',comparison:'Uten batteri ville dette overskuddet blitt sendt ut på nettet.',note:'Strømmen går via inverteren, som kobler solceller, batteri, hus og nett sammen.',charge:'Lader fra solen'},
    {mode:0,name:'Kveld',time:'20:00',title:'Solen er borte. Strømmen er din.',sub:'Lagret solenergi dekker husets forbruk i dette øyeblikket.',solar:0,home:2,battery:2,grid:0,soc:55,dir:-1,flow:'discharge',metric:'0 kW',label:'kjøpes fra strømnettet akkurat nå',comparison:'Uten batteri ville huset kjøpt 2 kW fra strømnettet.',note:'Du sparer kjøpet av strømmen du erstatter. Verdien må ses opp mot tapt salgsinntekt, energitap og batteriets kostnad.',charge:'Leverer til huset'},
    {mode:1,name:'Strømbrudd',time:'NETTET ER NEDE',title:'Nabolaget er mørkt. Det viktigste virker.',sub:'Batteriet forsyner lys, kjøleskap og internett på valgte kurser.',solar:0,home:.3,battery:.3,grid:0,soc:80,dir:-1,flow:'backup',metric:'ca. 26 timer',label:'med 8 kWh tilgjengelig og 300 W samlet last',comparison:'Eksempel uten solpåfyll. Oppvarming, varmtvann og billading er ikke med.',note:'Forutsetter kompatibel inverter, backup-utstyr og sikker frakobling fra nettet. 300 W inkluderer systemforbruk; faktisk driftstid varierer.',charge:'Holder valgte kurser i gang'},
    {mode:1,name:'Solpåfyll',time:'NESTE MORGEN',title:'Solen kan gi beredskapen mer tid.',sub:'I dette eksemplet dekker solen lasten og lader batteriet samtidig.',solar:2,home:.3,battery:1.7,grid:0,soc:45,dir:1,flow:'backup-solar',metric:'1,7 kW',label:'fylles på mens viktige kurser er i bruk',comparison:'Nettet er fortsatt frakoblet. Solpåfyll kan forlenge driftstiden.',note:'Krever solproduksjon i øydrift. Vær, årstid, last og batterinivå avgjør hvor lenge strømmen varer; dette er ikke ubegrenset nødstrøm.',charge:'Lader under strømbruddet'},
    {mode:2,name:'Kjøp billig',time:'LAV STRØMPRIS',title:'Batteriet fylles når prisen er lav.',sub:'Her vises bare strømmen til handelen; husets øvrige forbruk er utelatt.',solar:0,home:0,battery:3,grid:3,soc:35,dir:1,flow:'buy',metric:'0,60 kr/kWh',label:'eksempel på samlet variabel kjøpspris',comparison:'10 kWh kjøpt til denne prisen koster 6 kr.',note:'Kjøpsprisen i eksemplet inkluderer variable kjøpskostnader. Prisene er faste illustrasjoner, ikke dagens strømpris.',charge:'Lader fra nettet'},
    {mode:2,name:'Selg dyrere',time:'HØY STRØMPRIS',title:'Lagret strøm kan selges når prisen stiger.',sub:'Batteriet sender strøm tilbake til nettet gjennom inverteren.',solar:0,home:0,battery:3,grid:-3,soc:65,dir:-1,flow:'sell',metric:'12 kr',label:'eksempelmargin før slitasje og øvrige kostnader',comparison:'10 kWh inn → 9 kWh ut. Salg: 9 × 2 kr = 18 kr. Kjøp: 6 kr.',note:'10 % energitap. 2 kr/kWh er salgspris etter variable salgsgebyrer. Krever egnet styring og avklart nett-/strømavtale. Ingen garanti for inntekt; investering og øvrige kostnader er ikke trukket fra.',charge:'Selger til nettet'}
  ];
  const num = value => value.toLocaleString('nb-NO',{maximumFractionDigits:1});
  class SmartBatteryStory extends HTMLElement {
    static get observedAttributes() { return ['mode','contact-href']; }
    constructor() { super(); this.attachShadow({mode:'open'}); this.scene=0; this.elapsed=0; this.playing=true; this.visible=true; }
    connectedCallback() {
      if (this.initialized) { this.observe(); this.schedule(); return; }
      this.initialized=true;
      this.reduced=matchMedia('(prefers-reduced-motion: reduce)');
      this.playing=!this.reduced.matches && !this.hasAttribute('paused');
      const style=document.createElement('link'); style.rel='stylesheet'; style.href=new URL('smart-battery.css',assetBase).href;
      this.shadowRoot.append(style);
      const root=document.createElement('section');root.className='se-story';
      root.innerHTML=`<div class="se-layout"><div class="se-copy"><p class="se-eyebrow">${icon('battery')} SOLCELLER + BATTERI</p><h2>Ta vare på solstrømmen.<br><span>Bruk den når du trenger den.</span></h2><p class="se-intro">Egen strøm gir frihet. Et batteri gir deg flere muligheter til å bruke den.</p><div class="se-modes" role="group" aria-label="Velg hva batteriet skal vise">${chapters.map((c,i)=>`<button type="button" data-mode="${i}" aria-pressed="${i===0}">${icon(c.icon)}${c.name}</button>`).join('')}</div><div class="se-explain"><h3 data-text="chapter-title"></h3><p data-text="chapter-copy"></p></div><a class="se-cta" href="#kontakt">Finn riktig batteriløsning <span aria-hidden="true">↗</span></a></div><div class="se-panel"><div class="se-toolbar"><span class="se-kicker">SLIK JOBBER BATTERIET</span><button type="button" class="se-play" aria-label="Sett animasjonen på pause"></button></div><div class="se-compact-modes" role="group" aria-label="Velg hva batteriet skal vise">${chapters.map((c,i)=>`<button type="button" data-mode="${i}" aria-pressed="${i===0}">${c.name}</button>`).join('')}</div><div class="se-scene-head"><p class="se-time" data-text="time"></p><h3 data-text="title"></h3><p class="se-sub" data-text="sub"></p></div><div class="se-diagram" role="img" aria-label=""><svg class="se-wires" viewBox="0 0 600 370" preserveAspectRatio="none" aria-hidden="true"><g class="se-wire-base"><path d="M300 75V155"/><path d="M300 218V297"/><path d="M116 185H255"/><path d="M345 185H484"/></g><g class="se-wire-active"><path class="se-solar-wire" d="M300 75V155"/><path class="se-battery-wire" d="M300 218V297"/><path class="se-grid-wire" d="M116 185H255"/><path class="se-home-wire" d="M345 185H484"/></g></svg><div class="se-node se-solar">${icon('sun')}<span>Solceller</span><strong data-text="solar"></strong></div><div class="se-node se-grid">${icon('grid')}<span>Strømnettet</span><strong data-text="grid"></strong></div><div class="se-node se-inverter">${icon('inverter')}<span>Inverter</span></div><div class="se-node se-home">${icon('home')}<span data-text="home-name"></span><strong data-text="home"></strong></div><div class="se-node se-battery"><div class="se-battery-shell"><div class="se-battery-fill"></div><span data-text="soc"></span></div><span>Batteri · 10 kWh</span><strong data-text="battery"></strong></div><span class="se-disconnected">Nettet frakoblet</span></div><div class="se-battery-state"><span data-text="charge"></span><span data-text="energy"></span></div><div class="se-benefit"><div><strong data-text="metric"></strong><span data-text="label"></span></div><p data-text="comparison"></p></div><div class="se-steps" role="group" aria-label="Velg øyeblikk"></div><details class="se-assumptions"><summary>Forutsetninger for eksemplet</summary><p class="se-note" data-text="note"></p></details><p class="se-caption">Illustrative øyeblikk med faste verdier · ikke måledata</p><div class="se-progress" aria-hidden="true"><span></span></div><span class="se-status" role="status" aria-live="polite"></span></div></div>`;
      this.shadowRoot.append(root);this.root=root;
      root.addEventListener('click',e=>{
        const button=e.target.closest('button');
        if(button?.hasAttribute('data-mode')) this.select(Number(button.dataset.mode)*2);
        if(button?.hasAttribute('data-scene')) this.select(Number(button.dataset.scene));
        if(button?.classList.contains('se-play')) {this.playing=!this.playing;this.elapsed=0;this.render();}
        if(e.target.closest('.se-cta')) {const event=new CustomEvent('battery-contact',{bubbles:true,composed:true,cancelable:true});if(!this.dispatchEvent(event))e.preventDefault();}
      });
      this.onMotion=()=>{if(this.reduced.matches){this.playing=false;this.render();}};
      this.reduced.addEventListener('change',this.onMotion);
      this.onVisibility=()=>{this.last=performance.now();};document.addEventListener('visibilitychange',this.onVisibility);
      this.scene=this.modeIndex()*2;this.render();this.observe();this.schedule();
    }
    modeIndex(){return Math.max(0,['egenbruk','nodstrom','handel'].indexOf(this.getAttribute('mode')));}
    attributeChangedCallback(name,oldValue,newValue){if(!this.initialized||oldValue===newValue)return;if(name==='contact-href'){this.shadowRoot.querySelector('.se-cta').setAttribute('href',newValue||'#kontakt');return;}if(scenes[this.scene].mode!==this.modeIndex())this.select(this.modeIndex()*2,false);}
    observe(){this.observer=new IntersectionObserver(entries=>{this.visible=entries[0].isIntersecting;this.root?.classList.toggle('se-offscreen',!this.visible);this.last=performance.now();});this.observer.observe(this);}
    disconnectedCallback(){clearInterval(this.timer);this.observer?.disconnect();document.removeEventListener('visibilitychange',this.onVisibility);this.reduced?.removeEventListener('change',this.onMotion);this.initialized=false;this.shadowRoot.replaceChildren();}
    select(index,emit=true){this.scene=index;this.elapsed=0;this.playing=false;this.render();this.shadowRoot.querySelector('.se-status').textContent=scenes[index].title;if(emit)this.emitMode();}
    emitMode(){this.dispatchEvent(new CustomEvent('battery-mode-change',{detail:{mode:['egenbruk','nodstrom','handel'][scenes[this.scene].mode]},bubbles:true,composed:true}));}
    schedule(){clearInterval(this.timer);this.last=performance.now();this.timer=setInterval(()=>{const now=performance.now();const dt=Math.min(now-this.last,300);this.last=now;if(!this.playing||!this.visible||document.hidden)return;this.elapsed+=dt;if(this.elapsed>=9000){this.elapsed=0;this.scene=(this.scene+1)%scenes.length;this.render();this.emitMode();}this.shadowRoot.querySelector('.se-progress span').style.width=`${this.elapsed/90}%`;},100);}
    render(){
      const s=scenes[this.scene],c=chapters[s.mode];
      this.root.dataset.flow=s.flow;this.root.classList.toggle('se-paused',!this.playing);
      const text={'chapter-title':c.title,'chapter-copy':c.copy,...s,solar:`${num(s.solar)} kW`,home:`${num(s.home)} kW`,battery:`${s.dir>0?'+':'−'}${num(s.battery)} kW`,grid:s.mode===1?'Frakoblet':s.grid<0?`${num(-s.grid)} kW ut`:`${num(s.grid)} kW inn`,soc:`${s.soc}%`,energy:`${num(s.soc/10)} / 10 kWh`,'home-name':s.mode===1?'Valgte kurser':'Huset'};
      this.shadowRoot.querySelectorAll('[data-text]').forEach(el=>el.textContent=text[el.dataset.text]??'');
      this.shadowRoot.querySelectorAll('[data-mode]').forEach(el=>el.setAttribute('aria-pressed',String(Number(el.dataset.mode)===s.mode)));
      this.shadowRoot.querySelector('.se-battery-fill').style.height=`${s.soc}%`;
      const play=this.shadowRoot.querySelector('.se-play');play.textContent=this.playing?'Ⅱ Pause':'▷ Spill av';play.setAttribute('aria-label',this.playing?'Sett animasjonen på pause':'Spill av alle eksemplene');
      const steps=this.shadowRoot.querySelector('.se-steps');
      // Preserve focus when changing scenes within the same chapter.
      if(steps.dataset.mode!==String(s.mode)){steps.dataset.mode=String(s.mode);steps.innerHTML=scenes.map((x,i)=>x.mode===s.mode?`<button type="button" data-scene="${i}"><span>${i%2+1}</span>${x.name}</button>`:'').join('');}
      steps.querySelectorAll('button').forEach(el=>el.setAttribute('aria-pressed',String(Number(el.dataset.scene)===this.scene)));
      this.shadowRoot.querySelector('.se-diagram').setAttribute('aria-label',`${s.title} Solceller: ${num(s.solar)} kilowatt. ${s.mode===1?'Valgte kurser':'Huset'}: ${num(s.home)} kilowatt. Batteriet ${s.dir>0?'lader':'leverer'} ${num(s.battery)} kilowatt. ${s.mode===1?'Strømnettet er frakoblet.':s.grid<0?`${num(-s.grid)} kilowatt selges til nettet.`:`${num(s.grid)} kilowatt kjøpes fra nettet.`}`);
      this.shadowRoot.querySelector('.se-progress span').style.width='0%';
      const contact=this.getAttribute('contact-href');if(contact)this.shadowRoot.querySelector('.se-cta').setAttribute('href',contact);
    }
  }
  customElements.define('smart-battery-story',SmartBatteryStory);
})();
