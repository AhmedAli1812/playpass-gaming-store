const products=[
 {id:1,name:'PlayStation Plus Extra',platform:'playstation',platformLabel:'PlayStation',duration:'3 شهور',price:1499,oldPrice:1699,sales:68,badge:'الأكثر مبيعًا',logo:'PS+',rating:'4.9'},
 {id:2,name:'Xbox Game Pass Ultimate',platform:'xbox',platformLabel:'Xbox',duration:'3 شهور',price:1199,oldPrice:1349,sales:51,badge:'وفر 11%',logo:'X',rating:'4.8'},
 {id:3,name:'PC Game Pass',platform:'pc',platformLabel:'PC Gaming',duration:'3 شهور',price:599,oldPrice:699,sales:34,badge:'عرض',logo:'PC',rating:'4.7'},
 {id:4,name:'PlayStation Plus Essential',platform:'playstation',platformLabel:'PlayStation',duration:'شهر واحد',price:299,oldPrice:null,sales:29,badge:null,logo:'PS',rating:'4.8'},
 {id:5,name:'EA Play',platform:'pc',platformLabel:'PC Gaming',duration:'12 شهر',price:899,oldPrice:999,sales:22,badge:'سنة كاملة',logo:'EA',rating:'4.6'},
 {id:6,name:'Nintendo Switch Online',platform:'nintendo',platformLabel:'Nintendo',duration:'12 شهر',price:749,oldPrice:null,sales:18,badge:null,logo:'N',rating:'4.7'}
];
const orders=[
 {id:'#PP-1048',name:'عميل تجريبي 1',email:'customer1@example.com',product:'PlayStation Plus Extra',amount:'1,499 ج.م',payment:'Vodafone Cash',status:'done',label:'مكتمل',date:'اليوم، 11:42 ص'},
 {id:'#PP-1047',name:'عميل تجريبي 2',email:'customer2@example.com',product:'Xbox Game Pass Ultimate',amount:'1,199 ج.م',payment:'InstaPay',status:'new',label:'جديد',date:'اليوم، 10:18 ص'},
 {id:'#PP-1046',name:'عميل تجريبي 3',email:'customer3@example.com',product:'PC Game Pass',amount:'599 ج.م',payment:'بطاقة بنكية',status:'done',label:'مكتمل',date:'أمس، 9:54 م'},
 {id:'#PP-1045',name:'عميل تجريبي 4',email:'customer4@example.com',product:'EA Play',amount:'899 ج.م',payment:'Fawry',status:'done',label:'مكتمل',date:'أمس، 7:11 م'},
 {id:'#PP-1044',name:'عميل تجريبي 5',email:'customer5@example.com',product:'Nintendo Switch Online',amount:'749 ج.م',payment:'InstaPay',status:'cancelled',label:'ملغي',date:'أمس، 5:23 م'}
];
let cart=[];let activeFilter='all';
const $=selector=>document.querySelector(selector);const $$=selector=>[...document.querySelectorAll(selector)];
const money=value=>`${Number(value).toLocaleString('ar-EG')} ج.م`;
const initials=name=>name.split(' ').slice(0,2).map(x=>x[0]).join('');

