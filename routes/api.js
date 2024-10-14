const express = require('express');
const axios = require('axios');
const https = require('https');
const router = express.Router();

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

router.get('/recipes', async (req, res) => {
  try {
    console.log('Fetching recipes from external API...');
    const response = await axios.get('https://localhost:7259/Recipe/GetAllRecipes', { httpsAgent });
    const data = response.data;
    
    if (data && Array.isArray(data.recipes)) {
      const recipes = data.recipes.map(recipe => {
        if (recipe.image) {
          console.log('Original image data type:', typeof recipe.image);
          console.log('Original image data length:', recipe.image.length);
          
          const base64Image = Buffer.from(recipe.image, 'binary').toString('base64');
          recipe.image = `data:image/jpeg;base64,${base64Image}`;
          
          console.log('Base64 image data length:', base64Image.length);
        }
        return recipe;
      });
      console.log('Processed recipes.');
      res.json(recipes);
    } else {
      console.error('Error: Expected an array of recipes');
      res.status(500).json({ error: 'Invalid data format from API' });
    }
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

router.get('/recipes/:id', async (req, res) => {
  const recipeId = req.params.id;
  try {
    const response = await axios.get(`https://localhost:7259/Recipe/GetRecipeById/${recipeId}`, { httpsAgent });
    const recipe = response.data;

    if (recipe) {
      if (recipe.image) {
        const base64Image = Buffer.from(recipe.image, 'binary').toString('base64');
        recipe.image = `data:image/jpeg;base64,${base64Image}`;
      }
      res.json(recipe);
    } else {
      res.status(404).json({ error: 'Recipe not found' });
    }
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

module.exports = router;