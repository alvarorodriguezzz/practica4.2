// news-viewer.js

class NewsViewer extends HTMLElement {
  constructor() {
    super();
    this.articles = [];
  }

  connectedCallback() {
    this.loadAllArticles();
    this.setupSectionLinks();
  }

  async loadAllArticles() {
    const url = this.textContent;
    try {
      // URLs para las categorías
      const urls = [
        'https://news-foniuhqsba-uc.a.run.app/' + url
      ];

      // Cargar todos los artículos desde las URLs
      const requests = urls.map(url => fetch(url));
      const responses = await Promise.all(requests);
      const jsonResponses = await Promise.all(responses.map(res => res.json()));

      // Guardar todos los artículos
      this.articles = jsonResponses.flat();

      // Renderizar todos los artículos inicialmente
      this.renderArticles(this.articles);
    } catch (error) {
      console.error('Error:', error);
      this.innerHTML = `<p>Error al cargar los artículos. Inténtelo nuevamente más tarde.</p>`;
    }
  }



  renderArticles(articles) {
    const template = document.getElementById('article-template');

    // Limpiar contenido existente
    this.innerHTML = '';

    if (articles.length === 0) {
      this.innerHTML = '<p>No hay artículos disponibles para esta categoría.</p>';
      return;
    }

    articles.forEach(article => {
      // Clonar el contenido de la plantilla
      const articleContent = document.importNode(template.content, true);

      // Rellenar la plantilla con los datos del artículo
      articleContent.querySelector('.title').textContent = article.headline;
      articleContent.querySelector('.author').textContent = article.author;
      articleContent.querySelector('.description').innerHTML = article.body;

      // Añadir el artículo al componente
      this.appendChild(articleContent);
    });
  }
}

// Definir el elemento personalizado
customElements.define('news-viewer', NewsViewer);
