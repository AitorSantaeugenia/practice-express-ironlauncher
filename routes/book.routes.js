// routes/book.routes.js

const router = require('express').Router();

const Book = require('../models/Book.model.js'); // <== add this line before your routes

// ------------------------------------------------------
// CREATE
// ------------------------------------------------------
router.get('/books/create', (req, res) => res.render('books/book-create.hbs'));

router.post('/books/create', (req, res, next) => {
	// console.log(req.body);
	const { title, author, description, rating } = req.body;

	Book.create({ title, author, description, rating })
		// .then(bookFromDB => console.log(`New book created: ${bookFromDB.title}.`))
		.then(() => res.redirect('/books'))
		.catch((error) => next(error));
});
// ------------------------------------------------------
// BOOKS - GET route to retrieve and display all the books
// ------------------------------------------------------
router.get('/books', (req, res, next) => {
	Book.find()
		.then((allTheBooksFromDB) => {
			// -> allTheBooksFromDB is a placeholder, it can be any word
			console.log('Retrieved books from DB:', allTheBooksFromDB);

			res.render('books/books-list.hbs', { allTheBooksFromDB });
			//res.send(allTheBooksFromDB);
		})
		.catch((error) => {
			console.log('Error while getting the books from the DB: ', error);

			// Call the error-middleware to display the error page to the user
			next(error);
		});
});
// ------------------------------------------------------
// BOOK ID - GET route to retrieve and display details of a specific book
// ------------------------------------------------------
router.get('/books/:bookId', (req, res, next) => {
	const { bookId } = req.params;

	Book.findById(bookId).then((theBook) => res.render('books/book-details.hbs', { book: theBook })).catch((error) => {
		console.log('Error while retrieving book details: ', error);

		// Call the error-middleware to display the error page to the user
		next(error);
	});
});
// ------------------------------------------------------
// UPDATE BOOK - GET route to display the form to update a specific book
// ------------------------------------------------------
router.get('/books/:bookId/edit', (req, res, next) => {
	const { bookId } = req.params;

	Book.findById(bookId)
		.then((bookToEdit) => {
			// console.log(bookToEdit);
			res.render('books/book-edit.hbs', { book: bookToEdit }); // <-- add this line
		})
		.catch((error) => next(error));
});
// ------------------------------------------------------
// UPDATE BOOK - POST route to actually make updates on a specific book
// ------------------------------------------------------
router.post('/books/:bookId/edit', (req, res, next) => {
	const { bookId } = req.params;
	const { title, description, author, rating } = req.body;

	Book.findByIdAndUpdate(bookId, { title, description, author, rating }, { new: true })
		.then((updatedBook) => res.redirect(`/books/${updatedBook.id}`)) // go to the details page to see the updates
		.catch((error) => next(error));
});

// ------------------------------------------------------
// DELETE - POST route to actually make updates on a specific book
// ------------------------------------------------------
router.post('/books/:bookId/delete', (req, res, next) => {
	const { bookId } = req.params;

	Book.findByIdAndDelete(bookId).then(() => res.redirect('/books')).catch((error) => next(error));
});
/*
Book.findById(bookId); // => returns a single book object (only if provided argument is the id)
Book.findOne({ _id: bookId }); // => returns a single book object (can look for any attribute, including the id)
Book.find({ _id: bookId }); // => returns an array with a single book object (can look for any attribute, including the id)
*/
module.exports = router;
