'use strict';

const pickedMeal = () => meals.find(meal=>meal.id===state.meal) || meals[0];
const basketRows = () => Object.entries(state.cart).map(([key,qty])=>{
  const [id,spice]=key.split('|');
  return {key,spice,meal:meals.find(item=>item.id===id),qty};
}).filter(row=>row.meal && row.qty>0);
const subtotal = () => basketRows().reduce((sum,{meal,qty})=>sum+meal.price*qty,0);
const cartCount = () => basketRows().reduce((sum,{qty})=>sum+qty,0);
const fee = () => cartCount() ? 1200 : 0;
const areaSelect = (id='area') => `<select id="${id}" name="area" aria-label="Delivery area">${areas.map(area=>`<option ${area===state.area?'selected':''}>${area}</option>`).join('')}</select>`;

function landingPage() {
  return `<main class="landing-page">
    <header class="landing-header"><a href="#top" aria-label="Chopline home">${logo()}</a>
      <nav aria-label="Landing page"><a href="#featured">Explore food</a><a href="#how">How it works</a><a href="#partners">For kitchens</a></nav>
      ${go('login','Order food','button dark')}
    </header>
    <section id="top" class="landing-hero">
      <div class="landing-copy"><div class="eyebrow"><span class="round-status"></span> LOCAL KITCHENS IN LAGOS</div>
        <h1>Good food.<br> <em>Closer.</em></h1>
        <p>Order from local kitchens and discover a new favorite for lunch, dinner, or anything in between.</p>
        <form class="postal-form" data-form="area">${icon('pin',20)}<label class="sr-only" for="landing-area">Delivery area</label>${areaSelect('landing-area')}<button class="button primary">Find food</button></form>
        <small>Design prototype · Illustrative menus and delivery areas</small>
      </div>
      <div class="landing-image">${photo('hero','Jollof rice, grilled chicken and fried plantain on a ceramic plate')}
        <div class="dish-caption"><span class="dish-logo">${icon('spark',19)}</span><span><b>Smoky jollof & chicken</b><small>The Jollof Room</small></span></div>
        <div class="hero-stamp" aria-hidden="true">${icon('spark',38)}</div>
      </div>
    </section>
    <div class="landing-strip"><span>${icon('store',19)} Independent kitchens</span><span>${icon('bag',19)} Order from one place</span><span>${icon('route',19)} Follow your delivery</span></div>
    <section id="featured" class="landing-section">
      <div class="landing-title"><div><span class="eyebrow">ON THE MENU</span><h2>What sounds good?</h2></div>${go('discover','Browse all food','button outline')}</div>
      <div class="landing-meals">${meals.slice(0,3).map(meal=>mealCard(meal)).join('')}</div>
    </section>
    <section class="landing-promo">
      ${photo('puff','Cinnamon puff-puff with chocolate dip')}
      <div><span class="eyebrow">DESSERT PICKS</span><h2>Save room for puff-puff.</h2><p>Try a box of cinnamon puff-puff with chocolate dip, or browse more sweets from local kitchens.</p><button class="button dark" data-meal="puff">Explore the menu</button></div>
    </section>
    <section id="how" class="landing-section">
      <span class="eyebrow">HOW IT WORKS</span><h2>From kitchen to doorstep.</h2>
      <div class="how-grid">${[['pin','Set your area','See the kitchens that deliver to your neighborhood.'],['bag','Pick your meal','Browse menus and add your favorites to one cart.'],['route','Follow your order','Check when the kitchen starts cooking and when your rider is on the way.']].map(([glyph,title,copy])=>`<article><span>${icon(glyph,25)}</span><h3>${title}</h3><p>${copy}</p></article>`).join('')}</div>
    </section>
    <section class="landing-partner" id="partners"><div><span class="eyebrow">FOR INDEPENDENT KITCHENS</span><h2>Bring your kitchen to more tables.</h2><p>Take orders, manage your menu, and keep your team in sync with Chopline’s vendor workspace.</p>${go('vendor-home','Explore the vendor workspace','button dark')}</div><div class="partner-symbol">${icon('store',118)}</div></section>
    <section class="landing-app"><div><span class="eyebrow">CHOPLINE ON MOBILE</span><h2>Order on the go.</h2><p>Save your neighborhood and check your delivery from your phone.</p>${go('home','Try the customer app','button primary')}</div><div><span class="eyebrow">EXPLORE THE DEMO</span><h2>Meet the kitchens.</h2><p>The Jollof Room, Stack House, and Suya Social are illustrative kitchens you can browse in the prototype.</p>${go('discover','See the kitchens','button outline')}</div></section>
    <footer class="landing-footer">${logo()}<nav aria-label="Footer"><a href="#featured">Explore food</a><a href="#how">How it works</a><a href="#partners">For kitchens</a></nav><span>Chopline design prototype</span></footer>
  </main>`;
}

