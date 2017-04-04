"use strict";

// UUID
var uuid = require('node-uuid');

// Dates
var dateutil = require('dateutil');


//-------------------------------------------------------------------------------------------
// Create a Customer Profile
exports.createCustomer = function(req, res) {
	
	pool.connect(function(err, client, done) {
		
		var handleError = function(err) {
			// no error occurred, continue with the request
			if(!err) return false;
			res.status(500).json({ result:'error', data:{ error:err } });
			return true;
	    };
	    // handle an error from the connect
		if(handleError(err)) return;
		
		// Validate then insert
		if(req.body.email_address) {
            
			var queryText = 'INSERT INTO customers (id, user_name, first_name, last_name, email_address, phone_number, shipping_address, shipping_city, shipping_state, shipping_zip) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, user_name, email_address'
			client.query(queryText, [uuid.v4(), req.body.user_name, req.body.first_name, req.body.last_name, req.body.email_address, req.body.phone_number, req.body.shipping_address, req.body.shipping_city, req.body.shipping_state, req.body.shipping_zip], function(err, result) {
				done();
				// handle an error from the query
				if(handleError(err)) return;
				//res.status(200).json({result: 'success', data:{ id : result.rows[0].id, label : result.rows[0].label }});
				res.writeHead(302, {'Location': 'http://localhost:3000/addcustomers'});
				res.end();
	
			});
	  	
		} else {
			done();
	    	res.status(400).json({ result: 'error', data:{error: 'field is required'} });
		}
		
	});
	
}


//-------------------------------------------------------------------------------------------
// Get all Customers
exports.readCustomers = function(req, res) {
	
	// get a pg client from the connection pool
	pool.connect(function(err, client, done) {
		
    	var handleError = function(err) {
			// no error occurred, continue with the request
			if(!err) return false;
			done();
			console.log(err);
			res.status(500).json({ result:'error', data:{ error:err } });
			return true;
    	};
    	
    	// handle an error from the connect
		if(handleError(err)) return;
		var queryText = 'SELECT * FROM customers;';
		client.query(queryText, [], function(err, result) {
			if(handleError(err)) return;
			done();
			if(result.rowCount > 0) {
				var customer_types = result.rows;
				res.status(200).json({result: 'success', data:{ customer_types : customer_types }});
			} else {
				res.status(200).json({result: 'success', data:{}});
			}
		});
	});
};

//---------------------------------------------------------------------------------------
// Update
exports.updateCustomer = function(req, res) {
	
	// get a pg client from the connection pool
	pool.connect(function(err, client, done) {

    	var handleError = function(err) {
			// no error occurred, continue with the request
			if(!err) return false;
			done();
			res.status(500).json({ result:'error', data:{ error:err } });
			return true;
    	};

    	// handle an error from the connect
		if(handleError(err)) return;

		// Validate then insert
		if(req.params.id) {
			done();
			res.status(200).json({result: 'success', data:{count : result.rowCount}});
    	} else {
	    	done();
	    	rres.status(400).json({ result: 'error', data:{error: 'id is required'} });
    	}
   
  	});
};

//---------------------------------------------------------------------------------------
// Delete
exports.deleteCustomer = function(req, res) {
	
	// get a pg client from the connection pool
	pool.connect(function(err, client, done) {

    	var handleError = function(err) {
			// no error occurred, continue with the request
			if(!err) return false;
			done();
			res.status(500).json({ result:'error', data:{ error:err } });
			return true;
    	};

    	// handle an error from the connect
		if(handleError(err)) return;

		// Validate then insert
		if(req.params.id) {
			
			var queryText = 'DELETE FROM customers WHERE id = $1'
			client.query(queryText, [req.params.id], function(err, result) {
    			// handle an error from the query
				if(handleError(err)) return;
				done();
				res.status(200).json({result: 'success', data:{count : result.rowCount}});
      		});
      	
    	} else {
	    	done();
	    	res.status(400).json({ result: 'error', data:{error: 'id is required'} });
    	}
   
  	});
};