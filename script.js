let currentColumnId = ''; // Armazena a coluna onde o card será adicionado
let currentCard = null; // Armazena o card sendo visualizado ou editado

// Função para permitir o evento de "drop" nos elementos de destino
function allowDrop(ev) {
    ev.preventDefault();
}

// Função chamada quando o card é arrastado
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id); // Armazena o ID do card arrastado
}

// Função chamada quando o card é solto
function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    const target = ev.target;

    if (target.classList.contains("column")) {
        target.appendChild(draggedElement); // Adiciona o card à coluna
    } else if (target.classList.contains("card")) {
        target.parentElement.appendChild(draggedElement); // Coloca o card ao lado de outro
    }
}

// Função para abrir o modal de adicionar card e setar a coluna atual
function openAddCardModal(columnId) {
    currentColumnId = columnId; // Define a coluna onde o card será adicionado
    const modal = new bootstrap.Modal(document.getElementById('addCardModal'));
    modal.show();
}

// Função para salvar o card
document.getElementById('addCardForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const title = document.getElementById('cardTitle').value;
    const description = document.getElementById('cardDescription').value;
    const image = document.getElementById('cardImage').files[0];

    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('draggable', true);
    card.setAttribute('id', 'card-' + Date.now());
    card.setAttribute('ondragstart', 'drag(event)');
    card.innerHTML = `
        <h5>${title}</h5>
        <p>${description}</p>
        ${image ? `<img src="${URL.createObjectURL(image)}" alt="Imagem do Card">` : ''}
        <button class="btn btn-info mt-2" onclick="viewCard('${card.id}')">Visualizar</button>
    `;

    document.getElementById(currentColumnId).appendChild(card);
    const modal = bootstrap.Modal.getInstance(document.getElementById('addCardModal'));
    modal.hide();
});

// Função para visualizar o card
function viewCard(cardId) {
    currentCard = document.getElementById(cardId);
    const title = currentCard.querySelector('h5').textContent;
    const description = currentCard.querySelector('p').textContent;
    const image = currentCard.querySelector('img') ? currentCard.querySelector('img').src : '';

    document.getElementById('viewCardTitle').textContent = title;
    document.getElementById('viewCardDescription').textContent = description;
    document.getElementById('viewCardImage').src = image;

    const modal = new bootstrap.Modal(document.getElementById('viewCardModal'));
    modal.show();
}

// Função para editar o card
function openEditCardModal() {
    const title = currentCard.querySelector('h5').textContent;
    const description = currentCard.querySelector('p').textContent;

    document.getElementById('editCardTitle').value = title;
    document.getElementById('editCardDescription').value = description;

    const modal = new bootstrap.Modal(document.getElementById('editCardModal'));
    modal.show();
}

// Função para salvar o card editado
document.getElementById('editCardForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const title = document.getElementById('editCardTitle').value;
    const description = document.getElementById('editCardDescription').value;

    currentCard.querySelector('h5').textContent = title;
    currentCard.querySelector('p').textContent = description;

    const modal = bootstrap.Modal.getInstance(document.getElementById('editCardModal'));
    modal.hide();
});

// Função para deletar o card
function deleteCard() {
    currentCard.remove();
    const modal = bootstrap.Modal.getInstance(document.getElementById('viewCardModal'));
    modal.hide();
}
