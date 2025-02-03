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

    /** Start chronometer */
    const startTime = performance.now()

    const filteredRecipes = []

    recipes.forEach((recipe) => {
      const normalizedRecipeName = this.normalizeText(recipe.name)
      const normalizedRecipeDescription = this.normalizeText(recipe.description)
      const recipeIngredients = new Set()
      const recipeUstensils = new Set()

      // Normaliser les ingrédients et les ajouter dans un Set
      recipe.ingredients.forEach((ing) => {
        recipeIngredients.add(this.normalizeText(ing.ingredient))
      })

      // Normaliser les ustensiles et les ajouter dans un Set
      recipe.ustensils.forEach((ust) => {
        recipeUstensils.add(this.normalizeText(ust))
      })

      const normalizedAppliance = this.normalizeText(recipe.appliance)

      let matchesSearchBar = false
      if (!searchBarFilter) {
        matchesSearchBar = true
      } else if (
        normalizedRecipeName.includes(searchBarFilter) ||
        normalizedRecipeDescription.includes(searchBarFilter)
      ) {
        matchesSearchBar = true
      } else {
        recipeIngredients.forEach((ing) => {
          if (ing.includes(searchBarFilter)) {
            matchesSearchBar = true
          }
        })
      }

      let matchesIngredients = true
      ingredientsFilter.forEach((filter) => {
        if (!recipeIngredients.has(filter)) {
          matchesIngredients = false
        }
      })

      let matchesAppliance =
        appliancesFilter.size === 0 || appliancesFilter.has(normalizedAppliance)

      let matchesUstensils = true
      ustensilsFilter.forEach((filter) => {
        if (!recipeUstensils.has(filter)) {
          matchesUstensils = false
        }
      })

      if (
        matchesSearchBar &&
        matchesIngredients &&
        matchesAppliance &&
        matchesUstensils
      ) {
        filteredRecipes.push(recipe)
      }
    })

    const endTime = performance.now()
    console.log(`Execution delay: ${(endTime - startTime).toFixed(2)} ms`)
    console.log(`Filtered recipes count: ${filteredRecipes.length}`)

    return filteredRecipes
  }
}
