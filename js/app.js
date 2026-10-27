// ==========================================
// KREDENSIAL SUPABASE (GANTI DENGAN MILIK ANTUM)
// ==========================================
const SUPABASE_URL = "https://nqeclnbrzzmyabgwmpth.supabase.co"; //
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xZWNsbmJyenpteWFiZ3dtcHRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMzAzNTQsImV4cCI6MjEwNzgwNjM1NH0.cXvgbhJZCtpZVdPTbjoY7qTLyjS3uKZ53HurbTaUulM"; //

const { createClient } = supabase; //[cite: 10]
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); //[cite: 10]

// ==========================================
// PARAMETER LINK & DIREKTORI ASSET KLIEN (VERCEL READY)
// ==========================================
const urlParams = new URLSearchParams(window.location.search); //[cite: 10]
const slugPasangan = urlParams.get("slug") || "demo"; //[cite: 10]
const namaTamuParam = urlParams.get("to"); //[cite: 10]
const clientSlug =
  urlParams.get("client") || urlParams.get("clients") || "demo";

// Path Folder Asset Klien di Vercel (/clients/nama-klien)
const CLIENT_URL = `/clients/${clientSlug}`;

// ==========================================
// OTOMATISASI LOAD MEDIA KLIEN (FALLBACK TEMPLATE)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // Path default foto template
  const TEMPLATE_FOTO = `${CLIENT_URL}/foto5.jpg`;

  // 1. Audio Player
  const audioEl = $("musik") || document.querySelector("audio");
  if (audioEl) audioEl.src = `${CLIENT_URL}/musik.mp3`;

  // 2. Map Otomatis Semua Tag Image Berdasarkan ID
  document.querySelectorAll("img[id]").forEach((img) => {
    const fileExt = img.src.split(".").pop() || "jpg";
    const targetSrc = `${CLIENT_URL}/${img.id}.${fileExt.length > 4 ? "jpg" : fileExt}`;

    // Pasang foto target dulu
    img.src = targetSrc;

    // JIKA FOTO SPESIFIK TIDAK ADA -> OTOMATIS PAKAI TEMPLATE foto5.jpg
    img.onerror = () => {
      img.onerror = null; // Cegah infinite loop
      img.src = TEMPLATE_FOTO;
    };
  });

  // 3. Set Background Latar Merah & Perkamen (Burgundy)
  const bgMerahDesktop = $("bg-merah-desktop");
  if (bgMerahDesktop)
    bgMerahDesktop.style.backgroundImage = `url(${CLIENT_URL}/bg-merah.webp)`;

  const mainHome = $("main-home");
  if (mainHome)
    mainHome.style.backgroundImage = `url(${CLIENT_URL}/bg-merah.webp)`;

  const kertasBg = $("kertas-bg");
  if (kertasBg) kertasBg.src = `${CLIENT_URL}/kertas.webp`;
});
// ==========================================
// PENGATURAN (bagian yang paling sering diubah)
// ==========================================
const ACARA = {
  jam: 8, //[cite: 10]
  menit: 0, //[cite: 10]
  durasiJam: 6, //[cite: 10]
  zona: "+07:00", //[cite: 10]
};

const PENGINGAT_MENIT = [1440, 180]; //[cite: 10]
const CATATAN_TAMBAHAN = []; //[cite: 10]
const PETA_QUERY = ""; //[cite: 10]
const INTERVAL_SLIDE = 5500; //[cite: 10]
const KECEPATAN_GALERI = 22; //[cite: 10]
const EFEK_TUMPUK = true; //[cite: 10]
const VOLUME_LAGU = 0.7; //[cite: 10]

const $ = (id) => document.getElementById(id); //[cite: 10]
function isi(id, teks) {
  const el = $(id);
  if (el) el.textContent = teks;
} //[cite: 10]
function escapeHtml(t) {
  return String(t ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
} //[cite: 10]
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches; //[cite: 10]

const inputNamaEl = $("input-nama"); //[cite: 10]
const coverNamaEl = $("nama-tamu"); //[cite: 10]
if (namaTamuParam) {
  coverNamaEl.textContent = namaTamuParam; //[cite: 10]
  inputNamaEl.value = namaTamuParam; //[cite: 10]
} else {
  coverNamaEl.textContent = "Tamu Undangan"; //[cite: 10]
  inputNamaEl.value = "Tamu Umum"; //[cite: 10]
}

let currentCoupleId = null; //[cite: 10]

// ==========================================
// 1. DATA PASANGAN DARI SUPABASE
// ==========================================
function zonaMenit() {
  const m = /^([+-])(\d{2}):?(\d{2})$/.exec(ACARA.zona);
  return m ? (m[1] === "-" ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3])) : 0;
} //[cite: 10]
function tanggalDiZona(str) {
  const d = new Date(str);
  if (isNaN(d)) {
    const [y, m, dd] = String(str).slice(0, 10).split("-").map(Number);
    return { y, m, d: dd };
  }
  const g = new Date(d.getTime() + zonaMenit() * 60000);
  return { y: g.getUTCFullYear(), m: g.getUTCMonth() + 1, d: g.getUTCDate() };
} //[cite: 10]
function tanggalTampil(str) {
  const { y, m, d } = tanggalDiZona(str);
  return new Date(y, m - 1, d);
} //[cite: 10]
function waktuAcara(str, tambahJam = 0) {
  const { y, m, d } = tanggalDiZona(str);
  const p = (n) => String(n).padStart(2, "0");
  const t = new Date(
    `${y}-${p(m)}-${p(d)}T${p(ACARA.jam)}:${p(ACARA.menit)}:00${ACARA.zona}`,
  );
  return new Date(t.getTime() + tambahJam * 3600 * 1000);
} //[cite: 10]
function inisial(nama) {
  return String(nama || "")
    .trim()
    .charAt(0)
    .toUpperCase();
} //[cite: 10]

