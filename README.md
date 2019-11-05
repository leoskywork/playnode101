# node 101 note

## node with auth

### setup & run

```sh

npm init -y           # init project and create package.json file
# install dependencies
npm i express         # for RESTful api
  bcryptjs            # for encryption login data
  passport
  passport-local
  mongoose            # for mongoose db
  connect-flash       # for flash msg to client
  express-session     # dependent by connect-flash
# if need handle UI, add followings
  ejs                 # template engine
  express-ejs-layouts # ejs doesn't contains layout(2019.Nov)

npm i -D nodemon      # for live server update, no need to restart project make changes take effects, -D => dev dependency

# change package.json
  # add scripts.start, scripts.dev

npm run dev           # start server in dev mode(with nodemon)

npm i --save cors     # install cors module for enabling cross origin resource sharing


```

## more
