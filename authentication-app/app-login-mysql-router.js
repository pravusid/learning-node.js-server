module.exports = (express, passport) => {

  const router = express.Router();
  router.get('/', (req, resp) => {
    let msg = `
      <h1>Welcome</h1>
    `;
    if(req.user && req.user.displayName) {
      msg += `
        <h2>${req.user.displayName}</h2>
        <h3><a href="/logout">logout</a></h3>
      `;
    } else {
      msg += `
        <h3><a href="/login">login</a></h3>
      `;
    }
    resp.send(msg);
  });
  
  router.get('/login', (req,resp) => {
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
  
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false
  }));
  
  router.get('/logout', (req, resp) => {
    req.logout();
    resp.redirect('/');
  });
  
  router.get('/signup', (req, resp) => {
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
  
  router.post('/signup', (req, resp) => {
    hasher({password: req.body.password}, (err, pass, salt, hash) => {
      const user = {
        authId:'local:'+req.body.username,
        username: req.body.username,
        password: hash,
        salt: salt,
        displayName: req.body.name
      };
      console.log(user);
      const sql = 'INSERT INTO users SET ?';
      conn.query(sql, user, (err, results) => {
        if(err) {
          console.log(err);
          resp.status(500);
        }
      });
      req.login(user, err => {
        req.session.save(() => {
          resp.redirect('/');
        });
      });
    });
  });
  
  // 타사인증 (Facebook)
  router.get('/facebook', passport.authenticate('facebook'));
  
  router.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  return router;

};