async function loadWeddingData() {
  const { data, error } = await _supabase
    .from("pasangan")
    .select("*")
    .eq("slug", slugPasangan)
    .single(); //[cite: 10]

  if (error || !data) {
    console.error("Data pasangan tidak ditemukan:", error); //[cite: 10]
    return;
  }

  currentCoupleId = data.id; //[cite: 10]
  const nw = data.nama_wanita; //[cite: 10]
  const np = data.nama_pria; //[cite: 10]
  const tgl = tanggalTampil(data.tanggal_acara); //[cite: 10]
  const fmt = (opsi) => tgl.toLocaleDateString("id-ID", opsi); //[cite: 10]

  const elCover = $("cover-mempelai"); //[cite: 10]
  if (elCover) {
    elCover.textContent = ""; //[cite: 10]
    const amp = document.createElement("span"); //[cite: 10]
    amp.className = "block text-2xl leading-none my-1 opacity-70"; //[cite: 10]
    amp.textContent = "&"; //[cite: 10]
    elCover.append(nw, amp, np); //[cite: 10]
  }

  const dm = $("desktop-mempelai"); //[cite: 10]
  if (dm) {
    dm.textContent = ""; //[cite: 10]
    dm.append(
      nw,
      document.createElement("br"),
      "&",
      document.createElement("br"),
      np,
    ); //[cite: 10]
  }

  isi("berdua-wanita", nw); //[cite: 10]
  isi("berdua-pria", np); //[cite: 10]
  isi("mono-wanita", inisial(nw)); //[cite: 10]
  isi("mono-pria", inisial(np)); //[cite: 10]
  isi(
    "berdua-tanggal",
    fmt({ day: "numeric", month: "long", year: "numeric" }),
  ); //[cite: 10]

  isi("mempelai-wanita", nw); //[cite: 10]
  isi("mempelai-pria", np); //[cite: 10]

  isi("acara-hari", fmt({ weekday: "long" })); //[cite: 10]
  isi("acara-tgl", String(tgl.getDate()).padStart(2, "0")); //[cite: 10]
  isi("acara-bln", fmt({ month: "long", year: "numeric" })); //[cite: 10]
  isi("info-lokasi", data.lokasi_acara); //[cite: 10]
  if (data.url_maps)
    $("link-maps").href = data.url_maps; //[cite: 10]
  else $("link-maps").classList.add("hidden"); //[cite: 10]
  mulaiHitungMundur(waktuAcara(data.tanggal_acara)); //[cite: 10]
  siapkanKalender(data, nw, np); //[cite: 10]
  isiPeta(data); //[cite: 10]

  isi("penutup-nama", `${nw} & ${np}`); //[cite: 10]

  muatUcapanRealtime(currentCoupleId); //[cite: 10]
  hitungTumpukan(); //[cite: 10]
}

// ==========================================
// SIMPAN KE KALENDER
// ==========================================
function formatUtc(dt) {
  return dt
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
} //[cite: 10]
function escIcs(t) {
  return String(t)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
} //[cite: 10]
function lipatIcs(baris) {
  const enc = new TextEncoder();
  const hasil = [];
  let cur = "";
  let len = 0;
  for (const ch of baris) {
    const b = enc.encode(ch).length;
    if (len + b > 72) {
      hasil.push(cur);
      cur = " " + ch;
      len = 1 + b;
    } else {
      cur += ch;
      len += b;
    }
  }
  hasil.push(cur);
  return hasil.join("\r\n");
} //[cite: 10]

function susunCatatan(data, nw, np) {
  const baris = [`Undangan Pernikahan ${nw} & ${np}`]; //[cite: 10]
  if (namaTamuParam) baris.push(`Kepada: ${namaTamuParam}`); //[cite: 10]
  baris.push(""); //[cite: 10]
  document.querySelectorAll(".acara-item").forEach((el) => {
    const n = el.querySelector(".acara-nama")?.textContent.trim();
    const w = el.querySelector(".acara-waktu")?.textContent.trim();
    if (n && w) baris.push(`${n}: ${w}`);
  }); //[cite: 10]
  baris.push(""); //[cite: 10]
  if (data.lokasi_acara) baris.push(`Lokasi: ${data.lokasi_acara}`); //[cite: 10]
  if (data.url_maps) baris.push(`Peta: ${data.url_maps}`); //[cite: 10]
  CATATAN_TAMBAHAN.forEach((t) => baris.push(t)); //[cite: 10]
  baris.push(""); //[cite: 10]
  baris.push(`Undangan: ${window.location.href}`); //[cite: 10]
  return baris.join("\n"); //[cite: 10]
}

