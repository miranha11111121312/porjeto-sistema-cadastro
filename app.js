function adicionar() {
    const input = document.getElementById("inputNome");
    const lista = document.getElementById("lista");

    if (input.value.trim() === "") {
        alert("Digite um nome válido!");
        return;
    }

    const item = document.createElement("li");
    item.textContent = input.value;

    lista.appendChild(item);

    input.value = "";
}
