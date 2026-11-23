'use strict';

const icons = {
  search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>', pin:'<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  bag:'<path d="M5 8h14l2 13H3L5 8Z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/>', home:'<path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 5 0 0 1 16 0v2"/>', clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  star:'<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>', filter:'<path d="M4 7h16M4 17h16"/><circle cx="8" cy="7" r="2" fill="currentColor"/><circle cx="16" cy="17" r="2" fill="currentColor"/>',
  left:'<path d="m15 5-7 7 7 7"/>', chevron:'<path d="m9 5 7 7-7 7"/>', down:'<path d="m5 9 7 7 7-7"/>', plus:'<path d="M12 5v14M5 12h14"/>', minus:'<path d="M5 12h14"/>',
  heart:'<path d="M20 5a5 5 0 0 0-8 1 5 5 0 0 0-8-1c-4 4 1 9 8 15 7-6 12-11 8-15Z"/>', close:'<path d="m6 6 12 12M18 6 6 18"/>',
  check:'<path d="m4 12 5 5L20 6"/>', card:'<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20m-16 5h4"/>', receipt:'<path d="M5 3h14v18l-3-2-4 2-4-2-3 2V3Zm4 6h6m-6 4h6"/>',
  route:'<circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><path d="M9 18h6a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6"/>',
  bike:'<circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="m6 17 4-9h5l4 9m-9-9 4 9H6m9-9V5h3"/>',
  phone:'<path d="M8 3H4c-3 9 8 20 17 17v-4l-5-2-2 2a13 13 0 0 1-6-6l2-2Z"/>', mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  chart:'<path d="M3 3v18h18M7 15l4-4 3 2 5-6"/>', wallet:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M15 10h6v5h-6z"/>',
  store:'<path d="M4 11v10h16V11M3 11l2-7h14l2 7M9 21v-6h6v6M3 11h18"/>', bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8m-8 12h4"/>',
  more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>', play:'<path d="m8 4 12 8-12 8Z" fill="currentColor" stroke="none"/>',
  desktop:'<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M12 17v4m-5 0h10"/>', mobile:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 18h4"/>', tablet:'<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M17 12h1"/>',
  spark:'<path d="M12 1v22M1 12h22M4 4l16 16M20 4 4 20"/>', shield:'<path d="m12 2 8 4v6c0 5-8 10-8 10s-8-5-8-10V6Z"/><path d="m8 12 3 3 5-6"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>', external:'<path d="M14 3h7v7m0-7-10 10M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5"/>',
  download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>', eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>'
};

