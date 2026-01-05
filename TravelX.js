/* Travel X — Updated: Student / Religious / Routes / Chat / Callback features */

/* helpers */
const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));
const LS = localStorage;

function openModal(html){
  qs('#modalContent').innerHTML = html;
  qs('#modal').style.display = 'flex';
  qs('#modal').setAttribute('aria-hidden','false');
}
function closeModal(){ qs('#modal').style.display='none'; qs('#modal').setAttribute('aria-hidden','true'); }

function openLogin(){
  qs('#loginModal').style.display='flex'; qs('#loginModal').setAttribute('aria-hidden','false');
  qs('#loginEmail').value='student@demo'; qs('#loginPassword').value='student123';
}
function closeLogin(){ qs('#loginModal').style.display='none'; qs('#loginModal').setAttribute('aria-hidden','true'); }

function attemptLogin(){
  const email = qs('#loginEmail').value.trim();
  const pw = qs('#loginPassword').value;
  if((email === 'student@demo' && pw === 'student123') || email === ''){
    LS.setItem('tx_user', JSON.stringify({email, name: email.split('@')[0]||'Guest'}));
    closeLogin();
    openModal(`<h3>Welcome</h3><p class="small">Logged in as ${email || 'Guest'} (demo)</p>`);
  } else {
    alert('Invalid demo credentials. Use student@demo / student123 or leave blank for guest.');
  }
}

/* Search (demo) */
function performSearch(){
  const from = qs('#from').value || 'your city';
  const to = qs('#to').value || 'destination in India';
  const nights = qs('#nights').value;
  openModal(`<h3>Search: ${escapeHTML(from)} → ${escapeHTML(to)}</h3><p class="small">Searching ${nights} nights packages... (demo)</p>`);
}

/* package helpers */
function bookNow(pkg, student=false){
  openModal(`<h3>Book — ${escapeHTML(pkg)}</h3>
    <p class="small">Demo booking flow${student ? ' (Student special applied)' : ''}.</p>
    <div style="margin-top:8px">
      <input id="travName" placeholder="Traveler name" style="width:100%;padding:10px;border-radius:8px;border:1px solid rgba(0,0,0,0.06)">
      <input id="travEmail" placeholder="Email" style="width:100%;padding:10px;border-radius:8px;border:1px solid rgba(0,0,0,0.06);margin-top:8px">
      <div style="margin-top:10px;text-align:right"><button class="btn" onclick="confirmBooking('${encodeURIComponent(pkg)}', ${student})">Confirm (Demo)</button></div>
    </div>`);
}
function confirmBooking(pkgEnc, student=false){
  const name = qs('#travName').value || 'Guest';
  const email = qs('#travEmail').value || 'guest@example.com';
  closeModal();
  openModal(`<h3>Booking Confirmed (Demo)</h3>
    <p><strong>Package:</strong> ${decodeURIComponent(pkgEnc)}</p>
    <p><strong>Traveler:</strong> ${escapeHTML(name)} • ${escapeHTML(email)}</p>
    <p class="small">${student ? 'Student discount applied (demo).' : 'No payment processed — demo only.'}</p>`);
}

/* Save package */
function savePackage(pkg){
  const list = JSON.parse(LS.getItem('tx_wishlist') || '[]');
  if(list.includes(pkg)){ alert('Already saved to wishlist'); return; }
  list.push(pkg); LS.setItem('tx_wishlist', JSON.stringify(list)); alert('Saved to wishlist (local demo).');
}