function siapkanKalender(data, nw, np) {
  const mulai = waktuAcara(data.tanggal_acara); //[cite: 10]
  const selesai = waktuAcara(data.tanggal_acara, ACARA.durasiJam); //[cite: 10]
  const judul = `Pernikahan ${nw} & ${np}`; //[cite: 10]
  const catatan = susunCatatan(data, nw, np); //[cite: 10]
  const lokasi = data.lokasi_acara || ""; //[cite: 10]

  const g = new URL("https://calendar.google.com/calendar/render"); //[cite: 10]
  g.searchParams.set("action", "TEMPLATE"); //[cite: 10]
  g.searchParams.set("text", judul); //[cite: 10]
  g.searchParams.set("dates", `${formatUtc(mulai)}/${formatUtc(selesai)}`); //[cite: 10]
  g.searchParams.set("details", catatan); //[cite: 10]
  g.searchParams.set("location", lokasi); //[cite: 10]
  const linkGoogle = $("kal-google"); //[cite: 10]
  if (linkGoogle) linkGoogle.href = g.toString(); //[cite: 10]

  const tombolIcs = $("kal-ics"); //[cite: 10]
  if (!tombolIcs) return; //[cite: 10]
  tombolIcs.addEventListener("click", () => {
    const baris = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Wedding Code//Undangan Digital//ID",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${slugPasangan}-${mulai.getTime()}@weddingcode`,
      `DTSTAMP:${formatUtc(new Date())}`,
      `DTSTART:${formatUtc(mulai)}`,
      `DTEND:${formatUtc(selesai)}`,
      `SUMMARY:${escIcs(judul)}`,
      `LOCATION:${escIcs(lokasi)}`,
      `DESCRIPTION:${escIcs(catatan)}`,
      `URL:${window.location.href}`,
    ]; //[cite: 10]
    PENGINGAT_MENIT.forEach((m) => {
      baris.push(
        "BEGIN:VALARM",
        `TRIGGER:-PT${m}M`,
        "ACTION:DISPLAY",
        `DESCRIPTION:${escIcs(judul)}`,
        "END:VALARM",
      );
    }); //[cite: 10]
    baris.push("END:VEVENT", "END:VCALENDAR"); //[cite: 10]

    const isiIcs = baris.map(lipatIcs).join("\r\n") + "\r\n"; //[cite: 10]
    const blob = new Blob([isiIcs], { type: "text/calendar;charset=utf-8" }); //[cite: 10]
    const url = URL.createObjectURL(blob); //[cite: 10]
    const a = document.createElement("a"); //[cite: 10]
    a.href = url; //[cite: 10]
    a.download = `pernikahan-${slugPasangan}.ics`; //[cite: 10]
    document.body.appendChild(a); //[cite: 10]
    a.click(); //[cite: 10]
    a.remove(); //[cite: 10]
    setTimeout(() => URL.revokeObjectURL(url), 5000); //[cite: 10]
  });
}

function isiPeta(data) {
  const q = (PETA_QUERY || data.lokasi_acara || "").trim(); //[cite: 10]
  const frame = $("peta"); //[cite: 10]
  const wadah = $("peta-wrap"); //[cite: 10]
  if (!frame || !wadah || !q) return; //[cite: 10]
  frame.src =
    "https://maps.google.com/maps?q=" +
    encodeURIComponent(q) +
    "&z=15&output=embed"; //[cite: 10]
  wadah.classList.remove("hidden"); //[cite: 10]
}

// ==========================================
// 2. HITUNG MUNDUR
// ==========================================
function mulaiHitungMundur(target) {
  if (!$("cd-hari")) return; //[cite: 10]
  const pad = (n) => String(n).padStart(2, "0"); //[cite: 10]
  let timer = null; //[cite: 10]
  function tick() {
    const sisa = Math.floor((target.getTime() - Date.now()) / 1000); //[cite: 10]
    if (sisa <= 0) {
      ["cd-hari", "cd-jam", "cd-menit", "cd-detik"].forEach((id) =>
        isi(id, "00"),
      ); //[cite: 10]
      $("cd-pesan")?.classList.remove("hidden"); //[cite: 10]
      clearInterval(timer); //[cite: 10]
      return; //[cite: 10]
    }
    isi("cd-hari", pad(Math.floor(sisa / 86400))); //[cite: 10]
    isi("cd-jam", pad(Math.floor((sisa % 86400) / 3600))); //[cite: 10]
    isi("cd-menit", pad(Math.floor((sisa % 3600) / 60))); //[cite: 10]
    isi("cd-detik", pad(sisa % 60)); //[cite: 10]
  }
  tick(); //[cite: 10]
  timer = setInterval(tick, 1000); //[cite: 10]
}

// ==========================================
// 3. BUKA UNDANGAN (GSAP)
// ==========================================
let sedangMembuka = false; //[cite: 10]
const ZOOM_AWAL = 0.55; //[cite: 10]
const DURASI_BUKA = 3.4; //[cite: 10]
const JUMLAH_BURUNG = 8; //[cite: 10]

const SAYAP = {
  atas: "M32 22 Q20 4 2 6 Q18 16 32 22 Z M32 22 Q44 4 62 6 Q46 16 32 22 Z",
  tengah:
    "M32 22 Q20 12 2 18 Q18 22 32 22 Z M32 22 Q44 12 62 18 Q46 22 32 22 Z",
  bawah: "M32 22 Q20 30 2 36 Q20 22 32 22 Z M32 22 Q44 30 62 36 Q44 22 32 22 Z",
}; //[cite: 10]

function buatBurung() {
  const ns = "http://www.w3.org/2000/svg"; //[cite: 10]
  const svg = document.createElementNS(ns, "svg"); //[cite: 10]
  svg.setAttribute("viewBox", "0 0 64 40"); //[cite: 10]
  svg.setAttribute("class", "burung-el"); //[cite: 10]
  svg.setAttribute("aria-hidden", "true"); //[cite: 10]

  const sayap = document.createElementNS(ns, "path"); //[cite: 10]
  sayap.setAttribute("d", SAYAP.atas); //[cite: 10]
  sayap.setAttribute("fill", "currentColor"); //[cite: 10]
  const anim = document.createElementNS(ns, "animate"); //[cite: 10]
  anim.setAttribute("attributeName", "d"); //[cite: 10]
  anim.setAttribute("dur", (0.55 + Math.random() * 0.35).toFixed(2) + "s"); //[cite: 10]
  anim.setAttribute("begin", "-" + (Math.random() * 0.8).toFixed(2) + "s"); //[cite: 10]
  anim.setAttribute("repeatCount", "indefinite"); //[cite: 10]
  anim.setAttribute(
    "values",
    [SAYAP.atas, SAYAP.tengah, SAYAP.bawah, SAYAP.tengah, SAYAP.atas].join(";"),
  ); //[cite: 10]
  sayap.appendChild(anim); //[cite: 10]

  const badan = document.createElementNS(ns, "ellipse"); //[cite: 10]
  badan.setAttribute("cx", "32"); //[cite: 10]
  badan.setAttribute("cy", "23.5"); //[cite: 10]
  badan.setAttribute("rx", "2.6"); //[cite: 10]
  badan.setAttribute("ry", "5"); //[cite: 10]
  badan.setAttribute("fill", "currentColor"); //[cite: 10]

  svg.append(sayap, badan); //[cite: 10]
  return svg; //[cite: 10]
}

