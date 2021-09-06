const router = require('express').Router();
const Book = require('../models/Book.model.js'); // <== add this line before your routes

/* GET home page */
router.get('/', (req, res, next) => {
	res.render('index');
});

module.exports = router;
