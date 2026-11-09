"use strict";

console.log("P11 JavaScript aktif");

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

const produkGrid = document.querySelector("#produk-grid");
const produkStatus = document.querySelector("#produk-status");
const produkUnggulanEl = document.querySelector("#produk-unggulan");
const tombolFilter = document.querySelectorAll("[data-filter]");

function buatElemenProduk(produk) {
  const status = statusStok(produk.stok);
  const adaDiskon = produk.diskon > 0;

  const card = document.createElement("article");
  card.classList.add("js-product-card");

  const title = document.createElement("h3");
  title.textContent = produk.nama;

  const category = document.createElement("p");
  category.textContent = labelKategori(produk.kategori);

  const price = document.createElement("p");
  price.classList.add("price");

  if (adaDiskon) {
    const old = document.createElement("del");
    old.classList.add("price-old");
    old.textContent = formatRupiah(produk.hargaNormal);
    price.append(old);
  }

  price.append(formatRupiah(hitungHarga(produk)));

  if (adaDiskon) {
    const badge = document.createElement("span");
    badge.classList.add("discount-badge");
    badge.textContent = `-${produk.diskon}%`;
    price.append(badge);
  }

  const stock = document.createElement("span");
  stock.classList.add("stock-badge");
  if (status.className) {
    stock.classList.add(status.className);
  }
  stock.textContent = status.label;

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "Sembunyikan";
  removeButton.classList.add("ghost-button");
  removeButton.addEventListener("click", () => {
    card.remove();
    if (produkStatus) {
      produkStatus.textContent = "Satu kartu disembunyikan dari tampilan sementara.";
    }
  });

  card.append(title, category, price, stock, removeButton);
  return card;
}

function buatEmptyState(kategori) {
  const empty = document.createElement("p");
  empty.classList.add("empty-state");
  empty.textContent = `Belum ada produk pada kategori ${kategori}.`;
  return empty;
}

function renderProduk(kategoriAktif = "Semua") {
  if (!produkGrid || !produkStatus) {
    console.warn("Target render produk tidak ditemukan.");
    return;
  }

  console.log("Render kategori:", kategoriAktif);

  const produkTampil = kategoriAktif === "Semua"
    ? produkUmkm
    : produkUmkm.filter((produk) => produk.kategori === kategoriAktif);

  produkGrid.replaceChildren();

  if (produkTampil.length === 0) {
    produkGrid.append(buatEmptyState(kategoriAktif));
    produkStatus.textContent = "0 produk ditemukan.";
    return;
  }

  produkTampil.forEach((produk) => {
    produkGrid.append(buatElemenProduk(produk));
  });

  produkStatus.textContent = `${produkTampil.length} produk ditampilkan.`;
}

function renderUnggulan() {
  if (!produkUnggulanEl) {
    return;
  }

  const unggulan = produkUmkm.find((produk) => produk.unggulan === true);
  produkUnggulanEl.textContent = unggulan
    ? `Produk unggulan: ${unggulan.nama}`
    : "Belum ada produk unggulan.";
}

tombolFilter.forEach((tombol) => {
  tombol.addEventListener("click", (event) => {
    const tombolAktif = event.currentTarget;
    const kategori = tombolAktif.dataset.filter;

    tombolFilter.forEach((item) => item.classList.remove("is-active"));
    tombolAktif.classList.add("is-active");

    renderProduk(kategori);
  });
});

renderProduk();
renderUnggulan();