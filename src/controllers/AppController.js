import RecipeModel from "../models/RecipeModel.js"
import { renderRecipesList } from "../views/RecipesView.js"
import FilterMenu from "../views/templates/FilterMenu.js"
import FilterResult from "../views/templates/FilterResult.js"
import addFilterItems from "../views/templates/FilterItem.js"
import { selectedFilters } from "../utils/Filter.js"

/** GET DOM ELEMENTS */
/** Search Bar */
const inputSearch = document.getElementById("inputSearch")
const button_searchClear = document.getElementById("searchClear-button")

/** Filter Bar */
const containerFilterBar = document.getElementById("container-filterBar")
const containerFilterBarButtons = document.getElementById(
  "container-filterBar__buttons"
)

/**
 * APP CONTROLLER
 */
export default class AppController {
  static init() {
    const recipes = RecipeModel.getRecipes()

    /** Filter Bar */
    containerFilterBarButtons.appendChild(
      FilterMenu("ingredients", "Ingrédients")
    )
    containerFilterBarButtons.appendChild(FilterMenu("appliances", "Appareils"))
    containerFilterBarButtons.appendChild(FilterMenu("ustensils", "Ustensiles"))

    /** Filter items */
    addFilterItems()

    /** Filter result */
    containerFilterBar.appendChild(FilterResult())

    updateRecipesList()

    setEventListeners()
  }
}

/**
 * SET EVENT LISTENERS
 */
const setEventListeners = () => {
  /** Input Search */
  inputSearch.addEventListener("input", inputSearchHandler)
  button_searchClear.addEventListener("click", resetSearchBar)
}

/**
 * HANDLE SEARCHBAR INPUT
 */
const inputSearchHandler = () => {
  const searchValue = inputSearch.value
  if (searchValue.length >= 3) {
    button_searchClear.style.display = "block"
    selectedFilters.searchBar = searchValue
  } else {
    button_searchClear.style.display = "none"
    selectedFilters.searchBar = ""
  }
  updateRecipesList()
}

/**
 * RESET SEARCHBAR INPUT
 */
const resetSearchBar = () => {
  inputSearch.value = ""
  button_searchClear.style.display = "none"
  selectedFilters.searchBar = ""
  updateRecipesList()
}

/**
 * UPDATE RECIPES LIST
 */
export const updateRecipesList = () => {
  const recipes = RecipeModel.getFilteredRecipes()
  renderRecipesList(recipes)

  /** Update filter items */
  addFilterItems()

  /** Display filter result */
  const filterResult = document.getElementById("filterResult")
  filterResult.textContent = `${recipes.length} recette${
    recipes.length > 1 ? "s" : ""
  }`
}