function terbangkanBurung() {
  const wadah = $("burung"); //[cite: 10]
  if (!wadah || reduceMotion) return; //[cite: 10]
  wadah.textContent = ""; //[cite: 10]
  const warna = ["#f3e6e2", "#e6c9c4", "#c9a0a0"]; //[cite: 10]
  for (let i = 0; i < JUMLAH_BURUNG; i++) {
    const el = buatBurung(); //[cite: 10]
    el.style.color = warna[i % warna.length]; //[cite: 10]
    wadah.appendChild(el); //[cite: 10]

    const t = JUMLAH_BURUNG > 1 ? i / (JUMLAH_BURUNG - 1) : 0.5; //[cite: 10]
    const sudut =
      ((-90 + (t - 0.5) * 120 + gsap.utils.random(-10, 10)) * Math.PI) / 180; //[cite: 10]
    const jarak = gsap.utils.random(560, 900); //[cite: 10]
    const ex = Math.cos(sudut) * jarak; //[cite: 10]
    const ey = Math.sin(sudut) * jarak; //[cite: 10]
    const goyang = gsap.utils.random(25, 55) * (i % 2 ? 1 : -1); //[cite: 10]
    const delay = i * 0.16 + Math.random() * 0.3; //[cite: 10]

    gsap.set(el, {
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
      scale: 0.25,
      rotation: 0,
    }); //[cite: 10]
    gsap.to(el, {
      keyframes: [
        {
          x: ex * 0.3 + goyang,
          y: ey * 0.3,
          scale: 0.55,
          duration: 1.5,
          ease: "sine.inOut",
        },
        {
          x: ex * 0.65 - goyang,
          y: ey * 0.65,
          scale: 0.85,
          duration: 1.7,
          ease: "sine.inOut",
        },
        {
          x: ex,
          y: ey,
          scale: gsap.utils.random(1.0, 1.35),
          duration: 1.8,
          ease: "sine.in",
        },
      ],
      delay,
      onComplete: () => el.remove(),
    }); //[cite: 10]
    gsap.to(el, {
      rotation: (ex > 0 ? 1 : -1) * gsap.utils.random(10, 24),
      duration: 4.8,
      ease: "sine.inOut",
      delay,
    }); //[cite: 10]
  }
}

function munculkanKontrol() {
  gsap.fromTo(
    "#navbar",
    { autoAlpha: 0, y: 28 },
    { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.25 },
  ); //[cite: 10]
  gsap.fromTo(
    "#vinyl-pos",
    { autoAlpha: 0, scale: 0.4, y: 24 },
    {
      autoAlpha: 1,
      scale: 1,
      y: 0,
      duration: 1.1,
      ease: "back.out(1.6)",
      delay: 0.5,
    },
  ); //[cite: 10]
}

function siapkanAwan(ov) {
  const awan = Array.from(ov.querySelectorAll(".awan")); //[cite: 10]
  const r = ov.getBoundingClientRect(); //[cite: 10]
  const ox = r.left + r.width / 2; //[cite: 10]
  const oy = r.top + r.height / 2; //[cite: 10]
  const arah = awan.map((el, i) => {
    const b = el.getBoundingClientRect();
    let dx = b.left + b.width / 2 - ox;
    let dy = b.top + b.height / 2 - oy;
    if (Math.hypot(dx, dy) < 30) dx = i % 2 ? 40 : -40;
    const len = Math.hypot(dx, dy) || 1;
    return { ux: dx / len, uy: dy / len };
  }); //[cite: 10]
  return { awan, arah, jarak: Math.max(r.width, r.height) * 0.95 }; //[cite: 10]
}

