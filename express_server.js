const express = require('express');
const app = express();
const PORT = 8080;
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

const randomIDGenerate = (numberOfChar) => {
  const template =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const results = [];
  for (let i = 0; i < numberOfChar; i++) {
    const randomIndex = Math.round(Math.random() * 62);
    results.push(template[randomIndex]);
  }
  return results.join('');
};

const findUserByEmail = (email) => {
  for (let id in users) {
    if (users[id].email === email) {
      return users[id];
    }
  }
  return null;
};

const users = {
  userRandomID: {
    id: 'userRandomID',
    email: 'user@example.com',
    password: 'purple-monkey-dinosaur',
  },
  user2RandomID: {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: 'dishwasher-funk',
  },
};

const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};
app.get('/set', (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get('/fetch', (req, res) => {
  res.send(`a = ${a}`);
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});
app.get('/urls/new', (req, res) => {
  const templateVars = { user: users[req.cookies['user_id']] };
  res.render('urls_new', templateVars);
});

app.get('/', (req, res) => {
  res.send(`Hello World!`);
});
app.get('/hello', (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render('hello_world', templateVars);
});

app.get('/urls/:id', (req, res) => {
  const id = req.params.id;
  const templateVars = {
    urls: urlDatabase,
    id,
    longURL: urlDatabase[id].longURL,
    user: users[req.cookies['user_id']],
  };
  res.render('urls_show', templateVars);
});

app.get('/urls', (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies['user_id']],
  };
  res.render('urls_index', templateVars);
});
app.get('/u/:id', (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  res.redirect(longURL);
});

app.post('/urls', (req, res) => {
  const longURL = req.body.longURL;
  const id = randomIDGenerate(6);
  urlDatabase[id] = longURL;
  res.redirect(`/urls/${id}`);
});

app.post('/urls/:id', (req, res) => {
  const id = req.params.id;
  const newURL = `http://${req.body.longURL}`;
  console.log(id, newURL);
  urlDatabase[id] = newURL;
  res.redirect('/urls');
});

app.post('/urls/:id/delete', (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect('/urls');
});
app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

// if (req.cookies.user_id) {
//   res.redirect('/urls');
//   return;
// }
app.get('/register', (req, res) => {
  const userId = req.cookies['user_id'];
  const templateVars = { user: users[userId] };
  res.render('urls_regis', templateVars);
});

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = randomIDGenerate(12);
  const user = findUserByEmail(email);
  if (user) return res.status(400).send('This Email has already registered. ');
  if (email === '' || password === '') {
    res.status(400).send('you have to input email and password');
    return;
  }
  users[id] = { id, email, password };
  res.cookie('user_id', id);
  res.redirect('/urls');
});
// if (req.cookies.user_id) {
//   res.redirect('/urls');
//   return;
// }
app.get('/login', (req, res) => {
  let templateVars = { user: users[req.cookies['user_id']] };
  res.status(200).render('urls_login', templateVars);
});

app.post('/login', (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  const user = findUserByEmail(email);
  if (user === null) {
    res.status(403).send('Email or password not mathch. Please try again. ');
    return;
  } else if (user.password !== password) {
    res.status(403).send('Email or password not match. Please try again. ');
    return;
  } else {
    res.status(200).cookie('user_id', user.id).redirect('/urls');
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id'.user.id).redirect('/urls');
});
///

app.listen(PORT, () => {
  console.log(`Example app listening on port${PORT}!`);
});
