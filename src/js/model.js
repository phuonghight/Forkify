import { API_URL, KEY, REC_PER_PAGE } from './config';
import { AJAX } from './helpers';

export class Recipe {
  constructor(data) {
    this.id = data.id;
    this.cooking_time = +data.cooking_time;
    this.image_url = data.image_url;
    this.ingredients = data.ingredients;
    this.publisher = data.publisher;
    this.servings = +data.servings;
    this.source_url = data.source_url;
    this.title = data.title;
    if (data.key) this.key = data.key;
  }
}
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

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
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = new Recipe(data.data.recipe);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    return state.recipe;
  } catch (error) {}
};

export const loadSearchResults = async query => {
  try {
    state.search.query = query;
    const { data } = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    if (data.recipes.length == 0)
      throw new Error('No recipes found for your query. Please try again!');

    state.search.results = data.recipes.map(rec => {
      return {
        id: rec.id,
        image_url: rec.image_url,
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
  persistBookmark();
};

export const deleteBookmark = recipe => {
  state.recipe.bookmarked = false;
  const pos = state.bookmarks.indexOf(
    state.bookmarks.find(bookmark => bookmark.id === recipe.id)
  );
  state.bookmarks.splice(pos, 1);
  persistBookmark();
};

const persistBookmark = () => {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const init = () => {
  const json = localStorage.getItem('bookmarks');
  if (!json) return;
  state.bookmarks = JSON.parse(json);
};
init();

const clearBookmarks = () => {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async newRecipe => {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(ing => ing[0].startsWith('ingredient') && ing[1] !== '')
      .map(entry => {
        const [quantity, unit, description] = entry[1]
          .replaceAll(' ', '')
          .split(',');
        return { quantity: +quantity || null, unit, description };
      });

    // const recipe = {
    //   title: newRecipe.title,
    //   source_url: newRecipe.sourceUrl,
    //   image_url: newRecipe.imageUrl,
    //   publisher: newRecipe.publisher,
    //   cooking_time: +newRecipe.cookingTime,
    //   servings: +newRecipe.servings,
    //   ingredients,
    // };

    const recipe = new Recipe({ ...newRecipe, ingredients });

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = new Recipe(data.data.recipe);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
