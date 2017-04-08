// Richwood Scientific Bootcamp
// Basic Node+Express server for
// our test company
var express = require('express');
var app = express();

// Set the port to listen on. 80 since it's the web server
// NOTE: su usually required for ports under 1024
app.set('port', process.env.PORT || 80);

// Setup to serve static files
app.use(express.static(__dirname + '/public'));

// Morgan for logging
var morgan = require('morgan');
app.use(morgan(':date :remote-addr :method :url :status :response-time ms - :res[content-length]'));

// Add / Setup handlebars view engine
var handlebars = require('express-handlebars');
// Point to a default template
app.engine('handlebars', handlebars({defaultLayout: 'main'}));

// Add handlebars to the app
app.set('view engine', 'handlebars');

// Kill cache 304 response
app.disable('etag');

//-----------------------------------------
// Startup the server
app.listen(app.get('port'), function(){
	console.log( 'The Web Server is running. Open a browser and navigate to: http://localhost');
});


//-----------------------------------------
// Page routes
//

// Default page
app.get('/construction', function(req,res) {
	// Send the construction page
	res.render('construction');
});

app.get('/', function(req,res) {
	// Send the construction page
	res.render('home');
});
app.get('/pretty', function(req,res) {
	// Send the construction page
	res.render('homepretty');
});

// Stub of login page
app.get("/login", function (req, res) {
	// Send the login page
	res.render('login');
});

// Request to actually login
app.post("/login", function (req, res) {
    console.log(req.body.first_name);
	// Close connection
	res.status(200).json({result: 'success', data:{}});
});

//-----------------------------------------
// Dashboard and Admin pages
//-----------------------------------------
app.get("/admin", function (req, res) {
	// Send the Admin page
	// Note we are also changing from the main layout
	// to the Admin one; not just the body
    res.render('adminbody', {layout: 'adminmain', inventory_cost : "$0.00"});
});


//-----------------------------------------
// Product pages
//-----------------------------------------
// Page to add products to the Database
app.get("/addproduct", function (req, res) {
	// Send the Add Product page
    res.render('addproduct', {layout: 'adminmain'});
});

// Products Page to view Database tables
app.get("/viewproduct", function (req, res) {
	// Send the View Product page
    res.render('viewproduct', {layout: 'adminmain'});
});

// Page to update products in the Database
app.get("/updateproduct", function (req, res) {
	// Send the Update Product page
    res.render('updateproduct', {layout: 'adminmain'});
});

// Page to update products in the Database
app.get("/deleteproduct", function (req, res) {
	// Send the Update Product page
    res.render('deleteproduct', {layout: 'adminmain'});
});

//-----------------------------------------
// Product Type pages
//-----------------------------------------
// Page to add product types to the Database
app.get("/addproducttype", function (req, res) {
	// Send the Add Product page
    res.render('addproducttype', {layout: 'adminmain'});
});

// Product Types Page to view Database tables
app.get("/viewproducttypes", function (req, res) {
	// Send the View Product Types page
    res.render('viewproducttypes', {layout: 'adminmain'});
});

//-----------------------------------------
// Scent Type pages
//-----------------------------------------
// Page to add scents to the Database
app.get("/addscenttype", function (req, res) {
	// Send the Add Product page
    res.render('addscenttype', {layout: 'adminmain'});
});

// Scent Types Page to view Database tables
app.get("/viewscenttypes", function (req, res) {
	// Send the View Scent Types page
    res.render('viewscenttypes', {layout: 'adminmain'});
});

//-----------------------------------------
// Customer Pages
//-----------------------------------------
// Page to add customers to the Database
app.get("/addcustomers", function (req, res) {
	// Send the Add Product page
    res.render('addcustomers', {layout: 'adminmain'});
});

// Customers Page to view Database tables
app.get("/viewcustomer", function (req, res) {
	// Send the View Customers page
    res.render('viewcustomer', {layout: 'adminmain'});
});

// Update Customer Page to update Database tables
app.get("/updatecustomer", function (req, res) {
	// Send the Update Customer page
    res.render('updatecustomers', {layout: 'adminmain'});
});

//-----------------------------------------
// Utility pages
//-----------------------------------------
// Generic Page to manipulate Database tables
app.get("/viewdata", function (req, res) {
	// Send the Add Product page
    res.render('viewdata', {layout: 'adminmain'});
});

app.get("/adddata", function (req, res) {
	// Send the Add Product page
    res.render('adddata', {layout: 'adminmain'});
});

app.get("/updatedata", function (req, res) {
	// Send the Add Product page
    res.render('updatedata', {layout: 'adminmain'});
});

app.get("/deletedata", function (req, res) {
	// Send the Add Product page
    res.render('deletedata', {layout: 'adminmain'});
});

//-----------------------------------------
// Finally If no routes match, send the 404 page
app.use(function(req,res) {
	res.status(404);
	// Send 404 status code
	res.render('404');
});

