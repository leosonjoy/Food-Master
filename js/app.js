let random = document.querySelector("#random");
let searchCon = document.querySelector("#searchContainer");
let searchItemContainer = document.querySelector("#search-item-container");
let form = document.querySelector(".container-fluid form");
let input = document.querySelector(".container-fluid input");
let favItem = document.querySelector("#fav-items");
let randomItemContainer = document.querySelector(".random-items-container");
let mealInfoContainer = document.querySelector("#meal-info-container");

form.addEventListener("submit", searchMealByName);

// Search meal Name
async function searchMealByName(event) {
  event.preventDefault();
  let searchItem = await mealSearch(input.value);
  input.value = "";
  // when search button click then random meal section is empty
  randomItemContainer.innerHTML = "";
}

// All Meals by search
async function mealSearch(mealName) {
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`; //this api gives me meals by name search like beef
  const res = await fetch(url);
  const resData = await res.json();
  const meals = await resData.meals;

  searchCon.innerHTML = ""; //search container reset
  const h1 = document.createElement("h1");
  h1.className = "text-center";
  h1.innerText = "Meals By Search";
  searchItemContainer.appendChild(h1);

  meals.forEach((meal) => {
    let allMeals = addMeals(meal);

    searchCon.appendChild(allMeals);
    searchItemContainer.appendChild(searchCon);
  });
}

randomMeals();

// random 8 meals generate
async function randomMeals() {
  const randomMeal = [];
  // 1 random meal to get 8 random meals by using for loop
  for (let i = 0; i < 8; i++) {
    const res = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php" //this api provide me 1 random meal
    );
    const resData = await res.json();
    const meals = resData.meals[0];

    randomMeal.push(meals);
  }

  randomMeal.forEach((meals) => {
    let meal = addMeals(meals); //add per meals using random api data
    // console.log(meals);
    random.appendChild(meal); // add all random meals to Random Meals container
  });
}

// Add per meal
function addMeals(meals) {
  const meal = document.createElement("div");
  meal.className = "col-md-6 col-lg-4 card";

  meal.innerHTML = `
          <div>
            <img
              src="${meals.strMealThumb}"
              class="card-img-top"
              alt="${meals.strMeal}"
              
            />

            <div class="card-body">
              <h5 class="card-title">${meals.strMeal}</h5>
              <button type="button" id="${meals.idMeal}" class="${
    getMealsIdFromLS().includes(meals.idMeal) ? "love" : ""
  }">
                <i class="fa-solid fa-heart"></i>
              </button>
            </div>
          </div>
  `;

  const btn = meal.querySelector("button");
  btn.addEventListener("click", () => {
    if (btn.classList.contains("love")) {
      removeMealsLs(meals.idMeal); //remove mealID from localStorage
      favItem.innerHTML = ""; //reset favorite container
      btn.classList.remove("love"); //remove red color on love logo
    } else {
      btn.classList.add("love"); //add red color on love logo

      addMealLS(meals.idMeal); // add mealId on LocalStorage
    }
    mealFromLs(); //meals from LocalStorage mealIDs
  });

  let image = meal.querySelector("img");
  image.addEventListener("click", function (event) {
    event.preventDefault();
    image.classList.toggle("show");
    mealInfo(meals);
  });
  // console.log(image);

  return meal;
}

// meals from localStorage MealIds
function mealFromLs() {
  favItem.innerHTML = "";
  const LSIds = getMealsIdFromLS();
  const length = LSIds.length;
  for (let i = 0; i < length; i++) {
    mealsById(LSIds[i]); // meals by MealID
  }
}

// mealsById function define
async function mealsById(id) {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`; //this api gives me 1 meal by MealID.
  const res = await fetch(url);
  const resData = await res.json();
  const meal = resData.meals[0];
  // console.log(meal);
  addFavMeal(meal); //add meal to favorite container
}

