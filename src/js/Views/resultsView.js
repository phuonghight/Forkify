import View from './View';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');

  _generateMarkup = () => {
    const id = window.location.hash.slice(1);
    return this._data
      .map(
        rec => `
        <li class="preview">
            <a class="preview__link ${
              rec.id === id ? 'preview__link--active' : ''
            }" href="#${rec.id}">
            <figure class="preview__fig">
                <img src="${rec.img_url}" alt="Test" />
            </figure>
            <div class="preview__data">
                <h4 class="preview__title">${rec.title}</h4>
                <p class="preview__publisher">${rec.publisher}</p>
                
            </div>
            </a>
        </li>
    `
      )
      .join('');
  };
}

export default new ResultsView();
