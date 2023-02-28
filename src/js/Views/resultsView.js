import View from './View';
import previewView from './previewView';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');

  _generateMarkup = () => {
    const id = window.location.hash.slice(1);
    return this._data.map(rec => previewView.render(rec, false)).join('');
  };
}

export default new ResultsView();
