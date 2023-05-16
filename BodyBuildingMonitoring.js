
let dane = [];
function przeladujStrone() {
  location.reload();
}

function dodajDane() {
  const data = document.getElementById("data").value;
  const masa = document.getElementById("masa").value;
  const tluszcz = document.getElementById("tluszcz").value;
  const masaMiesni = document.getElementById("masa-miesni").value;
  const tbw = document.getElementById("tbw").value;
  const bmi = document.getElementById("bmi").value;

  const noweDane = {
    data,
    masa,
    tluszcz,
    masaMiesni,
    tbw,
    bmi,
  };

  dane.push(noweDane);

  localStorage.setItem("dane", JSON.stringify(dane));

  aktualizujTabele();
}

function aktualizujTabele() {
  const tabela = document.getElementById("tabela");
  const cialoTabeli = tabela.getElementsByTagName("tbody")[0];

  cialoTabeli.innerHTML = "";

  for (let i = 0; i < dane.length; i++) {
    const wiersz = cialoTabeli.insertRow();

    const komorkaData = wiersz.insertCell();
    komorkaData.textContent = dane[i].data;

    const komorkaMasa = wiersz.insertCell();
    komorkaMasa.textContent = dane[i].masa;

    const komorkaTluszcz = wiersz.insertCell();
    komorkaTluszcz.textContent = dane[i].tluszcz;

    const komorkaMasaMiesni = wiersz.insertCell();
    komorkaMasaMiesni.textContent = dane[i].masaMiesni;
    const komorkaTBW = wiersz.insertCell();
    komorkaTBW.textContent = dane[i].tbw;

    const komorkaBMI = wiersz.insertCell();
    komorkaBMI.textContent = dane[i].bmi;
  }
}

function generujTabele() {
  let csvContent = "data,masa,tluszcz,masaMiesni,tbw,bmi\n";
  dane.forEach(function (row) {
    csvContent +=
      row.data +
      "," +
      row.masa +
      "," +
      row.tluszcz +
      "," +
      row.masaMiesni +
      "," +
      row.tbw +
      "," +
      row.bmi +
      "\n";
  });

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "dane.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function resetujDane() {
  dane = [];
  localStorage.removeItem("dane");
  aktualizujTabele();
}

function generujWykresLiniowy(kategoria) {
  const etykiety = dane.map((item) => item.data);
  let dataset = [];

  if (kategoria === "masa") {
    dataset = dane.map((item) => item.masa);
  } else if (kategoria === "tluszcz") {
    dataset = dane.map((item) => item.tluszcz);
  } else if (kategoria === "masaMiesni") {
    dataset = dane.map((item) => item.masaMiesni);
  } else if (kategoria === "tbw") {
    dataset = dane.map((item) => item.tbw);
  } else if (kategoria === "bmi") {
    dataset = dane.map((item) => item.bmi);
  }

  const ctx = document.getElementById("wykres").getContext("2d");

    
  new Chart(ctx, {
    type: "line",
    data: {
      labels: etykiety,
      datasets: [
        {
          label: kategoria.charAt(0).toUpperCase() + kategoria.slice(1),
          data: dataset,
          borderColor: "blue",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "Data",
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: kategoria.charAt(0).toUpperCase() + kategoria.slice(1),
          },
        },
      },
    },
  });
}

const przyciskDodaj = document.getElementById("przycisk-dodaj");
przyciskDodaj.addEventListener("click", dodajDane);

const przyciskGeneruj = document.getElementById("generuj-tabele");
przyciskGeneruj.addEventListener("click", generujTabele);

const przyciskResetuj = document.getElementById("resetuj-dane");
przyciskResetuj.addEventListener("click", resetujDane);

const selectKategoria = document.getElementById("kategoria");
selectKategoria.addEventListener("change", function () {
  const wybranaKategoria = selectKategoria.value;
  generujWykresLiniowy(wybranaKategoria);
});

const storedData = localStorage.getItem("dane");
if (storedData) {
  dane = JSON.parse(storedData);
  aktualizujTabele();
  generujWykresLiniowy("masa");
}
