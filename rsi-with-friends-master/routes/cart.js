"use strict";

// UUID
var uuid = require('node-uuid');

// Dates
var dateutil = require('dateutil');

//-------------------------------------------------------------------------------------------
// Create a Cart
exports.createCart = function(req, res) {
	
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
		if(req.body.) {

			var queryText = 'INSERT INTO cart (id, id_product, quantity, date_created) VALUES ($1, $2, $3, $4) RETURNING id, id_product'
			client.query(queryText, [uuid.v4(), req.body.id_product, req.body.quantity, dateutil.date(),], function(err, result) {
				done();
				// handle an error from the query
				if(handleError(err)) return;
				res.status(200).json({result: 'success', data:{ id : result.rows[0].id, id_product : result.rows[0].id_product }});	
			});
	  	
		} else {
			done();
	    	res.status(400).json({ result: 'error', data:{error: 'id_product is required'} });
		}
		
	});
	
}


//---------------------------------------------------------------------------------------
// Update a Cart
exports.updateCart = function(req, res) {
	
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
			if(req.body) {
			
				if(req.body.id) {	
					
					var queryText = 'UPDATE cart SET date_created = $2';			
					var argumentCount = 2;
					var valueArray = [req.body.id, dateutil.date()];
										
					if(req.body.quantity) {
						argumentCount = argumentCount + 1;
						queryText = queryText + ', quantity = $' + argumentCount; 
						valueArray.push(req.body.quantity);
					}
					if(req.body.id_product) {
						argumentCount = argumentCount + 1;
						queryText = queryText + ', id_product = $' + argumentCount; 
						valueArray.push(req.body.id_product);
					}
				
					queryText = queryText + ' WHERE id = $1 RETURNING id;';
		
					// Remove for production
					console.log("Query: " + queryText);
					console.log("Values: " + valueArray);
					// End
					
					client.query(queryText, valueArray, function(err, result) {
		    			// handle an error from the query
						if(handleError(err)) return;
						done();
						if(result.rowCount > 0) {
							res.status(200).json({result: 'success', data:{ id : result.rows[0].id }});
						} else {
							res.status(400).json({ error: 'id not found' });	
						}
	      		});
      		
      		} else {
	      		done();
	      		res.status(400).json({ result:'error', data:{ error:'the cart id is required inside the body object'} });
    		}
      	
    	} else {
	    	done();
	    	res.status(400).json({ result:'error', data:{ error:'Missing body object' } });
    	}
   
  	});
};





//---------------------------------------------------------------------------------------
// Delete the Cart
exports.deleteCart = function(req, res) {
	
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
			
			var queryText = 'DELETE FROM cart WHERE id = $1'
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