const mongoose = require('mongoose');
const databaseURL = 'mongodb://localhost:27017/Shareventory';

const options = { useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false };

mongoose.connect(databaseURL, options, (error)=>{
    if(!error)
        {
            console.log("Success Connected");
        }
    else
        {
            console.log("Error Connecting to database.");
        } 
});

module.exports = mongoose;