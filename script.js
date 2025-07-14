document.addEventListener("DOMContentLoaded", () => {
  const inputValor = document.getElementById("valor");
  const selectMoeda = document.getElementById("moeda");
  const botaoConverter = document.getElementById("converter");
  const resultado = document.getElementById("resultado");
  const listaHistorico = document.getElementById("listaHistorico");
  const botaoExportar = document.getElementById("exportar");
  const historico = [];


  botaoConverter.addEventListener("click", () => {
    const valorEmReais = parseFloat(inputValor.value);
    const moedaDestino = selectMoeda.value;

    if (isNaN(valorEmReais) || valorEmReais <= 0) {
      resultado.textContent = "Digite um valor válido em reais.";
      return;
    }

    const url = `https://api.frankfurter.app/latest?amount=${valorEmReais}&from=BRL&to=${moedaDestino}`;

    fetch(url)
      .then(res => res.json())
      .then(dados => {
        const convertido = dados.rates[moedaDestino];
        // Atualiza histórico
        const registro = `R$ ${valorEmReais.toFixed(2)} = ${moedaDestino} ${convertido.toFixed(2)}`;
        historico.unshift(registro); // adiciona no começo
        if (historico.length > 5) historico.pop(); // mantém só 5 itens

        // Renderiza histórico na tela com bandeiras
        listaHistorico.innerHTML = historico
          .map(item => {
            const parts = item.split(" ");
            const moeda = parts[4]; // pega o código da moeda
     
            return `<li>${item}</li>`;
          })
          .join("");
      })
      .catch(() => {
        resultado.textContent = "Erro ao buscar a taxa de câmbio.";
      });
  });

  botaoExportar.addEventListener("click", () => {
    if (historico.length === 0) {
      alert("Nenhuma conversão para exportar.");
      return;
    }

    const texto = historico.join("\n");
    const blob = new Blob([texto], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "historico_conversoes.txt";
    a.click();
    URL.revokeObjectURL(url);
  });
});