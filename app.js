const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const handlebars = require('handlebars');
const bodyParser = require('body-parser');
const mongoose = require('./models/connection');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');
const { envPort, sessionKey } = require('./config');

const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');

const app = express();
const port = envPort || 3000;


app.listen(port, ()=>{
    console.log('Server started at port ' + port);
});

app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, "/views/"));

app.engine("hbs", exphbs({
    extname: "hbs",
    defaultLayout: "main1",
    layoutsDir: path.join(__dirname, '/views/layouts'),
    partialsDir: path.join(__dirname, '/views/partials')
}));

app.set("view engine", "hbs");

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: sessionKey,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 }
  }));

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

app.use('/', authRouter); 
app.use('/', indexRouter); // Main index route