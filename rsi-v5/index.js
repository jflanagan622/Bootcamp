// Richwood Scientific Bootcamp
// Basic Node+Express server for
// our test company
var express = require('express');
var app = express();

// Set the port to listen on. 3000 in this example
app.set('port', process.env.PORT || 3000);

// Setup to serve static files
app.use(express.static(__dirname + '/public'));

// Add BodyParser to read HTTP message body
var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

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


// =============================================================================
// Postgres
// =============================================================================
var config = {
  user: 'postgres', 				// env var: PGUSER
  database: 'postgres', 	// env var: PGDATABASE
  password: 'darkride7', 			// env var: PGPASSWORD
  host: 'localhost', 				// Server hosting the postgres database
  port: 5432, 						// env var: PGPORT ** CHECK YOUR PORT
  max: 10, 							// max number of clients in the pool
  idleTimeoutMillis: 30000	 		// how long a client is allowed to remain idle before being closed
};
var Pool = require('pg-pool')
global.pool = new Pool(config)

// attach an error handler to the pool for when a connected, idle client
// receives an error by being disconnected, etc
pool.on('error', function(error, client) {
  // handle this in the same way you would treat process.on('uncaughtException')
  // it is supplied the error as well as the idle client which received the error
  console.log('Pool received an error: ' + error)
});


//-----------------------------------------
// Startup the server
app.listen(app.get('port'), function(){
	console.log( 'The Server is running. Open a browser and navigate to: http://localhost:3000');
});




//-----------------------------------------
// Setup the routes
//


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

// Stub of login page
app.get("/addsimple", function (req, res) {
	// Send the login page
	res.render('addproduct-simple');
});

//-----------------------------------------
// Dashboard and Admin pages
//
app.get("/admin", function (req, res) {
	// Send the Admin page
	// Note we are also changing from the main layout
	// to the Admin one; not just the body
    res.render('adminbody', {layout: 'adminmain', inventory_cost : "$0.00"});
});

// Page to add products to the Database
app.get("/addproduct", function (req, res) {
	// Send the Add Product page
    res.render('addproduct', {layout: 'adminmain'});
});
// Page to add customers to the Database
app.get("/addcustomers", function (req, res) {
	// Send the Add Product page
    res.render('addcustomers', {layout: 'adminmain'});
});

// Page to update products in the Database
app.get("/updateproduct/:id", function (req, res) {
	// Send the Update Product page
    res.render('updateproduct', {layout: 'adminmain'});
});

// Page to add product types to the Database
app.get("/addproducttype", function (req, res) {
	// Send the Add Product page
    res.render('addproducttype', {layout: 'adminmain'});
});

// Page to add scent types to the Database
app.get("/addscenttype", function (req, res) {
	// Send the Add Product page
    res.render('addscenttype', {layout: 'adminmain'});
});

// Generic Page to view Database tables
app.get("/viewdata", function (req, res) {
	// Send the viewdata page
    res.render('viewdata', {layout: 'adminmain'});
});

// Products Page to view Database tables
app.get("/viewproduct", function (req, res) {
	// Send the View Product page
    res.render('viewproduct', {layout: 'adminmain'});
});

// Customers Page to view Database tables
app.get("/viewcustomer", function (req, res) {
	// Send the View Customers page
    res.render('viewcustomer', {layout: 'adminmain'});
});

// Product Types Page to view Database tables
app.get("/viewproducttypes", function (req, res) {
	// Send the View Product Types page
    res.render('viewproducttypes', {layout: 'adminmain'});
});

// Scent Types Page to view Database tables
app.get("/viewscenttypes", function (req, res) {
	// Send the View Scent Types page
    res.render('viewscenttypes', {layout: 'adminmain'});
});

//-----------------------------------------
// API routes
//


//-----------------------------------
//Customers
var customers = require('./routes/customers');

// Create
app.post('/api/customers', customers.createCustomer);

// Read all
app.get('/api/customers', customers.readCustomers);

// Read one
app.get('/api/customers/:id', customers.readCustomers);

// Update
app.put('/api/customers', customers.updateCustomer);

// Delete
app.delete('/api/customers', customers.deleteCustomer);

//-----------------------------------------
// Products

var products = require('./routes/products');

// Create
app.post('/api/product', products.createProduct);

// Read all
app.get('/api/products', products.readProducts);

// Read all best sellers
app.get('/api/bestsellers', products.readBestSellers);
// Read all best sellers minified
app.get('/api/bestsellersmin', products.readBestSellersMin);

// Read one
app.get('/api/product/:id', products.readProduct);

// Update
app.put('/api/product', products.updateProduct);

// Delete
app.delete('/api/product', products.deleteProduct);

// Get the total cost of on-hand inventory
app.get('/api/product_cost', products.totalCostofOnHand);

//-----------------------------------------

//-----------------------------------------
// Product Types

var product_types = require('./routes/product_types');

// Create
app.post('/api/product_type', product_types.createProductType);

// Read all
app.get('/api/product_types', product_types.readProductTypes);

// Read one
app.get('/api/product_types/:id', product_types.readProductTypes);

// Update
app.put('/api/product_type', product_types.updateProductType);

// Delete
app.delete('/api/product_type', product_types.deleteProductType);

//-----------------------------------------

//-----------------------------------------
// Scent Types

var scent_types = require('./routes/scent_types');

// Create
app.post('/api/scent_type', scent_types.createScentType);

// Read all
app.get('/api/scent_types', scent_types.readScentTypes);

// Read one
app.get('/api/scent_types/:id', scent_types.readScentTypes);

// Update
app.put('/api/scent_types', scent_types.updateScentType);

// Delete
app.delete('/api/scent_types', scent_types.deleteScentType);


// Finally If no routes match, send the 404 page
app.use(function(req,res) {
	res.status(404);
	// Send 404 status code
	res.render('404');
});

