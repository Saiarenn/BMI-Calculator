const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const router = require('./routes/bmiRoutes');

const port = 3000;
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', router);
app.use('/public', express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
