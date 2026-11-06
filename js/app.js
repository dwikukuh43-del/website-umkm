"use strict";

console.log("P10 JavaScript aktif");

const produkUmkm = [
  { nama: "Kopi Tubruk Rumah", kategori: "Kopi", hargaNormal: 20000, diskon: 10, stok: 15, unggulan: true },
  { nama: "Cold Brew Aren", kategori: "Kopi", hargaNormal: 22000, diskon: 0, stok: 10, unggulan: true },
  { nama: "Kopi Susu Aren", kategori: "Kopi", hargaNormal: 22222, diskon: 10, stok: 20, unggulan: false },
  { nama: "Paket Seduh Enak", kategori: "Bundling", hargaNormal: 75000, diskon: 0, stok: 1, unggulan: false },
];

function formatRupiah(nilai) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nilai);
}

function statusStok(stok) {
  if (stok <= 0) {
    return { label: "Habis", className: "empty" };
  }

  if (stok <= 5) {
    return { label: "Stok terbatas", className: "warning" };
  }

  return { label: "Tersedia", className: "" };
}

function labelKategori(kategori) {
  switch (kategori) {
    case "Kopi":
      return "Produk kopi pilihan";
    case "Bundling":
      return "Paket hemat";
    default:
      return "Produk UMKM";
  }
}

function hitungHarga(produk) {
  return Math.round(produk.hargaNormal * (1 - produk.diskon / 100));
}

function buatKartuProduk(produk) {
  const status = statusStok(produk.stok);
  const kategori = labelKategori(produk.kategori);
  const labelAksi = produk.stok > 0 ? "Siap dipesan" : "Hubungi admin";
  const hargaAkhir = hitungHarga(produk);
  const adaDiskon = produk.diskon > 0;

  return `
    <article class="js-product-card">
      <h3>${produk.nama}</h3>
      <p>${kategori}</p>
      <p class="price">
        ${adaDiskon ? `<del class="price-old">${formatRupiah(produk.hargaNormal)}</del>` : ""}
        ${formatRupiah(hargaAkhir)}
        ${adaDiskon ? `<span class="discount-badge">-${produk.diskon}%</span>` : ""}
      </p>
      <span class="stock-badge ${status.className}">${status.label}</span>
      <p>${labelAksi}</p>
    </article>
  `;
}

function renderProduk() {
  const grid = document.querySelector("#produk-dinamis");
  const ringkasan = document.querySelector("#produk-ringkasan");
  const unggulan = document.querySelector("#produk-unggulan");

  if (!grid || !ringkasan || !unggulan) {
    console.warn("Target render produk belum lengkap.");
    return;
  }

  produkUmkm.forEach((produk) => {
    console.log("Debug produk:", produk.nama, "stok:", produk.stok);
  });

  const produkTersedia = produkUmkm.filter((produk) => produk.stok > 0);
  const produkUnggulan = produkUmkm.find((produk) => produk.unggulan === true);
  const markupProduk = produkTersedia.map(buatKartuProduk).join("");

  console.log("Jumlah produk tersedia:", produkTersedia.length);
  console.table(produkUmkm);

  grid.innerHTML = markupProduk;
  ringkasan.textContent = `${produkTersedia.length} produk tersedia dari ${produkUmkm.length} data.`;

  unggulan.textContent = produkUnggulan
    ? `Produk unggulan: ${produkUnggulan.nama}`
    : "Belum ada produk unggulan.";
}
document.addEventListener("DOMContentLoaded", renderProduk);