function mobileNav(active) {
  return `<nav class="app-nav" aria-label="Customer navigation">${[['home','Home','home'],['discover','Discover','search'],['tracking','Orders','receipt'],['cart','Cart','bag']].map(([id,label,glyph])=>`
    <button data-screen="${id}" class="${id===active?'current':''}" ${id===active?'aria-current="page"':''}>${icon(glyph,19)}<span>${label}</span></button>`).join('')}</nav>`;
}

function phoneHead(title,back,right='') {
  return `<header class="phone-head">${back?iconBtn('left','Go back',`data-screen="${back}"`):'<span></span>'}
    <b>${title}</b>${right||'<span></span>'}</header>`;
}

function phonePage(content,{head='',nav='',foot='',className=''}={}) {
  return `<main class="phone-ui ${className}">${head}<div class="phone-content">${content}</div>${foot}${nav?mobileNav(nav):''}</main>`;
}

function loginPage() {
  return phonePage(`<div class="login-top">${logo()}<div class="login-visual">${photo('hero','Jollof with grilled chicken and plantain')}<span class="login-spark">${icon('spark',27)}</span></div></div>
    <div class="login-body"><h1>${state.register?'Create an account.':'Good to see you.'}</h1>
    <p>${state.register?'Save your delivery area and order from local kitchens.':'Sign in to order from kitchens near you.'}</p>
    <form data-form="login" class="form-stack">${state.register?'<label>Name<input name="name" placeholder="Your name" required></label>':''}
    <label>Email address<input type="email" name="email" placeholder="you@example.com" autocomplete="email" required></label>
    <label>Password<input type="password" name="password" placeholder="••••••••" autocomplete="${state.register?'new-password':'current-password'}" required minlength="4"></label>
    <button class="button primary full">${state.register?'Create account':'Sign in'}</button></form>
    ${go('home','Continue as guest','button outline full')}
    <div class="login-switch">${state.register?'Already have an account?':'New to Chopline?'} ${action('register',state.register?'Sign in':'Create an account','text-button')}</div></div>`,
    {className:'login-screen'});
}

const searchBox = (value='',placeholder='Search dishes or kitchens') => `<label class="search-field">${icon('search',19)}<input type="search" data-search placeholder="${placeholder}" value="${safe(value)}" aria-label="${placeholder}"></label>`;
const locationButton = () => `<button class="location-button" data-action="location"><span class="location-pin">${icon('pin',19)}</span><span><small>Delivering to</small><strong>${safe(state.area)} ${icon('down',11)}</strong></span></button>`;
const promptChips = () => `<div class="filter-row">${['All','Rice bowls','Burgers','Grills','Drinks','Desserts','Sides'].map(cat=>`<button class="chip ${state.category===cat?'selected':''}" data-category="${cat}">${cat}</button>`).join('')}</div>`;
const categoryMatches = meal => state.category==='All' || state.category===meal.category || (state.category==='Sides' && meal.id==='coconut');
const filteredMeals = (query=state.query) => meals.filter(meal=>categoryMatches(meal) && (meal.name+' '+meal.vendor+' '+meal.category).toLowerCase().includes(query.trim().toLowerCase())).sort((a,b)=>state.sort==='price'?a.price-b.price:0);

function mealCard(meal,small=false) {
  return `<button class="meal-card ${small?'compact':''}" data-meal="${meal.id}"><span class="meal-image ${meal.tone}">${photo(meal.img,meal.name)}${small?'':`<span class="meal-time">${icon('clock',13)} ${meal.eta}</span>`}</span>
    <span class="meal-card-copy"><strong>${meal.name}</strong><small>${meal.vendor}</small><b>${money(meal.price)}</b></span></button>`;
}
function miniMeal(meal,mode='details') {
  return `<button class="mini-meal" ${mode==='restaurant'?'data-rest="'+meal.id+'"':'data-meal="'+meal.id+'"'}>${thumb(meal.img,meal.name)}
    <span><strong>${mode==='restaurant'?meal.vendor:meal.name}</strong><small>${mode==='restaurant'?meal.category+' · '+meal.eta:meal.vendor+' · '+money(meal.price)}</small></span>${icon('chevron',16)}</button>`;
}

