'use strict';

const app = document.querySelector('#root');
const allScreens = {...customerScreens,...operationScreens};
const params = new URLSearchParams(location.search);
const requested = params.get('screen');
const embed = params.get('embed')==='1';
const showcase = !Object.hasOwn(allScreens,requested || '');
let screen = showcase ? '' : requested;
let frameObserver;
let activeBoard;
let previouslyFocused;
let toastTimer;

const state = {
  register:false, area:areas[0], address:'', search:'', query:'', category:'All', sort:'recommended',
  meal:'jollof', qty:1, spice:'Medium', cart:['cart','checkout','desk-checkout'].includes(screen)?{'jollof|Medium':1}:{},
  payment:'Demo card', order:null, favorite:false, period:'This week', tableQuery:'', vendorStage:screen==='kitchen-prep'?1:screen==='kitchen-details'?2:0,
  vendorTicket:0, offMenu:[], prepChecks:[], kitchenTicket:'CL-1042', online:true, riderStage:0, people:'Customers', reviews:[]
};

function demoSeed(id) {
  if(['cart','checkout','desk-checkout'].includes(id) && !Object.keys(state.cart).length && !state.order) state.cart={'jollof|Medium':1};
}
function screenUrl(id,inside=false) {
  return '?screen='+encodeURIComponent(id)+(inside?'&embed=1':'');
}
function boardUrl(group,board='') {return 'index.html'+(group==='customer'&&!board?'':'#'+group+(board?'/'+board:''));}
function getJourney(id) {
  return Object.keys(journeys).find(group=>journeys[group].includes(id)) || 'customer';
}
function getBoardFor(id) {
  for(const [group,data] of Object.entries(boards)) {
    const board=data.items.find(item=>item.screens.some(([key])=>key===id));
    if(board) return [group,board.id];
  }
  return ['customer','discovery'];
}

function header(group) {
  return `<header class="show-header">
    <a class="show-brand" href="index.html" aria-label="Chopline design showcase">${logo()}<span>Design showcase</span></a>
    <nav class="show-nav" aria-label="Presentation sections">${Object.entries(boards).filter(([id])=>id!=='design').map(([id,data])=>`<a href="\#${id}" ${id===group?'aria-current="page"':''}>${data.label}</a>`).join('')}</nav>
    <a class="button dark show-play" href="${screenUrl(firstScreen[group])}">${icon('play',17)} <span>Play prototype</span></a></header>`;
}

