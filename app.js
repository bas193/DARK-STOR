// CUSTOMER
function loadKedai(){ let d=DB.get(); namaKedai.innerText=d.nama; logoKedai.innerText=d.nama; }
function loadProduk(){
  let d=DB.get(); let cari=document.getElementById('cari')?.value.toLowerCase()||'';
  gridProduk.innerHTML = d.produk.filter(p=>p.nama.toLowerCase().includes(cari)).map(p=>`
    <div class="card-produk">
      <img src="${p.gambar[0]}">
      <h3>${p.nama}</h3><p>${p.harga}</p><p>Stok: ${p.stok}</p>
      <button onclick="order('${p.nama}')">Order Via WA</button>
    </div>`).join('');
}
function order(nama){ let d=DB.get(); d.order.push({id:Date.now(),produk:nama,status:'Baru',tarikh:new Date().toLocaleString()}); DB.save(d); alert('Order disimpan!'); window.open(`https://wa.me/${d.wa}?text=Saya nak order ${nama}`) }

// ADMIN
function loadAdminProduk(){ let d=DB.get(); tableProduk.innerHTML = d.produk.map((p,i)=>`<tr><td><img src="${p.gambar[0]}" width="50"></td><td>${p.nama}</td><td>${p.harga}</td><td><button onclick="padamPro(${i})">Padam</button></td></tr>`).join('') }
function simpanProduk(){ let d=DB.get(); let file=document.getElementById('gambar').files[0]; let reader=new FileReader(); reader.onload=()=>{d.produk.push({nama:nama.value,harga:harga.value,stok:stok.value,kategori:kategori.value,desc:desc.value,gambar:[reader.result]}); DB.save(d); alert('Simpan!')} ; reader.readAsDataURL(file)}
function tambahKategori(){let d=DB.get(); d.kategori.push(katBaru.value); DB.save(d); loadKategori()}
function loadKategori(){let d=DB.get(); listKat.innerHTML=d.kategori.map((k,i)=>`<div>${k} <button onclick="padamKat(${i})">X</button></div>`).join('')}
function padamKat(i){let d=DB.get(); d.kategori.splice(i,1); DB.save(d); loadKategori()}
function loadOrder(){let d=DB.get(); listOrder.innerHTML=d.order.map((o,i)=>`<div>${o.produk} - ${o.status} <button onclick="selesai(${i})">Selesai</button></div>`).join('')}
function selesai(i){let d=DB.get(); d.order[i].status='Selesai'; DB.save(d); loadOrder()}
function simpanSetting(){let d=DB.get(); d.nama=namaKedai.value; d.wa=noWa.value; DB.save(d); alert('Simpan')}
function exportData(){ let d=DB.get(); let a=document.createElement('a'); a.href='data:application/json,'+JSON.stringify(d); a.download='backup.json'; a.click(); }