const icon = (name, size=20) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.spark}</svg>`;
const logo = () => `<span class="wordmark"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>Chopline<span class="brand-dot">.</span></span>`;
const safe = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const money = amount => '₦' + new Intl.NumberFormat('en-NG').format(amount);
const decodedPhotos = new Set();
function photo(name,alt='',extra='') {
  const src=`assets/${name}.webp`;
  const loading=decodedPhotos.has(src)?'':' data-photo-loading';
  const priority=name==='hero'?' fetchpriority="high"':'';
  return `<img class="food-photo ${extra}"${loading} src="${src}" alt="${safe(alt)}" decoding="async"${priority} draggable="false">`;
}
const badge = (label, tone='lilac') => `<span class="badge ${tone}">${safe(label)}</span>`;
const go = (target,label,classes='button primary',glyph='') => `<button class="${classes}" data-screen="${target}">${glyph ? icon(glyph,17) : ''}${label}</button>`;
const action = (name,label,classes='button primary',glyph='') => `<button class="${classes}" data-action="${name}">${glyph ? icon(glyph,17) : ''}${label}</button>`;
const iconBtn = (name,label,data='') => `<button class="icon-button" aria-label="${label}" ${data}>${icon(name,18)}</button>`;
const thumb = (image,name='') => `<span class="thumb">${photo(image,name)}</span>`;

const meals = [
  {id:'jollof',name:'Smoky Jollof & Chicken',vendor:'The Jollof Room',category:'Rice bowls',price:6800,img:'jollof',tone:'papaya',eta:'25–35 min',description:'Party-style jollof, fire-grilled chicken and a generous side of sweet fried plantain.'},
  {id:'burger',name:'Double Smash Burger',vendor:'Stack House',category:'Burgers',price:7500,img:'burger',tone:'lilac',eta:'20–30 min',description:'Two smashed patties with melted cheese, crisp lettuce and house sauce on toasted brioche.'},
  {id:'suya',name:'Peppered Beef Suya',vendor:'Suya Social',category:'Grills',price:5600,img:'suya',tone:'pink',eta:'30–40 min',description:'Charcoal-grilled beef skewers, yaji spice, sliced red onions and sweet tomatoes.'},
  {id:'coconut',name:'Coconut Rice & Fish',vendor:'The Jollof Room',category:'Rice bowls',price:7200,img:'coconut',tone:'green',eta:'25–35 min',description:'Fragrant coconut rice with golden grilled fish, fresh vegetables and pepper sauce.'},
  {id:'zobo',name:'Hibiscus Zobo',vendor:'Cool Down',category:'Drinks',price:2100,img:'zobo',tone:'blue',eta:'15–25 min',description:'Cold-brewed hibiscus with fresh ginger and a squeeze of citrus.'},
  {id:'puff',name:'Cinnamon Puff-Puff',vendor:'Sweet Hour',category:'Desserts',price:2800,img:'puff',tone:'yellow',eta:'20–30 min',description:'Pillowy golden puff-puff tossed in cinnamon sugar and served with chocolate dip.'}
];

const areas = ['Yaba, Lagos','Surulere, Lagos','Lekki, Lagos','Ikeja, Lagos'];
const categories = [['Rice bowls','jollof','papaya'],['Burgers','burger','lilac'],['Grills','suya','pink'],['Drinks','zobo','blue'],['Desserts','puff','yellow'],['Sides','coconut','green']];

const boards = {
  customer:{label:'Customer',items:[
    {id:'discovery',tab:'Entry & discovery',title:'Find your next bite.',note:'Customer mobile · Entry & discovery',type:'mobile',tone:'lilac',screens:[['login','Sign in'],['home','Home'],['discover','Discover'],['categories','Categories']]},
    {id:'ordering',tab:'Ordering',title:'From craving to checkout.',note:'Customer mobile · Ordering',type:'mobile',tone:'peach',screens:[['restaurant','Restaurant'],['meal','Meal details'],['cart','Cart'],['checkout','Checkout']]},
    {id:'delivery',tab:'Delivery',title:'Dinner is on the way.',note:'Customer mobile · Delivery',type:'mobile',tone:'blue',screens:[['confirmed','Confirmed'],['tracking','Live tracking'],['delivered','Delivered']]},
    {id:'desktop-discovery',tab:'Desktop discovery',title:'A bigger table.',note:'Customer desktop · Discovery',type:'desktop',tone:'lilac',screens:[['desk-home','Customer home'],['desk-discover','Browse food']]},
    {id:'desktop-ordering',tab:'Desktop ordering',title:'Room to order.',note:'Customer desktop · Ordering',type:'desktop',tone:'peach',screens:[['desk-restaurant','Menu'],['desk-meal','Meal details'],['desk-checkout','Cart & checkout']]}
  ]},
  landing:{label:'Landing page',items:[
    {id:'landing-desktop',tab:'Desktop',title:'Good food, closer.',note:'Public landing page · Desktop',type:'desktop',tone:'yellow',screens:[['landing','Landing page']]},
    {id:'landing-mobile',tab:'Mobile',title:'Good food, to go.',note:'Public landing page · Mobile',type:'mobile',tone:'yellow',screens:[['landing-mobile','Landing page']]}
  ]},
  vendor:{label:'Vendor',items:[
    {id:'vendor-service',tab:'Service',title:'Keep service moving.',note:'Vendor desktop · Service',type:'desktop',tone:'green',screens:[['vendor-home','Business overview'],['vendor-orders','Incoming orders']]},
    {id:'vendor-business',tab:'Menu & sales',title:'Know what’s selling.',note:'Vendor desktop · Menu and sales',type:'desktop',tone:'green',screens:[['vendor-menu','Menu management'],['vendor-sales','Sales & transactions']]}
  ]},
  kitchen:{label:'Kitchen',items:[
    {id:'kitchen-boards',tab:'Kitchen workflow',title:'Made for the pass.',note:'Kitchen tablet · Order preparation',type:'tablet',tone:'yellow',screens:[['kitchen-queue','Order queue'],['kitchen-prep','Active preparation'],['kitchen-details','Order details']]}
  ]},
  rider:{label:'Rider',items:[
    {id:'rider-boards',tab:'Rider workflow',title:'Ready to roll.',note:'Rider mobile · Delivery workflow',type:'mobile',tone:'blue',screens:[['rider-home','Availability'],['rider-request','Delivery request'],['rider-delivery','Pickup & drop-off']]}
  ]},
  admin:{label:'Admin',items:[
    {id:'admin-platform',tab:'Platform & people',title:'See the whole operation.',note:'Admin desktop · Platform and people',type:'desktop',tone:'pink',screens:[['admin-home','Platform overview'],['admin-people','People & businesses']]},
    {id:'admin-operations',tab:'Orders & finance',title:'Follow every order.',note:'Admin desktop · Orders and finance',type:'desktop',tone:'pink',screens:[['admin-orders','Order management'],['admin-finance','Transactions & reports']]}
  ]},
  design:{label:'Design system',items:[
    {id:'design-system',tab:'Color & components',title:'One identity, different accents.',note:'Design system · Reference study',type:'system',tone:'paper',screens:[]}
  ]}
};

const screenTitles = Object.fromEntries(Object.values(boards).flatMap(group=>group.items.flatMap(board=>board.screens)));
const journeys = {
  landing:['landing','landing-mobile'],
  customer:['login','home','discover','categories','restaurant','meal','cart','checkout','confirmed','tracking','delivered'],
  desktop:['desk-home','desk-discover','desk-restaurant','desk-meal','desk-checkout'],
  vendor:['vendor-home','vendor-orders','vendor-menu','vendor-sales'],
  kitchen:['kitchen-queue','kitchen-prep','kitchen-details'],
  rider:['rider-home','rider-request','rider-delivery'],
  admin:['admin-home','admin-people','admin-orders','admin-finance']
};
const firstScreen = {landing:'landing',customer:'login',vendor:'vendor-home',kitchen:'kitchen-queue',rider:'rider-home',admin:'admin-home',design:'home'};

const palette = [
  ['Paper','#FBF5E9','Background'], ['Ink Plum','#251521','Text & administration'], ['Persimmon','#FF643C','Customer actions'],
  ['Orchid','#E8CEF5','Customer discovery'], ['Sky','#CEE4F5','Rider & tracking'], ['Celadon','#DFE9C9','Vendor workspace'], ['Butter','#FFE18A','Kitchen & promotions'], ['Blush','#F1D6E1','Admin presentation']
];

const references = [
  ['Flamenco nights',['#07382E','#F2E6CC','#AD176A'],'Deep teal · Bone · Magenta','Dark stages make intense accents and pale type stand out.'],
  ['Mended in gold',['#0D1827','#ADCABB','#E7AC37'],'Indigo · Celadon · Gold','Celadon and gold inform quieter operational surfaces and attention states.'],
  ['Sunbeds by the sea',['#D9BB92','#844022','#114CAC'],'Sand · Terracotta · Cobalt','Warm materials and a cool focal point inform the landing page’s photo composition.'],
  ['Spring season',['#133A2D','#EEE7D5','#DE331E'],'Bottle green · Bone · Vermilion','Vermilion informs the customer action color.'],
  ['Mirage',['#F2C5D2','#4D1021','#49B826'],'Blush · Deep wine · Kelly green','Blush and dark wine inform a soft surface with strongly contrasted text.'],
  ['Draw it. Walk in it.',['#172B4C','#EEE7D6','#FFB84E'],'Navy · Cream · Amber','Warm light against a cool field informs kitchen timing and status cues.'],
  ['Gelato made daily',['#C1D892','#171B13','#E40B59'],'Pistachio · Ink · Raspberry pink','Centered food photography and oversized type give a single dish presence.'],
  ['Inside the glacier',['#10171A','#E4F2F3','#149CBA'],'Black basalt · Bone · Glacier blue','Cool blue leads the eye toward the route and position markers.'],
  ['Seven rooms, one garden',['#BAC0C9','#182D51','#EE3D06'],'Stone gray · Deep indigo · Vermilion','Color concentrated in one subject informs restrained calls to action.'],
  ['Deep seats',['#CDBEE0','#3E1027','#5BA84D'],'Lilac · Deep plum · Velvet green','Lilac and plum inform discovery, where food imagery carries the vivid color.'],
  ['2,000 butterflies',['#E8CA97','#412510','#1161C9'],'Old paper · Deep umber · Morpho blue','Paper and saturated color inform the contrast between the canvas and featured content.'],
  ['Garda',['#86B7DD','#0F2547','#FFDA13'],'Lake blue · Navy · Sun yellow','Blue and yellow inform rider navigation and time-sensitive delivery information.']
];
