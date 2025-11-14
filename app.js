/* app.js
   Protótipo com padrão MVC simples e persistência via localStorage.
*/

/* ----------------- MODEL ----------------- */
const Storage = (function(){
  const KEY = "prot_cadastros_v1";
  function read(){ 
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } 
    catch(e){ return []; }
  }
  function save(data){ localStorage.setItem(KEY, JSON.stringify(data)); }
  return { read, save };
})();

/* ----------------- REPOSITORY (pequeno padrão) ----------------- */
const CadastroRepo = (function(){
  let data = Storage.read();
  function all(){ return [...data]; }
  function add(item){
    item.id = Date.now().toString();
    data.push(item);
    Storage.save(data);
    return item;
  }
  function update(id, newItem){
    data = data.map(it => it.id === id ? {...it, ...newItem} : it);
    Storage.save(data);
  }
  function remove(id){
    data = data.filter(it => it.id !== id);
    Storage.save(data);
  }
  function findById(id){ return data.find(it => it.id === id) || null; }
  function clear(){ data = []; Storage.save(data); }
  return { all, add, update, remove, findById, clear };
})();

/* ----------------- VIEW ----------------- */
const View = (function(){
  const listaEl = document.getElementById("lista");
  function renderList(items){
    listaEl.innerHTML = "";
    if(items.length === 0){
      listaEl.innerHTML = "<li>Nenhum registro</li>";
      return;
    }
    items.forEach(it => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="item-info">
          <strong>${escapeHtml(it.nome)}</strong><br>
          <small>${escapeHtml(it.email)} ${it.telefone ? "— " + escapeHtml(it.telefone) : ""}</small>
        </div>
        <div class="item-actions">
          <button class="btn small" data-action="edit" data-id="${it.id}">Editar</button>
          <button class="btn small danger" data-action="delete" data-id="${it.id}">Excluir</button>
        </div>
      `;
      listaEl.appendChild(li);
    });
  }
  function escapeHtml(str = ""){ return String(str).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }
  return { renderList };
})();

/* ----------------- CONTROLLER ----------------- */
const Controller = (function(){
  const form = document.getElementById("formCadastro");
  const inputNome = document.getElementById("nome");
  const inputEmail = document.getElementById("email");
  const inputTel = document.getElementById("telefone");
  const buscar = document.getElementById("buscar");
  const btnCancelar = document.getElementById("btnCancelar");

  let editId = null;

  function init(){
    bindEvents();
    refresh();
    btnCancelar.style.display = "none";
  }

  function bindEvents(){
    form.addEventListener("submit", onSubmit);
    document.getElementById("lista").addEventListener("click", onListClick);
    buscar.addEventListener("input", onSearch);
    btnCancelar.addEventListener("click", onCancelEdit);
  }

  function onSubmit(e){
    e.preventDefault();
    const nome = inputNome.value.trim();
    const email = inputEmail.value.trim();
    const telefone = inputTel.value.trim();

    if(!nome || !email){ alert("Nome e email são obrigatórios."); return; }
    if(!validateEmail(email)){ alert("Email inválido."); return; }

    const item = { nome, email, telefone };

    if(editId){
      CadastroRepo.update(editId, item);
      editId = null;
      btnCancelar.style.display = "none";
    } else {
      CadastroRepo.add(item);
    }
    form.reset();
    refresh();
  }

  function onListClick(evt){
    const action = evt.target.dataset.action;
    const id = evt.target.dataset.id;
    if(!action) return;
    if(action === "edit"){
      startEdit(id);
    } else if(action === "delete"){
      if(confirm("Excluir este registro?")) {
        CadastroRepo.remove(id);
        refresh();
      }
    }
  }

  function startEdit(id){
    const rec = CadastroRepo.findById(id);
    if(!rec) return;
    inputNome.value = rec.nome;
    inputEmail.value = rec.email;
    inputTel.value = rec.telefone || "";
    editId = id;
    btnCancelar.style.display = "inline-block";
  }

  function onCancelEdit(){
    editId = null;
    form.reset();
    btnCancelar.style.display = "none";
  }

  function onSearch(){
    const q = buscar.value.trim().toLowerCase();
    const all = CadastroRepo.all();
    if(!q){ View.renderList(all); return; }
    const filtered = all.filter(it => (it.nome + " " + it.email).toLowerCase().includes(q));
    View.renderList(filtered);
  }

  function refresh(){ View.renderList(CadastroRepo.all()); }

  function validateEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  return { init };
})();

/* ----------------- START ----------------- */
document.addEventListener("DOMContentLoaded", () => Controller.init());
