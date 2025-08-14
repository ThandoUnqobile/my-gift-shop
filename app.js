
const state = {
  cart: JSON.parse(localStorage.getItem('flo_cart')||'[]'),
  products: (window.FLO_PRODUCTS||[]),
};

function saveCart(){
  localStorage.setItem('flo_cart', JSON.stringify(state.cart));
  updateCartCount();
}

function addToCart(id){
  const p = state.products.find(x=>x.id===id);
  if(!p) return;
  const item = state.cart.find(x=>x.id===id);
  if(item){ item.qty += 1; } else { state.cart.push({id, qty:1}); }
  saveCart();
  alert(p.name + ' added to cart');
}

function removeFromCart(id){
  state.cart = state.cart.filter(x=>x.id!==id);
  saveCart();
  renderCart && renderCart();
}

function setQty(id, qty){
  const it = state.cart.find(x=>x.id===id);
  if(!it) return;
  it.qty = Math.max(1, parseInt(qty||1));
  saveCart();
  renderCart && renderCart();
}

function cartCount(){
  return state.cart.reduce((a,b)=>a+b.qty,0);
}

function updateCartCount(){
  const el = document.querySelector('.cart-count');
  if(el) el.textContent = cartCount();
}

function money(v){ return 'R' + Number(v).toFixed(0); }

function renderProducts(filter='All', search=''){
  const list = document.querySelector('#product-grid');
  if(!list) return;
  list.innerHTML = '';
  const prods = state.products.filter(p=> (filter==='All'||p.category===filter) && p.name.toLowerCase().includes(search.toLowerCase()));
  for(const p of prods){
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="assets/placeholder.png" alt="${p.name}">
      <div class="body">
        <span class="badge">${p.category}</span>
        <strong>${p.name}</strong>
        <span class="price">${money(p.price)}</span>
        ${p.note?`<span class='small'>${p.note}</span>`:''}
        <button class="btn" data-id="${p.id}">Add to cart</button>
      </div>`;
    list.appendChild(card);
  }
  list.querySelectorAll('button[data-id]').forEach(btn=>btn.addEventListener('click', e=> addToCart(e.target.dataset.id)));
}

function getCartLines(){
  return state.cart.map(it=>{
    const p = state.products.find(x=>x.id===it.id);
    const price = p? p.price : 0;
    return {...it, name:p?.name||it.id, price, total: price*it.qty};
  });
}

function cartTotals(){
  const lines = getCartLines();
  const subtotal = lines.reduce((a,b)=>a+b.total,0);
  const shipping = subtotal>0 ? 60 : 0; // flat demo shipping
  const total = subtotal + shipping;
  return {subtotal, shipping, total, lines};
}

// Cart page renderer
function renderCart(){
  const tbody = document.querySelector('#cart-body');
  if(!tbody) return;
  const {subtotal, shipping, total, lines} = cartTotals();
  tbody.innerHTML = lines.map(l=>`
    <tr>
      <td>${l.name}</td>
      <td><input type='number' min='1' value='${l.qty}' data-qty='${l.id}'/></td>
      <td>${money(l.price)}</td>
      <td>${money(l.total)}</td>
      <td><button class='btn secondary' data-remove='${l.id}'>Remove</button></td>
    </tr>`).join('') || `<tr><td colspan='5'>Your cart is empty.</td></tr>`;

  const st = document.querySelector('#subtotal'); if(st) st.textContent = money(subtotal);
  const sh = document.querySelector('#shipping'); if(sh) sh.textContent = money(shipping);
  const tt = document.querySelector('#grand'); if(tt) tt.textContent = money(total);

  tbody.querySelectorAll('input[data-qty]').forEach(inp=> inp.addEventListener('input', e=> setQty(e.target.dataset.qty, e.target.value)));
  tbody.querySelectorAll('button[data-remove]').forEach(btn=> btn.addEventListener('click', e=> removeFromCart(e.target.dataset.remove)));
}

// Expose totals for PayPal
window.floCartTotals = cartTotals;
window.addEventListener('DOMContentLoaded', ()=>{
  updateCartCount();
  const catSel = document.querySelector('#cat');
  const search = document.querySelector('#search');
  if(catSel||search){
    const run = ()=> renderProducts(catSel?catSel.value:'All', search?search.value:'');
    if(catSel) catSel.addEventListener('change', run);
    if(search) search.addEventListener('input', run);
    run();
  }
  renderCart();
});
