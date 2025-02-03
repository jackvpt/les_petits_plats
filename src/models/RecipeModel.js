import recipes from "../data/recipes.js"
import { selectedFilters } from "../utils/Filter.js"

export default class RecipeModel {
  /**
   * MANAGE RECIPE MODEL
   * @param {Object} data
   */
  constructor(data) {
    this.id = data.id
    this.image = data.image
    this.name = data.name
    this.servings = data.servings
    this.ingredients = data.ingredients
    this.time = data.time
    this.description = data.description
    this.appliance = data.appliance
    this.ustensils = data.ustensils
  }

  /**
   * GET ALL RECIPES (UNFILTERED)
   * @returns {Array} recipes
   */
  static getRecipes() {
    return recipes.map((recipe) => new RecipeModel(recipe))
  }

  /**
   * GET INGREDIENTS FROM RECIPES
   * @param {RecipeModel[]} recipes
   * @returns Set
   */
  static getIngredients(recipes) {
    return [
      ...new Set(
        recipes.flatMap((recipe) => recipe.ingredients.map((i) => i.ingredient))
      ),
    ]
  }

  /**
   * GET APPLIANCES FROM RECIPES
   * @param {RecipeModel[]} recipes
   * @returns Set
   */
  static getAppliances(recipes) {
    return [...new Set(recipes.map((recipe) => recipe.appliance))]
  }

  /**
   * GET USTENSILS FROM RECIPES
   * @param {RecipeModel[]} recipes
   * @returns Set
   */
  static getUstensils(recipes) {
    return [...new Set(recipes.flatMap((recipe) => recipe.ustensils))]
  }

  /**
   * NORMALIZE TEXT
   * @param {string} text
   * @returns string
   */
  static normalizeText(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
  }

  /**
   * GET FILTERED RECIPES
   * Based on selectedFilters
   * @returns {Array} recipes
   */
  static getFilteredRecipes() {
    const searchBarFilter = this.normalizeText(selectedFilters.searchBar || "")

    if (!searchBarFilter && !selectedFilters.ingredients.size && !selectedFilters.appliances.size && !selectedFilters.ustensils.size) {
      return recipes.map((recipe) => new RecipeModel(recipe))
    }

    const ingredientsFilter = new Set(
      Array.from(selectedFilters.ingredients).map(this.normalizeText)
    )
    const appliancesFilter = new Set(
      Array.from(selectedFilters.appliances).map(this.normalizeText)
    )
    const ustensilsFilter = new Set(
      Array.from(selectedFilters.ustensils).map(this.normalizeText)
    )

    /** Start chronometer */
    const startTime = performance.now()

    const filteredRecipes = recipes

    const endTime = performance.now()
    console.log(`Execution delay: ${(endTime - startTime).toFixed(2)} ms`)
    console.log(`Filtered recipes count: ${filteredRecipes.length}`)

    return filteredRecipes
  }
}
