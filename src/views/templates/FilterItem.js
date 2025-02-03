import { addSelectedFilter } from "../../utils/Filter.js"
import RecipeModel from "../../models/RecipeModel.js"

/**
 * CREATE FILTER ITEM
 * @param {string} category
 * @param {string} itemName
 * @returns li
 */
const FilterItem = (category, itemName) => {
  const container = document.createElement("li")
  container.className = "filter-item"
  const name = document.createElement("p")
  name.textContent = itemName
  container.appendChild(name)

  container.addEventListener("click", () => {
    addSelectedFilter(category, itemName)
  })

  return container
}

/**
 * ADD FILTER ITEM
 * @param {string} category
 * @param {string} itemName
 */
export const addFilterItem = (category, itemName) => {
  const filterMenu = document.getElementById(`filterItems_${category}`)
  const filterItem = FilterItem(category, itemName)
  filterMenu.appendChild(filterItem)
}

/**
 * ADD FILTER ITEMS LIST
 * @param {Object} filter
 */
export const addFilterItems = (filter = {}) => {
  const recipes = RecipeModel.getFilteredRecipes()

  const { category, key } = filter

  const ingredients = RecipeModel.getIngredients(recipes)
  const appliances = RecipeModel.getAppliances(recipes)
  const ustensils = RecipeModel.getUstensils(recipes)

  // Dynamic filter
  const ingredientsFiltered =
    category === "ingredients" && key
      ? ingredients.filter((ingredient) =>
          ingredient.toLowerCase().includes(key.toLowerCase())
        )
      : ingredients

  const appliancesFiltered =
    category === "appliances" && key
      ? appliances.filter((appliance) =>
          appliance.toLowerCase().includes(key.toLowerCase())
        )
      : appliances

  const ustensilsFiltered =
    category === "ustensils" && key
      ? ustensils.filter((ustensil) =>
          ustensil.toLowerCase().includes(key.toLowerCase())
        )
      : ustensils

  document.getElementById("filterItems_ingredients").innerHTML = ""
  document.getElementById("filterItems_appliances").innerHTML = ""
  document.getElementById("filterItems_ustensils").innerHTML = ""

  ingredientsFiltered.forEach((ingredient) =>
    addFilterItem("ingredients", ingredient)
  )
  appliancesFiltered.forEach((appliance) =>
    addFilterItem("appliances", appliance)
  )
  ustensilsFiltered.forEach((ustensil) => addFilterItem("ustensils", ustensil))
}

export default addFilterItems
