'use strict';

const themeKey = 'chopline-theme';
let pickerSequence = 0;
let activePickerPosition;

function themeIcon() {
  return document.documentElement.dataset.theme==='dark' ? 'sun' : 'moon';
}

function themeButton() {
  const dark=document.documentElement.dataset.theme==='dark';
  return `<button type="button" class="icon-button theme-toggle" data-action="theme" aria-label="Dark mode" aria-pressed="${dark}" title="${dark?'Switch to light mode':'Switch to dark mode'}">${icon(themeIcon(),18)}</button>`;
}

function applyTheme(theme,persist=false) {
  const dark=theme==='dark';
  document.documentElement.dataset.theme=dark?'dark':'light';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',dark?'#171219':'#f9f5ec');
  for(const button of document.querySelectorAll('.theme-toggle')) {
    button.setAttribute('aria-pressed',String(dark));
    button.title=dark?'Switch to light mode':'Switch to dark mode';
    button.innerHTML=icon(themeIcon(),18);
  }
  const swatches=document.querySelector('.swatches');
  if(swatches) swatches.innerHTML=paletteSwatches();
  if(persist) {
    try { localStorage.setItem(themeKey,dark?'dark':'light'); } catch {}
  }
}

window.addEventListener('storage',event=>{
  if(event.key===themeKey || event.key===null) applyTheme(event.newValue);
});

window.addEventListener('resize',()=>activePickerPosition?.());
window.addEventListener('scroll',event=>{
  if(!(event.target instanceof Element) || !event.target.closest('.picker-menu')) activePickerPosition?.();
},true);

function enhancePickers(root,readOnly=false) {
  if(!HTMLElement.prototype.showPopover) return;
  root.querySelectorAll('select').forEach(select=>enhancePicker(select,readOnly));
}