function bukaUndangan() {
  if (sedangMembuka) return; //[cite: 10]
  sedangMembuka = true; //[cite: 10]

  $("musik")
    .play()
    .catch(() => {}); //[cite: 10]

  const cover = $("main-home"); //[cite: 10]
  const konten = $("main-content"); //[cite: 10]
  const kertas = cover.querySelector(".anim-paper"); //[cite: 10]
  const mawar = Array.from(cover.querySelectorAll('[class*="anim-rose-"]')); //[cite: 10]
  const teks = cover.querySelector(".ink-blend"); //[cite: 10]
  const tombol = cover.querySelector(".btn-cover"); //[cite: 10]
  const ov = $("awan-intro"); //[cite: 10]
  const isi = $("pasangan-isi"); //[cite: 10]
  const langit = $("awan-langit"); //[cite: 10]

  const bukaLangsung = () => {
    cover.style.display = "none"; //[cite: 10]
    document.body.classList.remove("locked"); //[cite: 10]
    konten.classList.remove("opacity-0"); //[cite: 10]
    window.scrollTo(0, 0); //[cite: 10]
    hitungTumpukan(); //[cite: 10]
    aktifkanReveal(); //[cite: 10]
    mulaiSlideBerdua(); //[cite: 10]
    perbarui(); //[cite: 10]
    munculkanKontrol(); //[cite: 10]
  };
  if (reduceMotion) {
    bukaLangsung(); //[cite: 10]
    return; //[cite: 10]
  }

  const semua = [kertas, teks, tombol, ...mawar]; //[cite: 10]
  semua.forEach((el) => (el.style.animation = "none")); //[cite: 10]
  gsap.set(semua, { opacity: 1 }); //[cite: 10]
  cover.style.pointerEvents = "none"; //[cite: 10]

  const pk = kertas.getBoundingClientRect(); //[cite: 10]
  const px = pk.left + pk.width / 2; //[cite: 10]
  const py = pk.top + pk.height / 2; //[cite: 10]
  const arahMawar = mawar.map((el) => {
    const r = el.getBoundingClientRect();
    const dx = r.left + r.width / 2 - px;
    const dy = r.top + r.height / 2 - py;
    const len = Math.hypot(dx, dy) || 1;
    const jarak = 170 + Math.random() * 60;
    return { x: (dx / len) * jarak, y: (dy / len) * jarak };
  }); //[cite: 10]

  const tl = gsap.timeline(); //[cite: 10]
  tl.to(tombol, {
    opacity: 0,
    y: 10,
    scale: 0.92,
    duration: 0.35,
    ease: "power2.in",
  })
    .to(teks, { opacity: 0, y: -8, duration: 0.5, ease: "power1.in" }, "<0.05")
    .to(
      mawar,
      {
        x: (i) => arahMawar[i].x,
        y: (i) => arahMawar[i].y,
        rotation: () => gsap.utils.random(-70, 70),
        scale: 1.3,
        opacity: 0,
        duration: 1.3,
        ease: "power2.inOut",
        stagger: 0.05,
      },
      "<0.1",
    )
    .to(
      kertas,
      { y: -40, scale: 1.06, opacity: 0, duration: 0.9, ease: "power2.inOut" },
      "-=0.9",
    ); //[cite: 10]

  if (!ov || !isi) {
    tl.add(() => konten.classList.remove("opacity-0"), "-=0.5")
      .to(cover, { opacity: 0, duration: 0.7, ease: "power1.out" }, "<")
      .add(bukaLangsung); //[cite: 10]
    return; //[cite: 10]
  }

  const { awan, arah, jarak } = siapkanAwan(ov); //[cite: 10]
  gsap.set(awan, {
    x: (i) => arah[i].ux * jarak,
    y: (i) => arah[i].uy * jarak,
    opacity: 0,
    scale: 1.2,
  }); //[cite: 10]
  gsap.set(langit, { opacity: 0 }); //[cite: 10]

  tl.add(() => gsap.set(ov, { autoAlpha: 1 }), "-=0.7")
    .to(langit, { opacity: 1, duration: 1.1, ease: "power1.out" }, "<")
    .to(
      awan,
      {
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.4,
        ease: "power2.out",
        stagger: { each: 0.05, from: "random" },
      },
      "<",
    )
    .add(() => {
      cover.style.display = "none";
      konten.style.transition = "none";
      konten.classList.remove("opacity-0");
      window.scrollTo(0, 0);
      hitungTumpukan();
      perbarui();
      gsap.set(isi, {
        scale: ZOOM_AWAL,
        opacity: 0,
        filter: "blur(10px)",
        transformOrigin: "50% 50%",
      });
    }, "+=0.25")
    .addLabel("buka", "+=0.4")
    .to(
      awan,
      {
        x: (i) => arah[i].ux * jarak * 1.15,
        y: (i) => arah[i].uy * jarak * 1.15,
        scale: 1.6,
        duration: DURASI_BUKA,
        ease: "power2.in",
        stagger: { each: 0.04, from: "center" },
      },
      "buka",
    )
    .to(
      awan,
      {
        opacity: 0,
        duration: DURASI_BUKA - 0.4,
        ease: "power3.in",
        stagger: { each: 0.04, from: "center" },
      },
      "buka+=0.4",
    )
    .to(
      langit,
      { opacity: 0, duration: DURASI_BUKA * 0.65, ease: "power1.inOut" },
      "buka+=0.5",
    )
    .to(
      isi,
      {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: DURASI_BUKA + 0.2,
        ease: "power2.inOut",
      },
      "buka",
    )
    .add(() => {
      aktifkanReveal();
      mulaiSlideBerdua();
      perbarui();
    }, "buka+=1")
    .add(() => {
      ov.style.display = "none";
      konten.style.transition = "";
      gsap.set(isi, { clearProps: "transform,filter,opacity,transformOrigin" });
      document.body.classList.remove("locked");
      perbarui();
      munculkanKontrol();
      setTimeout(terbangkanBurung, 300);
    }); //[cite: 10]
}

// ==========================================
// 4. ANIMASI MUNCUL SAAT DI-SCROLL
// ==========================================
function aktifkanReveal() {
  const els = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-zoom, .reveal-arch, .line-grow, .tulis, .garis-tumbuh, .tracking-masuk, .mono-wrap",
  ); //[cite: 10]

  const peta = new Map(); //[cite: 10]
  els.forEach((el) => {
    const target = el.classList.contains("reveal-arch") ? el.parentElement : el;
    if (!peta.has(target)) peta.set(target, []);
    peta.get(target).push(el);
  }); //[cite: 10]

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        peta.get(e.target).forEach((el) => el.classList.add("is-visible"));
        io.unobserve(e.target);
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
  ); //[cite: 10]
  peta.forEach((_, target) => io.observe(target)); //[cite: 10]
}

// ==========================================
// 5. EFEK LEMBAR BERTUMPUK + NAVIGASI SECTION
// ==========================================
const mainContent = $("main-content"); //[cite: 10]
const daftarSection = Array.from(
  mainContent.querySelectorAll(":scope > section"),
); //[cite: 10]
const navLinks = Array.from(
  document.querySelectorAll("#navbar a[data-target]"),
); //[cite: 10]

const jurnal = document.querySelector(".jurnal"); //[cite: 10]
const sectionJurnal = $("journey"); //[cite: 10]
const daftarHati = jurnal
  ? Array.from(jurnal.querySelectorAll(".titik-hati"))
  : []; //[cite: 10]
let pusatHati = []; //[cite: 10]

function ukurJurnal() {
  if (!jurnal) return; //[cite: 10]
  const atas = jurnal.getBoundingClientRect().top; //[cite: 10]
  pusatHati = daftarHati.map((h) => {
    const r = h.getBoundingClientRect();
    return r.top + r.height / 2 - atas;
  }); //[cite: 10]
}

