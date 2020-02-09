import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';

/*
Global state of the app :
- Search object
- Current recipe object
- Shopping list object
- Liked recipes
*/
const state = {};


// *************************************
// ********* SEARCH CONTROLLER *********
// *************************************

const controlSearch = async () => {
    // Get query from the view
    const query = searchView.getInput();

    if (query) {
        // new search object and add to state
        state.search = new Search(query);

        // prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // search for recipes
            await state.search.getResults();

            // render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert('Soemthing wrong with the search...');
            clearLoader();
        }
        
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline')
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});



// *************************************
// ********* RECIPE CONTROLLER *********
// *************************************

const controlRecipe = async () => {
    // Get ID from the URL
    const id = window.location.hash.replace('#', '');

    if (id) {
        // Prepare UI for changes

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data
            await state.recipe.getRecipe();
            // Calculate servings and time
            state.recipe.calcServings();
            state.recipe.calcTime();
            // Render recipe
            console.log(state.recipe);
        } catch (error) {
            alert('Error processing recipe');
        }
    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));