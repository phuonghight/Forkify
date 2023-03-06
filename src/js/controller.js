import * as model from './model';
import recipeView from './Views/recipeView';
import searchView from './Views/searchView';
import resultsView from './Views/resultsView';
import paginationView from './Views/paginationView';
import bookmarksView from './Views/bookmarksView';
import addRecipeView from './Views/addRecipeView';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());
    bookmarksView.render(model.state.bookmarks);

    const recipe = await model.loadRecipe(id);
    // const { recipe } = model.state;
    console.log(recipe);

    recipeView.render(recipe);
  } catch (error) {
    console.error(error);
    recipeView.renderError(
      'We could not find that recipe. Please try another one!'
    );
  }
}

const controlSearchResults = async () => {
  try {
    const query = searchView.getQuerry();
    if (!query) return;

    resultsView.renderSpinner();

    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage());

    paginationView.render(model.state.search);
  } catch (error) {
    resultsView.renderError(error);
  }
};

const controlPaginationSearchResults = gotoPage => {
  resultsView.render(model.getSearchResultsPage(gotoPage));

  paginationView.render(model.state.search);
};

const controlUpdateServings = newServings => {
  // update
  model.updateServings(newServings);

  // render
  // recipeView.render(model.state.recipe);

  // update
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = () => {
  if (model.state.recipe.bookmarked) {
    model.deleteBookmark(model.state.recipe);
  } else model.addBookmark(model.state.recipe);
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
  model.state.bookmarks.length === 0 &&
    bookmarksView.renderMessage(
      'No bookmarks yet. Find a nice recipe and bookmark it :)'
    );
};

const controlBookmarks = () => {
  if (model.state.bookmarks.length === 0)
    bookmarksView.renderMessage(
      'No bookmarks yet. Find a nice recipe and bookmark it :)'
    );
  else bookmarksView.render(model.state.bookmarks);
};

const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlUpdateServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPaginationSearchResults);
};
init();