function perbaruiJurnal(vh) {
  if (!jurnal || !sectionJurnal) return; //[cite: 10]
  const r = jurnal.getBoundingClientRect(); //[cite: 10]
  let p = 1; //[cite: 10]
  if (!reduceMotion) {
    const sisa = sectionJurnal.getBoundingClientRect().bottom - r.bottom;
    const T = vh * 0.6;
    p = (T - r.top) / Math.max(1, T - vh + sisa + r.height);
    p = Math.min(1, Math.max(0, p));
  } //[cite: 10]
  jurnal.style.setProperty("--p", p.toFixed(4)); //[cite: 10]
  jurnal.classList.toggle("jalan", p > 0.005 && p < 0.995); //[cite: 10]
  const ujung = 8 + p * Math.max(0, r.height - 16); //[cite: 10]
  daftarHati.forEach((h, i) =>
    h.classList.toggle(
      "aktif",
      p >= 1 || ujung >= (pusatHati[i] ?? Infinity) - 2,
    ),
  ); //[cite: 10]
}

if (EFEK_TUMPUK) daftarSection.forEach((s) => s.classList.add("stack-sec")); //[cite: 10]

function hitungTumpukan() {
  if (!EFEK_TUMPUK) return; //[cite: 10]
  const vh = window.innerHeight; //[cite: 10]
  daftarSection.forEach((s) => {
    s.style.top = Math.min(0, vh - s.offsetHeight) + "px";
  }); //[cite: 10]
}

function topAlir(indeks) {
  let y = mainContent.getBoundingClientRect().top + window.scrollY; //[cite: 10]
  for (let i = 0; i < indeks; i++) y += daftarSection[i].offsetHeight; //[cite: 10]
  return y; //[cite: 10]
}

let terjadwal = false; //[cite: 10]
function perbarui() {
  terjadwal = false; //[cite: 10]
  const vh = window.innerHeight; //[cite: 10]
  perbaruiJurnal(vh); //[cite: 10]

  if (EFEK_TUMPUK) {
    for (let i = 0; i < daftarSection.length - 1; i++) {
      const a = daftarSection[i].getBoundingClientRect();
      const b = daftarSection[i + 1].getBoundingClientRect();
      const tumpang = a.bottom - b.top;
      const p = Math.min(
        1,
        Math.max(0, tumpang / Math.max(1, Math.min(a.height, vh))),
      );
      daftarSection[i].style.setProperty("--tutup", p.toFixed(3));
    }
  } //[cite: 10]

  document.querySelectorAll(".reveal-arch:not(.is-visible)").forEach((el) => {
    const r = (el.parentElement || el).getBoundingClientRect();
    if (r.top < vh * 0.92 && r.bottom > vh * 0.08)
      el.classList.add("is-visible");
  }); //[cite: 10]

  const garis = window.scrollY + vh * 0.5; //[cite: 10]
  let aktif = 0; //[cite: 10]
  for (let i = 0; i < daftarSection.length; i++) {
    if (topAlir(i) <= garis) aktif = i;
  } //[cite: 10]
  const idAktif = daftarSection[aktif].id; //[cite: 10]
  navLinks.forEach((a) =>
    a.classList.toggle("is-active", a.dataset.target === idAktif),
  ); //[cite: 10]
}
function jadwalkanPerbarui() {
  if (terjadwal) return; //[cite: 10]
  terjadwal = true; //[cite: 10]
  requestAnimationFrame(perbarui); //[cite: 10]
}

window.addEventListener("scroll", jadwalkanPerbarui, { passive: true }); //[cite: 10]
window.addEventListener("resize", () => {
  hitungTumpukan();
  ukurJurnal();
  jadwalkanPerbarui();
}); //[cite: 10]
window.addEventListener("load", () => {
  hitungTumpukan();
  ukurJurnal();
  perbarui();
}); //[cite: 10]
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    hitungTumpukan();
    ukurJurnal();
    perbarui();
  });
} //[cite: 10]

if ("ResizeObserver" in window) {
  const ro = new ResizeObserver(() => {
    hitungTumpukan();
    ukurJurnal();
    jadwalkanPerbarui();
  });
  daftarSection.forEach((s) => ro.observe(s));
  if (jurnal) ro.observe(jurnal);
} //[cite: 10]

navLinks.forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const indeks = daftarSection.findIndex((s) => s.id === a.dataset.target);
    if (indeks < 0) return;
    window.scrollTo({
      top: topAlir(indeks),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  });
}); //[cite: 10]

hitungTumpukan(); //[cite: 10]
ukurJurnal(); //[cite: 10]
perbarui(); //[cite: 10]

// ==========================================
// 6. KONTROL MUSIK
// ==========================================
const musik = $("musik"); //[cite: 10]
const vinylBtn = $("vinyl-btn"); //[cite: 10]
if (musik) musik.volume = VOLUME_LAGU; //[cite: 10]

function setUiMusik(sedangMain) {
  if (!vinylBtn) return;
  vinylBtn.classList.toggle("playing", sedangMain);
  vinylBtn.setAttribute("aria-pressed", String(sedangMain));
  vinylBtn.setAttribute(
    "aria-label",
    sedangMain ? "Jeda musik" : "Putar musik",
  );
} //[cite: 10]
if (musik) {
  musik.addEventListener("play", () => setUiMusik(true)); //[cite: 10]
  musik.addEventListener("pause", () => setUiMusik(false)); //[cite: 10]
}
if (vinylBtn) {
  vinylBtn.addEventListener("click", () => {
    if (musik.paused) musik.play().catch(() => {});
    else musik.pause();
  }); //[cite: 10]
}

let diputarSebelumDitinggal = false; //[cite: 10]
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    diputarSebelumDitinggal = musik && !musik.paused;
    if (musik) musik.pause();
  } else if (diputarSebelumDitinggal && musik) {
    musik.play().catch(() => {});
  }
}); //[cite: 10]

// ==========================================
// 7. GIFT & SALIN TEKS
// ==========================================
async function salinTeks(teks) {
  try {
    await navigator.clipboard.writeText(teks);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = teks;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {}
    ta.remove();
    return ok;
  }
} //[cite: 10]
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn-salin");
  if (!btn) return;
  const label = btn.querySelector(".btn-label");
  label.dataset.asli = label.dataset.asli || label.textContent;
  const ok = await salinTeks(btn.dataset.salin);
  label.textContent = ok ? "Tersalin" : "Gagal, salin manual";
  clearTimeout(btn._timer);
  btn._timer = setTimeout(() => (label.textContent = label.dataset.asli), 2000);
}); //[cite: 10]

