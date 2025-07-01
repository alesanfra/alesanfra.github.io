// Configurazione del gioco
const GAME_CONFIG = {
    CANVAS_SIZE: { width: 400, height: 400 },
    GRID_SIZE: 20,
    INITIAL_SPEED: 150,
    SPEED_INCREASE: 5,
    MIN_SPEED: 50
};

// Modalità dei muri
const WALL_MODES = {
    SOLID: 'solid',
    PORTAL: 'portal'
};

// Classe per gestire il gioco Snake
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('high-score');
        this.gameStatusElement = document.getElementById('gameStatus');
        
        // Pulsanti di controllo
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.restartBtn = document.getElementById('restartBtn');

        // Controlli touch
        this.touchUpBtn = document.getElementById('touchUp');
        this.touchLeftBtn = document.getElementById('touchLeft');
        this.touchDownBtn = document.getElementById('touchDown');
        this.touchRightBtn = document.getElementById('touchRight');
        
        // Toggle modalità muri
        this.wallModeToggle = document.getElementById('wallModeToggle');
        this.wallModeText = document.getElementById('wallModeText');
        
        this.initializeGame();
        this.setupEventListeners();
        this.loadHighScore();
        this.loadSettings();
    }
    
    initializeGame() {
        this.gridWidth = GAME_CONFIG.CANVAS_SIZE.width / GAME_CONFIG.GRID_SIZE;
        this.gridHeight = GAME_CONFIG.CANVAS_SIZE.height / GAME_CONFIG.GRID_SIZE;
        
        this.resetGame();
    }
    
    resetGame() {
        // Stato del gioco
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameOver = false;
        this.score = 0;
        this.speed = GAME_CONFIG.INITIAL_SPEED;
        
        // Modalità muri (default: solidi)
        this.wallMode = this.wallModeToggle.checked ? WALL_MODES.PORTAL : WALL_MODES.SOLID;
        
        // Posizione iniziale del serpente (centro)
        this.snake = [
            { x: Math.floor(this.gridWidth / 2), y: Math.floor(this.gridHeight / 2) }
        ];
        
        // Direzione iniziale
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        
        // Genera il primo cibo
        this.generateFood();
        
        // Aggiorna interfaccia
        this.updateScore();
        this.updateGameStatus("Premi 'Inizia' per cominciare!");
        this.draw();
    }
    
    setupEventListeners() {
        // Controlli da tastiera
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Pulsanti di controllo
        this.startBtn.addEventListener('click', () => this.startGame());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.restartBtn.addEventListener('click', () => this.restart());
        
        // Controlli touch - aggiungo sia eventi touchstart che click per maggiore compatibilità
        this.touchUpBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();  // Previene comportamenti indesiderati
            this.handleTouch('up');
        });
        this.touchUpBtn.addEventListener('click', () => this.handleTouch('up'));
        
        this.touchLeftBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleTouch('left');
        });
        this.touchLeftBtn.addEventListener('click', () => this.handleTouch('left'));
        
        this.touchDownBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleTouch('down');
        });
        this.touchDownBtn.addEventListener('click', () => this.handleTouch('down'));
        
        this.touchRightBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleTouch('right');
        });
        this.touchRightBtn.addEventListener('click', () => this.handleTouch('right'));
        
        // Gestione degli swipe sul canvas
        this.setupSwipeControls();
        
        // Toggle modalità muri
        this.wallModeToggle.addEventListener('change', () => this.updateWallMode());
        
        // Prevenire lo scroll della pagina con le frecce
        document.addEventListener('keydown', (e) => {
            if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
        });
    }
    
    setupSwipeControls() {
        // Variabili per monitorare lo swipe
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        
        // Threshold minima per considerare un movimento come swipe
        const minSwipeDistance = 30;
        
        // Gestione touchstart
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Previene lo scroll e altri comportamenti predefiniti
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: false });
        
        // Gestione touchend
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            
            // Calcola la direzione dello swipe
            this.handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY, minSwipeDistance);
        }, { passive: false });
    }
    
    handleSwipe(startX, startY, endX, endY, minDistance) {
        // Calcola le distanze
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        // Determina se lo swipe è abbastanza significativo
        if (Math.abs(deltaX) < minDistance && Math.abs(deltaY) < minDistance) {
            // Tap (non swipe) - può essere usato per avviare/mettere in pausa il gioco
            if (!this.gameRunning) {
                this.startGame();
            } else {
                this.togglePause();
            }
            return;
        }
        
        // Determina se lo swipe è più orizzontale o verticale
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Swipe orizzontale
            if (deltaX > 0) {
                // Swipe verso destra
                this.handleTouch('right');
            } else {
                // Swipe verso sinistra
                this.handleTouch('left');
            }
        } else {
            // Swipe verticale
            if (deltaY > 0) {
                // Swipe verso il basso
                this.handleTouch('down');
            } else {
                // Swipe verso l'alto
                this.handleTouch('up');
            }
        }
    }
    
    handleKeyPress(event) {
        if (!this.gameRunning || this.gamePaused) {
            if (event.key === ' ') {
                this.togglePause();
            }
            if (event.key.toLowerCase() === 'r') {
                this.restart();
            }
            return;
        }
        
        // Controlli direzionali
        switch(event.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (this.direction.y === 0) {
                    this.nextDirection = { x: 0, y: -1 };
                }
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (this.direction.y === 0) {
                    this.nextDirection = { x: 0, y: 1 };
                }
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (this.direction.x === 0) {
                    this.nextDirection = { x: -1, y: 0 };
                }
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (this.direction.x === 0) {
                    this.nextDirection = { x: 1, y: 0 };
                }
                break;
            case ' ':
                this.togglePause();
                break;
            case 'r':
            case 'R':
                this.restart();
                break;
        }
    }
    
    handleTouch(direction) {
        // Se il gioco non è in esecuzione, avvialo
        if (!this.gameRunning) {
            this.startGame();
        }
        // Se il gioco è in pausa, esci
        if (this.gamePaused) {
            return;
        }
        
        switch(direction) {
            case 'up':
                if (this.direction.y === 0) {
                    this.nextDirection = { x: 0, y: -1 };
                }
                break;
            case 'down':
                if (this.direction.y === 0) {
                    this.nextDirection = { x: 0, y: 1 };
                }
                break;
            case 'left':
                if (this.direction.x === 0) {
                    this.nextDirection = { x: -1, y: 0 };
                }
                break;
            case 'right':
                if (this.direction.x === 0) {
                    this.nextDirection = { x: 1, y: 0 };
                }
                break;
        }
    }
    
    startGame() {
        if (this.gameOver) {
            this.resetGame();
        }
        
        this.gameRunning = true;
        this.gamePaused = false;
        this.updateGameStatus("Gioco in corso...");
        this.gameLoop();
    }
    
    togglePause() {
        if (!this.gameRunning || this.gameOver) return;
        
        this.gamePaused = !this.gamePaused;
        
        if (this.gamePaused) {
            this.updateGameStatus("⏸️ Gioco in pausa - Premi SPAZIO per continuare");
        } else {
            this.updateGameStatus("Gioco in corso...");
            this.gameLoop();
        }
    }
    
    restart() {
        this.resetGame();
        this.startGame();
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused || this.gameOver) return;
        
        this.update();
        this.draw();
        
        setTimeout(() => this.gameLoop(), this.speed);
    }
    
    update() {
        // Aggiorna direzione
        this.direction = { ...this.nextDirection };
        
        // Calcola nuova posizione della testa
        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;
        
        // Controlla collisioni con i muri
        if (this.handleWallCollision(head)) {
            this.endGame();
            return;
        }
        
        // Controlla collisioni con se stesso
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.endGame();
            return;
        }
        
        // Aggiungi nuova testa
        this.snake.unshift(head);
        
        // Controlla se ha mangiato il cibo
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScore();
            this.generateFood();
            this.increaseSpeed();
        } else {
            // Rimuovi coda se non ha mangiato
            this.snake.pop();
        }
    }
    
    generateFood() {
        do {
            this.food = {
                x: Math.floor(Math.random() * this.gridWidth),
                y: Math.floor(Math.random() * this.gridHeight)
            };
        } while (this.snake.some(segment => 
            segment.x === this.food.x && segment.y === this.food.y
        ));
    }
    
    increaseSpeed() {
        if (this.speed > GAME_CONFIG.MIN_SPEED) {
            this.speed = Math.max(GAME_CONFIG.MIN_SPEED, 
                this.speed - GAME_CONFIG.SPEED_INCREASE);
        }
    }
    
    draw() {
        // Pulisci canvas
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Disegna griglia (opzionale)
        this.drawGrid();
        
        // Disegna effetti portali se attivi
        this.drawPortalEffects();
        
        // Disegna cibo
        this.drawFood();
        
        // Disegna serpente
        this.drawSnake();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i <= this.gridWidth; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * GAME_CONFIG.GRID_SIZE, 0);
            this.ctx.lineTo(i * GAME_CONFIG.GRID_SIZE, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let i = 0; i <= this.gridHeight; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * GAME_CONFIG.GRID_SIZE);
            this.ctx.lineTo(this.canvas.width, i * GAME_CONFIG.GRID_SIZE);
            this.ctx.stroke();
        }
    }
    
    drawSnake() {
        this.snake.forEach((segment, index) => {
            const x = segment.x * GAME_CONFIG.GRID_SIZE;
            const y = segment.y * GAME_CONFIG.GRID_SIZE;
            
            // Testa del serpente
            if (index === 0) {
                // Gradiente per la testa
                const gradient = this.ctx.createRadialGradient(
                    x + GAME_CONFIG.GRID_SIZE / 2, y + GAME_CONFIG.GRID_SIZE / 2, 0,
                    x + GAME_CONFIG.GRID_SIZE / 2, y + GAME_CONFIG.GRID_SIZE / 2, GAME_CONFIG.GRID_SIZE / 2
                );
                gradient.addColorStop(0, '#4CAF50');
                gradient.addColorStop(1, '#388E3C');
                
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(x + 1, y + 1, GAME_CONFIG.GRID_SIZE - 2, GAME_CONFIG.GRID_SIZE - 2);
                
                // Occhi del serpente
                this.ctx.fillStyle = 'white';
                const eyeSize = 3;
                const eyeOffset = 5;
                
                // Posizione degli occhi basata sulla direzione
                let eyeX1, eyeY1, eyeX2, eyeY2;
                if (this.direction.x === 1) { // Destra
                    eyeX1 = x + GAME_CONFIG.GRID_SIZE - eyeOffset;
                    eyeY1 = y + eyeOffset;
                    eyeX2 = x + GAME_CONFIG.GRID_SIZE - eyeOffset;
                    eyeY2 = y + GAME_CONFIG.GRID_SIZE - eyeOffset;
                } else if (this.direction.x === -1) { // Sinistra
                    eyeX1 = x + eyeOffset;
                    eyeY1 = y + eyeOffset;
                    eyeX2 = x + eyeOffset;
                    eyeY2 = y + GAME_CONFIG.GRID_SIZE - eyeOffset;
                } else if (this.direction.y === -1) { // Su
                    eyeX1 = x + eyeOffset;
                    eyeY1 = y + eyeOffset;
                    eyeX2 = x + GAME_CONFIG.GRID_SIZE - eyeOffset;
                    eyeY2 = y + eyeOffset;
                } else { // Giù
                    eyeX1 = x + eyeOffset;
                    eyeY1 = y + GAME_CONFIG.GRID_SIZE - eyeOffset;
                    eyeX2 = x + GAME_CONFIG.GRID_SIZE - eyeOffset;
                    eyeY2 = y + GAME_CONFIG.GRID_SIZE - eyeOffset;
                }
                
                this.ctx.fillRect(eyeX1 - eyeSize/2, eyeY1 - eyeSize/2, eyeSize, eyeSize);
                this.ctx.fillRect(eyeX2 - eyeSize/2, eyeY2 - eyeSize/2, eyeSize, eyeSize);
            } else {
                // Corpo del serpente
                const alpha = 1 - (index * 0.1);
                this.ctx.fillStyle = `rgba(76, 175, 80, ${Math.max(alpha, 0.3)})`;
                this.ctx.fillRect(x + 2, y + 2, GAME_CONFIG.GRID_SIZE - 4, GAME_CONFIG.GRID_SIZE - 4);
            }
        });
    }
    
    drawFood() {
        const x = this.food.x * GAME_CONFIG.GRID_SIZE;
        const y = this.food.y * GAME_CONFIG.GRID_SIZE;
        
        // Gradiente per il cibo
        const gradient = this.ctx.createRadialGradient(
            x + GAME_CONFIG.GRID_SIZE / 2, y + GAME_CONFIG.GRID_SIZE / 2, 0,
            x + GAME_CONFIG.GRID_SIZE / 2, y + GAME_CONFIG.GRID_SIZE / 2, GAME_CONFIG.GRID_SIZE / 2
        );
        gradient.addColorStop(0, '#FF5722');
        gradient.addColorStop(1, '#D32F2F');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(
            x + GAME_CONFIG.GRID_SIZE / 2, 
            y + GAME_CONFIG.GRID_SIZE / 2, 
            GAME_CONFIG.GRID_SIZE / 2 - 2, 
            0, 
            2 * Math.PI
        );
        this.ctx.fill();
        
        // Piccolo riflesso sul cibo
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.beginPath();
        this.ctx.arc(
            x + GAME_CONFIG.GRID_SIZE / 2 - 3, 
            y + GAME_CONFIG.GRID_SIZE / 2 - 3, 
            3, 
            0, 
            2 * Math.PI
        );
        this.ctx.fill();
    }
    
    drawPortalEffects() {
        if (this.wallMode === WALL_MODES.PORTAL) {
            // Disegna effetti visivi sui bordi per indicare i portali
            this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
            this.ctx.lineWidth = 3;
            this.ctx.setLineDash([5, 5]);
            
            // Animazione del tratteggio
            const time = Date.now() * 0.005;
            this.ctx.lineDashOffset = time % 10;
            
            this.ctx.strokeRect(1.5, 1.5, this.canvas.width - 3, this.canvas.height - 3);
            
            // Reset delle impostazioni
            this.ctx.setLineDash([]);
            this.ctx.lineDashOffset = 0;
        }
    }
    
    endGame() {
        this.gameOver = true;
        this.gameRunning = false;
        
        // Aggiorna record se necessario
        const currentHighScore = parseInt(localStorage.getItem('snakeHighScore') || '0');
        if (this.score > currentHighScore) {
            localStorage.setItem('snakeHighScore', this.score.toString());
            this.loadHighScore();
            this.updateGameStatus("🎉 Nuovo record! Game Over - Premi R per ricominciare");
        } else {
            this.updateGameStatus("💀 Game Over - Premi R per ricominciare");
        }
        
        // Aggiunge classe CSS per animazione
        this.gameStatusElement.className = 'game-status game-over';
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
    }
    
    loadHighScore() {
        const highScore = localStorage.getItem('snakeHighScore') || '0';
        this.highScoreElement.textContent = highScore;
    }
    
    updateGameStatus(message) {
        this.gameStatusElement.textContent = message;
        this.gameStatusElement.className = 'game-status';
        
        if (this.gamePaused) {
            this.gameStatusElement.className += ' paused';
        }
    }
    
    updateWallMode() {
        this.wallMode = this.wallModeToggle.checked ? WALL_MODES.PORTAL : WALL_MODES.SOLID;
        this.wallModeText.textContent = this.wallModeToggle.checked ? 'Portali' : 'Solidi';
        this.saveSettings();
        
        // Se il gioco è in corso, aggiorna immediatamente
        if (this.gameRunning && !this.gameOver) {
            this.updateGameStatus(
                this.wallModeToggle.checked ? 
                "Modalità portali attiva! 🌀" : 
                "Modalità muri solidi attiva! 🧱"
            );
        }
    }
    
    handleWallCollision(head) {
        if (this.wallMode === WALL_MODES.SOLID) {
            // Modalità classica: collisione con i muri termina il gioco
            if (head.x < 0 || head.x >= this.gridWidth || 
                head.y < 0 || head.y >= this.gridHeight) {
                return true; // Collisione fatale
            }
        } else {
            // Modalità portali: teletrasporto attraverso i muri
            if (head.x < 0) {
                head.x = this.gridWidth - 1;
            } else if (head.x >= this.gridWidth) {
                head.x = 0;
            }
            
            if (head.y < 0) {
                head.y = this.gridHeight - 1;
            } else if (head.y >= this.gridHeight) {
                head.y = 0;
            }
        }
        
        return false; // Nessuna collisione fatale
    }
    
    saveSettings() {
        const settings = {
            wallMode: this.wallModeToggle.checked
        };
        localStorage.setItem('snakeGameSettings', JSON.stringify(settings));
    }
    
    loadSettings() {
        const savedSettings = localStorage.getItem('snakeGameSettings');
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                this.wallModeToggle.checked = settings.wallMode || false;
                this.updateWallMode();
            } catch (e) {
                // Se ci sono errori nel parsing, usa le impostazioni di default
                this.wallModeToggle.checked = false;
                this.updateWallMode();
            }
        } else {
            // Impostazioni di default
            this.wallModeToggle.checked = false;
            this.updateWallMode();
        }
    }
}

// Inizializza il gioco quando la pagina è caricata
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
    
    // Rileva se l'app è stata avviata dalla schermata Home
    checkStandaloneMode();
});

// Funzione per rilevare se l'app è in modalità standalone (aggiunta alla schermata Home)
function checkStandaloneMode() {
    const isInStandaloneMode = window.navigator.standalone || 
                               window.matchMedia('(display-mode: standalone)').matches;
    
    if (isInStandaloneMode) {
        // L'app è stata avviata dalla schermata Home
        // Possiamo personalizzare l'esperienza se necessario
        document.body.classList.add('standalone-mode');
        
        // Se necessario, possiamo mostrare un messaggio di benvenuto o altre personalizzazioni
        console.log('App avviata dalla schermata Home');
    }
}

// Gestione del ridimensionamento della finestra
window.addEventListener('resize', () => {
    // Potresti voler adattare il canvas qui se necessario
});
