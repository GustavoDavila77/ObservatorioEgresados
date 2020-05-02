const mongoose = require('mongoose');
const { Schema } = mongoose; //requiero solo su esquema
const bcrypt = require('bcryptjs');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({

    egresados: {
        //permiso: {type: String, default: 3}
        email: {type: String, required: true},
        password: {type:String, required: true},
        dni: {type: String, require: true},
        personaldata: {
            name: {type: String, required:true},
            lastname: {type: String, required: true},
            country: {type: String, required: true},
            city: {type: String, required: true},
            
        },        
     },
    superusers:{
        email: {type: String, required: true},
        password: {type:String, required: true},
        personaldata: {
            name: {type: String, required:true},
            lastname: {type: String, required: true},
        } 
    },
});

//metodo para retornar la constraseña cifrada
UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10); //generar el hash, iterar 10 veces
    const hash = bcrypt.hash(password, salt); //aplicar el hash a la contraseña
    return hash; 
};

//metodo para comparar la contraseña ingresada contra la contraseña que esta cifrada
UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password); //se compara la contraseña ingresada vs la del modelo
};

UserSchema.plugin(passportLocalMongoose);

const users = mongoose.model('users', UserSchema);
module.exports = users;