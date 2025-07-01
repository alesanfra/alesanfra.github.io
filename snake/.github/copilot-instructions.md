<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Snake Game - Istruzioni per Copilot

Questo è un progetto di gioco Snake implementato in JavaScript vanilla con HTML5 Canvas.

## Caratteristiche del progetto:
- **Linguaggio principale**: JavaScript ES6+ con HTML5 e CSS3
- **Architettura**: Programmazione orientata agli oggetti con classe SnakeGame
- **Rendering**: HTML5 Canvas per la grafica 2D
- **Controlli**: Tastiera (frecce direzionali, WASD, spazio, R)
- **Storage**: LocalStorage per salvare il punteggio record
- **Design**: Responsive con grafica moderna e animazioni CSS

## Strutture dati principali:
- `snake`: Array di oggetti con coordinate {x, y}
- `food`: Oggetto con coordinate {x, y}
- `direction`: Oggetto con vettore direzionale {x, y}
- `GAME_CONFIG`: Oggetto di configurazione con costanti del gioco

## Convenzioni di codice:
- Usa camelCase per variabili e metodi
- Usa UPPER_SNAKE_CASE per costanti
- Commenta le funzioni complesse
- Mantieni la separazione tra logica di gioco e rendering
- Usa addEventListener per la gestione degli eventi
- Implementa controlli di validazione per prevenire input non validi

## Funzionalità da mantenere:
- Game loop fluido con setTimeout
- Controllo delle collisioni (muri e corpo del serpente)
- Sistema di punteggio con aumento di velocità
- Pausa e restart del gioco
- Salvataggio automatico del record
- Design responsivo per dispositivi mobili

Quando modifichi il codice, mantieni la struttura OOP esistente e assicurati che tutte le funzionalità rimangano operative.
