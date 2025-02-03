import { removeSelectedFilter } from "../../utils/Filter.js"

/**
 * CREATE FILTER TAG
 * @param {string} tagName
 * @returns div
 */
const FilterTag = (category, tagName) => {
  const container = document.createElement("div")
  container.className = "filter-tag"
  const name = document.createElement("p")
  name.textContent = tagName
  const tagRemoveButton = document.createElement("button")
  tagRemoveButton.className = "itemRemove-button"
  tagRemoveButton.innerHTML = `<i class="fa-solid fa-xmark"></i>`
  container.appendChild(name)
  container.appendChild(tagRemoveButton)

  tagRemoveButton.addEventListener("click", () => {
    removeSelectedFilter(category, tagName)
  })

  return container
}

export default FilterTag