function renderProducts(){
 const term=$('#searchInput').value.trim().toLowerCase();
 const visible=products.filter(p=>(activeFilter==='all'||p.platform===activeFilter)&&(`${p.name} ${p.platformLabel}`.toLowerCase().includes(term)));
 $('#resultsCount').textContent=`${visible.length} منتجات`;
 $('#productGrid').innerHTML=visible.map(p=>`<article class="product-card" data-id="${p.id}">
  ${p.badge?`<span class="badge">${p.badge}</span>`:''}
  <button class="product-visual ${p.platform}" data-detail="${p.id}" aria-label="عرض تفاصيل ${p.name}"><span class="platform-tag">${p.platformLabel}</span><span class="visual-logo">${p.logo}<small>${p.duration}</small></span></button>
  <div class="product-info"><small>${p.platformLabel} • ${p.duration}</small><h3>${p.name}</h3><div class="rating">★★★★★ <span>${p.rating}</span></div><div class="product-bottom"><div class="price">${money(p.price)}${p.oldPrice?`<del>${money(p.oldPrice)}</del>`:''}</div><button class="add-btn" data-add="${p.id}" aria-label="أضف ${p.name} للسلة">+</button></div></div>
 </article>`).join('')||'<div class="empty-cart"><div><b>مفيش نتائج مطابقة</b><span>جرب كلمة بحث أو منصة تانية.</span></div></div>';
}
function setFilter(filter){activeFilter=filter;$$('.platform').forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));renderProducts();$('#products').scrollIntoView({behavior:'smooth'});}
function addToCart(id){const product=products.find(p=>p.id===Number(id));if(!product)return;cart.push(product);updateCart();showToast(`تمت إضافة ${product.name} للسلة`);}
function updateCart(){
 $('#cartCount').textContent=cart.length;$('#cartSub').textContent=`${cart.length} منتجات`;$('#cartTotal').textContent=money(cart.reduce((sum,p)=>sum+p.price,0));
 $('#cartItems').innerHTML=cart.length?cart.map((p,index)=>`<div class="cart-item"><span class="mini">${p.logo}</span><div><b>${p.name}</b><small>${p.duration} • ${money(p.price)}</small></div><button class="remove" data-remove="${index}" aria-label="حذف">×</button></div>`).join(''):'<div class="empty-cart"><div><b>السلة فاضية دلوقتي</b><span>ضيف اشتراك وارجع كمل طلبك.</span></div></div>';
}
function toggleCart(open){$('#cartDrawer').classList.toggle('open',open);$('#cartDrawer').setAttribute('aria-hidden',String(!open));$('#backdrop').hidden=!open;}
function showDetail(id){
 const p=products.find(item=>item.id===Number(id));if(!p)return;
 $('#productDialogContent').innerHTML=`<div class="product-detail"><div class="detail-visual">${p.logo}</div><div class="detail-content"><span class="eyebrow">${p.platformLabel}</span><h2>${p.name}</h2><p>كود رقمي أصلي للاستخدام على حسابك الشخصي، بيتبعت فور تأكيد الدفع.</p><div class="detail-features"><span>تسليم سريع على الإيميل وواتساب</span><span>تعليمات تفعيل واضحة بالعربي</span><span>دعم فني لو واجهتك أي مشكلة</span></div><div class="detail-price">${money(p.price)}</div><button class="primary-btn full" data-dialog-add="${p.id}">أضف للسلة</button></div></div>`;
 $('#productDialog').showModal();
}
function showToast(message){const toast=$('#toast');toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),2300);}
function showView(view){const admin=view==='admin';$('#storeView').hidden=admin;$('#adminView').hidden=!admin;document.body.classList.toggle('in-admin',admin);scrollTo({top:0,behavior:'auto'});}
const adminTitles={overview:'نظرة عامة',adminProducts:'إدارة المنتجات',orders:'الطلبات',customers:'العملاء',settings:'الإعدادات'};
function setAdminTab(id){$$('.admin-tab').forEach(t=>t.classList.toggle('active',t.id===id));$$('.side-link').forEach(b=>b.classList.toggle('active',b.dataset.adminTab===id));$('#adminTitle').textContent=adminTitles[id]||'لوحة التحكم';$('.admin-sidebar').classList.remove('open');}
function statusMarkup(status,label){return `<span class="status ${status}">${label}</span>`}
function renderOrders(){
 const rows=orders.map(o=>`<tr><td><b>${o.id}</b></td><td><div class="customer-cell"><span class="avatar">${initials(o.name)}</span><div><b>${o.name}</b><small>${o.email}</small></div></div></td><td>${o.product}</td><td><b>${o.amount}</b></td><td>${o.payment}</td><td>${statusMarkup(o.status,o.label)}</td><td>${o.date}</td></tr>`).join('');
 $('#allOrders').innerHTML=rows;
 $('#recentOrders').innerHTML=orders.slice(0,4).map(o=>`<tr><td><b>${o.id}</b></td><td><div class="customer-cell"><span class="avatar">${initials(o.name)}</span><div><b>${o.name}</b><small>${o.email}</small></div></div></td><td>${o.product}</td><td><b>${o.amount}</b></td><td>${statusMarkup(o.status,o.label)}</td><td>${o.date}</td></tr>`).join('');
}
function renderAdminProducts(){
 const term=$('#adminProductSearch').value.trim().toLowerCase();
 $('#adminProductTable').innerHTML=products.filter(p=>p.name.toLowerCase().includes(term)).map(p=>`<tr><td><div class="product-table-name"><span>${p.logo}</span><b>${p.name}</b></div></td><td>${p.platformLabel}</td><td><b>${money(p.price)}</b></td><td>${p.sales}</td><td>${statusMarkup('active','نشط')}</td><td><button class="action-btn" data-edit="${p.id}">تعديل</button></td></tr>`).join('');
}
function openProductForm(id){
 const p=products.find(item=>item.id===Number(id));$('#formTitle').textContent=p?'تعديل المنتج':'إضافة منتج جديد';$('#editProductId').value=p?.id||'';$('#formName').value=p?.name||'';$('#formPlatform').value=p?.platform||'playstation';$('#formPrice').value=p?.price||'';$('#formDuration').value=p?.duration||'';$('#editDialog').showModal();
}
function saveProductForm(event){
 event.preventDefault();const id=Number($('#editProductId').value);const platform=$('#formPlatform').value;const labels={playstation:'PlayStation',xbox:'Xbox',pc:'PC Gaming',nintendo:'Nintendo'};const logos={playstation:'PS',xbox:'X',pc:'PC',nintendo:'N'};
 const data={name:$('#formName').value.trim(),platform,platformLabel:labels[platform],price:Number($('#formPrice').value),duration:$('#formDuration').value.trim()};if(!data.name||!data.price||!data.duration)return;
 if(id){Object.assign(products.find(p=>p.id===id),data)}else{products.push({id:Math.max(...products.map(p=>p.id))+1,...data,oldPrice:null,sales:0,badge:'جديد',logo:logos[platform],rating:'5.0'})}
 $('#editDialog').close();renderProducts();renderAdminProducts();showToast(id?'تم تحديث المنتج':'تمت إضافة المنتج');
}
function renderCustomers(){
 const data=[['عميل تجريبي 1','customer1@example.com','8 طلبات','8,420 ج.م'],['عميل تجريبي 2','customer2@example.com','7 طلبات','6,985 ج.م'],['عميل تجريبي 3','customer3@example.com','6 طلبات','5,760 ج.م'],['عميل تجريبي 4','customer4@example.com','5 طلبات','4,890 ج.م']];
 $('#customerList').innerHTML=data.map(c=>`<div class="customer-row"><div class="customer-cell"><span class="avatar">${initials(c[0])}</span><div><b>${c[0]}</b><small>${c[1]}</small></div></div><span>${c[2]}</span><span>${c[3]}</span><button class="action-btn">عرض التفاصيل</button></div>`).join('');
}
document.addEventListener('click',event=>{
 const add=event.target.closest('[data-add]');if(add)addToCart(add.dataset.add);
 const detail=event.target.closest('[data-detail]');if(detail)showDetail(detail.dataset.detail);
 const remove=event.target.closest('[data-remove]');if(remove){cart.splice(Number(remove.dataset.remove),1);updateCart()}
 const filter=event.target.closest('[data-filter]');if(filter)setFilter(filter.dataset.filter);
 const scroll=event.target.closest('[data-scroll]');if(scroll)document.getElementById(scroll.dataset.scroll)?.scrollIntoView({behavior:'smooth'});
 const adminTab=event.target.closest('[data-admin-tab]');if(adminTab)setAdminTab(adminTab.dataset.adminTab);
 const edit=event.target.closest('[data-edit]');if(edit)openProductForm(edit.dataset.edit);
 const dialogAdd=event.target.closest('[data-dialog-add]');if(dialogAdd){addToCart(dialogAdd.dataset.dialogAdd);$('#productDialog').close()}
});
$('#searchToggle').addEventListener('click',()=>{const panel=$('#searchPanel');panel.hidden=!panel.hidden;if(!panel.hidden)$('#searchInput').focus()});
$('#searchInput').addEventListener('input',renderProducts);$('#adminProductSearch').addEventListener('input',renderAdminProducts);
$('#cartOpen').addEventListener('click',()=>toggleCart(true));$('#cartClose').addEventListener('click',()=>toggleCart(false));$('#backdrop').addEventListener('click',()=>toggleCart(false));
$('#adminEntry').addEventListener('click',()=>showView('admin'));$('#backStore').addEventListener('click',()=>showView('store'));$('#mobileMenu').addEventListener('click',()=>$('.admin-sidebar').classList.toggle('open'));
$('#addProduct').addEventListener('click',()=>openProductForm());$('#productForm').addEventListener('submit',saveProductForm);$('#saveSettings').addEventListener('click',()=>showToast('تم حفظ الإعدادات'));
$$('.edit-dialog-close').forEach(button=>button.addEventListener('click',()=>$('#editDialog').close()));
$('#checkoutBtn').addEventListener('click',()=>showToast(cart.length?'صفحة الدفع هتتربط في النسخة النهائية':'ضيف منتج للسلة الأول'));$('#howItWorks').addEventListener('click',()=>$('#steps').scrollIntoView({behavior:'smooth'}));$('.dialog-close').addEventListener('click',()=>$('#productDialog').close());
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#searchPanel').hidden=true;toggleCart(false)}});