/* Filter by category */
function applyFilter(btn){
  qsa('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const f = btn.dataset.filter;
  // featured cards
  qsa('#featuredCards .card').forEach(c=>{
    const cat = c.getAttribute('data-category') || 'India';
    c.style.display = (f === 'All' || f === cat || (f !== 'All' && cat.includes(f))) ? 'block' : 'none';
  });
  // packages
  qsa('.pkg').forEach(p=>{
    const type = p.getAttribute('data-type') || 'India';
    const cat = p.getAttribute('data-cat') || '';
    const show = (f === 'All') || (f === 'India' && type === 'India') || (f === 'Student' && type === 'Student') || (f === 'Religious' && type === 'Religious') || (f === cat) || (f === type);
    p.style.display = show ? 'block' : 'none';
  });
}

/* Student discount application (demo) */
function applyStudentCode(pkgName){
  const code = prompt('Enter Student Discount Code (demo):');
  if(!code) return;
  if(code.trim().toUpperCase() === 'STUDENT50' || code.trim().toUpperCase() === 'TXSTU2025'){
    alert('Student code applied! You get extra discounts (demo). Proceed to booking to confirm.');
  } else {
    alert('Invalid code (demo). Suggested codes: STUDENT50 or TXSTU2025');
  }
}

/* Redeem general offer */
function redeemOffer(){
  dismissPopup();
  openModal(`<h3>Offer Applied</h3><p class="small">Code <strong>TXIND2000</strong> will be displayed at checkout (demo). Students may combine codes where noted.</p>`);
}
function dismissPopup(){ LS.setItem('tx_popup_dismissed','1'); qs('#popupWrap').style.display='none'; }

/* Route guidance: open Google Maps directions */
function openRoute(){
  const from = encodeURIComponent(qs('#routeFrom').value || '');
  const to = encodeURIComponent(qs('#routeTo').value || '');
  if(!to){ alert('Please enter a destination'); return; }
  const url = `https://www.google.com/maps/dir/?api=1&origin=${from || ''}&destination=${to}&travelmode=driving`;
  window.open(url, '_blank');
}
function openRouteFor(place){
  const origin = prompt('Enter your origin (city or address). Leave blank to use current location in Google Maps.');
  const dest = encodeURIComponent(place);
  const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin||'')}&destination=${dest}&travelmode=driving`;
  window.open(url, '_blank');
}

/* Callback requests */
function requestCallback(){
  const name = qs('#cbName').value.trim();
  const phone = qs('#cbPhone').value.trim();
  if(!name || !phone) return alert('Please enter name and phone');
  const req = JSON.parse(LS.getItem('tx_callbacks') || '[]');
  req.unshift({name,phone,time:new Date().toISOString(),type:'quick'});
  LS.setItem('tx_callbacks', JSON.stringify(req));
  qs('#cbName').value=''; qs('#cbPhone').value='';
  alert('Callback requested — demo. Our team will reach out (simulated).');
}
function requestCallback2(){
  const name = qs('#cbName2').value.trim();
  const phone = qs('#cbPhone2').value.trim();
  if(!name || !phone) return alert('Please enter name and phone');
  const req = JSON.parse(LS.getItem('tx_callbacks') || '[]');
  req.unshift({name,phone,time:new Date().toISOString(),type:'contact'});
  LS.setItem('tx_callbacks', JSON.stringify(req));
  qs('#cbName2').value=''; qs('#cbPhone2').value='';
  alert('Callback requested from Contact panel (demo).');
}

/* Contact form */
function submitContact(e){
  e.preventDefault();
  const name = qs('#contactName').value.trim();
  const email = qs('#contactEmail').value.trim();
  const msg = qs('#contactMessage').value.trim();
  if(!name || !email || !msg) return alert('Please fill all fields');
  const logs = JSON.parse(LS.getItem('tx_contacts') || '[]');
  logs.unshift({name,email,msg,time:new Date().toISOString()});
  LS.setItem('tx_contacts', JSON.stringify(logs));
  qs('#contactForm').reset();
  openModal('<h3>Message Sent</h3><p class="small">Thanks! Our demo support will respond (simulated).</p>');
}

/* Chat widget (simple local chat demo) */
function toggleChat(){
  const win = qs('#chatWindow');
  if(win.style.display === 'none' || !win.style.display) {
    win.style.display = 'flex';
    renderChat();
  } else {
    win.style.display = 'none';
  }
}
function sendChat(){
  const input = qs('#chatInput');
  const text = input.value.trim();
  if(!text) return;
  const msgs = JSON.parse(LS.getItem('tx_chat') || '[]');
  msgs.push({from:'user',text,time:new Date().toISOString()});
  // bot echo response (demo)
  msgs.push({from:'bot',text:'Thanks! We received: "'+text+'". Our support will reply shortly (demo).',time:new Date().toISOString()});
  LS.setItem('tx_chat', JSON.stringify(msgs));
  input.value='';
  renderChat();
}
function renderChat(){
  const body = qs('#chatBody');
  const msgs = JSON.parse(LS.getItem('tx_chat') || '[]');
  body.innerHTML = '';
  msgs.slice(-30).forEach(m=>{
    const d = document.createElement('div');
    d.style.marginBottom='8px';
    if(m.from === 'user') d.innerHTML = `<div style="text-align:right"><div style="display:inline-block;background:linear-gradient(90deg,var(--accent-2),var(--accent));color:white;padding:8px 10px;border-radius:10px">${escapeHTML(m.text)}</div><div class="small">${new Date(m.time).toLocaleTimeString()}</div></div>`;
    else d.innerHTML = `<div style="text-align:left"><div style="display:inline-block;background:rgba(0,0,0,0.04);padding:8px 10px;border-radius:10px">${escapeHTML(m.text)}</div><div class="small">${new Date(m.time).toLocaleTimeString()}</div></div>`;
    body.appendChild(d);
  });
  body.scrollTop = body.scrollHeight;
}

/* utility */
function escapeHTML(s){ return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'); }

/* accessibility: close modals/popup on ESC */
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape'){ closeModal(); qs('#loginModal').style.display='none'; qs('#popupWrap').style.display='none'; } });

/* init: hide popup if dismissed before */
(function init(){
  if(LS.getItem('tx_popup_dismissed')) qs('#popupWrap').style.display='none';
  // seed chat with greeting
  if(!LS.getItem('tx_chat')) LS.setItem('tx_chat', JSON.stringify([{from:'bot',text:'Hello! Travel X here — ask about student deals, routes or packages (demo).',time:new Date().toISOString()}]));
})();
function viewDetails(packageName) {
  openModal(`
    <h3>${packageName}</h3>
    <p class="small">
      This travel package includes comfortable accommodation, guided sightseeing,
      local transportation, and complete customer assistance during the journey.
    </p>
    <p class="small">
      Travel X ensures transparent pricing, safe travel arrangements,
      and well-organized itineraries. Detailed travel plans are shared after booking.
    </p>
    <div style="margin-top:12px;text-align:right">
      <button class="btn" onclick="closeModal()">Close</button>
    </div>
  `);
}


/* ===== BACKEND INTEGRATION PATCH ===== */

function signup(name,email,password){
 fetch("/api/signup",{method:"POST",headers:{"Content-Type":"application/json"},
 body:JSON.stringify({name,email,password})})
 .then(r=>r.json()).then(d=>alert(d.success?"Signup success":"User exists"));
}

function login(email,password){
 fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},
 body:JSON.stringify({email,password})})
 .then(r=>r.json()).then(d=>{
   if(d.success){ localStorage.setItem("userEmail",email); alert("Login success"); }
   else alert("Invalid login");
 });
}

function bookNow(destination){
 const email=localStorage.getItem("userEmail");
 const date=new Date().toISOString().slice(0,10);
 fetch("/api/book",{method:"POST",headers:{"Content-Type":"application/json"},
 body:JSON.stringify({email,destination,date})})
 .then(r=>r.json()).then(d=>alert("Booking confirmed"));
}

/* ===== SIGNUP UI FUNCTIONS ===== */
function openSignup(){
  document.getElementById("signupModal").style.display="block";
}
function closeSignup(){
  document.getElementById("signupModal").style.display="none";
}
function doSignup(){
  const name=signupName.value;
  const email=signupEmail.value;
  const password=signupPassword.value;

  fetch("/api/signup",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({name,email,password})
  })
  .then(r=>r.json())
  .then(d=>{
    if(d.success){
      alert("Signup successful, please login");
      closeSignup();
      openLogin();
    }else{
      alert("User already exists");
    }
  });
}
