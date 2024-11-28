document.getElementById("searchButton").addEventListener("click", fetchRecipes);

function fetchRecipes() {
    const query = document.getElementById("searchInput").value;

    if (!query) {
        document.getElementById("recipeResults").innerHTML = "<p>ENter recipes.</p>";
        return;
    }

  

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        .then((res) => res.json())
        .then((data) => displayRecipes(data.meals))
        .catch((err) => {
            console.log("Error fetching the recipe data:", err);
        });
}


// Display Recipes
function displayRecipes(meals) {
    const recipeResults = document.getElementById("recipeResults");
    recipeResults.innerHTML = "";


    meals.forEach((meal) => {
        const recipeCard = document.createElement("div");
        recipeCard.className = "recipe-card";

        recipeCard.innerHTML = `
            <img src="${meal.strMealThumb}"/>
            <h2>${meal.strMeal}</h2>
            <p>${meal.strInstructions.slice(0, 100)}...</p>
        `;

        recipeResults.appendChild(recipeCard);
    });
}


document.querySelectorAll(".keyword-button").forEach((button) => {
    button.addEventListener("click", () => {
        const keyword = button.textContent;
        document.getElementById("searchInput").value = keyword; 
        fetchRecipes();
    });
});



// display recipe  details
function displayRecipes(meals) {
    const recipeResults = document.getElementById("recipeResults");
    recipeResults.innerHTML = "";

    meals.forEach((meal) => {
        const recipeCard = document.createElement("div");
        recipeCard.className = "recipe-card";

        recipeCard.innerHTML = `
            <img src="${meal.strMealThumb}"/>
            <h2>${meal.strMeal}</h2>
            <p>${meal.strInstructions.slice(0, 100)}...</p>
            <button class="details-button" data-id="${meal.idMeal}">View Details</button>
        `;

        recipeResults.appendChild(recipeCard);
    });

    // View Details
    document.querySelectorAll(".details-button").forEach((button) => {
        button.addEventListener("click", (even) => {
            const mealId = even.target.getAttribute("data-id");
            fetchRecipeDetails(mealId);
        });
    });
}


// fetch Recipe Details
function fetchRecipeDetails(id) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then((res) => res.json())
        .then((data) => showRecipeDetails(data.meals[0]))
        .catch((err) => {
            console.log("Error fetching recipe details:", err);
        });
}



// show Recipe Details
function showRecipeDetails(meal) {
    const recipeResults = document.getElementById("recipeResults");
    recipeResults.innerHTML = `
        <div class="recipe-details">
            <h2>${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}"/>
            <h3>Category: ${meal.strCategory}</h3>
            <h3>Area: ${meal.strArea}</h3>
            <p>${meal.strInstructions}</p>
            <h3>Ingredients:</h3>
            <ul>${getIngredientsList(meal)}</ul>
            <button class="back-button">Back to Search</button>
        </div>
    `;

    // Back to Search
    document.querySelector(".back-button").addEventListener("click", () => {
        fetchRecipes();
    });
}


// get Ingredients List
function getIngredientsList(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            ingredients.push(`<li>${ingredient} - ${measure}</li>`);
        }
    }
    return ingredients.join("");
}
