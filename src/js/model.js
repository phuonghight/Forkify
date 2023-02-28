import { API_URL, REC_PER_PAGE } from './config';
import { getJSON } from './helpers';

export class Recipe {
  constructor(data) {
    this.id = data.id;
    this.cookingTime = data.cooking_time;
    this.img = data.image_url;
    this.ingredients = data.ingredients;
    this.publisher = data.publisher;
    this.servings = data.servings;
    this.source_url = data.source_url;
    this.title = data.title;
  }
}

export const state = {
  recipe: undefined,
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPage: REC_PER_PAGE,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const urlAPI = `${API_URL}${id}`;

    const { data } = await getJSON(urlAPI);

    state.recipe = new Recipe(data.recipe);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    return state.recipe;
  } catch (error) {}
};

export const loadSearchResults = async query => {
  try {
    state.search.query = query;
    const { data } = await getJSON(`${API_URL}?search=${query}`);

    if (data.recipes.length == 0) throw new Error();

    state.search.results = data.recipes.map(rec => {
      return {
        id: rec.id,
        img_url: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
      };
    });

    state.search.page = 1;
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPage = (page = state.search.page) => {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPage;
  const end = page * state.search.resultsPage;

  return state.search.results.slice(start, end);
};

export const updateServings = newServings => {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

export const addBookmark = recipe => {
  state.recipe.bookmarked = true;
  state.bookmarks.push(recipe);
};

export const deleteBookmark = recipe => {
  state.recipe.bookmarked = false;
  state.bookmarks.splice(state.bookmarks.indexOf(recipe) - 1, 1);
};