function homeContent(desktop=false) {
  return `<section class="customer-hero">
      <div><span class="eyebrow">THE JOLLOF ROOM</span><h1>Craving<br>something<br class="mobile-break"> good?</h1><p>Smoky jollof, grilled chicken and sweet plantain.</p>${go(desktop?'desk-restaurant':'restaurant','Explore menu','button dark')}</div>
      ${photo('hero','Signature jollof with fire-grilled chicken')}
    </section>
    <section class="screen-section"><div class="section-title"><h2>Browse by craving</h2>${go(desktop?'desk-discover':'categories','View all','text-button')}</div>
      <div class="category-rail">${categories.slice(0,4).map(([cat,img,tone])=>`<button data-open-category="${cat}"><span class="${tone}">${photo(img,'')}</span><strong>${cat}</strong></button>`).join('')}</div>
    </section>
    <section class="screen-section"><div class="section-title"><h2>Popular near you</h2>${go(desktop?'desk-discover':'discover','See all','text-button')}</div>
    ${desktop?`<div class="food-grid">${meals.slice(0,3).map(meal=>mealCard(meal)).join('')}</div>`:miniMeal(meals[1])+miniMeal(meals[2])}</section>`;
}

function customerHome() {
  return phonePage(`<header class="location-header">${locationButton()}${iconBtn('bag','Cart','data-screen="cart"')}</header>
    <div class="search-launch">${icon('search',18)}${go('discover','Search dishes or kitchens','text-button')}</div>
    ${homeContent()}`,{nav:'home',className:'home-screen'});
}

function discoverContent(desktop=false) {
  return `<div class="discover-title"><h1>Find your flavor.</h1><p>Explore local kitchens and the dishes they do best.</p></div>
    <div class="search-row">${searchBox(state.query)}${iconBtn('filter','Sort results','data-action="sort"')}</div>${promptChips()}
    <div class="section-title"><h2>${desktop?'Meals and kitchens':'Kitchens near you'}</h2><small data-result-count>${filteredMeals().length} to try</small></div>
    <div class="${desktop?'food-grid':'result-list'}" data-results>${discoveryResults(desktop)}</div>`;
}

function discoveryResults(desktop) {
  const results=filteredMeals();
  return results.length ? results.map(meal=>desktop ? mealCard(meal) : miniMeal(meal,'restaurant')).join('') : '<p class="empty-copy">No matches. Try a different dish or category.</p>';
}
function customerDiscover() {return phonePage(discoverContent(),{head:phoneHead('Discover','home'),nav:'discover',className:'discover-screen'});}
function categoryPage() {
  return phonePage(`<div class="discover-title"><h1>What’s your mood?</h1><p>Pick a category to see what’s cooking.</p></div>
    <div class="category-grid">${categories.map(([cat,img,tone])=>`<button class="${tone}" data-open-category="${cat}">${photo(img,'')}<strong>${cat}</strong></button>`).join('')}</div>`,
    {head:phoneHead('Categories','discover'),nav:'discover',className:'category-screen'});
}

function restaurantContent(desktop=false) {
  const meal=pickedMeal();
  const menu=meals.filter(item=>item.vendor===meal.vendor);
  return `<div class="restaurant-hero ${meal.tone}">${photo(meal.id==='jollof'?'hero':meal.img,meal.name)}</div>
    <div class="restaurant-info"><h1>${meal.vendor}</h1><p>${meal.category} · Local kitchen</p><div class="meta-chips">${badge(meal.eta,'yellow')}${badge('₦1,200 delivery','green')}</div></div>
    <div class="section-title"><h2>Menu</h2><small>${menu.length} ${menu.length===1?'dish':'dishes'}</small></div>
    <div class="${desktop?'food-grid':'result-list'}">${menu.map(item=>desktop?mealCard(item):miniMeal(item)).join('')}</div>`;
}

function customerRestaurant() {
  return phonePage(restaurantContent(),{head:phoneHead('Kitchen menu','discover',iconBtn('heart','Save kitchen','data-action="favorite" aria-pressed="'+state.favorite+'"')),nav:'discover',className:'restaurant-screen'});
}

