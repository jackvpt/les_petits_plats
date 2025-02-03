import SelectedFilterItem from "../views/templates/SelectedFilterItem.js"
import FilterTag from "../views/templates/FilterTag.js"
import { updateRecipesList } from "../controllers/AppController.js"

/**
 * SET SELECTED FILTERS
 */
export const selectedFilters = {
  searchBar: "",
  ingredients: new Set(),
  appliances: new Set(),
  ustensils: new Set(),
}

/**
 * ADD A FILTER TO SELECTED FILTERS LIST
 * @param {string} category 
 * @param {string} value 
 */
export function addSelectedFilter(category, value) {
  selectedFilters[category].add(value)

  const selectedList = document.getElementById(`selectedItems_${category}`)
  selectedList.innerHTML = ""
  selectedFilters[category].forEach((item) => {
    const selectedItem = SelectedFilterItem(category, item)
    selectedList.appendChild(selectedItem)
  })

  updateFilterTags()
}

/**
 * REMOVE FILTER FROM SELECTER FILTERS LIST
 * @param {string} category 
 * @param {string} value 
 */
export function removeSelectedFilter(category, value) {
  selectedFilters[category].delete(value)

  const selectedList = document.getElementById(`selectedItems_${category}`)
  selectedList.innerHTML = ""

  selectedFilters[category].forEach((item) => {
    const selectedItem = SelectedFilterItem(category, item)
    selectedList.appendChild(selectedItem)
  })

  updateFilterTags()
}

/**
 * UPDATE FILTER TAGS
 */
export function updateFilterTags() {
  const container = document.getElementById("filter-tags")
  container.innerHTML = ""
  Object.entries(selectedFilters)
  .filter(([category])=> category !== "searchBar")
  .forEach(([category, items]) => {
    items.forEach((item) => {
      const filterTag = FilterTag(category, item)
      container.appendChild(filterTag)
    })
  })

  /** Update displayed recipes */
  updateRecipesList()
}
