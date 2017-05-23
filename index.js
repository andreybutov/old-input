// ============================================================================
//
// old-input
// 
// Middleware to recall previously submitted 
// form values in Node.js and Express.
//
// https://github.com/andreybutov/old-input
//
// (c) 2017, Andrey Butov
// http://andreybutov.com
//
// ============================================================================


const sanitizer = require('sanitizer');


module.exports = function(req, res, next)
{
	if ( req.method === 'POST' )
	{
		// Extract the POST key/val pairs from the request
		// and store in the session.

		req.session.oldInput = {};

		for ( var key in req.body )
		{
			if ( req.body.hasOwnProperty(key) )
			{
				var value = sanitizer.sanitize(req.body[key]);
				req.session.oldInput[key] = value;
			}
		}
	}
	else if ( req.method === 'GET' )
	{
		// 1. Create a new object in the request called oldInput.
		// 2. Fill the oldInput object with POST key/val pairs that we may
		// have stored in the previous POST request.
		// 3. Add a value() function to the oldInput object, as a convenience
		// method to retrieve a POST key/value from the previous POST call. 
		// 4. Clear the previous oldInput data from the session (this is
		// similar to the way "flash" data works in a session.

		req.oldInput = {
			value : function(key) {
				return this[key] || '';
			}
		};

		if ( req.session && req.session.oldInput )
		{
			for ( var key in req.session.oldInput )
			{
				req.oldInput[key] = req.session.oldInput[key];
			}
		}

		req.session.oldInput = {};
	}

	next();
}
