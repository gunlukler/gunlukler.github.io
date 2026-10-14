(function () {
  "use strict";

  var AYLAR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz",
    "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  var GUNLER = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  var GUN_KISA = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
  var GUN_MS = 864e5;

  // ---------- tarih yardımcıları ----------
  function tarihOku(s) {
    var p = s.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function iki(n) { return (n < 10 ? "0" : "") + n; }
  function anahtar(d) { return d.getFullYear() + "-" + iki(d.getMonth() + 1) + "-" + iki(d.getDate()); }
  function gunEkle(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function haftaBasi(d) { return gunEkle(d, -((d.getDay() + 6) % 7)); } // Pazartesi
  function isoHafta(d) {
    var x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    x.setDate(x.getDate() + 3 - ((x.getDay() + 6) % 7)); // o haftanın Perşembesi
    var ocak4 = new Date(x.getFullYear(), 0, 4);
    return 1 + Math.round(((x - ocak4) / GUN_MS - 3 + ((ocak4.getDay() + 6) % 7)) / 7);
  }
  function uzunTarih(d) { return d.getDate() + " " + AYLAR[d.getMonth()] + " " + d.getFullYear(); }

  // ---------- gruplama ----------
  var GORUNUMLER = {
    gun: {
      anahtar: function (d) { return anahtar(d); },
      etiket: function (d) { return uzunTarih(d) + ", " + GUNLER[d.getDay()]; }
    },
    hafta: {
      anahtar: function (d) { return anahtar(haftaBasi(d)); },
      etiket: function (d) {
        var b = haftaBasi(d), s = gunEkle(b, 6);
        var bas = b.getDate() + (b.getMonth() !== s.getMonth() ? " " + AYLAR[b.getMonth()] : "") +
          (b.getFullYear() !== s.getFullYear() ? " " + b.getFullYear() : "");
        return isoHafta(d) + ". hafta · " + bas + " – " + uzunTarih(s);
      }
    },
    ay: {
      anahtar: function (d) { return d.getFullYear() + "-" + iki(d.getMonth() + 1); },
      etiket: function (d) { return AYLAR[d.getMonth()] + " " + d.getFullYear(); }
    }
  };

  function grupla(yazilar, gorunum) {
    var g = GORUNUMLER[gorunum], gruplar = [], son = null;
    yazilar.forEach(function (y) {
      var k = g.anahtar(y.d);
      if (!son || son.k !== k) { son = { k: k, etiket: g.etiket(y.d), yazilar: [] }; gruplar.push(son); }
      son.yazilar.push(y);
    });
    return gruplar;
  }

  // ---------- istatistik ----------
  function seriler(gunSet, bugun) {
    var gunler = Object.keys(gunSet).sort(), enUzun = 0, sayac = 0, onceki = null;
    gunler.forEach(function (k) {
      var d = tarihOku(k);
      sayac = onceki && Math.round((d - onceki) / GUN_MS) === 1 ? sayac + 1 : 1;
      if (sayac > enUzun) enUzun = sayac;
      onceki = d;
    });
    var simdiki = 0, d = gunSet[anahtar(bugun)] ? bugun : gunEkle(bugun, -1);
    while (gunSet[anahtar(d)]) { simdiki++; d = gunEkle(d, -1); }
    return { simdiki: simdiki, enUzun: enUzun };
  }

  // ---------- DOM ----------
  function el(etiket, sinif, metin) {
    var e = document.createElement(etiket);
    if (sinif) e.className = sinif;
    if (metin != null) e.textContent = metin;
    return e;
  }

  function kart(y) {
    var li = el("li", "kart");
    var a = el("a");
    a.href = y.url;
    var tarih = el("div", "kart-tarih");
    tarih.appendChild(el("span", "kart-gun", String(y.d.getDate())));
    tarih.appendChild(el("span", "kart-gunad", GUN_KISA[y.d.getDay()]));
    var govde = el("div", "kart-govde");
    var h = el("h3", null, y.baslik);
    if (y.ruh) h.insertBefore(el("span", "ruh", y.ruh + " "), h.firstChild);
    govde.appendChild(h);
    if (y.ozet) govde.appendChild(el("p", null, y.ozet));
    a.appendChild(tarih);
    a.appendChild(govde);
    li.appendChild(a);
    return li;
  }

  function listeyiCiz(kap, yazilar, gorunum, aranan) {
    kap.textContent = "";
    kap.setAttribute("data-gorunum", gorunum);
    if (!yazilar.length) {
      kap.appendChild(el("p", "bos", aranan ? "“" + aranan + "” için bir şey bulunamadı." : "Henüz hiçbir şey yazılmadı."));
      return;
    }
    grupla(yazilar, gorunum).forEach(function (g) {
      var bolum = el("section", "grup");
      var h = el("h2", "grup-baslik", g.etiket);
      if (gorunum !== "gun") h.appendChild(el("span", "grup-sayi", g.yazilar.length + " yazı"));
      bolum.appendChild(h);
      var ol = el("ol", "kartlar");
      g.yazilar.forEach(function (y) { ol.appendChild(kart(y)); });
      bolum.appendChild(ol);
      kap.appendChild(bolum);
    });
  }

  function istatistikCiz(kap, yazilar, gunSet, bugun) {
    var s = seriler(gunSet, bugun);
    var kelime = yazilar.reduce(function (t, y) { return t + (y.kelime || 0); }, 0);
    [
      [yazilar.length, "yazı"],
      [Object.keys(gunSet).length, "gün"],
      [kelime.toLocaleString("tr-TR"), "kelime"],
      [s.simdiki, "günlük seri"],
      [s.enUzun, "en uzun seri"]
    ].forEach(function (x) {
      var d = el("div");
      d.appendChild(el("dt", null, x[1]));
      d.appendChild(el("dd", null, String(x[0])));
      kap.appendChild(d);
    });
    kap.hidden = false;
  }

  function haritaCiz(kap, gunSet, bugun) {
    var bas = haftaBasi(gunEkle(bugun, -52 * 7));
    for (var d = bas; d <= bugun; d = gunEkle(d, 1)) {
      var k = anahtar(d), gun = gunSet[k], h;
      if (gun) {
        h = el("a", "hucre");
        h.href = gun.ilk.url;
        var kelime = gun.kelime;
        h.setAttribute("data-seviye", kelime > 600 ? 3 : kelime > 200 ? 2 : 1);
        h.title = uzunTarih(d) + " · " + gun.sayi + " yazı · " + kelime + " kelime";
      } else {
        h = el("span", "hucre");
        h.title = uzunTarih(d);
      }
      kap.appendChild(h);
    }
    kap.parentNode.hidden = false;
    kap.scrollLeft = kap.scrollWidth;
  }

  // ---------- başlat ----------
  var liste = document.getElementById("liste");
  if (!liste) return;

  fetch(liste.getAttribute("data-veri"))
    .then(function (r) { return r.json(); })
    .then(function (veri) {
      var bugun = new Date(); bugun = new Date(bugun.getFullYear(), bugun.getMonth(), bugun.getDate());
      var yazilar = veri.map(function (y) {
        y.d = tarihOku(y.tarih);
        y.aranacak = (y.baslik + " " + (y.metin || "")).toLocaleLowerCase("tr-TR");
        return y;
      }).sort(function (a, b) { return b.d - a.d; });

      var gunSet = {};
      yazilar.forEach(function (y) {
        var g = gunSet[y.tarih] || (gunSet[y.tarih] = { sayi: 0, kelime: 0, ilk: y });
        g.sayi++; g.kelime += y.kelime || 0;
      });

      if (yazilar.length) {
        istatistikCiz(document.getElementById("istatistik"), yazilar, gunSet, bugun);
        haritaCiz(document.getElementById("harita"), gunSet, bugun);
      }

      var arac = document.getElementById("arac");
      var ara = document.getElementById("ara");
      var sekmeler = arac.querySelectorAll("[data-gorunum]");
      var gorunum = GORUNUMLER[location.hash.slice(1)] ? location.hash.slice(1) : "gun";

      function guncelle() {
        var q = ara.value.trim().toLocaleLowerCase("tr-TR");
        var suzulmus = q ? yazilar.filter(function (y) { return y.aranacak.indexOf(q) !== -1; }) : yazilar;
        Array.prototype.forEach.call(sekmeler, function (s) {
          s.setAttribute("aria-selected", String(s.getAttribute("data-gorunum") === gorunum));
        });
        listeyiCiz(liste, suzulmus, gorunum, ara.value.trim());
      }

      Array.prototype.forEach.call(sekmeler, function (s) {
        s.addEventListener("click", function () {
          gorunum = s.getAttribute("data-gorunum");
          history.replaceState(null, "", "#" + gorunum);
          guncelle();
        });
      });
      ara.addEventListener("input", guncelle);
      document.getElementById("rastgele").addEventListener("click", function () {
        if (yazilar.length) location.href = yazilar[Math.floor(Math.random() * yazilar.length)].url;
      });

      arac.hidden = false;
      guncelle();
    })
    .catch(function () { /* veri yüklenemezse sunucunun çizdiği basit liste kalır */ });
})();
