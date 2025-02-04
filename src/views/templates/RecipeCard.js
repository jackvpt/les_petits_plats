/**
 * RENDER RECIPE CARD
 * @param {RecipeModel} recipe
 * @returns article
 */
const RecipeCard = (recipe) => {
  /** Main container (article) */
  const article = document.createElement("article")
  article.className = "col"

  /** Bootstrap card */
  const card = document.createElement("div")
  card.className = "card rounded-4"

  /** Recipe image */
  const image = document.createElement("img")
  image.className = "card-img-top rounded-top-4"
  image.src = `./src/assets/images/recipes/${recipe.image}`
  image.alt = recipe.name

  /** Recipe time */
  const time = document.createElement("div")
  time.className = "recipe-time"
  time.textContent = `${recipe.time}min`
  card.appendChild(time)

  /** Content container */
  const body = document.createElement("div")
  body.className = "card-body"

  /** Recipe title */
  const title = document.createElement("h2")
  title.className = "card-title mb-4"
  title.textContent = recipe.name

  /** Recipe description */
  const descriptionTitle = document.createElement("h3")
  descriptionTitle.className = "recipe-subtitle"
  descriptionTitle.textContent = "RECETTE"
  const description = document.createElement("p")
  description.className = "recipe-description mb-4"
  description.textContent = recipe.description

  /** Recipe ingredients */
  const ingredientsTitle = document.createElement("h3")
  ingredientsTitle.className = "recipe-subtitle"
  ingredientsTitle.textContent = "INGRÉDIENTS"
  const ingredients = document.createElement("div")
  ingredients.className = "row row-cols-6 gy-3"

  recipe.ingredients.forEach((ingredient) => {
    /** Ingredients container */
    const ingredientDiv = document.createElement("div")
    ingredientDiv.className = "col-6"

    /** Ingredient name */
    const ingredientName = document.createElement("h4")
    ingredientName.className = "ingredient-name"
    ingredientName.textContent = ingredient.ingredient

    /** Ingredient quantity & unit */
    const ingredientQuantity = document.createElement("div")
    ingredientQuantity.className = "ingredient-quantity"
    let unit = ""
    ingredient.unit ? (unit = ingredient.unit) : (unit = "")
    unit.length >= 3 ? (unit = " " + unit) : (unit = unit)
    ingredientQuantity.textContent = `${
      ingredient.quantity ? ingredient.quantity : ""
    }${unit}`

    ingredientDiv.appendChild(ingredientName)
    ingredientDiv.appendChild(ingredientQuantity)
    ingredients.appendChild(ingredientDiv)
  })

  body.appendChild(title)
  body.appendChild(descriptionTitle)
  body.appendChild(description)
  body.appendChild(ingredientsTitle)
  body.appendChild(ingredients)
  card.appendChild(image)
  card.appendChild(body)
  article.appendChild(card)

  return article
}

export default RecipeCard
