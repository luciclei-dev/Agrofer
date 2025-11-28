// --- IMPORTA A BIBLIOTECA SUPABASE (VIA CDN MODULAR) ---
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// --- INICIALIZA O SUPABASE ---
const client = createClient(
  "https://zrstjjhjnaaddlaljnwl.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyc3RqamhqbmFhZGRsYWxqbndsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0ODA1NjEsImV4cCI6MjA3NDA1NjU2MX0.12RypSVOBajdNo5ShrcU1cikIEpJMZdIZIoCjo1HVjc"
);

// --- CADASTRO DE CLIENTE ---
document.getElementById("formulario").addEventListener("submit", async function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const telefone = document.getElementById("telefone").value;
  const endereco = document.getElementById("endereco").value;

  const { error } = await client
    .from("clientes")
    .insert([
      { nome, email, senha, telefone, endereco }
    ]);

  if (error) {
    alert("Erro ao cadastrar: " + error.message);
    console.error(error);
    return;
  }

  alert("Cadastro realizado com sucesso!");
  window.location.href = "login.html";
});
