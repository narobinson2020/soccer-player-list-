class Player {
    constructor(name, age, club, country) {
        this.name = name;
        this.age = age;
        this.club = club;
        this.country = country;
    }
}

// UI Class: Handle UI Tasks
class UI {
    static displayPlayers() {
        let players = Store.getPlayers;

        players.forEach((player) => UI.addPlayerToList(player)
        );
    }

    static addPlayerToList(player) {
        const list = document.querySelector('#player-list');

        const row = document.createElement('tr')

        row.innerHTML = `
        <td>${player.name}</td>
        <td>${player.age}</td>
        <td>${player.club}</td>
        <td>${player.country}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</td>
        `;

        list.appendChild(row);
    }

    static deletePlayer(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove()
        }
    }

    static showAlert(message, className) {
        const div= document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#player-form');
        container.insertBefore(div, form);
        // Vanish in 5 seconds 
        setTimeout(() => {document.querySelector('alert').remove(), 5000});
    }

    static clearFields() {
        document.querySelector('#name').value = '';
        document.querySelector('#age').value = '';
        document.querySelector('#club').value = '';
        document.querySelector('#country').value = '';
    }
}

// Store Class: Handles Storage 
class Store {
    static getPlayers() {
        let players;

        if(localStorage.getItem('players') === null) {
            players=[];
        } else {
            players = JSON.parse(localStorage.getItem('players'));
        }

        return players;
    }

    static addPlayer(player) {
        const players = Store.getPlayers();
        players.push(player);
        localStorage.setItem('players', JSON.stringify(players));
    }

    static removePlayer(name) {
        const players = Store.getPlayers();

        players.forEach((player, index) => {
            if(player.name === name) {
                players.splice(index, 1);
            }
        });

        localStorage.setItem('players', JSON.stringify(players))
    }
}

// Event: Display Players
document.addEventListener('DOMContentLoaded', UI.displayPlayers);

// Event: Add a Player
document.querySelector('#player-form').addEventListener('submit', (e) => {
    // Prevent actual submit. Want the player info to be displayed rather than submitted (disappear)
    e.preventDefault(); 

    // Get form Values 
    const name= document.querySelector("#name").value; 
    const age= document.querySelector("#age").value;
    const club= document.querySelector("#club").value;
    const country= document.querySelector("#country").value;

    // Validate 
    if(name=== '' || age === '' || club=== '' || country=== '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
    // instantiate player 
    const player = new Player(name, age, club, country);

    // Add player to UI
    UI.addPlayerToList(player);

    // Add player to store 
    Store.addPlayer(player);

    // Show success message 
    UI.showAlert('Player added', 'success');

    // Clear fields 
    UI.clearFields();
    }
});

// Event: Remove a Player
document.querySelector('#player-list').addEventListener('click', (e) => {
    // Remove Player from UI
    UI.deletePlayer(e.target);

    // Remove Player from store
    Store.removePlayer(e.target.parentElement.textContent);

    // Show success message 
    UI.showAlert('Player removed', 'success');
});
