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


function initOldInputInSession(req, name) {
	if ( !req.session.oldInput.hasOwnProperty(name) ) {
		req.session.oldInput[name] = {
			value : '',
			error : ''
		};
	}
}


module.exports = function(req, res, next)
{
	if ( !req.session ) {
		return;
	}

	if ( req.method === 'POST' )
	{
		req.session.oldInput = {};

		for ( var name in req.body ) {
			if ( req.body.hasOwnProperty(name) ) {
				initOldInputInSession(req, name);
				req.session.oldInput[name].value = sanitizer.sanitize(req.body[name]);
			}
		}

		req.oldInput = {
			setError: function(name, error) {
				if ( name ) {
					initOldInputInSession(req, name);
					req.session.oldInput[name].error = error;
				}
			}
		};
	}
	else if ( req.method === 'GET' )
	{
		req.oldInput = {
			value : function(name) {
				if ( this.hasOwnProperty(name) ) {
					return this[name].value || '';
				}
			},

			error : function(name) {
				if ( this.hasOwnProperty(name) ) {
					return this[name].error || '';
				}
			}
		};

		if ( req.session.oldInput ) {
			for ( var name in req.session.oldInput ) {
				req.oldInput[name] = {
					value : req.session.oldInput[name].value,	
					error : req.session.oldInput[name].error
				}
			}
		}

		req.session.oldInput = {};
	}

	next();
}
