import icons from '../img/icons.svg';

import * as model from './model.js';
import recipeView from './Views/recipeView.js';
import searchView from './Views/searchView.js';
import resultsView from './Views/resultsView.js';
import paginationView from './Views/paginationView';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

async function controlRecipes() {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    await model.loadRecipe(id);
    const { recipe } = model.state;

    recipeView.render(recipe);
  } catch (error) {
    recipeView.renderError();
  }
}

const controlSearchResults = async () => {
  try {
    const query = searchView.getQuerry();
    if (!query) return;

    resultsView.renderSpinner();

    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage(model.state.search.page));

    paginationView.render(model.state.search);

    paginationView.addHandlerPagination(controlPaginationSearchResults);
  } catch (error) {
    resultsView.renderError();
  }
};

const controlPaginationSearchResults = async e => {
  if (e.target.closest('.pagination__btn--prev')) {
    model.state.search.page--;

    resultsView.render(model.getSearchResultsPage(model.state.search.page));

    paginationView.render(model.state.search);

    paginationView.addHandlerPagination(controlPaginationSearchResults);
  } else if (e.target.closest('.pagination__btn--next')) {
    model.state.search.page++;

    resultsView.render(model.getSearchResultsPage(model.state.search.page));

    paginationView.render(model.state.search);

    paginationView.addHandlerPagination(controlPaginationSearchResults);
  }
};

const init = () => {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};

init();
