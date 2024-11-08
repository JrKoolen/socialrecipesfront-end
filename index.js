const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const https = require('https');
const session = require('express-session');
const crypto = require('crypto');

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static('assets'));


app.use(session({
  secret: crypto.randomBytes(64).toString('hex'), 
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true, 
    maxAge: 1000 * 60 * 60 * 24 
  }
}));

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, 
});

app.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://localhost:7259/Recipe/GetAllRecipes', { httpsAgent });
    
    const recipes = response.data.recipes || []; 

    if (Array.isArray(recipes)) {
      res.render('index', { recipes, activePage: 'home' });
    } else {
      console.error('Error: Expected an array for recipes, received:', recipes);
      res.render('index', { recipes: [], activePage: 'home' });
    }
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.render('index', { recipes: [], activePage: 'home' });
  }
});

//Post recipe

app.get('/recipes', async (req, res) => {
  try {
    const response = await axios.get('https://localhost:7259/Recipe/GetAllRecipes', { httpsAgent });
    const recipes = response.data.recipes || [];
    if (Array.isArray(recipes)) {
      res.render('recipes', { recipes, activePage: 'recipes' });
    } else {
      console.error('Error: Expected an array for recipes, received:', recipes);
      res.render('recipes', { recipes: [], activePage: 'recipes' });
    }
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.render('recipes', { recipes: [], activePage: 'recipes' });
  }
});


app.get('/login', (req, res) => {
  res.render('login', { activePage: 'login' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await axios.post(
      'https://localhost:7259/Auth/login',
      { username: email, password },
      { httpsAgent: new https.Agent({ rejectUnauthorized: false }) }
    );

    const { token } = response.data;

    if (token) {
      req.session.user = { email, token };
      console.log(`User ${email} logged in with token.`);
      return res.redirect('/dashboard'); 
    } else {
      res.render('login', { errorMessage: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.render('login', { errorMessage: 'Login failed. Please try again.' });
  }
});

app.get('/register', (req, res) => {
  res.render('register', { activePage: 'register', errorMessage: null });
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  const payload = {
    name: username,
    email: email,
    password: password
  };

  console.log('Data sent to the API:', payload); 

  try {
    const response = await axios.post(
      'https://localhost:7259/Auth/register',
      payload,
      { httpsAgent }
    );

    if (response.status === 200) {
      return res.redirect('/login'); 
    } else {
      res.render('register', {
        activePage: 'register',
        errorMessage: 'Registration failed. Please try again.'
      });
    }
  } catch (error) {
    console.error('Error registering user:', error.response ? error.response.data : error.message);
    res.render('register', {
      activePage: 'register',
      errorMessage: 'An error occurred during registration. Please try again.'
    });
  }
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

const marked = require('marked');

app.get('/recipe/:id', async (req, res) => {
  const recipeId = req.params.id;
  try {
    const response = await axios.get(`https://localhost:7259/Recipe/GetRecipeById/${recipeId}`, { httpsAgent });
    const recipe = response.data.recipe;

    if (recipe) {
      if (recipe.body) {
        recipe.body = marked.parse(recipe.body);
      }
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