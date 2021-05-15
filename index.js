const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const connect = require('./db/connect')
const app = express();
const port = 3000;
const register = require('./routes/register');
const company = require('./routes/company');
const events = require('./routes/events');
const tags = require('./routes/tags');


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




app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})