function quantity({id='',value=1}={}) {
  const scope=id?`cart:${id}`:'meal';
  return `<span class="quantity">${iconBtn('minus','Decrease quantity',`data-action="quantity:${scope}:-1"`)}<b>${value}</b>${iconBtn('plus','Increase quantity',`data-action="quantity:${scope}:1"`)}</span>`;
}

function mealContent(desktop=false) {
  const meal=pickedMeal();
  return `<div class="meal-detail ${desktop?'desktop-meal':''}">
    <div class="meal-detail-photo ${meal.tone}">${photo(meal.id==='jollof'?'hero':meal.img,meal.name)}</div>
    <div class="meal-detail-copy"><span class="eyebrow">${meal.vendor}</span><h1>${meal.name}</h1><p>${meal.description}</p><strong class="meal-price">${money(meal.price)}</strong>
      <div class="option-list"><h2>Spice level</h2><small>Select one</small>${['Medium','Mild','Extra hot'].map(level=>`<label><input type="radio" name="spice" value="${level}" ${state.spice===level?'checked':''}>${level}</label>`).join('')}</div>
      ${desktop?addBar():''}</div></div>`;
}
function addBar() {return `<div class="sticky-action">${quantity({value:state.qty})}${action('add',`Add · ${money(pickedMeal().price*state.qty)}`,'button primary','bag')}</div>`;}
function mealPage() {return phonePage(mealContent(),{head:phoneHead('Meal details','restaurant'),foot:addBar(),className:'meal-screen'});}

function cartList() {
  const rows=basketRows();
  if(!rows.length) return `<div class="empty-cart"><span>${icon('bag',34)}</span><h2>Your cart is empty.</h2><p>Find something delicious to add.</p>${go(screen.startsWith('desk-')?'desk-discover':'discover','Browse food','button primary')}</div>`;
  return `<div class="cart-list">${rows.map(({key,spice,meal,qty})=>`<article class="cart-item">${thumb(meal.img,meal.name)}<div><strong>${meal.name}</strong><small>${spice} spice</small><b>${money(meal.price*qty)}</b></div>${quantity({id:key,value:qty})}</article>`).join('')}</div>`;
}

function totals() {
  return `<div class="totals"><div><span>Subtotal</span><strong>${money(subtotal())}</strong></div><div><span>Delivery</span><strong>${money(fee())}</strong></div><div class="total"><span>Total</span><strong>${money(subtotal()+fee())}</strong></div></div>`;
}

function cartPage() {
  return phonePage(`<h1>Your cart</h1>${cartList()}${cartCount()?totals():''}`,{
    head:phoneHead('Shopping cart','home'), nav:'cart',
    foot:cartCount()?`<div class="sticky-action">${go('checkout','Continue to checkout','button primary full')}</div>`:'',className:'cart-screen'});
}

function checkoutContent() {
  return `<div class="checkout-info"><h1>Checkout</h1>
    <div class="checkout-section"><h2>Delivery address</h2><button class="info-row" data-action="location"><span class="row-icon">${icon('pin',19)}</span><span><strong>${safe(state.area)}</strong><small>${safe(state.address||'Sample delivery address')}</small></span><b>Edit</b></button></div>
    <div class="checkout-section"><h2>Delivery time</h2><div class="info-row"><span class="row-icon yellow">${icon('clock',19)}</span><span><strong>As soon as possible</strong><small>Estimated 25–35 min</small></span></div></div>
    <div class="checkout-section"><h2>Payment method</h2><div class="payment-options">${['Demo card','Pay on delivery'].map(method=>`<label><input type="radio" name="payment" value="${method}" ${state.payment===method?'checked':''}>${method}</label>`).join('')}</div><small class="demo-note">Illustrative checkout. No payment is collected.</small></div></div>`;
}
function placeOrder() {return action('order',`Place demo order · ${money(subtotal()+fee())}`,'button primary full');}
function checkoutPage() {
  return phonePage(`${checkoutContent()}${cartCount()?totals():cartList()}`,{head:phoneHead('Checkout','cart'),foot:cartCount()?`<div class="sticky-action">${placeOrder()}</div>`:'',className:'checkout-screen'});
}