// ==========================================
// HERO BERDUA SLIDESHOW
// ==========================================
let slideBerdua = { mulai: false, timer: null }; //[cite: 10]
function mulaiSlideBerdua() {
  const wadah = $("berdua-slides"); //[cite: 10]
  if (!wadah || slideBerdua.mulai) return; //[cite: 10]
  slideBerdua.mulai = true; //[cite: 10]
  const slide = Array.from(wadah.querySelectorAll(".slide-foto")); //[cite: 10]
  if (!slide.length) return; //[cite: 10]

  slide[0].classList.remove("is-aktif"); //[cite: 10]
  void slide[0].offsetWidth; //[cite: 10]
  slide[0].classList.add("is-aktif"); //[cite: 10]

  if (slide.length < 2 || reduceMotion) return; //[cite: 10]
  let i = 0; //[cite: 10]
  slideBerdua.timer = setInterval(() => {
    if (document.hidden || !wadah.classList.contains("is-run")) return;
    const lama = slide[i];
    i = (i + 1) % slide.length;
    const baru = slide[i];
    lama.classList.remove("is-aktif");
    lama.classList.add("is-keluar");
    baru.classList.remove("is-keluar");
    baru.classList.add("is-aktif");
    setTimeout(() => lama.classList.remove("is-keluar"), 1600);
  }, INTERVAL_SLIDE); //[cite: 10]
}

// ==========================================
// 8. GALLERY & LIGHTBOX
// ==========================================
const galWrap = document.querySelector(".gal-wrap"); //[cite: 10]

function siapkanGaleri() {
  if (!galWrap) return; //[cite: 10]
  const tracks = Array.from(galWrap.querySelectorAll(".gal-track")); //[cite: 10]
  tracks.forEach((track) => {
    if (track.dataset.siap) return;
    track.dataset.siap = "1";
    Array.from(track.children).forEach((el) => {
      const salinan = el.cloneNode(true);
      salinan.classList.add("gal-clone");
      salinan.setAttribute("aria-hidden", "true");
      salinan.tabIndex = -1;
      track.appendChild(salinan);
    });
  }); //[cite: 10]

  const hitungDurasi = () =>
    tracks.forEach((t) => {
      const tinggiSet = t.scrollHeight / 2;
      t.style.setProperty(
        "--durasi",
        Math.max(12, tinggiSet / KECEPATAN_GALERI).toFixed(1) + "s",
      );
    }); //[cite: 10]
  hitungDurasi(); //[cite: 10]
  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(hitungDurasi);
    tracks.forEach((t) => ro.observe(t));
  } //[cite: 10]
}

const lightbox = $("lightbox"); //[cite: 10]
const lightboxImg = $("lightbox-img"); //[cite: 10]
function tutupLightbox() {
  if (lightbox) lightbox.classList.remove("is-open");
  galWrap?.classList.remove("is-pause");
} //[cite: 10]

document.addEventListener("click", (e) => {
  const item = e.target.closest(".gal-item");
  if (!item) return;
  const img = item.querySelector("img");
  if (!img) return;
  if (lightboxImg) {
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
  }
  if (lightbox) lightbox.classList.add("is-open");
  galWrap?.classList.add("is-pause");
}); //[cite: 10]

if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target !== lightboxImg) tutupLightbox();
  }); //[cite: 10]
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") tutupLightbox();
}); //[cite: 10]

const ioJalan = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) =>
      e.target.classList.toggle("is-run", e.isIntersecting),
    ),
  { threshold: 0 },
); //[cite: 10]
document
  .querySelectorAll(".run-when-visible")
  .forEach((el) => ioJalan.observe(el)); //[cite: 10]

// ==========================================
// 9. BUKU TAMU + BALASAN
// ==========================================
let balasanAktif = true; //[cite: 10]
let ucapanIdAsli = new Map(); //[cite: 10]

function tglPendek(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d)
    ? ""
    : d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
} //[cite: 10]

function kartuUcapan(item, daftarBalasan) {
  const id = escapeHtml(String(item.id)); //[cite: 10]
  const balasHtml = daftarBalasan
    .map(
      (b) => `
        <div>
          <p class="font-quote text-base text-blush leading-tight">${escapeHtml(b.nama)}</p>
          <p class="text-ivory/65 leading-relaxed mt-0.5">${escapeHtml(b.isi)}</p>
        </div>`,
    )
    .join(""); //[cite: 10]

  const formBalas = balasanAktif
    ? `
      <button type="button" class="btn-balas mt-3" data-balas="${id}">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 14L4 9l5-5M4 9h10a6 6 0 016 6v3"/></svg>
        Balas
      </button>
      <form class="form-balas hidden mt-3 space-y-2" data-id="${id}">
        <textarea rows="2" maxlength="300" required class="field" placeholder="Tulis balasan..."></textarea>
        <div class="flex items-center gap-2">
          <button type="submit" class="btn-mini">Kirim</button>
          <button type="button" class="btn-mini btn-mini-ghost btn-batal-balas">Batal</button>
          <span class="status-balas text-[11px] ml-1" aria-live="polite"></span>
        </div>
      </form>`
    : ""; //[cite: 10]

  return `
    <div class="ucapan-card rounded-xl border border-blush/15 bg-white/[0.04] p-4 text-xs" data-id="${id}">
      <div class="flex justify-between items-baseline gap-3">
        <span class="font-quote text-lg text-ivory leading-tight">${escapeHtml(item.nama)}</span>
        <span class="shrink-0 text-[10px] text-blush/50">${escapeHtml(tglPendek(item.dibuat_pada))}</span>
      </div>
      <p class="text-ivory/70 leading-relaxed mt-1.5">${escapeHtml(item.ucapan)}</p>
      ${balasHtml ? `<div class="mt-3 ml-1 pl-3 border-l border-blush/25 space-y-3">${balasHtml}</div>` : ""}
      ${formBalas}
    </div>`; //[cite: 10]
}

