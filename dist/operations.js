'use strict';

const vendorNav=[['vendor-home','Overview','chart'],['vendor-orders','Orders','receipt'],['vendor-menu','Menu','grid'],['vendor-sales','Sales','wallet']];
const adminNav=[['admin-home','Overview','chart'],['admin-people','People & businesses','user'],['admin-orders','Orders','bag'],['admin-finance','Transactions','wallet']];
const orderStages=['New','Preparing','Ready'];
const orderRows=[
  ['CL-1042','Ada O.','The Jollof Room','2 items','₦14,800','12:42'],
  ['CL-1041','Tobi A.','Stack House','1 item','₦8,700','12:37'],
  ['CL-1040','Nneka I.','Suya Social','3 items','₦20,100','12:28'],
  ['CL-1039','Sam K.','The Jollof Room','1 item','₦8,400','12:20']
];
const personRows = {
  Customers:[['Ada O.','CL-C102','Yaba','Active','Today'],['Tobi A.','CL-C101','Surulere','Active','Today'],['Nneka I.','CL-C100','Lekki','Active','Yesterday'],['Sam K.','CL-C099','Ikeja','Review','Yesterday']],
  Vendors:[['The Jollof Room','CL-V028','Yaba','Active','Today'],['Stack House','CL-V027','Surulere','Active','Today'],['Suya Social','CL-V026','Lekki','Active','Yesterday'],['Sweet Hour','CL-V025','Ikeja','Review','Yesterday']],
  Riders:[['Amina M.','CL-R203','Yaba','Active','Today'],['Dami E.','CL-R202','Surulere','Active','Today'],['Zain K.','CL-R201','Lekki','Active','Yesterday'],['Ify N.','CL-R200','Ikeja','Review','Yesterday']]
};
const transactions=[
  ['TX-2084','CL-1042','The Jollof Room','₦14,800','Settled','12:42'],
  ['TX-2083','CL-1041','Stack House','₦8,700','Settled','12:37'],
  ['TX-2082','CL-1040','Suya Social','₦20,100','Pending','12:28'],
  ['TX-2081','CL-1039','The Jollof Room','₦8,400','Settled','12:20']
];
const statusTone = status=>['Settled','Active','Ready','Delivered','Available'].includes(status) ? 'green' : ['Preparing','Pending','Review'].includes(status)?'yellow':'lilac';
const statusBadge = status=>badge(status,statusTone(status));

function opLayout(role,title,detail,content,tools='') {
  const admin=role==='admin';
  const nav=admin?adminNav:vendorNav;
  return `<main class="workspace-ui ${role}-ui">
    <aside class="workspace-sidebar">${logo()}<div class="workspace-team"><span class="avatar ${admin?'pink':'green'}">${admin?'CL':'JR'}</span><span><strong>${admin?'Platform team':'The Jollof Room'}</strong><small>${admin?'Administration':'Vendor workspace'}</small></span></div>
      <nav aria-label="${role} workspace navigation">${nav.map(([id,label,glyph])=>go(id,label,'workspace-nav '+(id===screen?'selected':''),glyph)).join('')}</nav>
      ${admin?'':go('kitchen-queue','Kitchen view','workspace-nav kitchen-link','tablet')}
      <div class="workspace-person"><span class="avatar ${admin?'pink':'green'}">${admin?'TO':'AO'}</span><span><strong>${admin?'Tolu O.':'Ada O.'}</strong><small>Demo workspace</small></span></div>
    </aside>
    <section class="workspace-main"><div class="workspace-top"><span>${admin?'Platform operations':'Kitchen operations'}</span><div>${badge('Demo data',admin?'pink':'green')}${iconBtn('bell','Notifications','data-action="notifications"')}</div></div>
      <header class="workspace-heading"><div><h1>${title}</h1><p>${detail}</p></div><div class="workspace-tools">${tools}</div></header>
      <div class="workspace-body">${content}</div></section></main>`;
}

function metrics(items) {
  return `<div class="metrics">${items.map(([label,value,note,glyph,tone])=>`<article><span class="metric-icon ${tone}">${icon(glyph,18)}</span><p>${label}</p><strong>${value}</strong><small>${note}</small></article>`).join('')}</div>`;
}

