// IMPORTA O SUPABASE (MODO MODULE)
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// CRIA O CLIENT DO SUPABASE
const client = createClient(
  "https://zrstjjhjnaaddlaljnwl.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyc3RqamhqbmFhZGRsYWxqbndsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0ODA1NjEsImV4cCI6MjA3NDA1NjU2MX0.12RypSVOBajdNo5ShrcU1cikIEpJMZdIZIoCjo1HVjc"
);

// FUNÇÃO DE LOGIN
document.getElementById("formulario").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  // BUSCA NO BANCO SUPABASE
  const { data, error } = await client
    .from("clientes")
    .select("*")
    .eq("email", email)
    .eq("senha", senha)
    .maybeSingle();  
    // maybeSingle() → retorna null se não encontrar

  if (error) {
    console.error("Erro ao consultar Supabase:", error);
    alert("Erro no servidor. Tente novamente.");
    return;
  }

  // SE NÃO ACHOU NENHUM USUÁRIO
  if (!data) {
    alert("Usuário ou senha incorretos!");
    return;
  }

  // SE ACHOU O USUÁRIO
  alert("Login realizado com sucesso!");

  // ARMAZENA O ID DO USUÁRIO
  localStorage.setItem("usuarioLogado", data.id);

  // REDIRECIONA PARA A PÁGINA INICIAL
  window.location.href = "index.html"; 
});