function frame([id,label],type,solo) {
  const dimensions = type==='mobile'?[390,746]:type==='tablet'?[1024,680]:[1280,770];
  return `<figure class="device-item ${type}-item ${solo?'solo':''}">
    <div class="device ${type}-device">
      ${type==='desktop'?'<div class="browser-chrome"><i></i><i></i><i></i><span>chopline / prototype</span></div>':''}
      ${type==='mobile'?'<div class="device-island"></div>':''}
      <div class="device-viewport" data-frame-width="${dimensions[0]}">
        <iframe src="${screenUrl(id,true)}" width="${dimensions[0]}" height="${dimensions[1]}" title="${label} screen" tabindex="-1"></iframe>
      </div>
      ${type==='mobile'?'<div class="device-home-indicator"></div>':''}
    </div>
    <figcaption><a href="${screenUrl(id)}">${label} ${icon('external',13)}</a></figcaption>
  </figure>`;
}
function systemBoard() {
  return `<div class="system-area">
    <div class="swatches">${palette.map(([name,color,usage])=>`<article><span style="--swatch:${color}"></span><strong>${name}</strong><code>${color}</code><small>${usage}</small></article>`).join('')}</div>
    <div class="system-components">
      <article><span class="eyebrow">TYPOGRAPHY</span><h2>Aa</h2><strong>Bricolage Grotesque</strong><p>DM Sans for content, labels and numbers.</p></article>
      <article><span class="eyebrow">INTERACTION</span><div class="component-example"><span class="button primary">Order food</span><span class="button outline">Browse menu</span></div><div class="example-input">${icon('search',18)} Search dishes or kitchens</div></article>
      <article><span class="eyebrow">ORDER STATUS</span><div class="component-example">${badge('Preparing','yellow')}${badge('On the way','blue')}${badge('Ready','green')}</div><div class="example-notification">${icon('check',20)} Order confirmed.</div></article>
    </div>
  </div>`;
}
function referenceStudy() {
  return `<section class="reference-study"><div class="reference-heading"><h2>Color across the references</h2><p>Swatches are visual approximations from the twelve screenshots. Each reference contributed a color, contrast, typography, or composition idea.</p></div>
    <div class="reference-grid">${references.map(([title,colors,labels,detail])=>`<article><div class="reference-colors">${colors.map(color=>`<span style="background:${color}"></span>`).join('')}</div><h3>${title}</h3><small>${labels}</small><p>${detail}</p></article>`).join('')}</div>
  </section>`;
}
function renderShowcase() {
  const [groupPart,boardPart] = location.hash.slice(1).split('/');
  const group=Object.hasOwn(boards,groupPart)?groupPart:'customer';
  const data=boards[group];
  const board=data.items.find(item=>item.id===boardPart)||data.items[0];
  if(activeBoard===board) return;
  activeBoard=board;
  frameObserver?.disconnect();
  document.body.className='showcase';
  document.title=`Chopline · ${data.label} design showcase`;
  const boardCount=board.screens.length;
  app.innerHTML=`${header(group)}<main class="show-main">
    <div class="show-intro"><div><p class="eyebrow">CHOPLINE PRODUCT DESIGN</p><h1>${group==='customer'?'Customer experience':data.label}</h1></div>
      <div class="show-controls"><a href="#design" class="button outline system-link" ${group==='design'?'aria-current="page"':''}>${icon('grid',16)} Design system</a><button data-action="fullscreen" class="icon-button" title="Present current board" aria-label="Present current board">${icon('desktop',19)}</button></div></div>
    <div class="show-tabs"><nav aria-label="${data.label} boards">${data.items.map(item=>`<a href="\#${group}/${item.id}" ${item===board?'aria-current="page"':''}>${item.tab}</a>`).join('')}</nav>
    ${boardCount?`<span class="screen-count">${icon(board.type,18)} ${boardCount} ${boardCount===1?'screen':'screens'}</span>`:''}</div>
    <section class="artboard screen-enter tone-${board.tone} ${board.type}-board ${boardCount===1?'solo-board':''}" aria-label="${board.note}">
      <div class="artboard-head"><div><div class="eyebrow">${board.note}</div><h2>${board.title}</h2></div>${logo()}</div>
      ${board.type==='system'?systemBoard():`<div class="devices frames-${boardCount}">${board.screens.map(item=>frame(item,board.type,boardCount===1)).join('')}</div>`}
    </section>
    ${group==='design'?referenceStudy():'<p class="board-note">Select a screen name to open it in the interactive prototype.</p>'}
  </main><footer class="show-footer">${logo()}<span>Food ordering & delivery · Interactive design prototype</span><a href="#design">Color and reference study</a></footer>`;
  frameObserver=new ResizeObserver(entries=>{
    for(const {target,contentRect} of entries) target.style.setProperty('--frame-scale',contentRect.width/Number(target.dataset.frameWidth));
  });
  document.querySelectorAll('.device-viewport').forEach(viewport=>frameObserver.observe(viewport));
}

function screenBar() {
  const group=getJourney(screen);
  const [board,boardID]=getBoardFor(screen);
  return `<header class="prototype-bar"><a href="${boardUrl(board,boardID)}">${icon('left',17)} <span>Back to boards</span></a>
    <div>${logo()}<span class="prototype-context">Interactive prototype</span></div>
    <label class="sr-only" for="prototype-screen">Jump to screen</label><select id="prototype-screen" name="prototype-screen">${Object.entries(journeys).map(([journey,ids])=>
    `<optgroup label="${journey==='desktop'?'Customer desktop':boards[journey].label}">${ids.map(id=>`<option value="${id}" ${id===screen?'selected':''}>${screenTitles[id]}${journey==='landing'?(id==='landing'?' · Desktop':' · Mobile'):''}</option>`).join('')}</optgroup>`).join('')}</select></header>`;
}
function renderScreen({enter=true}={}) {
  const journey=getJourney(screen);
  const kind=journey==='landing'?'marketing':journey==='customer'||journey==='rider'?'phone':journey==='kitchen'?'tablet':'desktop';
  document.documentElement.classList.toggle('embedded',embed);
  document.body.className=`${embed?'embedded':'prototype'} view-${kind} ${screen==='landing-mobile'?'responsive-mobile':''}`;
  document.title=`Chopline · ${screenTitles[screen]||'Prototype'}`;
  app.innerHTML=`${embed?'':screenBar()}<div class="live-screen${enter&&!embed?' screen-enter':''}">${allScreens[screen]()}</div>`;
}
function navigate(id,{seed=false}={}) {
  if(!Object.hasOwn(allScreens,id)) return;
  if(seed) demoSeed(id);
  const enter=id!==screen;
  if(enter) state.tableQuery='';
  screen=id;
  history.pushState({screen:id},'',screenUrl(id));
  renderScreen({enter});
  window.scrollTo(0,0);
  app.querySelector('main h1')?.setAttribute('tabindex','-1');
  app.querySelector('main h1')?.focus({preventScroll:true});
}

