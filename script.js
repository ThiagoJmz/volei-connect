let usuario = JSON.parse(localStorage.getItem("usuario")) || null;
let equipes = JSON.parse(localStorage.getItem("equipes")) || [];

const jogadores = [
  {
    nome:"Carlos",
    posicao:"Bloqueador",
    idade:33,
    imagem:"https://stardewvalleywiki.com/mediawiki/images/4/47/Alex_Happy.png",
    cidade:"Maringá",
    time:"Goretti",
    altura:"1.90m"
  },
  {
    nome:"Hadassa",
    posicao:"Trocadora de marcha proficional",
    idade:28,
    imagem:"https://stardewvalleywiki.com/mediawiki/images/8/88/Abigail.png",
    cidade:"Maringá",
    time:"Goretti",
    altura:"1.52m"
  },
  {
    nome:"Thiago",
    posicao:"Defensor",
    idade:26,
    imagem:"https://stardewvalleywiki.com/mediawiki/images/4/4f/Sebastian_Winter_01.png",
    cidade:"Maringá",
    time:"Goretti",
    altura:"1.77m"
  },
  {
    nome:"Gustavo",
    posicao:"Defensor",
    idade:30,
    imagem:"https://stardewvalleywiki.com/mediawiki/images/f/f2/Shane_Beach_Pleased.png",
    cidade:"Maringá",
    time:"Goretti",
    altura:"1.83m"
  },
  {
    nome:"Alice",
    posicao:"Pivô",
    idade:27,
    imagem:"https://stardewvalleywiki.com/mediawiki/images/1/1b/Robin.png",
    cidade:"Maringá",
    time:"Goretti",
    altura:"1.73m"
  }
];

function mostrarTela(id) {
  document.querySelectorAll(".tela").forEach(t => {
    t.classList.remove("ativa");
    t.style.display = "none";
  });

  const tela = document.getElementById(id);
  tela.style.display = "block";

  setTimeout(() => {
    tela.classList.add("ativa");
  }, 50);
}

function renderJogadores() {
  const div = document.getElementById("telaJogadores");

  let html = `
    <div class="topo">Jogadores em destaque</div>
    <div class="painel">
      <div class="lista">
  `;

  jogadores.forEach(j => {
    html += `
      <div class="card" onclick='abrirPerfil(${JSON.stringify(j)})'>
        <img src="${j.imagem}">
        <div>
          <div class="nome">${j.nome}</div>
          <div class="posicao">${j.posicao}</div>
          <div class="posicao">Idade: ${j.idade}</div>
          <div class="posicao">${j.cidade}</div>
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  div.innerHTML = html;
}

function abrirPerfil(j) {
  const div = document.getElementById("telaPerfil");

  div.innerHTML = `
    <div class="topo">Perfil</div>

    <div class="painel center">
      <img src="${j.imagem}" width="120" style="border-radius:50%;">
      <h2>${j.nome}</h2>

      <p>${j.posicao}</p>
      <p>Idade: ${j.idade}</p>
      <p>Time: ${j.time}</p>
      <p>Cidade: ${j.cidade}</p>
      <p>Altura: ${j.altura}</p>

      <button onclick="mostrarTela('telaJogadores')">Voltar</button>
    </div>
  `;

  mostrarTela("telaPerfil");
}

function renderCadastro() {
  const div = document.getElementById("telaCadastro");

  div.innerHTML = `
    <div class="topo">Cadastro</div>

    <div class="painel center">

      <input id="nome" placeholder="Nome"><br><br>
      <input id="cidade" placeholder="Cidade"><br><br>
      <input id="altura" placeholder=" Sua altura (ex: 1.70m)"><br><br>
      <input id="id" placeholder="Posição"><br><br>

      <label class="upload">
        <input id="foto" type="file" accept="image/*">
        <div class="upload-box">
          <img src="camera.png">
          <span>Adicionar foto</span>
        </div>
      </label>

      <button onclick="cadastrar()">Salvar</button>

    </div>
  `;
}

function cadastrar() {
  const file = document.getElementById("foto").files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      salvarUsuario(e.target.result);
    };
    reader.readAsDataURL(file);
  } else {
    salvarUsuario(null);
  }
}

function salvarUsuario(fotoBase64) {
  usuario = {
    nome: document.getElementById("nome").value,
    cidade: document.getElementById("cidade").value,
    altura: document.getElementById("altura").value,
    id: document.getElementById("id").value,
    foto: fotoBase64
  };

  localStorage.setItem("usuario", JSON.stringify(usuario));

  renderApp();
  mostrarTela("telaApp");
}

function criarEquipe() {
  if (!usuario) return alert("Faça cadastro primeiro!");

  const nome = prompt("Nome da equipe:");
  if (!nome) return;

  const novaEquipe = {
    nome: nome,
    lider: usuario.nome,
    membros: [usuario.nome]
  };

  equipes.push(novaEquipe);
  salvarEquipes();
  renderApp();
}

function entrarEquipe(index) {
  if (!usuario) return alert("Faça cadastro primeiro!");

  const equipe = equipes[index];

  if (!equipe.membros.includes(usuario.nome)) {
    equipe.membros.push(usuario.nome);
    salvarEquipes();
    renderApp();
  }
}

function salvarEquipes() {
  localStorage.setItem("equipes", JSON.stringify(equipes));
}

function renderApp() {
  const div = document.getElementById("telaApp");

  let html = `
    <div class="topo">Perfil</div>

    <div class="painel center">
      ${usuario?.foto ? `<img src="${usuario.foto}" width="100" style="border-radius:50%;">` : ""}

      <h2>${usuario?.nome || "Visitante"}</h2>
      <p>${usuario?.cidade || ""}</p>
      <p>Altura: ${usuario?.altura || ""}</p>
      <p>ID: ${usuario?.id || ""}</p>
    </div>

    <button onclick="criarEquipe()">Criar equipe</button>
  `;

  equipes.forEach((e, i) => {
    html += `
      <div class="card">
        <div>
          <div class="nome">${e.nome}</div>
          <div class="posicao">Líder: ${e.lider}</div>
          <div class="posicao">Membros: ${e.membros.join(", ")}</div>
          <button onclick="entrarEquipe(${i})">Entrar</button>
        </div>
      </div>
    `;
  });

  div.innerHTML = html;
}

renderJogadores();
renderCadastro();

if (usuario) {
  renderApp();
  mostrarTela("telaApp");
} else {
  mostrarTela("telaJogadores");
}