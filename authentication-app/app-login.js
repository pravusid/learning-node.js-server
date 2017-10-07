const express = require('express');
const session = require('express-session');
const bkfd2Password = require('pbkdf2-password');
const hasher = bkfd2Password();
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

let users = [];

// 세션에 유저 정보 저장
passport.serializeUser((user, done) => {
  console.log('serialize user');
  done(null, user.username);
});

// 페이지 접근할때마다 세션에서 유저정보 확인
// 세션 메모리 절약을 위해서 세션에서는 user의 id값만 보관 : 오히려 db조회 문제가 발생
passport.deserializeUser((id, done) => {
  console.log('deserialize user');
  for(let i=0; i<users.length; i++) {
    let user = users[i];
    if(id === user.username) {
      done(null, user);
    }
  }
});

passport.use(new LocalStrategy(
  (username, password, done) => {
    console.log('local strategy');
    for(let i=0; i<users.length; i++) {
      let user = users[i];
      if(username === user.username) {
        return hasher({password: password, salt: user.salt}, (err, pass, salt, hash) =>{
          if(hash === user.password) {
            done(null, user);
          } else {
            done(null, false);
          }
        });
      }
    }
    done(null, false);
  }
));

passport.use(new FacebookStrategy({
    clientID: '123983388328324',
    clientSecret: '7d690cf5613b4b2a468010aee07828fd',
    callbackURL: '/facebook/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    const authId = 'facebook:'+profile.id;
    for(let i=0; i<users.length; i++) {
      const user = users[i];
      if(user.authId === authId) {
        return done(null, user);
      }
    }
    const newUser = {
      'authId': authId,
      'displayName': profile.displayName,
      'email': profile.emails[0].value
    };
    users.push(newUser);
    done(null, newUser);
  }
));

app.get('/', (req, resp) => {
  let msg = `
    <h1>Welcome</h1>
  `;
  if(req.user && req.user.name) {
    msg += `
      <h2>${req.user.name}</h2>
      <h3><a href="/logout">logout</a></h3>
    `;
  } else {
    msg += `
      <h3><a href="/login">login</a></h3>
    `;
  }
  resp.send(msg);
});

app.get('/login', (req,resp) => {
  const loginForm = `
    <form action="/login" method="post">
      <h1>로그인</h1>
      <p>
        <input type="text" name="username" placeholder="아이디">
      </p>
      <p>
        <input type="password" name="password" placeholder="비밀번호">
      </p>
      <p>
        <button type="submit">로그인</button>
      </p>
      <p>
        <h3><a href="/facebook">facebook</a></h3>
      </p>
    </form>
  `;
  resp.send(loginForm);
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: false
}));

app.get('/logout', (req, resp) => {
  req.logout();
  resp.redirect('/');
});

app.get('/signup', (req, resp) => {
  const signupForm = `
    <h1>Sign Up</h1>
    <form action="/signup" method="post">
      <p>
        <input type="text" name="username" placeholder="username">
      </p>
      <p>
        <input type="password" name="password" placeholder="password">
      </p>
      <p>
        <input type="text" name="name" placeholder="name">
      </p>
      <p>
        <button type="submit">가입</button>
      </p>
    </form>
  `;
  resp.send(signupForm);
});

app.post('/signup', (req, resp) => {
  hasher({password: req.body.password}, (err, pass, salt, hash) => {
    const user = {
      username: req.body.username,
      password: hash,
      salt: salt,
      name: req.body.name
    };
    console.log(user);
    users.push(user);
    req.login(user, err => {
      req.session.save(() => {
        resp.redirect('/');
      });
    });
  });
});

// 타사인증 (Facebook)
app.get('/facebook', passport.authenticate('facebook'));

app.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.listen(8080, () => {
  console.log('http://localhost:8080');
});
