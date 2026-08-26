const TEMA_KEY = 'holymind-tema';

function aplicarTema(tema) {
    document.documentElement.setAttribute('data-theme', tema);
    const btn = document.getElementById('btn-tema');
    if (btn) {
        const proximo = tema === 'dark' ? 'Tema claro' : 'Tema escuro';
        btn.setAttribute('title', proximo);
        btn.setAttribute('aria-label', proximo);
    }
}

function alternarTema() {
    const atual = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const novo = atual === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(TEMA_KEY, novo); } catch (e) {}
    aplicarTema(novo);
}

(function iniciarTema() {
    let salvo = null;
    try { salvo = localStorage.getItem(TEMA_KEY); } catch (e) {}
    aplicarTema(salvo === 'light' ? 'light' : 'dark');
})();

// Functions for Alerts Modal

function abrirAvisos() {
    document.getElementById('avisos-overlay').classList.add('aberto');
}

function fecharAvisos() {
    document.getElementById('avisos-overlay').classList.remove('aberto');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharAvisos();
});


// Input Helpers

const entradaEl = document.getElementById('entrada');
const contadorEl = document.getElementById('contador');

function atualizarContador() {
    contadorEl.textContent = `${entradaEl.value.length} caracteres`;
}

entradaEl.addEventListener('input', atualizarContador);
atualizarContador();

function limparEntrada() {
    entradaEl.value = '';
    atualizarContador();
    entradaEl.focus();
}

function usarSugestao(btn) {
    entradaEl.value = btn.textContent.trim();
    atualizarContador();
    entradaEl.focus();
}

// Response Panel

const cardResposta = document.getElementById('resposta-card');
const respostaEl = document.getElementById('resposta');
const carregandoEl = document.getElementById('carregando');
const modoAtivoEl = document.getElementById('modo-ativo');

function irParaResposta() {
    requestAnimationFrame(() => {
        const top = cardResposta.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: top < 0 ? 0 : top, behavior: 'smooth' });
    });
}

function destacarModo(nome) {
    document.querySelectorAll('.mode').forEach(b => {
        b.classList.toggle('ativo', b.dataset.modo === nome);
    });
}

function limparResposta() {
    respostaEl.textContent = '';
    modoAtivoEl.textContent = '';
    carregandoEl.hidden = true;
    cardResposta.hidden = true;
    destacarModo(null);
}

function copiarResposta() {
    const btn = document.getElementById('btn-copiar');
    const texto = respostaEl.innerText || respostaEl.textContent || '';
    if (navigator.clipboard) navigator.clipboard.writeText(texto);
    btn.textContent = 'Copiado';
    setTimeout(() => { btn.textContent = 'Copiar'; }, 1600);
}

// Codigo para interagir com a API e interface da IA

async function sendRequest(type) { // Function to request the AI's response, sending the user's input to the API
    const entrada = entradaEl.value.trim();
    const nomeModo = (document.querySelector(`.mode[onclick*="${type}"]`) || {}).dataset;

    cardResposta.hidden = false;
    cardResposta.classList.remove('glow');
    void cardResposta.offsetWidth; // restart the glow animation
    cardResposta.classList.add('glow');

    if (!entrada) {
        carregandoEl.hidden = true;
        modoAtivoEl.textContent = '';
        respostaEl.textContent = 'Digite uma pergunta primeiro.'; // Text for when the user doesn't type anything
        destacarModo(null);
        irParaResposta();
        return;
    }

    modoAtivoEl.textContent = nomeModo ? nomeModo.modo : '';
    destacarModo(nomeModo ? nomeModo.modo : null);
    respostaEl.textContent = '';
    carregandoEl.hidden = false; // Loading state
    irParaResposta();

    try {
        const resp = await fetch(`/${type}`, { // Sending the request
            method: "POST", // Request type
            headers: {"Content-Type": "application/json"}, // Request content type
            body: JSON.stringify({text: entrada}) // JSON body of the content to be received from the API
        });

        carregandoEl.hidden = true;

        if (resp.ok) { // If the API response is OK
            const data = await resp.json(); // Data will wait for JSON
            respostaEl.innerHTML = data.explanation; // The JSON will be displayed in HTML directly in the response div
        } else {
            const dataErro = await resp.json(); // If the response is outside the condition, the expected error will be displayed in the response div
            respostaEl.textContent = dataErro.detail
                ? `Erro: ${dataErro.detail}`
                : "Error fetching explanation.";
        }
    } catch (error) {
        carregandoEl.hidden = true;
        respostaEl.textContent = "Internet ta ruim ou o servidor caiu :("
    }
}



// Code to populate the selects for Bible books, chapters and verses




let versiculos = [];
let versiculosDoCapitulo = [];

fetch('/static/bibles/biblia.json') // Fetches the JSON file from the server
  .then(res => res.json()) // Converts the response to JSON
  .then(data => { // Stores the data in the global variable
    versiculos = data; // Array of verses
    popularLivros(); // Calls the function to populate the books in the select
  })
    .catch(err => console.error("Error in fetch:", err));

