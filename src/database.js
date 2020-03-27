
//Archivo para establecer la conexión con la base de datos
const mongoose = require('mongoose');

//mongodb+srv://atlas-admin:<password>@atlastar-vkqae.mongodb.net/test?retryWrites=true&w=majority

mongoose.connect('mongodb+srv://atlas-admin:admintavo@atlastar-vkqae.mongodb.net/ObservatorioEgresados?retryWrites=true&w=majority',{
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(db => console.log('db is connect'))
.catch(err => console.error(err));
