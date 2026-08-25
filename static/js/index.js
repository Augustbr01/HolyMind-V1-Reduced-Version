

// Functions for Alerts Modal

function abrirAvisos() {
    const overlay = document.getElementById('avisos-overlay');
    overlay.classList.remove('fade-out');
    overlay.classList.add('fade-in');
}

function fecharAvisos() {
    const overlay = document.getElementById('avisos-overlay');
    overlay.classList.remove('fade-in');
    overlay.classList.add('fade-out');
    setTimeout(() => {
        overlay.classList.remove('fade-out');
    }, 300);
}


// Code to interact with the API and display the AI's response on screen


async function sendRequest(type) { // Function to request the AI's response, sending the user's input to the API
    const entrada = document.getElementById('entrada').value.trim();
    const respostaIA = document.getElementById('resposta');

    if (!entrada) {
        respostaIA.innerText = "DIGITE ALGO PRIMEIRO"; // Text for when the user doesn't type anything
        return;
    }

    respostaIA.innerText = "Carregando ..."; // Loading text

    try {
        const resp = await fetch(`/${type}`, { // Sending the request
            method: "POST", // Request type
            headers: {"Content-Type": "application/json"}, // Request content type
            body: JSON.stringify({text: entrada}) // JSON body of the content to be received from the API
        });

        if (resp.ok) { // If the API response is OK
            const data = await resp.json(); // Data will wait for JSON
            respostaIA.innerHTML = data.explanation; // The JSON will be displayed in HTML directly in the response div
        } else {
            const dataErro = await resp.json(); // If the response is outside the condition, the expected error will be displayed in the response div
            respostaIA.innerText = dataErro.detail
                ? `Erro: ${dataErro.detail}`
                : "Error fetching explanation.";
        }
    } catch (error) {
        respostaIA.innerText = "Internet ta ruim ou o servidor caiu :("
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

  livroSelect.addEventListener('change', () => { // When the book changes
    const livroId = livroSelect.value; // Gets the id of the selected book
    const capituloSelect = document.getElementById('capitulo-select'); // Gets the chapters select

    // Gets all chapters of this book
    const capitulos = [...new Set(
      versiculos.filter(v => v.livro_id === livroId).map(v => String(v.capitulo)) // Unique array of chapters
    )];

    capituloSelect.innerHTML = `<option value="" disabled selected>Capítulo</option>`;
    capitulos.forEach(cap => { // For each chapter, creates an option in the select
      const opt = document.createElement('option'); // Creates the option element
      opt.value = cap;
      opt.textContent = cap;
      capituloSelect.appendChild(opt);
    });

    capituloSelect.onchange = () => { // When the chapter changes
      const cap = capituloSelect.value; // Gets the selected chapter
      const versiculoSelect = document.getElementById('versiculo-select'); // Gets the verses select

      // Gets all verses of the chapter
      const vers = versiculos
        .filter(v => v.livro_id === livroId && String(v.capitulo) === String(cap)) // Filters by book and chapter
        .map(v => String(v.versiculo)); // Array of verses

      versiculoSelect.innerHTML = `<option value="" disabled selected>Versículo</option>`;
      vers.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v;
        opt.textContent = v;
        versiculoSelect.appendChild(opt);
      });
    };
  });
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

  document.getElementById('referencia').textContent = `${resultado.livro} ${cap}:${vers}`; // Shows the reference
  document.getElementById('texto').textContent = resultado?.texto || 'Não encontrado'; // Shows the verse text

  // Stores all verses of the chapter (for "show more")
  versiculosDoCapitulo = versiculos.filter(v =>
    v.livro_id === livroId && String(v.capitulo) === String(cap) // Filters by book and chapter
  );

  document.getElementById('mais-btn').style.display = 'inline-block'; // Shows the "show more" button
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