async function muatUcapanRealtime(coupleId) {
  const wadah = $("daftar-ucapan"); //[cite: 10]
  if (!wadah) return;
  const posisi = wadah.scrollTop; //[cite: 10]

  const [resU, resB] = await Promise.all([
    _supabase
      .from("ucapan_tamu")
      .select("*")
      .eq("pasangan_id", coupleId)
      .order("dibuat_pada", { ascending: false }),
    _supabase
      .from("balasan_ucapan")
      .select("*")
      .eq("pasangan_id", coupleId)
      .order("dibuat_pada", { ascending: true }),
  ]); //[cite: 10]

  if (resU.error || !resU.data || resU.data.length === 0) {
    wadah.innerHTML =
      '<p class="text-xs text-blush/60 text-center italic">Belum ada ucapan.</p>'; //[cite: 10]
    return;
  }

  let balasan = []; //[cite: 10]
  if (resB.error) {
    balasanAktif = false; //[cite: 10]
  } else {
    balasanAktif = true; //[cite: 10]
    balasan = resB.data || []; //[cite: 10]
  }

  const petaBalasan = new Map(); //[cite: 10]
  balasan.forEach((b) => {
    const k = String(b.ucapan_id);
    if (!petaBalasan.has(k)) petaBalasan.set(k, []);
    petaBalasan.get(k).push(b);
  }); //[cite: 10]
  ucapanIdAsli = new Map(resU.data.map((u) => [String(u.id), u.id])); //[cite: 10]

  wadah.innerHTML = resU.data
    .map((u) => kartuUcapan(u, petaBalasan.get(String(u.id)) || []))
    .join(""); //[cite: 10]
  wadah.scrollTop = posisi; //[cite: 10]
}

const daftarUcapanEl = $("daftar-ucapan"); //[cite: 10]
if (daftarUcapanEl) {
  daftarUcapanEl.addEventListener("click", (e) => {
    const tombol = e.target.closest(".btn-balas");
    if (tombol) {
      const form = tombol.closest(".ucapan-card").querySelector(".form-balas");
      form.classList.toggle("hidden");
      if (!form.classList.contains("hidden"))
        form.querySelector("textarea").focus();
      return;
    }
    const batal = e.target.closest(".btn-batal-balas");
    if (batal) batal.closest(".form-balas").classList.add("hidden");
  }); //[cite: 10]

  daftarUcapanEl.addEventListener("submit", async (e) => {
    const form = e.target.closest(".form-balas");
    if (!form) return;
    e.preventDefault();

    const isiBalasan = form.querySelector("textarea").value.trim();
    const status = form.querySelector(".status-balas");
    if (!isiBalasan || !currentCoupleId) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    status.className = "status-balas text-[11px] ml-1 text-blush";
    status.textContent = "Mengirim...";

    const { error } = await _supabase.from("balasan_ucapan").insert([
      {
        ucapan_id: ucapanIdAsli.get(form.dataset.id),
        pasangan_id: currentCoupleId,
        nama: inputNamaEl.value,
        isi: isiBalasan,
      },
    ]); //[cite: 10]

    if (error) {
      status.className = "status-balas text-[11px] ml-1 text-rose-300";
      status.textContent = "Gagal: " + error.message;
      btn.disabled = false;
    } else {
      muatUcapanRealtime(currentCoupleId);
    }
  }); //[cite: 10]
}

// ==========================================
// 10. KIRIM RSVP & UCAPAN KE SUPABASE
// ==========================================
function tampilStatus(teks, galat) {
  const el = $("rsvp-status"); //[cite: 10]
  if (!el) return;
  el.textContent = teks; //[cite: 10]
  el.className =
    "text-center text-xs min-h-[1rem] " +
    (galat ? "text-rose-300" : "text-emerald-300"); //[cite: 10]
}

const rsvpFormEl = $("rsvp-form"); //[cite: 10]
if (rsvpFormEl) {
  rsvpFormEl.addEventListener("submit", async (e) => {
    e.preventDefault();

    const ucapan = $("input-ucapan").value.trim(); //[cite: 10]
    if (!currentCoupleId) {
      tampilStatus("Data belum termuat. Coba muat ulang halaman.", true); //[cite: 10]
      return;
    }
    if (!ucapan) {
      tampilStatus("Silakan tulis ucapan terlebih dahulu.", true); //[cite: 10]
      return;
    }

    const btn = $("submit-btn"); //[cite: 10]
    const labelAsli = btn.textContent; //[cite: 10]
    btn.textContent = "Mengirim..."; //[cite: 10]
    btn.disabled = true; //[cite: 10]

    const { error } = await _supabase.from("ucapan_tamu").insert([
      {
        pasangan_id: currentCoupleId,
        nama: inputNamaEl.value,
        kehadiran: $("input-kehadiran").value,
        ucapan,
      },
    ]); //[cite: 10]

    if (error) {
      tampilStatus("Gagal mengirim pesan: " + error.message, true); //[cite: 10]
    } else {
      tampilStatus("Terima kasih, ucapan Anda sudah terkirim.", false); //[cite: 10]
      $("input-ucapan").value = ""; //[cite: 10]
      muatUcapanRealtime(currentCoupleId); //[cite: 10]
    }

    btn.textContent = labelAsli; //[cite: 10]
    btn.disabled = false; //[cite: 10]
  });
}

// Jalankan Fungsi Utama
siapkanGaleri(); //[cite: 10]
loadWeddingData(); //[cite: 10]

document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("error", () => {
    console.warn(
      "Gambar gagal dimuat, cek nama/lokasi file:",
      img.getAttribute("src"),
    ); //[cite: 10]
  });
});
