import { addFilterItems } from "./FilterItem.js"

/**
 * CREATE FILTER MENU
 * @param {string} category
 * @param {string} caption
 * @returns div
 */
const FilterMenu = (category, caption) => {
  /** Global container */
  const container = document.createElement("div")
  container.className = `container-filterBar__buttons-${category}`

  /** Menu trigger (button) */
  const filterButton = document.createElement("div")
  filterButton.id = `filter-${category}`
  filterButton.className = "filterButton"
  filterButton.addEventListener("click", () => showFilterMenu(category))

  /** Button name */
  const filterButtonName = document.createElement("div")
  filterButtonName.className = "filterButton-name"
  filterButtonName.textContent = caption

  /** Button icon */
  const iconExpandButton = document.createElement("i")
  iconExpandButton.id = `filterChevron-${category}`
  iconExpandButton.className = "fa-solid fa-chevron-down"

  filterButton.appendChild(filterButtonName)
  filterButton.appendChild(iconExpandButton)
  container.appendChild(filterButton)

  /** Filter Menu */
  const filterMenu = document.createElement("div")
  filterMenu.id = `filterMenu-${category}`
  filterMenu.className = "filterMenu"

  /** Search Bar */
  const filterMenuSearchBar = document.createElement("div")
  filterMenuSearchBar.className = "filterMenu__searchBar"

  /** Form */
  const form = document.createElement("div")
  form.className = "searchBar-category"

  /** Input */
  const input = document.createElement("input")
  input.id = `input_${category}`
  input.className = "input-filter"
  input.type = "text"
  input.addEventListener("input", () => inputFilterHandler(category))
  form.appendChild(input)

  /** Clear button */
  const clearButton = document.createElement("button")
  clearButton.id = `${category}-clearButton`
  clearButton.className = "buttonClear-filter"
  clearButton.addEventListener("click", () => resetInputFilter(category))

  /** Clear button icon */
  const iconClearButton = document.createElement("i")
  iconClearButton.className = "fa-solid fa-xmark"

  clearButton.appendChild(iconClearButton)
  form.appendChild(clearButton)

  /** Search icon */
  const iconSearch = document.createElement("i")
  iconSearch.className = "fa-solid fa-magnifying-glass filterSearch-icon"
  form.appendChild(iconSearch)

  filterMenuSearchBar.appendChild(form)

  /** Selected items list */
  const selectedList = document.createElement("ul")
  selectedList.id = `selectedItems_${category}`
  selectedList.className = "selected-items"

  filterMenu.appendChild(selectedList)

  /** Items list */
  const filterList = document.createElement("ul")
  filterList.id = `filterItems_${category}`
  filterList.className = "filter-items"

  filterMenu.appendChild(filterMenuSearchBar)
  filterMenu.appendChild(filterList)

  container.appendChild(filterMenu)
  return container
}

/**
 * SHOW FILTER MENU
 * @param {string} category
 */
const showFilterMenu = (category) => {
  const filterMenu = document.getElementById(`filterMenu-${category}`)
  filterMenu.classList.toggle("open")
  document
    .getElementById(`filterChevron-${category}`)
    .classList.toggle("rotate")
}

/**
 * HANDLE FILTER INPUT
 * @param {string} category
 */
const inputFilterHandler = (category) => {
  const searchValue = document.getElementById(`input_${category}`).value
  if (searchValue.length >= 3) {
    document.getElementById(`${category}-clearButton`).style.display = "block"
    addFilterItems({ category, key: searchValue })
  } else {
    document.getElementById(`${category}-clearButton`).style.display = "none"
    addFilterItems()
  }
}

const resetInputFilter = (category) => {
  document.getElementById(`input_${category}`).value = ""
  document.getElementById(`${category}-clearButton`).style.display = "none"
  addFilterItems()
}

export default FilterMenu