function chartPanel(title,sublabel,values,tone='green') {
  return `<section class="ops-panel chart-panel"><div class="section-title"><div><h2>${title}</h2><small>${sublabel}</small></div>${badge(state.period,tone)}</div>
    <div class="chart-grid" role="img" aria-label="${title}, illustrative activity varied from Monday to Sunday">
      <div class="chart-scale"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0</span></div>
      <div class="chart-bars">${values.map((v,i)=>`<span class="${tone} ${i===4?'peak':''}" style="--bar:${v}%"><span>${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span></span>`).join('')}</div>
    </div></section>`;
}

function table(headers, rows) {
  const headings=headers.map(label=>`<th scope="col" role="columnheader">${label||'<span class="sr-only">Actions</span>'}</th>`).join('');
  const records=rows.map(row=>{
    const cells=row.map((cell,index)=>{
      const label=headers[index];
      if(index===0) return `<td class="record-title" role="cell">${cell}</td>`;
      if(!label) return `<td class="record-action" role="cell">${cell}</td>`;
      return `<td role="cell"><span class="record-label" aria-hidden="true">${label}</span>${cell}</td>`;
    }).join('');
    return `<tr role="row">${cells}</tr>`;
  }).join('');
  return `<div class="table-wrap"><table class="record-table" role="table"><thead role="rowgroup"><tr role="row">${headings}</tr></thead>
    <tbody role="rowgroup">${records||`<tr role="row"><td class="record-empty" colspan="${headers.length}" role="cell">No matching records.</td></tr>`}</tbody></table></div>`;
}
function periodSelect() {return `<label class="period-control">${icon('clock',16)}<select aria-label="Report period" name="period">${['This week','Last week'].map(period=>`<option ${state.period===period?'selected':''}>${period}</option>`).join('')}</select></label>`;}
const textFilter = (name,placeholder) => `<label class="search-field">${icon('search',18)}<input name="${name}" data-table-search type="search" value="${safe(state.tableQuery)}" placeholder="${placeholder}" aria-label="${placeholder}"></label>`;
const hasQuery = row => row.join(' ').toLowerCase().includes(state.tableQuery.trim().toLowerCase());

function vendorHome() {
  return opLayout('vendor','Business overview','Track orders, earnings, and what your kitchen is serving.',
    `${metrics([['Orders today','24','6 in the last hour','receipt','green'],['Sales today','₦168,400','Illustrative gross sales','wallet','yellow'],['Preparing','3','Across your kitchen','clock','lilac'],['Available dishes',String(2-state.offMenu.length),'The Jollof Room menu','grid','pink']])}
    <div class="ops-columns">${chartPanel('Order activity','Share of peak daily orders',state.period==='This week'?[32,43,37,56,88,72,62]:[33,25,61,51,82,79,64])}
    <section class="ops-panel task-panel"><div class="section-title"><h2>Incoming orders</h2>${statusBadge(orderStages[state.vendorStage])}</div><p><strong>CL-1042 · 2 items</strong><br>Smoky Jollof & Chicken × 2</p><p>Received at 12:42 · Pickup by rider</p>${go('vendor-orders','Review order','button dark full')}</section></div>
    <section class="ops-panel"><div class="section-title"><h2>Most ordered</h2>${go('vendor-menu','View menu','text-button')}</div>${miniMeal(meals[0])}</section>`,periodSelect());
}
function vendorOrders() {
  const status=orderStages[state.vendorStage];
  return opLayout('vendor','Orders','Review new tickets and update prep status.',
    `<div class="ops-columns order-columns"><section class="ops-panel"><div class="section-title"><h2>Order queue</h2>${badge('2 orders','green')}</div>
      ${table(['Order','Received','Status',''],[['<strong>CL-1042</strong>','12:42',statusBadge(status),action('vendor-ticket:0','View','text-button')],['<strong>CL-1039</strong>','12:20',statusBadge('Ready'),action('vendor-ticket:1','View','text-button')]])}</section>
    <section class="ops-panel order-ticket"><div class="section-title"><h2>${state.vendorTicket===1?'CL-1039':'CL-1042'}</h2>${statusBadge(state.vendorTicket===1?'Ready':status)}</div>
    <p>${state.vendorTicket===1?'Sam K.':'Ada O.'} · Rider pickup</p><div class="ticket-food">${thumb(state.vendorTicket===1?'coconut':'jollof')}<span><b>${state.vendorTicket===1?'Coconut Rice & Fish':'Smoky Jollof & Chicken'}</b><small>${state.vendorTicket===1?'Qty 1 · Mild':'Qty 2 · Medium spice'}</small></span></div>
    <div class="ticket-total"><span>Order total</span><b>${state.vendorTicket===1?'₦8,400':'₦14,800'}</b></div>
    ${state.vendorTicket===1 || state.vendorStage===2?go('kitchen-queue','Open kitchen queue','button outline full'):action('vendor-next',state.vendorStage===0?'Accept and start prep':'Mark ready for pickup','button dark full','check')}</section></div>`);
}
function vendorMenu() {
  const menu=meals.filter(meal=>meal.vendor==='The Jollof Room');
  return opLayout('vendor','Menu management','Update the dishes available to order.',
    `<section class="ops-panel"><div class="list-controls"><h2>All dishes</h2>${textFilter('vendor-menu','Search dishes')}</div>
    ${table(['Dish','Category','Price','Availability',''],menu.filter(meal=>hasQuery([meal.name,meal.category])).map(meal=>[
      `<div class="cell-person">${thumb(meal.img)}<strong>${meal.name}</strong></div>`,meal.category,money(meal.price),
      statusBadge(state.offMenu.includes(meal.id)?'Paused':'Available'),action('menu:'+meal.id,state.offMenu.includes(meal.id)?'Make available':'Pause','button outline small')
    ]))}</section>`);
}
function financeTable(rows=transactions) {
  return table(['Transaction','Order','Kitchen','Total','Status','Time'],rows.map(([id,order,kitchen,total,status,time])=>[`<strong>${id}</strong>`,order,kitchen,total,statusBadge(status),time]));
}
function vendorSales() {
  return opLayout('vendor','Sales & transactions','Review sample sales, payouts, and recent transactions.',
    `${metrics([['Gross sales',state.period==='This week'?'₦482,400':'₦427,800',state.period,'wallet','green'],['Payouts','₦406,800','Illustrative settled payouts','card','yellow'],['Orders','76','Across the selected period','receipt','lilac']])}
      ${chartPanel('Sales by day','Share of peak daily sales',state.period==='This week'?[32,48,45,60,86,68,59]:[25,37,49,60,64,78,42])}
      <section class="ops-panel"><div class="section-title"><h2>Recent transactions</h2></div>${financeTable(transactions.filter(tx=>tx[2]==='The Jollof Room'))}</section>`,periodSelect());
}

function kitchenShell(title,detail,content,active) {
  return `<main class="kitchen-ui">
    <header class="kitchen-header">${logo()}<span>The Jollof Room</span><div>${badge('Demo kitchen','yellow')}${icon('clock',20)} <strong>12:42</strong></div></header>
    <div class="kitchen-content"><div class="kitchen-title"><div><h1>${title}</h1><p>${detail}</p></div><nav>${[['kitchen-queue','Queue'],['kitchen-prep','Preparation'],['kitchen-details','Details']].map(([id,label])=>go(id,label,'button '+(active===id?'dark':'outline'))).join('')}</nav></div>${content}</div></main>`;
}
function kitchenTicket(id,status,mealsText,time,button) {
  return `<article class="kitchen-ticket"><div class="section-title"><strong>${id}</strong>${statusBadge(status)}</div><p>${mealsText}</p><small>${icon('clock',15)} ${time}</small>${button}</article>`;
}
function kitchenQueue() {
  const cards = [
    kitchenTicket('CL-1042',orderStages[state.vendorStage],'2 × Smoky Jollof & Chicken','12:42 · Rider pickup',state.vendorStage===0?action('kitchen-accept','Start prep','button dark full'):state.vendorStage===2?action('kitchen-ticket:CL-1042','Open ticket','button outline full'):go('kitchen-prep','Open ticket','button outline full')),
    kitchenTicket('CL-1039','Ready','1 × Coconut Rice & Fish','12:20 · Rider pickup',action('kitchen-ticket:CL-1039','View ticket','button outline full'))
  ];
  return kitchenShell('Order queue','Tickets update as the kitchen accepts and completes orders.',
    `<div class="kitchen-columns">${orderStages.map((status,i)=>`<section class="kitchen-lane ${['lilac','yellow','green'][i]}"><h2>${status==='New'?'Incoming':status} <span>${Number(state.vendorStage===i)+Number(i===2)}</span></h2>${state.vendorStage===i?cards[0]:''}${i===2?cards[1]:''}</section>`).join('')}</div>`,'kitchen-queue');
}
function kitchenPrep() {
  return kitchenShell('Active preparation','Check off each dish as it’s ready to pack.',
    `<div class="kitchen-detail-grid"><section class="ops-panel"><div class="section-title"><h2>CL-1042</h2>${statusBadge(orderStages[state.vendorStage])}</div>
    <div class="checklist">${[1,2].map(i=>`<label><input type="checkbox" name="prep-check" value="${i}" ${state.prepChecks.includes(i)?'checked':''}><span><strong>Smoky Jollof & Chicken</strong><small>Portion ${i} · Medium spice</small></span></label>`).join('')}</div></section>
    <aside class="ops-panel kitchen-focus"><span class="row-icon yellow">${icon('clock',24)}</span><h2>Rider pickup</h2><p>Target time 13:00</p>${action('kitchen-ready','Mark order ready','button dark full','check')}</aside></div>`,'kitchen-prep');
}
function kitchenDetails() {
  const older=state.kitchenTicket==='CL-1039';
  return kitchenShell('Order details','Review what goes in the bag before handoff.',
    `<div class="kitchen-detail-grid"><section class="ops-panel"><div class="section-title"><h2>${state.kitchenTicket}</h2>${statusBadge(older?'Ready':orderStages[state.vendorStage])}</div>
    <div class="ticket-food">${thumb(older?'coconut':'jollof')}<span><b>${older?'1 × Coconut Rice & Fish':'2 × Smoky Jollof & Chicken'}</b><small>${older?'Mild spice':'Medium spice · Pack plantain separately'}</small></span></div>
    <div class="timeline"><span class="done">Received at ${older?'12:20':'12:42'}</span><span class="${older||state.vendorStage?'done':''}">Preparing</span><span class="${older||state.vendorStage===2?'done':''}">Ready for pickup</span></div></section>
    <aside class="ops-panel kitchen-focus"><span class="row-icon green">${icon('bike',26)}</span><h2>Pickup by ${older?'Dami':'Amina'}</h2><p>Demo rider · Order ${state.kitchenTicket}</p>${go('kitchen-queue','Back to queue','button dark full')}</aside></div>`,'kitchen-details');
}

function riderHome() {
  return phonePage(`<header class="rider-header">${logo()}${iconBtn('bell','Notifications','data-action="notifications"')}</header>
    <div class="rider-greeting"><span class="eyebrow">RIDER WORKSPACE</span><h1>Hi, Amina.</h1><p>Here’s what’s happening on your route.</p></div>
    <div class="availability"><span class="row-icon">${icon('bike',23)}</span><span><b>${state.online?'You’re online':'You’re offline'}</b><small>${state.online?'Ready for delivery requests':'Pause new delivery requests'}</small></span>
    <button data-action="online" class="switch ${state.online?'on':''}" role="switch" aria-checked="${state.online}" aria-label="Accept delivery requests"></button></div>
    <div class="rider-stats"><article><small>Today’s earnings</small><strong>₦9,400</strong></article><article><small>Deliveries</small><strong>6</strong></article></div>
    <div class="section-title"><h2>Delivery requests</h2>${badge(state.online?'1 available':'Paused','blue')}</div>
    ${state.online?go('rider-request','View delivery request','button dark full','route'):'<p class="empty-copy">Go online to see new delivery requests.</p>'}
    <div class="screen-section"><div class="section-title"><h2>Recent delivery</h2></div><div class="info-row"><span class="row-icon green">${icon('check',18)}</span><span><strong>CL-1037</strong><small>Delivered · Demo history</small></span><b>₦1,550</b></div></div>`,
    {className:'rider-screen'});
}
function riderRequest() {
  return phonePage(`${routeMap()}<div class="rider-request"><div class="section-title"><h1>Delivery request</h1>${badge('New','yellow')}</div><div class="rider-stats"><article><small>Estimated earnings</small><strong>₦1,800</strong></article><article><small>Distance</small><strong>3.2 km</strong></article></div>
    <div class="route-stops"><div class="info-row"><span class="row-icon yellow">${icon('store',18)}</span><span><strong>The Jollof Room</strong><small>Pickup · Yaba</small></span></div>
    <div class="info-row"><span class="row-icon blue">${icon('pin',18)}</span><span><strong>Customer drop-off</strong><small>Sample delivery address · Yaba</small></span></div></div></div>`,
    {head:phoneHead('New request','rider-home'),foot:`<div class="sticky-action">${go('rider-home','Decline','button outline')}${action('rider-accept','Accept delivery','button dark','check')}</div>`,className:'rider-screen'});
}
function riderDelivery() {
  const stage=state.riderStage;
  return phonePage(`${routeMap()}<div class="rider-request"><div class="section-title"><h1>${['Collect order','Deliver order','Delivery complete'][stage]}</h1>${badge(stage===2?'Done':'CL-1042',stage===2?'green':'blue')}</div>
    <div class="route-stops"><div class="info-row"><span class="row-icon yellow">${icon(stage?'check':'store',18)}</span><span><strong>The Jollof Room</strong><small>${stage?'Collected':'Pickup · Ask for CL-1042'}</small></span></div>
    <div class="info-row"><span class="row-icon blue">${icon(stage===2?'check':'pin',18)}</span><span><strong>Ada O.</strong><small>${stage===2?'Delivered':'Sample delivery address · Yaba'}</small></span>${stage===2?'':iconBtn('phone','Contact customer','data-action="contact"')}</div></div>
    <div class="rider-stats"><article><small>${stage===2?'Earnings':'Estimated earnings'}</small><strong>₦1,800</strong></article><article><small>Order</small><strong>2 items</strong></article></div></div>`,
    {head:phoneHead('Active delivery','rider-request'),foot:`<div class="sticky-action">${stage===2?go('rider-home','Back to rider home','button dark full'):action('rider-next',stage===0?'Confirm pickup':'Complete delivery','button dark full','check')}</div>`,className:'rider-screen'});
}

function adminHome() {
  return opLayout('admin','Platform overview','Monitor the sample marketplace across customers, kitchens, and deliveries.',
    `${metrics([['Orders today','148','Illustrative order volume','bag','lilac'],['Active kitchens','28','Demo marketplace','store','green'],['Riders online','36','Across Lagos zones','bike','blue'],['Gross volume','₦1.24m',state.period,'wallet','pink']])}
    <div class="ops-columns">${chartPanel('Marketplace activity','Share of peak daily orders',state.period==='This week'?[38,51,47,62,91,75,68]:[34,47,41,62,68,87,63],'pink')}
    <section class="ops-panel task-panel"><div class="section-title"><h2>Needs attention</h2>${badge('3 items','pink')}</div>
    <div class="attention">${go('admin-people','Vendor profile review','text-button','user')}${go('admin-orders','Orders in progress','text-button','bag')}${go('admin-finance','Pending settlement','text-button','wallet')}</div></section></div>`,periodSelect());
}
function adminPeople() {
  const current=personRows[state.people].filter(hasQuery);
  return opLayout('admin','People & businesses','Browse and review customer, vendor, and rider records.',
    `<section class="ops-panel"><div class="list-controls"><div class="filter-row">${Object.keys(personRows).map(role=>action('people:'+role,role,'chip '+(state.people===role?'selected':''))).join('')}</div>${textFilter('people','Search names or areas')}</div>
    ${table(['Name','Account ID','Area','Status','Last active',''],current.map(([name,id,area,status,active])=>[`<b>${name}</b>`,id,area,statusBadge(state.reviews.includes(id)?'Active':status),active,action('person:'+id,'View profile','text-button')]))}</section>`);
}
function adminOrders() {
  return opLayout('admin','Order management','Look up orders and review the current delivery stage.',
    `<section class="ops-panel"><div class="list-controls"><h2>Recent orders</h2>${textFilter('orders','Search orders or kitchens')}</div>
    ${table(['Order','Customer','Kitchen','Amount','Status','Time',''],orderRows.filter(hasQuery).map(([id,name,kitchen,items,total,time])=>[`<strong>${id}</strong>`,name,kitchen,total,statusBadge(id==='CL-1042'?orderStages[state.vendorStage]:'Delivered'),time,action('order-detail:'+id,'View order','text-button')]))}</section>`);
}
function adminFinance() {
  return opLayout('admin','Transactions & reports','Track illustrative payments and settlement activity.',
    `${metrics([['Gross volume',state.period==='This week'?'₦1,242,800':'₦1,104,200',state.period,'wallet','pink'],['Settled','₦1,181,600','Illustrative payouts','check','green'],['Pending','₦61,200','Illustrative settlement queue','clock','yellow']])}
    <section class="ops-panel"><div class="list-controls"><h2>Payment activity</h2>${textFilter('finance','Search transactions')}</div>${financeTable(transactions.filter(hasQuery))}</section>`,
    periodSelect()+action('download-finance','Export sample CSV','button dark','download'));
}

const operationScreens={
  'vendor-home':vendorHome,'vendor-orders':vendorOrders,'vendor-menu':vendorMenu,'vendor-sales':vendorSales,
  'kitchen-queue':kitchenQueue,'kitchen-prep':kitchenPrep,'kitchen-details':kitchenDetails,
  'rider-home':riderHome,'rider-request':riderRequest,'rider-delivery':riderDelivery,
  'admin-home':adminHome,'admin-people':adminPeople,'admin-orders':adminOrders,'admin-finance':adminFinance
};
