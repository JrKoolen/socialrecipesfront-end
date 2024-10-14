const express = require('express');
const path = require('path');
const axios = require('axios');
const apiRouter = require('./routes/api');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static('assets'));

// Use the apiRouter for API routes under /api
app.use('/api', apiRouter);

app.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3000/api/recipes');
    const recipes = response.data;
    res.render('index', { recipes, activePage: 'home' });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.render('index', { recipes: [], activePage: 'home' });
  }
});

app.get('/recipes', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3000/api/recipes');
    const recipes = response.data;
    res.render('recipes', { recipes, activePage: 'recipes' });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.render('recipes', { recipes: [], activePage: 'recipes' });
  }
});

app.get('/login', (req, res) => {
  res.render('login', { activePage: 'login' });
});

app.get('/register', (req, res) => {
  res.render('register', { activePage: 'register' });
});

app.get('/user-page', (req, res) => {
  res.render('user-page', { activePage: 'user-page' });
});

app.get('/create-recipe', (req, res) => {
  res.render('create-recipe', { activePage: 'create-recipe' });
});

app.get('/confirm-account', (req, res) => {
  res.render('confirm-account', { activePage: 'confirm-account' });
});

app.get('/recipe/:id', async (req, res) => {
  const recipeId = req.params.id;
  console.log("Trying to get recipe with id: " + recipeId);
  try {
    const response = await axios.get(`http://localhost:3000/api/recipes/${recipeId}`);
    const recipe = response.data;
    if (recipe) {
      res.render('recipe', { recipe, activePage: 'recipe' });
    } else {
      res.status(404).send('Recipe not found');
    }
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).send('Failed to fetch recipe.');
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});