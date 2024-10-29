const express = require('express');
const axios = require('axios');
const https = require('https');
const router = express.Router();

const marked = require('marked');

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
          //console.log('Original image data type:', typeof recipe.image);
          //console.log('Original image data length:', recipe.image.length);
          
          const base64Image = Buffer.from(recipe.image, 'binary').toString('base64');
          recipe.image = `data:image/jpeg;base64,${base64Image}`;
          
          //console.log('Base64 image data length:', base64Image.length);
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
    //console.log('Recipe:', recipe.recipe.body);

    //console.log('Image:', response.data.recipe.body);
    //console.log('Recipe:', recipe.body);
    if (recipe) {
      if (recipe.recipe.imageBase64) {
        //const base64Image = Buffer.from(recipe.recipe.imageBase64, 'binary').toString('base64');
        //recipe.recipe.imageBase64 = `data:image/jpeg;base64,${base64Image}`;
      } else {
        console.log(`No image available for this recipe. ID: ${recipeId}`);
      }

      if (recipe.recipe.body) {
        //console.log('Body before conversion:', recipe.recipe.body);  
        recipe.recipe.body = marked.parse(recipe.recipe.body);
        //console.log('Markdown converted to HTML:', recipe.recipe.body);  
      } else {
        recipe.body = '<p>No description or instructions available for this recipe.</p>';
        console.log(`No body available for this recipe. ID: ${recipeId}`);
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

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await axios.post(
      'https://localhost:7259/Auth/login',
      { username: email, password },
      { httpsAgent }
    );

    const { token } = response.data;

    if (token) {
      req.session.jwtToken = token; 
      return res.redirect('/dashboard'); 
    } else {
      return res.render('login', { errorMessage: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error.message);
    return res.render('login', { errorMessage: 'Login failed. Please try again.' });
  }
});


router.post('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Failed to log out' });
    }
    res.json({ message: 'Logout successful' });
  });
});

module.exports = router;
