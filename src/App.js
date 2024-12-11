import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [cocktail, setCocktail] = useState(null);
  const [cocktailName, setCocktailName] = useState("");
  const [error, setError] = useState("");

  // Function to fetch cocktail by name
  const fetchCocktail = async (name) => {
    const apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch cocktail data.");
      }
      const data = await response.json();

      if (data.drinks) {
        const drink = data.drinks[0]; // Get the first cocktail in the list
        setCocktail({
          name: drink.strDrink,
          instructions: drink.strInstructions,
          ingredients: getIngredients(drink),
          image: drink.strDrinkThumb,
        });
        setError("");
      } else {
        setCocktail(null);
        setError("Cocktail not found.");
      }
    } catch (err) {
      setCocktail(null);
      setError(err.message || "An error occurred while fetching cocktail data.");
    }
  };

  // Function to get ingredients from the API response
  const getIngredients = (drink) => {
    let ingredients = [];
    for (let i = 1; i <= 15; i++) {
      if (drink[`strIngredient${i}`]) {
        ingredients.push(`${drink[`strIngredient${i}`]} - ${drink[`strMeasure${i}`]}`);
      }
    }
    return ingredients;
  };

  // Function to fetch random cocktail on app load
  const fetchRandomCocktail = async () => {
    const apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/random.php";

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch random cocktail.");
      }
      const data = await response.json();
      const drink = data.drinks[0];
      setCocktail({
        name: drink.strDrink,
        instructions: drink.strInstructions,
        ingredients: getIngredients(drink),
        image: drink.strDrinkThumb,
      });
      setError("");
    } catch (err) {
      setCocktail(null);
      setError(err.message || "An error occurred while fetching random cocktail data.");
    }
  };

  useEffect(() => {
    fetchRandomCocktail(); // Fetch a random cocktail when the app loads
  }, []);

  const handleInputChange = (e) => {
    setCocktailName(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (cocktailName) fetchCocktail(cocktailName);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Cocktail Recipe Finder</h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter cocktail name"
            value={cocktailName}
            onChange={handleInputChange}
            className="cocktail-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>

        {error && <p className="error">{error}</p>}

        {cocktail ? (
          <div className="cocktail-info">
            <h2>{cocktail.name}</h2>
            <img src={cocktail.image} alt={cocktail.name} className="cocktail-image" />
            <h3>Ingredients:</h3>
            <ul>
              {cocktail.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <h3>Instructions:</h3>
            <p>{cocktail.instructions}</p>
          </div>
        ) : (
          <p>Loading cocktail...</p>
        )}

        <button onClick={fetchRandomCocktail} className="random-button">Get Random Cocktail</button>
      </header>
    </div>
  );
}

export default App;
