(function() {
  // 1. DEFINE and REGISTER the events for the theme feature
  const themeEventNames = ['theme:changed'];
  EventBus.register(themeEventNames);

  // 2. DEFINE the ThemeSwitcher Web Component
  class ThemeSwitcher extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.render();
    }

    connectedCallback() {
      this.shadowRoot.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', (e) => {
          const theme = e.target.dataset.theme;
          EventBus.dispatch('theme:changed', { theme: theme });
        });
      });
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>
          .theme-controls { display: flex; gap: 10px; padding: 10px; background: #eee; border-radius: 8px; }
          button { padding: 8px 15px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; }
          button:hover { background: #ddd; }
        </style>
        <div class="theme-controls">
          <button data-theme="light">Light</button>
          <button data-theme="dark">Dark</button>
          <button data-theme="blue">Blue</button>
        </div>
      `;
    }
  }
  customElements.define('theme-switcher', ThemeSwitcher);

  // 3. DEFINE the ThemedContent Web Component
  class ThemedContent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.handleThemeChange = this.handleThemeChange.bind(this);
      this.render();
    }

    connectedCallback() {
      EventBus.listen('theme:changed', this.handleThemeChange);
    }

    disconnectedCallback() {
      EventBus.remove('theme:changed', this.handleThemeChange);
    }

    handleThemeChange(event) {
      const theme = event.detail.theme;
      const themes = {
        light: { background: '#fff', color: '#333', borderColor: '#ddd' },
        dark: { background: '#333', color: '#fff', borderColor: '#555' },
        blue: { background: '#e6f2ff', color: '#003366', borderColor: '#99c2ff' }
      };
      const styles = themes[theme] || themes.light;
      const wrapper = this.shadowRoot.querySelector('.wrapper');
      wrapper.style.backgroundColor = styles.background;
      wrapper.style.color = styles.color;
      wrapper.style.borderColor = styles.borderColor;
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>
          .wrapper {
            display: block;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            transition: all 0.3s ease-in-out;
          }
        </style>
        <div class="wrapper">
          <slot></slot>
        </div>
      `;
    }
  }
  customElements.define('themed-content', ThemedContent);

})();
