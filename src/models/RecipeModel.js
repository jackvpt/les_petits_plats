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
    return [...new Set(
      recipes.flatMap((recipe) => 
        recipe.ingredients.map((i) => 
          i.ingredient.charAt(0).toUpperCase() + i.ingredient.slice(1).toLowerCase()
        )
      )
    )];
  }
  

  /**
   * GET APPLIANCES FROM RECIPES
   * @param {RecipeModel[]} recipes
   * @returns Set
   */
  static getAppliances(recipes) {
    return [...new Set(
      recipes.map((recipe) => 
        recipe.appliance.charAt(0).toUpperCase() + recipe.appliance.slice(1).toLowerCase()
      )
    )];
  }
  

  /**
   * GET USTENSILS FROM RECIPES
   * @param {RecipeModel[]} recipes
   * @returns Set
   */
  static getUstensils(recipes) {
    return [...new Set(
      recipes.flatMap((recipe) => 
        recipe.ustensils.map((ustensil) => ustensil.charAt(0).toUpperCase() + ustensil.slice(1).toLowerCase())
      )
    )];
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
    /** Start chronometer */
    const startTime = performance.now()
    
    const searchBarFilter = this.normalizeText(selectedFilters.searchBar || "")

    if (
      !searchBarFilter &&
      !selectedFilters.ingredients.size &&
      !selectedFilters.appliances.size &&
      !selectedFilters.ustensils.size
    ) {
    if (
      !searchBarFilter &&
      !selectedFilters.ingredients.size &&
      !selectedFilters.appliances.size &&
      !selectedFilters.ustensils.size
    ) {
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

    const filteredRecipes = recipes.filter((recipe) => {
      const normalizedRecipeName = this.normalizeText(recipe.name)
      const normalizedRecipeDescription = this.normalizeText(recipe.description)
      const recipeIngredients = new Set(
        recipe.ingredients.map((ing) => this.normalizeText(ing.ingredient))
      )
      const normalizedAppliance = this.normalizeText(recipe.appliance)
      const recipeUstensils = new Set(recipe.ustensils.map(this.normalizeText))

      /** Check search bar filter */
      const matchesSearchBar =
        !searchBarFilter ||
        normalizedRecipeName.includes(searchBarFilter) ||
        normalizedRecipeDescription.includes(searchBarFilter) ||
        [...recipeIngredients].some((ing) => ing.includes(searchBarFilter))

      /** Check ingredients filter */
      const matchesIngredients = [...ingredientsFilter].every((filter) =>
        recipeIngredients.has(filter)
      )

      /** Check appliance filter */
      const matchesAppliance =
        !appliancesFilter.size || appliancesFilter.has(normalizedAppliance)

      /** Check ustensils filter */
      const matchesUstensils = [...ustensilsFilter].every((filter) =>
        recipeUstensils.has(filter)
      )

      return (
        matchesSearchBar &&
        matchesIngredients &&
        matchesAppliance &&
        matchesUstensils
      )
    })

    const endTime = performance.now()
    console.log(`Execution delay: ${(endTime - startTime).toFixed(2)} ms`)
    console.log(`Filtered recipes count: ${filteredRecipes.length}`)

    return filteredRecipes
  }
}
