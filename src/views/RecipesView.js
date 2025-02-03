import RecipeCard from "./templates/recipeCard.js"

/**
 * POPULATE RECIPES CONTAINER
 * @param {RecipeModel[]} recipes
 */
export const renderRecipesList = (recipes) => {
  const container = document.getElementById("container-recipes")
  container.innerHTML = ""
  if (recipes.length === 0) {
    const noResult = document.createElement("p")
    noResult.className = "no-result"
    noResult.textContent =
      "Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc."
    container.appendChild(noResult)
    return
  }

  recipes.forEach((recipe) => {
    container.appendChild(RecipeCard(recipe))
  })
}
