let currentPokemonId = 1;

async function buscarPokemon() {
  const input = document.getElementById('pokemonInput').value.trim().toLowerCase();
  const container = document.getElementById('pokemonContainer');

  if (!input) {
    alert('Por favor escribe un nombre o número de Pokémon');
    return;
  }

  container.innerHTML = 'Buscando...';

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
    if (!res.ok) throw new Error('No encontrado');
    const data = await res.json();

    currentPokemonId = data.id;

    mostrarPokemon(data);
  } catch (error) {
    container.innerHTML = `<p>Pokémon no encontrado. Intenta con otro nombre o número.</p>`;
  }
}

function mostrarPokemon(data) {
  const container = document.getElementById('pokemonContainer');

  const stats = data.stats
    .map((stat) => {
      const nombre = traducirStat(stat.stat.name);
      return `<p><strong>${nombre}:</strong> ${stat.base_stat}</p>`;
    })
    .join('');

  container.innerHTML = `
    <h2>${data.name.toUpperCase()}</h2>
    <div class="pokemon-info">
      <img src="${data.sprites.front_default}" alt="${data.name}" />
      <div class="details">
        <p><strong>Tipo:</strong> ${data.types.map((t) => t.type.name).join(', ')}</p>
        <p><strong>Altura:</strong> ${data.height / 10} m</p>
        <p><strong>Peso:</strong> ${data.weight / 10} kg</p>
      </div>
    </div>
    <h3>Estadísticas:</h3>
    ${stats}
  `;
}

async function cambiarPokemon(delta) {
  const newId = currentPokemonId + delta;
  if (newId < 1 || newId > 1025) return;

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${newId}`);
    if (!res.ok) throw new Error('Error');
    const data = await res.json();
    currentPokemonId = data.id;
    mostrarPokemon(data);
  } catch (error) {
    console.error('Error al cargar Pokémon:', error);
  }
}

function traducirStat(statName) {
  const traducciones = {
    hp: 'HP',
    attack: 'Ataque',
    defense: 'Defensa',
    'special-attack': 'Ataque Esp.',
    'special-defense': 'Defensa Esp.',
    speed: 'Velocidad',
  };
  return traducciones[statName] || statName;
}

document.addEventListener('DOMContentLoaded', () => {
  const buscarBtn = document.getElementById('buscarBtn');
  const pokemonInput = document.getElementById('pokemonInput');

  buscarBtn.addEventListener('click', buscarPokemon);

  pokemonInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      buscarPokemon();
    }
  });
});

//prueba git