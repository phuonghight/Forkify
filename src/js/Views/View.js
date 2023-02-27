import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  render(data) {
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update = data => {
    this._data = data;
    const markup = this._generateMarkup();

    const newDom = document.createRange().createContextualFragment(markup);
    const newElements = [...newDom.querySelectorAll('*')];
    const curElements = [...this._parentElement.querySelectorAll('*')];

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      if (
        !newEl.isEqualNode(curEl) 
      ) {
        curEl.innerHTML = newEl.innerHTML;
      }
    });
  };

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div> 
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = 'No recipes found for your query. Please try again!') {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