function routeMap() {
  return `<div class="route-map" aria-label="Illustrative route from the kitchen to the delivery area">
    <span class="map-road r1"></span><span class="map-road r2"></span><span class="map-road r3"></span><span class="map-road r4"></span><span class="map-road r5"></span>
    <span class="map-garden"></span><span class="map-line a"></span><span class="map-line b"></span><span class="map-line c"></span><span class="map-label">YABA</span>
    <span class="map-marker store">${icon('store',17)}</span><span class="map-marker bike">${icon('bike',17)}</span><span class="map-marker house">${icon('home',17)}</span></div>`;
}
const orderSummary = () => `<div class="info-row order-summary"><span class="row-icon">${icon('receipt',19)}</span><span><strong>Order CL-1042</strong><small>${state.order?.qty||1} ${(state.order?.qty||1)===1?'item':'items'} · ${safe(state.area)}</small></span><b>${money(state.order?.total||8000)}</b></div>`;

function confirmedPage() {
  return phonePage(`<div class="confirmation"><span class="confirmation-icon">${icon('check',35)}</span><h1>Order confirmed.</h1><p>The kitchen has your order. Your meal should arrive in 25–35 minutes.</p></div>
    ${orderSummary()}<div class="timeline"><span class="done">Order placed</span><span>Kitchen preparing</span><span>Rider on the way</span></div>`,
    {head:phoneHead('Order confirmed','home'),foot:`<div class="sticky-action">${go('tracking','Track my order','button primary full','route')}</div>`,className:'confirmed-screen'});
}
function trackingPage() {
  return phonePage(`${routeMap()}<div class="tracking-card"><div class="section-title"><h1>On the way</h1>${badge('8–12 min','blue')}</div><p>Your rider is heading to ${safe(state.area)}.</p>
    <div class="info-row"><span class="avatar blue">AM</span><span><strong>Amina M.</strong><small>Your rider · Demo profile</small></span>${iconBtn('phone','Contact rider','data-action="contact"')}</div>
    <div class="timeline"><span class="done">Order placed</span><span class="done">Picked up</span><span class="active">On the way</span><span>Delivered</span></div></div>`,
    {head:phoneHead('Track order','confirmed'),foot:`<div class="sticky-action">${go('delivered','Preview delivered state','button dark full')}</div>`,className:'tracking-screen'});
}
function deliveredPage() {
  return phonePage(`<div class="confirmation delivered"><span class="confirmation-icon">${icon('bag',34)}</span><h1>Food has arrived.</h1><p>Enjoy your meal. Your order details are saved below.</p></div>
    ${orderSummary()}<div class="checkout-section"><h2>Delivery details</h2><div class="info-row"><span class="row-icon green">${icon('check',19)}</span><span><strong>Delivered</strong><small>${safe(state.address||'Sample delivery address')}</small></span></div></div>`,
    {head:phoneHead('Order details','tracking'),foot:`<div class="sticky-action">${go('home','Back to home','button primary full')}</div>`,className:'delivered-screen'});
}

function desktopCustomer(content,active) {
  return `<main class="desktop-customer"><header class="desktop-customer-header">${go('desk-home',logo(),'text-button')}<nav aria-label="Customer navigation">${go('desk-home','Home','text-button '+(active==='home'?'selected':''))}${go('desk-discover','Discover','text-button '+(active==='discover'?'selected':''))}</nav>${locationButton()}${go('desk-checkout','Cart'+(cartCount()?' · '+cartCount():''),'button dark','bag')}</header>
    <div class="desktop-customer-body">${content}</div><footer class="desktop-customer-footer">${logo()} <span>Illustrative customer experience</span></footer></main>`;
}

function desktopCheckout() {
  return desktopCustomer(`<div class="desktop-checkout"><section>${checkoutContent()}</section><aside><h2>Your cart</h2>${cartList()}${cartCount()?totals()+placeOrder():''}</aside></div>`,'checkout');
}

const customerScreens={
  landing:landingPage,'landing-mobile':landingPage,login:loginPage,home:customerHome,discover:customerDiscover,categories:categoryPage,
  restaurant:customerRestaurant,meal:mealPage,cart:cartPage,checkout:checkoutPage,confirmed:confirmedPage,tracking:trackingPage,delivered:deliveredPage,
  'desk-home':()=>desktopCustomer(homeContent(true),'home'),'desk-discover':()=>desktopCustomer(discoverContent(true),'discover'),
  'desk-restaurant':()=>desktopCustomer(restaurantContent(true),'discover'),'desk-meal':()=>desktopCustomer(mealContent(true),'discover'),'desk-checkout':desktopCheckout
};