function registerWebMCP(){
 const context=document.modelContext;if(!context?.registerTool)return;const lifecycle=new AbortController();const register=tool=>Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});
 register({name:'browse_store_category',title:'تصفح قسم المتجر',description:'يفتح قسمًا محددًا في متجر PlayPass ويعرض المنتجات المطابقة.',inputSchema:{type:'object',properties:{category:{type:'string',enum:['all','playstation','xbox','pc','nintendo']}},required:['category'],additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute({category}){if(!['all','playstation','xbox','pc','nintendo'].includes(category))throw new Error('Invalid category');showView('store');setFilter(category);return{category,results:products.filter(p=>category==='all'||p.platform===category).length}}});
 register({name:'add_store_product_to_cart',title:'إضافة منتج للسلة',description:'يضيف منتجًا متاحًا إلى سلة PlayPass ويحدّث السلة الظاهرة.',inputSchema:{type:'object',properties:{productId:{type:'number'}},required:['productId'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute({productId}){const p=products.find(x=>x.id===Number(productId));if(!p)throw new Error('Product not found');addToCart(p.id);return{productId:p.id,productName:p.name,cartCount:cart.length,total:cart.reduce((sum,x)=>sum+x.price,0)}}});
}
renderProducts();renderOrders();renderAdminProducts();renderCustomers();updateCart();registerWebMCP();
