module.exports = (app, conn, hasher) => {

  const passport = require('passport');
  const LocalStrategy = require('passport-local').Strategy;
  const FacebookStrategy = require('passport-facebook').Strategy;
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  // 세션에 유저 정보 저장
  passport.serializeUser((user, done) => {
    console.log('serialize user: ' + user.authId);
    done(null, user.authId);
  });
  
  // 페이지 접근할때마다 세션에서 유저정보 확인
  // 세션 메모리 절약을 위해서 세션에서는 user의 id값만 보관 : 오히려 db조회 문제가 발생
  passport.deserializeUser((id, done) => {
    console.log('deserialize user: ' + id);
    const sql = 'SELECT * FROM users WHERE authId=?';
    conn.query(sql, id, (err, results) => {
      if(err) {
        done('There is no user');
      } else {
        console.log(results[0]);
        done(null, results[0]);
      }
    });
  });
  
  passport.use(new LocalStrategy(
    (username, password, done) => {
      console.log('local strategy');
      const sql = 'SELECT * FROM users WHERE authId=?';
      conn.query(sql, ['local:'+username], (err, results) => {
        if(err) {
          return done('There is no user');
        }
        const user = results[0];
        return hasher({password: password, salt: user.salt}, (err, pass, salt, hash) => {
          if(hash === user.password) {
            console.log('로그인 성공');
            done(null, user);
          } else {
            console.log('로그인 실패');
            done(null, false);
          }
        })
      });
    }
  ));
  
  passport.use(new FacebookStrategy({
      clientID: 'my-id',
      clientSecret: 'my-secret',
      callbackURL: '/facebook/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      const authId = 'facebook:'+profile.id;
      const sql = 'SELECT * FROM users WHERE authId=?';
      conn.query(sql, authId, (err, results) => {
        if(results.length > 0) {
          done(null, results[0]);
  
        } else {
          const newUser = {
            'authId': authId,
            'displayName': profile.displayName,
            'email': profile.id
          };
          const sql_insert = 'INSERT INTO users SET ?';
          conn.query(sql_insert, newUser, (err, results) => {
            if(err) {
              console.log(err);
              done('ERROR');
            } else {
              done(null, newUser);
            }
          });
        }
      });
    }
  ));
  return passport;

};
