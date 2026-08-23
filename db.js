const DB = {
  get(){ return JSON.parse(localStorage.getItem('darkstorepro')) || {
    nama:"DARK STORE", wa:"60123456789", user:"admin", pass:"admin123",
    kategori:["Free Fire","Mobile Legends"],
    produk:[], order:[], banner:[]
  }},
  save(d){ localStorage.setItem('darkstorepro', JSON.stringify(d)) }
}
