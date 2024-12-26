const express = require('express');
const path = require('path');
const port = 1008;
const app = express();

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views')); 

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('Index');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
