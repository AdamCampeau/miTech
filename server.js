const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3001;

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sesh = {
    secret: 'no',
    cookie: {},
    resave: false,
    saveUnitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sesh));

const hlprs = exphbs.create({ helpers });

app.engine('handlebars', hlprs.engine);
app.set('view engine', 'handlebars');

// express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

// enable connection
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('LISTENING'));
});