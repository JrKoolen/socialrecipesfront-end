const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { activePage: 'home' });
});

app.get('/recipes', (req, res) => {
    const recipes = [
      { title: 'Spaghetti', description: 'Delicious homemade spaghetti', image: 'https://via.placeholder.com/250x150' },
      { title: 'Pizza', description: 'Cheesy pizza with toppings', image: 'https://via.placeholder.com/250x150' },
      { title: 'Pizza', description: 'Cheesy pizza with toppings', image: 'https://via.placeholder.com/250x150' },
      { title: 'Pizza', description: 'Cheesy pizza with toppings', image: 'https://via.placeholder.com/250x150' },
      { title: 'Pizza', description: 'Cheesy pizza with toppings', image: 'https://via.placeholder.com/250x150' },
      { title: 'Pizza', description: 'Cheesy pizza with toppings', image: 'https://via.placeholder.com/250x150' },
      { title: 'Pizza', description: 'Cheesy pizza with toppings', image: 'https://via.placeholder.com/250x150' },
      { title: 'Pizza', description: 'Cheesy pizza with toppings', image: 'https://via.placeholder.com/250x150' },
      { title: 'Pizza', description: 'Cheesy pizza with toppings', image: 'https://via.placeholder.com/250x150' },
      { title: 'Pizza', description: 'Cheesy pizza with toppings', image: 'https://via.placeholder.com/250x150' },
      { title: 'Pizza', description: 'Cheesy pizza with toppings', image: 'https://via.placeholder.com/250x150' },
      { title: 'Pizza', description: 'Cheesy pizza with toppings', image: 'https://via.placeholder.com/250x150' },

    ];
  
    const validRecipes = recipes.filter(recipe => recipe.title && recipe.image);
    res.render('recipes', { recipes: validRecipes, activePage: 'recipes' });  
  });

app.get('/login', (req, res) => {
  res.render('login', { activePage: 'login' }); 
});


app.get('/register', (req, res) => {
res.render('register', { activePage: 'register' });  
});

app.get('/user-page', (req, res) => {
res.render('/user-page', { activePage: '/user-page' }); 
});

app.get('/create-recipe', (req, res) => {
res.render('/user-page', { activePage: '/user-page' });  
});

app.get('/create-recipe', (req, res) => {
res.render('/create-recipe', { activePage: '/create-recipe' });  
});

app.get('/confirm-account', (req, res) => {
res.render('/confirm-account', { activePage: '/confirm-account' });  
});
  

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
