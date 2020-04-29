const mongoose = require('mongoose');
const { dbURL } = require('../config');

const options = { useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

mongoose.connect(dbURL, options, (error)=>{
    if(!error){
        console.log("Success Connected");
    }
    else{
        console.log("Error Connecting to database.");
    } 
});

module.exports = mongoose;