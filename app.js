const inputNome = document.getElementById("inputNome");
const lista = document.getElementById("lista");

function adicionarNome() {
    const nome = inputNome.value.trim();

    if (nome === "") {
        alert("Digite um nome!");
        return;
    }

    const li = document.createElement("li");
    li.textContent = nome;

    const btnRemover = document.createElement("button");
    btnRemover.textContent = "Excluir";
    btnRemover.className = "btn-remover";

    btnRemover.onclick = () => {
        li.remove();
    };

    li.appendChild(btnRemover);
    lista.appendChild(li);

    inputNome.value = "";
}
