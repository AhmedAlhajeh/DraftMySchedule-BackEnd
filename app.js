const express = require('express');
const app = express();
app.use(express.static('Public'));
const data = require("./Lab3-timetable-data.json"); 
app.listen(3000, () => console.log('Listening on port 3000'));