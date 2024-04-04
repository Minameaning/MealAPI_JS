function searchMeal() {
    const searchTerm = document.getElementById('search').value.trim();
    if (searchTerm === '') {
        alert('Please enter a search term.');
        return;
    }

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        const mealsTable = document.getElementById('meals-table');
        mealsTable.innerHTML = ''; // Clear previous search results
        if (data.meals) {
            const table = document.createElement('table');
            table.innerHTML = `
                    <th>Meal Name</th>
            `;
            data.meals.forEach(meal => {
                const mealName = meal.strMeal;
                const mealID = meal.idMeal; // Get the meal ID
                const mealCategory = meal.strCategory;
                const mealArea = meal.strArea;
                // Create a row for each meal in the table
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><a href="meal-details.html?id=${mealID}">${mealName}</a></td>

                `;
                table.appendChild(row);
            });
            mealsTable.appendChild(table);
        } else {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="3">No results found.</td>';
            mealsTable.appendChild(row);
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}
// Function to fetch and display meal details
function displayMealDetails() {
    const mealID = getMealID();
    if (!mealID) {
        console.error('Meal ID not found in URL.');
        return;
    }

    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const mealDetailsDiv = document.getElementById('meal-details');
            mealDetailsDiv.innerHTML = ''; // Clear previous meal details
            if (data.meals && data.meals.length > 0) {
                const meal = data.meals[0];
                const mealName = meal.strMeal;
                const mealThumbnail = meal.strMealThumb;
                const mealCategory = meal.strCategory;
                const mealInstructions = meal.strInstructions;
                // Display meal details
                mealDetailsDiv.innerHTML = `
                    <h2>${mealName}</h2>
                    <img src="${mealThumbnail}" alt="${mealName}" style="max-width: 300px; border-radius:5px">
                    <p>Category: ${mealCategory}</p>
                    <div class="instructions-box">
                        <h3>Instructions:</h3>
                        <p>${mealInstructions}</p>
                    </div>
                    
                `;
            } else {
                mealDetailsDiv.textContent = 'Meal details not found.';
            }
        })
        .catch(error => {
            console.error('Error fetching or parsing data:', error);
            const mealDetailsDiv = document.getElementById('meal-details');
            mealDetailsDiv.textContent = 'Error fetching meal details.';
        });
}

// Function to extract meal ID from the URL query string
function getMealID() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Call the function to display meal details when the page loads
window.onload = displayMealDetails;

// Function to go back to the previous page
function goBack() {
    window.history.back();
}