function openDialog(title,body) {
  document.querySelector('#demo-dialog')?.remove();
  previouslyFocused=document.activeElement;
  app.insertAdjacentHTML('beforeend',`<dialog id="demo-dialog" class="demo-dialog"><div class="section-title"><h2>${title}</h2>${iconBtn('close','Close dialog','data-action="close"')}</div>${body}</dialog>`);
  const dialog=document.querySelector('#demo-dialog');
  dialog.addEventListener('close',()=>{dialog.remove();previouslyFocused?.focus();});
  dialog.showModal();
}
function toast(message) {
  clearTimeout(toastTimer);
  document.querySelector('.toast')?.remove();
  app.insertAdjacentHTML('beforeend',`<div class="toast" role="status">${icon('check',18)} ${safe(message)}</div>`);
  toastTimer=setTimeout(()=>document.querySelector('.toast')?.remove(),3200);
}
function downloadFinance() {
  const contents=[['Transaction','Order','Kitchen','Total','Status','Time'],...transactions.filter(hasQuery)].map(row=>row.map(cell=>'"'+cell.replaceAll('"','""')+'"').join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob(['\ufeff',contents],{type:'text/csv;charset=utf-8'}));
  const link=document.createElement('a');
  link.href=url;
  link.download='chopline-sample-transactions.csv';
  link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function updateScreen() {
  const scroll=document.querySelector('.phone-content')?.scrollTop;
  renderScreen({enter:false});
  if(scroll) document.querySelector('.phone-content')?.scrollTo(0,scroll);
}

function handleAction(value) {
  const [name,argument,extra,modifier]=value.split(':');
  if(name==='fullscreen') {
    const artboard=document.querySelector('.artboard');
    if(document.fullscreenElement) document.exitFullscreen();
    else artboard?.requestFullscreen().catch(()=>toast('Full-screen mode is unavailable here.'));
    return;
  }
  if(name==='close') return document.querySelector('#demo-dialog')?.close();
  if(name==='location') {
    return openDialog('Delivery area',`<form data-form="location" class="form-stack"><label>Neighborhood${areaSelect('location-area')}</label><label>Delivery details <input name="address" maxlength="70" placeholder="Sample delivery address" value="${safe(state.address)}"></label><button class="button primary full">Save delivery area</button></form>`);
  }
  if(name==='sort') {
    return openDialog('Sort food',`<form data-form="sort" class="form-stack"><label>Sort by<select name="sort"><option value="recommended" ${state.sort==='recommended'?'selected':''}>Recommended</option><option value="price" ${state.sort==='price'?'selected':''}>Lowest price</option></select></label><button class="button primary full">Apply</button></form>`);
  }
  if(name==='contact') return openDialog('Contact', '<p>This is a sample profile for the prototype. Contact details are illustrative.</p>');
  if(name==='notifications') return openDialog('Notifications','<p>You’re up to date in this demo workspace.</p>');
  if(name==='download-finance') return downloadFinance();
  if(name==='person') {
    const row=Object.values(personRows).flat().find(item=>item[1]===argument);
    if(!row) return;
    return openDialog(row[0],`<p>${row[1]} · ${row[2]} · Illustrative profile</p><p>${statusBadge(state.reviews.includes(argument)?'Active':row[3])}</p>${row[3]==='Review'&&!state.reviews.includes(argument)?action('approve:'+argument,'Mark reviewed','button dark full','check'):''}`);
  }
  if(name==='order-detail') {
    const row=orderRows.find(item=>item[0]===argument);
    if(!row) return;
    return openDialog(row[0],`<p>${row[1]} · ${row[2]}</p><p>${row[3]} · ${row[4]} · ${row[5]}</p>${statusBadge(argument==='CL-1042'?orderStages[state.vendorStage]:'Delivered')}`);
  }
  if(name==='add') {
    const key=state.meal+'|'+state.spice;
    state.cart[key]=Math.min(20,(state.cart[key]||0)+state.qty);
    state.qty=1;
    return navigate(screen.startsWith('desk-')?'desk-checkout':'cart');
  }
  if(name==='order'&&cartCount()) {
    state.order={qty:cartCount(),total:subtotal()+fee()};
    state.cart={};
    return navigate('confirmed');
  }
  if(name==='kitchen-accept') {
    state.vendorStage=1;
    state.kitchenTicket='CL-1042';
    return navigate('kitchen-prep');
  }
  if(name==='kitchen-ticket') {
    state.kitchenTicket=argument;
    return navigate('kitchen-details');
  }
  if(name==='kitchen-ready') {
    if(state.prepChecks.length!==2) return toast('Check off both portions before marking the order ready.');
    state.vendorStage=2;
    state.kitchenTicket='CL-1042';
    return navigate('kitchen-details');
  }
  if(name==='rider-accept') {
    state.riderStage=0;
    return navigate('rider-delivery');
  }
  if(name==='register') state.register=!state.register;
  else if(name==='favorite') state.favorite=!state.favorite;
  else if(name==='quantity'&&argument==='meal') state.qty=Math.min(20,Math.max(1,state.qty+Number(extra)));
  else if(name==='quantity'&&argument==='cart') {
    state.cart[extra]=Math.min(20,Math.max(0,state.cart[extra]+Number(modifier)));
    if(!state.cart[extra]) delete state.cart[extra];
  }
  else if(name==='vendor-next') state.vendorStage=Math.min(2,state.vendorStage+1);
  else if(name==='vendor-ticket') state.vendorTicket=Number(argument);
  else if(name==='menu') state.offMenu=state.offMenu.includes(argument)?state.offMenu.filter(id=>id!==argument):[...state.offMenu,argument];
  else if(name==='online') state.online=!state.online;
  else if(name==='rider-next') state.riderStage=Math.min(2,state.riderStage+1);
  else if(name==='people') {state.people=argument;state.tableQuery='';}
  else if(name==='approve') state.reviews.push(argument);
  updateScreen();
  if(name==='approve') toast('Demo profile marked reviewed.');
}

app.addEventListener('load',event=>{
  const media=event.target;
  if(media.matches('.device-viewport iframe')) {
    media.classList.add('frame-ready');
  } else if(media.matches('.food-photo[data-photo-loading]')) {
    const reveal=()=>{
      if(media.naturalWidth) decodedPhotos.add(media.getAttribute('src'));
      media.removeAttribute('data-photo-loading');
    };
    if(typeof media.decode==='function') media.decode().then(reveal,reveal);
    else reveal();
  }
},true);
app.addEventListener('error',event=>{
  if(event.target.matches('.food-photo[data-photo-loading]')) event.target.removeAttribute('data-photo-loading');
},true);

app.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(!button) return;
  if(embed) { event.preventDefault(); return; }
  const data=button.dataset;
  if(data.screen) navigate(data.screen);
  else if(data.action) handleAction(data.action);
  else if(data.category) {state.category=data.category;updateScreen();}
  else if(data.openCategory) {
    state.category=data.openCategory;
    state.query='';
    navigate(screen.startsWith('desk-')?'desk-discover':'discover');
  }
  else if(data.meal || data.rest) {
    state.meal=data.meal || data.rest;
    state.qty=1;
    state.spice='Medium';
    navigate((screen.startsWith('desk-')?'desk-':'')+(data.meal?'meal':'restaurant'));
  }
});
app.addEventListener('submit',event=>{
  const form=event.target;
  if(!form.dataset.form) return;
  event.preventDefault();
  if(embed) return;
  const data=new FormData(form);
  if(form.dataset.form==='login') return navigate('home');
  if(form.dataset.form==='area') {state.area=data.get('area');return navigate('discover');}
  if(form.dataset.form==='location') {state.area=data.get('area');state.address=String(data.get('address')).trim();}
  if(form.dataset.form==='sort') state.sort=data.get('sort');
  updateScreen();
});
app.addEventListener('input',event=>{
  if(embed) return;
  const input=event.target;
  if(Object.hasOwn(input.dataset,'search')) {
    state.query=input.value;
    document.querySelector('[data-results]').innerHTML=discoveryResults(screen==='desk-discover');
    document.querySelector('[data-result-count]').textContent=filteredMeals().length+' to try';
  }
  else if(Object.hasOwn(input.dataset,'tableSearch')) {
    state.tableQuery=input.value;
    const scratch=document.createElement('div');
    scratch.innerHTML=allScreens[screen]();
    document.querySelector('.table-wrap').replaceWith(scratch.querySelector('.table-wrap'));
  }
});
app.addEventListener('change',event=>{
  if(embed) return;
  const {name,value,checked}=event.target;
  if(name==='prototype-screen') navigate(value,{seed:true});
  else if(name==='period') {state.period=value;updateScreen();}
  else if(name==='payment') state.payment=value;
  else if(name==='spice') state.spice=value;
  else if(name==='prep-check') state.prepChecks=checked?[...state.prepChecks,Number(value)]:state.prepChecks.filter(id=>id!==Number(value));
});
window.addEventListener('hashchange',()=>{if(showcase)renderShowcase();});
window.addEventListener('popstate',()=>{
  if(showcase) return;
  const next=new URLSearchParams(location.search).get('screen');
  if(next&&Object.hasOwn(allScreens,next)) {screen=next;renderScreen();}
});
if(showcase) renderShowcase();
else renderScreen();
