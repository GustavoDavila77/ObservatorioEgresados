/*
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

// esto es para usar las promesas que nos ofrece js */
/*db.Promise = global.Promise;

async function connect(url) {
    await db.connect(url, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
         }
        );
   console.log('[db] Conectada con éxito');

module.exports = connect; 
}*/

