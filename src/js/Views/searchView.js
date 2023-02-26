import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';

class SearchView {
  _parentElement = document.querySelector('.search');

  getQuerry = () => {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  };

  _clearInput = () =>
    (this._parentElement.querySelector('.search__field').value = '');

  addHandlerSearch = handler => {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  };
}

export default new SearchView();
