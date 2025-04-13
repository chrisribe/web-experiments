
  // Balloon component that inflates until popped
DFlow.createComponent('balloon-game', {
    template: `
      <div class="game-container">
        <div class="balloon" id="balloon"></div>
        <div class="score">Score: <span id="score">0</span></div>
        <button id="inflate">Inflate!</button>
      </div>
    `,
    styles: `
      .game-container { text-align: center; padding: 20px; }
      .balloon { 
        width: 100px; height: 100px; 
        background: red;
        border-radius: 50%;
        margin: 0 auto 20px;
        transition: transform 0.2s;
      }
      button { padding: 10px 20px; font-size: 18px; }
    `,
    methods: {
      connectedCallback() {
        this.id = this.getAttribute('id') || 'balloon-game';
        this.size = 1.0;
        this.score = 0;
        this.setupListeners();
      },
      
      setupListeners() {
        this.shadowRoot.getElementById('inflate').addEventListener('click', () => {
          this.inflateBallon();
        });
        
        this.shadowRoot.getElementById('balloon').addEventListener('click', () => {
          this.popBalloon();
        });
      },
      
      inflateBallon() {
        this.size += 0.1;
        const balloon = this.shadowRoot.getElementById('balloon');
        balloon.style.transform = `scale(${this.size})`;
        
        if (this.size > 2.0) {
          this.popBalloon();
        }
        
        DFlow.dispatch('balloon-inflated', { size: this.size });
      },
      
      popBalloon() {
        this.score++;
        this.shadowRoot.getElementById('score').textContent = this.score;
        this.size = 1.0;
        
        const balloon = this.shadowRoot.getElementById('balloon');
        balloon.style.transform = `scale(${this.size})`;
        
        DFlow.dispatch('balloon-popped', { score: this.score, gameId: this.id });
      }
    }
  });

  // Add this to components.js
DFlow.createComponent('score-tracker', {
    template: `
      <div class="tracker-container">
        <h3>Game Scores</h3>
        <div id="scores-list"></div>
      </div>
    `,
    styles: `
      .tracker-container { 
        border: 1px solid #ccc; 
        padding: 10px; 
        margin: 10px 0; 
        background: #f9f9f9; 
      }
      .game-score { 
        margin: 5px 0; 
        padding: 5px; 
        background: #e9e9e9; 
      }
    `,
    methods: {
      connectedCallback() {
        this.scores = {};
        this.setupListeners();
      },
      
      setupListeners() {
        DFlow.listen('balloon-popped', (e) => {
          const gameId = e.detail.gameId || 'unknown';
          this.scores[gameId] = (this.scores[gameId] || 0) + 1;
          this.updateScores();
        });
      },
      
      updateScores() {
        const list = this.shadowRoot.getElementById('scores-list');
        list.innerHTML = '';
        
        Object.entries(this.scores).forEach(([gameId, score]) => {
          const scoreEl = document.createElement('div');
          scoreEl.className = 'game-score';
          scoreEl.textContent = `Game ${gameId}: ${score} pops`;
          list.appendChild(scoreEl);
        });
      }
    }
  });