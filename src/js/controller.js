import icons from '../img/icons.svg';

import * as model from './model';
import recipeView from './Views/recipeView';
import searchView from './Views/searchView';
import resultsView from './Views/resultsView';
import paginationView from './Views/paginationView';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());

    const recipe = await model.loadRecipe(id);
    // const { recipe } = model.state;
    console.log(recipe);

    recipeView.render(recipe);
  } catch (error) {
    console.error(error);
    recipeView.renderError();
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
    resultsView.renderError();
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
  if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe);
  else model.addBookmark(model.state.recipe);
  console.log(model.state.bookmarks);
  recipeView.update(model.state.recipe);
};

const init = () => {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlUpdateServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPaginationSearchResults);
};

init();
