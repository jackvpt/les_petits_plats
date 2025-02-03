import { removeSelectedFilter } from "../../utils/Filter.js"

/**
 * CREATE SELECTED FILTER ITEM
 * Used in top of filter menu to display selected filters
 * @param {string} category 
 * @param {string} itemName 
 * @returns li
 */
const SelectedFilterItem = (category, itemName) => {
  const container = document.createElement("li")
  container.className = "selectedFilter-item"
  const name = document.createElement("p")
  name.textContent = itemName
  container.appendChild(name)

  const removeButton = document.createElement("button")
  removeButton.id = `removeButton_${category}_${itemName}`
  removeButton.className = "selectedItem-removeButton"
  const removeButtonIcon = document.createElement("i")
  removeButtonIcon.className = "fa-solid fa-circle-xmark"
  removeButton.appendChild(removeButtonIcon)

  container.appendChild(removeButton)

  removeButton.addEventListener("click", () => {
    removeSelectedFilter(category, itemName)
  })

  return container
}

export default SelectedFilterItem
