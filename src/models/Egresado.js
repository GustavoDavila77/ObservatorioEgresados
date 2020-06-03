const mongoose = require('mongoose');
const { Schema } = mongoose; //requiero solo su esquema
const bcrypt = require('bcryptjs');
const passportLocalMongoose = require('passport-local-mongoose');

// TODO add egresadohabilitado: 0/1
const UserSchema = new Schema({
        //permiso: {type: String, default: 3}
        name: {type: String, required:true},
        lastname: {type: String, required: true},
        email: {type: String, required: true},
        password: {type:String, required: true},
        dni: {type: String, require: true},
        country: {type: String, required: true},
        city: {type: String, required: true},
        interests: {type: String, required: true},
        age: {type: Number, require: true},
        gender: {type: String, require: true},
        tipouser: {type: String, required: true}      
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

const egresado = mongoose.model('egresados', UserSchema);
module.exports = egresado;