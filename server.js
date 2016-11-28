var express = require('express')

var path = require('path')

var morgan = require('morgan')
var methodOverride = require('method-override')

var port = process.env.PORT || 3000 

var app = express()



// view engine setup
app.set('views', path.join(__dirname, 'app/views/pages'))
app.set('view engine', 'jade')

//public modules setup
app.use(express.static(path.join(__dirname, 'public')))


//


console.log("App started on port : "+ port)
