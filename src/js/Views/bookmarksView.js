import previewView from './previewView';
import View from './View';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');

  _generateMarkup = () => {
    const id = window.location.hash.slice(1);
    return this._data.map(bookmark => previewView.render(bookmark, false)).join('');
  };
}

export default new BookmarksView();