function enhancePicker(select,readOnly) {
  const options=Array.from(select.options);
  const name=select.getAttribute('aria-label');
  const popupId='picker-'+(++pickerSequence);
  const container=document.createElement('div');
  container.className='picker';
  container.innerHTML=`<button type="button" class="picker-trigger" popovertarget="${popupId}" aria-haspopup="listbox" aria-expanded="false" aria-controls="${popupId}"><span></span>${icon('down',15)}</button><div class="picker-menu" id="${popupId}" popover="auto" role="listbox" aria-label="${safe(name)}"></div>`;
  const trigger=container.querySelector('button');
  const popup=container.querySelector('.picker-menu');
  const groupMap=new Map();
  const items=options.map((option,index)=>{
    const parent=option.parentElement;
    let section=popup;
    if(parent.tagName==='OPTGROUP') {
      if(!groupMap.has(parent)) {
        const group=document.createElement('div');
        group.className='picker-group';
        group.setAttribute('role','group');
        group.setAttribute('aria-label',parent.label);
        group.innerHTML=`<div class="picker-group-label" aria-hidden="true">${safe(parent.label)}</div>`;
        popup.append(group);
        groupMap.set(parent,group);
      }
      section=groupMap.get(parent);
    }
    const item=document.createElement('div');
    item.className='picker-option';
    item.setAttribute('role','option');
    item.tabIndex=-1;
    if(option.disabled || parent.disabled) item.setAttribute('aria-disabled','true');
    item.innerHTML=`<span>${safe(option.label)}</span>${icon('check',15)}`;
    item.addEventListener('click',()=>choose(index));
    section.append(item);
    return item;
  });
  const enabled=items.filter(item=>item.getAttribute('aria-disabled')!=='true');
  if(!enabled.length) return;

  select.after(container);
  select.hidden=true;
  trigger.disabled=readOnly;
  sync();
  if(readOnly) return;
  select.addEventListener('change',sync);
  select.form?.addEventListener('reset',()=>requestAnimationFrame(sync));

  function sync() {
    const value=options[select.selectedIndex]?.label ?? '';
    trigger.firstElementChild.textContent=value;
    trigger.setAttribute('aria-label',name+', '+value);
    items.forEach((item,index)=>item.setAttribute('aria-selected',String(index===select.selectedIndex)));
  }

  function position() {
    if(!popup.matches(':popover-open')) return;
    const box=trigger.getBoundingClientRect();
    const width=Math.min(window.innerWidth-16,Math.max(box.width,groupMap.size?256:176));
    popup.style.width=width+'px';
    const below=window.innerHeight-box.bottom-12;
    const above=box.top-12;
    const opensUp=below<Math.min(popup.scrollHeight,280) && above>below;
    const height=Math.min(368,opensUp?above:below);
    popup.style.left=Math.max(8,Math.min(box.right-width,window.innerWidth-width-8))+'px';
    popup.style.maxHeight=Math.max(0,height)+'px';
    popup.style.top=(opensUp ? box.top-6-popup.offsetHeight : box.bottom+6)+'px';
  }

  function close(focusTrigger) {
    if(popup.matches(':popover-open')) popup.hidePopover();
    trigger.setAttribute('aria-expanded','false');
    if(activePickerPosition===position) activePickerPosition=undefined;
    if(focusTrigger) trigger.focus();
  }

  function choose(index) {
    if(!enabled.includes(items[index])) return;
    const changed=index!==select.selectedIndex;
    select.selectedIndex=index;
    sync();
    close(true);
    if(changed) select.dispatchEvent(new Event('change',{bubbles:true}));
  }

  function focusOption(item,block='nearest') {
    item.focus({preventScroll:true});
    item.scrollIntoView({block});
  }

  function open() {
    if(popup.matches(':popover-open')) return;
    popup.showPopover({source:trigger});
    trigger.setAttribute('aria-expanded','true');
    activePickerPosition=position;
    position();
    focusOption(enabled.includes(items[select.selectedIndex])?items[select.selectedIndex]:enabled[0],'center');
  }

  trigger.addEventListener('click',event=>{
    event.preventDefault();
    if(popup.matches(':popover-open')) close(true);
    else open();
  });
  trigger.addEventListener('keydown',event=>{
    if(event.key==='ArrowDown' || event.key==='ArrowUp') {
      event.preventDefault();
      open();
    }
  });
  popup.addEventListener('toggle',()=>{
    const expanded=popup.matches(':popover-open');
    trigger.setAttribute('aria-expanded',String(expanded));
    if(!expanded && activePickerPosition===position) activePickerPosition=undefined;
  });

  let prefix='';
  let lastKey=0;
  popup.addEventListener('keydown',event=>{
    const index=enabled.indexOf(document.activeElement);
    const key=event.key;
    if(key==='Tab') {
      close(true);
      return;
    }
    if(key==='Escape') {
      event.preventDefault();
      event.stopPropagation();
      close(true);
      return;
    }
    if(key==='Enter' || key===' ') {
      event.preventDefault();
      choose(items.indexOf(document.activeElement));
      return;
    }
    if(key==='ArrowDown' || key==='ArrowUp' || key==='Home' || key==='End') {
      event.preventDefault();
      const next=key==='Home'?0:key==='End'?enabled.length-1:
        Math.max(0,Math.min(enabled.length-1,index+(key==='ArrowDown'?1:-1)));
      focusOption(enabled[next]);
      return;
    }
    if(key.length!==1 || event.ctrlKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    const char=key.toLowerCase();
    const now=Date.now();
    prefix=now-lastKey<600?prefix+char:char;
    lastKey=now;
    const candidates=enabled.slice(index+1).concat(enabled.slice(0,index+1));
    const find=()=>candidates.find(item=>item.firstElementChild.textContent.toLowerCase().startsWith(prefix));
    let match=find();
    if(!match && prefix.length>1) {
      prefix=char;
      match=find();
    }
    if(match) focusOption(match);
  });
}
