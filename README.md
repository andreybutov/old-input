# old-input
Middleware to recall previously submitted form values in Node.js and Express.

When a user submits a form with data, and the submitted data fails validation, your app would typically redirect the user back to the same form page, perhaps with an error to display.

This middleware allows you to easily recall the previously POSTed form values, so you can re-populate the form, as needed, after the redirect.

## Requirements

This middleware requires the [body-parser](https://github.com/expressjs/body-parser) and the [express-session](https://github.com/expressjs/session) modules. In addition, the [sanitizer](https://github.com/theSmaw/Caja-HTML-Sanitizer) module is used to sanitize the POSTed data.

**NOTE:** The `body-parser` and `express-session` middleware must be used in the app before using `old-input`, as `old-input` requires the presence of `req.body` and `req.session`.

## Installation

```sh
$ npm install old-input
```

## Example

### Setup
```js
var express = require('express');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var oldInput = require('old-input');

var app = express()

app.use(bodyParser.urlencoded({ extended: false }))

app.use(expressSession({ 
	secret: 'your secret', 
	resave: true,
	saveUninitialized: false
}));

app.use(oldInput);

```

On POST requests, `old-input` will automatically save the `req.body` POST data. If the POST fails validation and you need to redirect the user back to the same form page, `old-input` will make the previous POST data available to you in the next GET request.

### Usage
```js
app.post('/signup', function(req, res) {
	// req.body POST data validation fails ...
	// redirect back to the signup page
	res.redirect('/signup');
});
```

```js
app.get('/signup', function(req, res) {
	// req.oldInput will contain the POST data submitted
	// by the user in the previous POST request.
	res.render('signup', { 
		oldInput: req.oldInput
	});
});
```

```html
<!-- signup.ejs -->
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Sign up page</title>
	</head>
	<body>
		<form action="" method="post">
			<input type="text" name="username" value="<%= oldInput.value('username') %>" />
			
			<input type="password" name="password" value="<%= oldInput.value('password') %>" />
			
			<input type="password" name="passwordConfirmation" value="<%= oldInput.value('passwordConfirmation') %>" />
			
			<input type="submit" value="Sign up">
		</form>
	</body>
</html>
```

### Associating Error Messages with Input Fields

You can optionally associate error messages with previous POST input field. This makes it easy to retrieve and display individual error messages next to the form fields that failed validation.

```js
app.post('/signup', function(req, res) {
	var email = req.body.email;
	
	// ... email validation fails
	
	req.oldInput.setError('email', 'Please enter a valid email address.');
	
	res.redirect('/signup');
});
```

```html
<!-- signup.ejs -->

... 

<% if ( oldInput.error('email') ) { %>
	<strong><span class='label label-danger'><%= oldInput.error('email') %></span></strong>
<% } %>		
		
<input type="text" name="email" value="<%= oldInput.value('email') %>" />
			
...

```

## License

[MIT](LICENSE)