// add meal to favorite meal container
function addFavMeal(meals) {
  const meal = document.createElement("div");

  meal.className = "card col-md-2 col-lg-3";
  meal.innerHTML = `
                      <img
                        src="${meals.strMealThumb}"
                        class="card-img-top position-relative"
                        alt="${meals.strMeal}"
                      />
                      <button
                        type="button"
                        class="btn-close position-absolute text-bg-light"
                        aria-label="Close"
                      ></button>
                      <div class="card-body">
                        <h5 class="card-title text text-center">${meals.strMeal}</h5>
                      </div>

  `;

  const btn = meal.querySelector(".btn-close");
  btn.addEventListener("click", function () {
    favItem.removeChild(this.parentNode); //remove item from favorite container
    removeMealsLs(meals.idMeal); //remove mealID from localStorage
    removeLoveClassFromAll(meals.idMeal);
  });

  let image = meal.querySelector("img");
  image.addEventListener("click", function (event) {
    event.preventDefault();
    image.classList.toggle("show");
    mealInfo(meals);
  });

  favItem.appendChild(meal);
}

// remove red love form all love button
function removeLoveClassFromAll(id) {
  const button = random.querySelectorAll("button");
  const button2 = searchCon.querySelectorAll("button");
  button.forEach((btn) => {
    if (btn.getAttribute("id") === id) {
      btn.classList.remove("love");
    }
  });

  button2.forEach((btn) => {
    if (btn.getAttribute("id") === id) {
      btn.classList.remove("love");
    }
  });
}

// meal making info container
function mealInfo(meals) {
  const meal = document.createElement("div");
  meal.className = "meal-info-container bg-dark bg-opacity-75 w-100 h-100";

  // finding ingredients & measure from api
  const ing = [];
  for (let i = 1; i <= 20; i++) {
    if (meals["strIngredient" + i]) {
      ing.push(`${meals["strIngredient" + i]} -- ${meals["strMeasure" + i]}`);
    } else {
      break;
    }
  }

  meal.innerHTML = `
                    <div class="meal-making-info">
                    <div
                      class="meal-making-header d-flex align-items-center bg-dark bg-opacity-100 text-light h-100"
                    >
                      <div>
                        <h2>${meals.strMeal}</h2>
                      </div>
                      <div>
                        <button
                          type="button"
                          class="btn-close mx-2 bg-light"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                    </div>
                    <div class="meal-info-body">
                      <div class="d-xl-flex justify-content-between"> 
                        <div class="meal-img">
                          <img
                            src="${meals.strMealThumb}"
                            alt="${meals.strMeal}"
                          />
                        </div>
                        <div class="meal-info-text">
                          <ul>
                            <h2 class="mb-3">Ingredients--Measure</h2>
                            ${ing.map((e) => `<li class="mx-3">${e}</li>`)}

                          </ul>
                          
                        </div>
                      </div>
                      <div class="py-5">
                        <h2 class="my-3">Making Instructions</h2>  
                        <p>
                            ${meals.strInstructions}
                        </p>
                      </div>
                          
                    </div>
                    
                    <button class="btn bg-danger text-light btn-bottom">Close</button>
</div>
  `;

  const btn = meal.querySelector(".btn-bottom");
  btn.addEventListener("click", function () {
    mealInfoContainer.innerHTML = "";
  });

  const btn2 = meal.querySelector(".btn-close");
  btn2.addEventListener("click", function () {
    mealInfoContainer.innerHTML = "";
  });
  mealInfoContainer.innerHTML = "";

  mealInfoContainer.appendChild(meal);
}

// set local Storage
function addMealLS(id) {
  const getMealsId = getMealsIdFromLS();
  const idMeal = JSON.stringify([...getMealsId, id]);

  localStorage.setItem("mealId", idMeal);
}

// get localStorage
function getMealsIdFromLS() {
  const mealsId = JSON.parse(localStorage.getItem("mealId"));
  return mealsId === null ? [] : mealsId;
}

// remove Meals from local storage
function removeMealsLs(id) {
  const mealsId = getMealsIdFromLS();
  localStorage.setItem(
    "mealId",
    JSON.stringify(mealsId.filter((el) => el !== id))
  );
}

document.addEventListener("DOMContentLoaded", function () {
  mealFromLs();
  searchItemContainer.innerHTML = "";
});
