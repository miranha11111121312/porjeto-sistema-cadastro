const form = document.getElementById("cadastroForm");
const lista = document.getElementById("lista");
const busca = document.getElementById("busca");

let registros = [];

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const telefone = document.getElementById("telefone").value;

    const pessoa = { nome, email, telefone };
    registros.push(pessoa);

    form.reset();
    renderLista(registros);
});

function renderLista(arr) {
    lista.innerHTML = "";

    arr.forEach((pessoa, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${pessoa.nome} — ${pessoa.email} — ${pessoa.telefone}
            <button onclick="remover(${index})">X</button>
        `;
        lista.appendChild(li);
    });
}

function remover(i) {
    registros.splice(i, 1);
    renderLista(registros);
}

busca.addEventListener("input", () => {
    const filtro = busca.value.toLowerCase();
    const filtrados = registros.filter(p =>
        p.nome.toLowerCase().includes(filtro)
    );

    renderLista(filtrados);
});
