# 🐍 Snake Game

Un classico gioco Snake implementato in JavaScript vanilla con HTML5 Canvas, caratterizzato da grafica moderna e gameplay fluido.

## 🎮 Caratteristiche

- **Gameplay classico**: Controlla il serpente, mangia il cibo, evita le collisioni
- **Grafica moderna**: Interfaccia elegante con effetti visivi e animazioni
- **Controlli intuitivi**: Supporto per frecce direzionali, WASD e controlli touch
- **Sistema di punteggio**: Punteggio crescente con aumento progressivo della velocità
- **Salvataggio record**: Il punteggio più alto viene salvato automaticamente
- **Design responsivo**: Ottimizzato per desktop e dispositivi mobili
- **Controlli completi**: Pausa, restart e indicatori di stato

## 🎯 Come giocare

### Controlli da tastiera:
- **Frecce direzionali** o **WASD**: Muovi il serpente
- **Spazio**: Pausa/Riprendi il gioco  
- **R**: Restart del gioco

### Controlli con pulsanti:
- **Inizia**: Avvia una nuova partita
- **Pausa**: Mette in pausa o riprende il gioco
- **Restart**: Ricomincia da capo

### Obiettivo:
1. Guida il serpente per mangiare il cibo rosso
2. Ogni cibo mangiato fa crescere il serpente e aumenta il punteggio
3. Evita di colpire i muri o il corpo del serpente
4. Cerca di battere il tuo record!

## 🚀 Avvio rapido

1. **Clona o scarica** il progetto
2. **Apri** il file `index.html` in un browser web moderno
3. **Clicca** su "Inizia" o premi un tasto freccia per cominciare
4. **Divertiti!**

## 📁 Struttura del progetto

```
snake/
├── index.html          # Struttura HTML principale
├── styles.css          # Stili CSS e animazioni
├── script.js           # Logica del gioco JavaScript
├── README.md           # Documentazione
└── .github/
    └── copilot-instructions.md  # Istruzioni per GitHub Copilot
```

## 🛠️ Tecnologie utilizzate

- **HTML5**: Struttura semantica e Canvas element
- **CSS3**: Styling moderno con gradientit, animazioni e design responsivo
- **JavaScript ES6+**: Programmazione orientata agli oggetti e API moderne
- **Canvas API**: Rendering grafico 2D ad alte prestazioni
- **LocalStorage**: Persistenza del punteggio record

## ⚡ Caratteristiche tecniche

### Architettura del codice:
- **Classe SnakeGame**: Gestione completa dello stato del gioco
- **Game loop**: Ciclo di aggiornamento fluido con setTimeout
- **Collision detection**: Sistema di rilevamento collisioni ottimizzato
- **Event handling**: Gestione robusta degli input da tastiera e mouse

### Configurazione del gioco:
- **Dimensioni canvas**: 400x400 pixel
- **Dimensione griglia**: 20x20 pixel per cella
- **Velocità iniziale**: 150ms per movimento
- **Accelerazione**: -5ms ogni cibo mangiato
- **Velocità massima**: 50ms per movimento

## 🎨 Personalizzazione

Il gioco è facilmente personalizzabile modificando:

- **Colori**: Modifica i gradienti in `styles.css`
- **Velocità**: Cambia `INITIAL_SPEED` e `SPEED_INCREASE` in `script.js`
- **Dimensioni**: Modifica `CANVAS_SIZE` e `GRID_SIZE` in `script.js`
- **Controlli**: Aggiungi nuovi tasti in `handleKeyPress()`

## 🐛 Debugging e sviluppo

Per modifiche al codice:
1. Apri gli strumenti di sviluppo del browser (F12)
2. Monitora la console per eventuali errori
3. Testa su diversi browser e dispositivi
4. Verifica la responsività su schermi diversi

## 📱 Compatibilità

- **Browser**: Chrome, Firefox, Safari, Edge (versioni moderne)
- **Dispositivi**: Desktop, tablet, smartphone
- **Sistema operativo**: Windows, macOS, Linux, iOS, Android

## 🤝 Contributi

Il progetto è aperto a miglioramenti! Idee per nuove funzionalità:
- Livelli di difficoltà
- Power-up speciali
- Modalità multiplayer
- Temi grafici aggiuntivi
- Effetti sonori

## 📄 Licenza

Progetto educativo opensource - sentiti libero di usarlo e modificarlo!

---

**Divertiti a giocare! 🎮**
