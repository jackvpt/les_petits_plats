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

    /** Checks if all filters are empty */
    if (
      !searchBarFilter &&
      !selectedFilters.ingredients.size &&
      !selectedFilters.appliances.size &&
      !selectedFilters.ustensils.size
    ) {
      return recipes.map((recipe) => new RecipeModel(recipe))
    }

    /** Start chronometer */
    const startTime = performance.now()

    /** Normalize filters */
    let ingredientsFilter = new Set()
    selectedFilters.ingredients.forEach((ingredient) => {
      ingredientsFilter.add(this.normalizeText(ingredient))
    })
    let appliancesFilter = new Set()
    selectedFilters.appliances.forEach((appliance) => {
      appliancesFilter.add(this.normalizeText(appliance))
    })
    let ustensilsFilter = new Set()
    selectedFilters.ustensils.forEach((ustensil) => {
      ustensilsFilter.add(this.normalizeText(ustensil))
    })

    const filteredRecipes = []

    for (let idx = 0; idx < recipes.length; idx++) {
      const recipe = recipes[idx]
      const normalizedRecipeName = this.normalizeText(recipe.name)
      const normalizedRecipeDescription = this.normalizeText(recipe.description)
      const recipeIngredients = new Set()
      const recipeUstensils = new Set()

      /** Normalize ingrédients and adding in a Set */
      for (let idx = 0; idx < recipe.ingredients.length; idx++) {
        recipeIngredients.add(
          this.normalizeText(recipe.ingredients[idx].ingredient)
        )
      }

      /** Normalize ustensils and adding in a Set */
      for (let idx = 0; idx < recipe.ustensils.length; idx++) {
        recipeUstensils.add(this.normalizeText(recipe.ustensils[idx]))
      }

      /** Nomalize appliances */
      const normalizedAppliance = this.normalizeText(recipe.appliance)

      /** Search from global search bar value */
      let matchesSearchBar = false
      if (!searchBarFilter) {
        matchesSearchBar = true
      } else if (
        normalizedRecipeName.includes(searchBarFilter) ||
        normalizedRecipeDescription.includes(searchBarFilter)
      ) {
        matchesSearchBar = true
      } else {
        recipeIngredients.forEach((ingredient) => {
          if (ingredient.includes(searchBarFilter)) {
            matchesSearchBar = true
          }
        })
      }

      /** Search from ingredients filter */
      let matchesIngredients = true
      ingredientsFilter.forEach((ingredient) => {
        if (!recipeIngredients.has(ingredient)) {
          matchesIngredients = false
        }
      })

      /** Search from appliance filter */
      let matchesAppliance =
        appliancesFilter.size === 0 || appliancesFilter.has(normalizedAppliance)

      /** Search from ustensils filter */
      let matchesUstensils = true

      ustensilsFilter.forEach((ustensil) => {
        if (!recipeUstensils.has(ustensil)) {
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
    }

    const endTime = performance.now()
    console.log(`Execution delay: ${(endTime - startTime).toFixed(2)} ms`)
    console.log(`Filtered recipes count: ${filteredRecipes.length}`)

    return filteredRecipes
  }
}
