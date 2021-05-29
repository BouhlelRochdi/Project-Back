const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const connect = require('./db/connect')
const strategy = require('./passport/passport');
const app = express();
const port = 3000;
const register = require('./routes/register');
const company = require('./routes/company');
const events = require('./routes/events');
const tags = require('./routes/tags');
const login = require('./routes/login');
const token = require('./routes/tokenApi');
const resetPasswordMail = require('./routes/resetPwd');


// config
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(morgan('dev'));

// routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to my rest API !' });
});


app.use('/api', company);
app.use('/api', events);
app.use('/api', tags);
app.use('/api', register);
app.use('/api', login);
app.use('/api', token);
app.use('/api', resetPasswordMail);




app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})