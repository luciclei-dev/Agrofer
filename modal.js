// --- CONFIG ---
const AUTO_OPEN_ON_ADD = false; // true = abre o modal automaticamente ao adicionar; false = não abre

// --- Carrega carrinho do localStorage ---
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

/*
  MODO DE ARMAZENAMENTO:
  - Comportamento padrão (agrupa por id): mantém uma única entrada por produto e incrementa quantidade.
  - Se preferir criar uma linha separada a cada clique (mesmo produto aparece várias vezes),
    use ADD_AS_SEPARATE_ENTRIES = true.
*/
const ADD_AS_SEPARATE_ENTRIES = true; // mudar para true se quiser cada clique como linha nova

// Salva no storage
function salvarCarrinho() {
  if (carrinho.length === 0) {
    localStorage.removeItem("carrinho"); // 🧹 limpa o armazenamento
    console.log("Carrinho vazio — removido do localStorage");
  } else {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    console.log("Carrinho atualizado:", carrinho);
  }
}

// Delegação de clique para botões "adicionar-carrinho"
document.addEventListener("click", function (e) {
  const target = e.target;

  // botão adicionar
  if (target.classList && target.classList.contains("adicionar-carrinho")) {
    const id = target.dataset.produtoId;
    const nome = target.dataset.nome;
    const preco = parseFloat(target.dataset.preco) || 0;

    if (ADD_AS_SEPARATE_ENTRIES) {
      // cria entrada única por clique (gera id único para instância)
      const instanceId = `${id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      carrinho.push({ id: instanceId, produtoIdOriginal: id, nome, preco, quantidade: 1 });
    } else {
      // agrupa por id (comportamento original)
      const itemExistente = carrinho.find((it) => it.id == id);
      if (itemExistente) {
        itemExistente.quantidade += 1;
      } else {
        carrinho.push({ id, nome, preco, quantidade: 1 });
      }
    }

    salvarCarrinho();
    atualizarCarrinho();

    if (AUTO_OPEN_ON_ADD) mostrarCarrinho();
  }

  // Delegação para botões "Excluir" dentro da lista do carrinho
  // (usa atributo data-id para identificar item no carrinho)
  if (target.classList && target.classList.contains("excluir-item")) {
    const idParaExcluir = target.dataset.id;
    carrinho = carrinho.filter((it) => it.id != idParaExcluir);
    salvarCarrinho();
    atualizarCarrinho();
  }
});

// Mostrar modal do carrinho (apenas quando chamado)
function mostrarCarrinho() {
  atualizarCarrinho();
  const modalElement = document.getElementById("carrinhoModal");
  if (!modalElement) return;
  const carrinhoModal = new bootstrap.Modal(modalElement);
  carrinhoModal.show();
}

// Atualiza o HTML do carrinho (lista, total e badge)
function atualizarCarrinho() {
  const lista = document.getElementById("lista-carrinho");
  const totalEl = document.getElementById("total-carrinho");
  const contador = document.getElementById("contador-carrinho");

  if (!lista || !totalEl || !contador) return;

  lista.innerHTML = "";
  let total = 0;
  let totalItens = 0;

  carrinho.forEach((item) => {
    const subtotal = item.preco * (item.quantidade || 1);
    total += subtotal;
    totalItens += item.quantidade || 1;

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <div>
        <div><strong>${item.nome}</strong></div>
        <small>R$ ${item.preco.toFixed(2)} ${item.quantidade > 1 ? `× ${item.quantidade}` : ""}</small>
      </div>
      <div class="text-end">
        <div><strong>R$ ${subtotal.toFixed(2)}</strong></div>
        <button type="button" class="btn btn-sm btn-outline-danger mt-2 excluir-item" data-id="${item.id}">Excluir</button>
      </div>
    `;
    lista.appendChild(li);
  });

  // Atualiza total e contador
  totalEl.textContent = `R$ ${total.toFixed(2)}`;
  contador.textContent = totalItens;
  contador.style.display = totalItens > 0 ? "inline-block" : "none";

  // --- NOVO: limpa o localStorage se o carrinho estiver vazio ---
  if (carrinho.length === 0) {
    localStorage.removeItem("carrinho");
    totalEl.textContent = "R$ 0,00";
  } else {
    salvarCarrinho();
  }
}


// Inicializa a interface quando DOM carregado
document.addEventListener("DOMContentLoaded", () => {
  atualizarCarrinho();

  // adiciona listener no botão finalizar só após DOM estar pronto
  const finalizarBtn = document.querySelector("#carrinhoModal .btn-primary");
  if (finalizarBtn) {
    finalizarBtn.addEventListener("click", () => {
      const usuarioLogado = localStorage.getItem("usuarioLogado");
      if (usuarioLogado) {
        window.location.href = "pagamentos.html";
      } else {
        window.location.href = "login.html";
      }
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  atualizarCarrinho();

  // Botão "Finalizar Compra"
  const finalizarBtn = document.querySelector("#carrinhoModal .btn-primary");
  if (finalizarBtn) {
    finalizarBtn.addEventListener("click", () => {
      const usuarioLogado = localStorage.getItem("usuarioLogado");
      window.location.href = usuarioLogado ? "pagamentos.html" : "login.html";
    });
  }

  // 🧹 Botão "Esvaziar Carrinho"
  const limparBtn = document.getElementById("limpar-carrinho");
  if (limparBtn) {
    limparBtn.addEventListener("click", () => {
      if (confirm("Tem certeza que deseja esvaziar o carrinho?")) {
        carrinho = [];
        salvarCarrinho();
        atualizarCarrinho();
      }
    });
  }
});