function preencherSelect(select, itens, placeholder) { // Fills a select with options and auto-selects the first item
  select.innerHTML = `<option value="" disabled>${placeholder}</option>`;
  itens.forEach(([valor, rotulo]) => { // For each item, creates an option in the select
    const opt = document.createElement('option');
    opt.value = valor;
    opt.textContent = rotulo;
    select.appendChild(opt);
  });
  select.value = itens.length ? itens[0][0] : ''; // Auto-selects the first option (or the placeholder if empty)
}

function popularLivros() { // Populates the books select
  const livroSelect = document.getElementById('livro-select'); // Gets the select from HTML

  // Generates unique list of books using book_id as value and book as label
  const livros = [...new Map(versiculos.map(v => [v.livro_id, v.livro])).entries()]; // Array of arrays [id, name]

  livroSelect.innerHTML = `<option value="" disabled selected>Selecione o Livro</option>`;
  livros.forEach(([id, nome]) => { // For each book, creates an option in the select
    const opt = document.createElement('option'); // Creates the option element
    opt.value = id;          // Use unique id for the value
    opt.textContent = nome;  // Show book name
    livroSelect.appendChild(opt); // Adds the option to the select
  });

  livroSelect.addEventListener('change', popularCapitulos); // When the book changes, cascades to chapters and verses
  document.getElementById('capitulo-select').addEventListener('change', popularVersiculos); // When the chapter changes, refills the verses
}

function popularCapitulos() { // Populates the chapters select of the selected book and selects the first one
  const livroId = document.getElementById('livro-select').value; // Gets the id of the selected book
  const capituloSelect = document.getElementById('capitulo-select'); // Gets the chapters select

  // Gets all chapters of this book
  const capitulos = [...new Set(
    versiculos.filter(v => v.livro_id === livroId).map(v => String(v.capitulo)) // Unique array of chapters
  )];

  preencherSelect(capituloSelect, capitulos.map(cap => [cap, cap]), 'Capítulo');
  popularVersiculos(); // Cascades so the first verse is already selected too (without searching)
}

function popularVersiculos() { // Populates the verses select of the selected chapter and selects the first one
  const livroId = document.getElementById('livro-select').value; // Gets the id of the selected book
  const cap = document.getElementById('capitulo-select').value; // Gets the selected chapter
  const versiculoSelect = document.getElementById('versiculo-select'); // Gets the verses select

  // Gets all verses of the chapter
  const vers = versiculos
    .filter(v => v.livro_id === livroId && String(v.capitulo) === String(cap)) // Filters by book and chapter
    .map(v => String(v.versiculo)); // Array of verses

  preencherSelect(versiculoSelect, vers.map(v => [v, v]), 'Versículo');
}

function buscarVersiculo() { // Searches for the selected verse and displays it in HTML
  const livroId = document.getElementById('livro-select').value;
  const cap = document.getElementById('capitulo-select').value;
  const vers = document.getElementById('versiculo-select').value;

  const resultado = versiculos.find(v => // Finds the exact verse
    v.livro_id === livroId && // Filters by book
    String(v.capitulo) === String(cap) && // Filters by chapter
    String(v.versiculo) === String(vers) // Filters by verse
  );

  document.getElementById('sem-resultado').hidden = true;
  document.getElementById('resultado').hidden = false;
  document.getElementById('referencia').textContent = `${resultado.livro} ${cap}:${vers}`; // Shows the reference
  document.getElementById('texto').textContent = resultado.texto || 'Não encontrado'; // Shows the verse text

  // Stores all verses of the chapter (for "show more")
  versiculosDoCapitulo = versiculos.filter(v =>
    v.livro_id === livroId && String(v.capitulo) === String(cap) // Filters by book and chapter
  );

  document.getElementById('mais-btn').hidden = false; // Shows the "show more" button
  document.getElementById('mais-versiculos').innerHTML = ''; // Clears the more verses area
}

function mostrarMais() { // Shows more verses starting from the selected one
  const versSelecionado = document.getElementById('versiculo-select').value;
  const container = document.getElementById('mais-versiculos');
  container.innerHTML = '';

  let iniciou = false; // Flag to start displaying verses
  versiculosDoCapitulo.forEach(v => { // Iterates through the verses of the chapter
    if (String(v.versiculo) === String(versSelecionado)) iniciou = true; // Starts showing from the selected verse
    if (iniciou) { // If already started, shows the verse
      const p = document.createElement('p');
      p.textContent = `${v.capitulo}:${v.versiculo} — ${v.texto}`; // Formats the text
      container.appendChild(p); // Adds to the container
    }
  });

  container.scrollIntoView({ // Scrolls the page to the displayed verses
    behavior: "smooth", // Smooth animation
    block: "start" // Aligns to the top
  });
}

