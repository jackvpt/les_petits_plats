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
    const ingredientsFilter = Array.from(selectedFilters.ingredients).map(
      this.normalizeText
    )
    const appliancesFilter = Array.from(selectedFilters.appliances).map(
      this.normalizeText
    )
    const ustensilsFilter = Array.from(selectedFilters.ustensils).map(
      this.normalizeText
    )

    return recipes.filter((recipe) => {
      const normalizedRecipeName = this.normalizeText(recipe.name)
      const normalizedRecipeDescription = this.normalizeText(recipe.description)
      const normalizedRecipeIngredients = recipe.ingredients.map((ing) =>
        this.normalizeText(ing.ingredient)
      )

      /** Check search bar filter */
      const matchesSearchBar =
        !searchBarFilter ||
        normalizedRecipeName.includes(searchBarFilter) ||
        normalizedRecipeDescription.includes(searchBarFilter) ||
        normalizedRecipeIngredients.includes(searchBarFilter)

      /** Check ingredients filter */
      const recipeIngredients = recipe.ingredients.map((ing) =>
        this.normalizeText(ing.ingredient)
      )
      const matchesIngredients = ingredientsFilter.every((filter) =>
        recipeIngredients.includes(filter)
      )

      /** Check appliance filter */
      const matchesAppliance =
        !appliancesFilter.length ||
        appliancesFilter.includes(this.normalizeText(recipe.appliance))

      /** Check ustensils filter */
      const recipeUstensils = recipe.ustensils.map(this.normalizeText)
      const matchesUstensils = ustensilsFilter.every((filter) =>
        recipeUstensils.includes(filter)
      )

      /** Return true if all filters match */
      return (
        matchesSearchBar &&
        matchesIngredients &&
        matchesAppliance &&
        matchesUstensils
      )
    })
  }
}
