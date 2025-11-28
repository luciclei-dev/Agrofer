import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

//  Substitua com suas credenciais do Supabase
const SUPABASE_URL = "https://zrstjjhjnaaddlaljnwl.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyc3RqamhqbmFhZGRsYWxqbndsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0ODA1NjEsImV4cCI6MjA3NDA1NjU2MX0.12RypSVOBajdNo5ShrcU1cikIEpJMZdIZIoCjo1HVjc";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Seleciona os containers (se existirem)
//const produtosContainer = document.querySelector(".produtos .row");
const produtosContainer = document.getElementById("produtos-container");

const medicamentosContainer = document.getElementById("medicamentos-container");



// Função para criar card
function criarCard(produto) {
  const col = document.createElement("div");
  col.classList.add("col");

  col.innerHTML = `
    <div class="card h-100">
      <img src="${
        produto.imagem_produto ||
        "https://via.placeholder.com/400x300.png?text=Sem+Imagem"
      }" class="card-img-top" alt="${produto.nome}">
      <div class="card-body">
        <h5 class="card-title">${produto.nome}</h5>
        <p class="card-price">R$ ${Number(produto.preco_venda).toFixed(2)}</p>
       
        <button 
          class="btn btn-success adicionar-carrinho" 
          data-nome="${produto.nome}" 
          data-preco="${produto.preco_venda}">
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  `;
  return col;
}

// Carregar produtos
async function carregarProdutos() {
  const { data, error } = await supabase
    .from("produtos")
    .select("nome, preco_venda, imagem_produto, categoria, estoque")
    .gt("estoque", 0); // só traz com estoque maior que 0

  if (error) {
    console.error("Erro ao buscar produtos:", error);
    return;
  }

  if (produtosContainer) produtosContainer.innerHTML = "";
  if (medicamentosContainer) medicamentosContainer.innerHTML = "";

  data.forEach((produto) => {
    const card = criarCard(produto);

    if (produto.categoria?.toLowerCase() === "medicamento") {
      if (medicamentosContainer) {
        medicamentosContainer.appendChild(card);
      }
    } else {
      if (produtosContainer) {
        produtosContainer.appendChild(card);
      }
    }
  });
}

// Buscar produtos
async function buscarProdutos(termo) {
  const { data, error } = await supabase
    .from("produtos")
    .select("nome, preco_venda, imagem_produto, categoria, estoque")
    .gt("estoque", 0) // só com estoque
    .ilike("nome", `%${termo}%`);

  if (error) {
    console.error("Erro ao buscar produtos:", error);
    return;
  }

  if (produtosContainer) produtosContainer.innerHTML = "";
  if (medicamentosContainer) medicamentosContainer.innerHTML = "";

  if (data.length === 0) {
    if (produtosContainer)
      produtosContainer.innerHTML = "<p>Nenhum produto encontrado.</p>";
    if (medicamentosContainer)
      medicamentosContainer.innerHTML = "<p>Nenhum medicamento encontrado.</p>";
    return;
  }

  data.forEach((produto) => {
    const card = criarCard(produto);

    if (produto.categoria?.toLowerCase() === "medicamento") {
      if (medicamentosContainer) {
        medicamentosContainer.appendChild(card);
      }
    } else {
      if (produtosContainer) {
        produtosContainer.appendChild(card);
      }
    }
  });
}

// Pesquisa
const formPesquisa = document.getElementById("form-pesquisa");
const inputBusca = document.getElementById("busca");

if (formPesquisa && inputBusca) {
  formPesquisa.addEventListener("submit", (e) => {
    e.preventDefault();
    const termo = inputBusca.value.trim();

    if (termo) {
      buscarProdutos(termo);
    } else {
      carregarProdutos();
    }
  });
}

 document.getElementById("logoutBtn").addEventListener("click", () => {
   localStorage.removeItem("usuarioLogado");
   alert("Você saiu da conta!");
   window.location.href = "index.html";
 });


// Inicializa
carregarProdutos();
