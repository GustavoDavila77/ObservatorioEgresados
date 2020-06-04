const { Schema, model } = require('mongoose'); //requiero solo su esquema y modelo

// TODO add intereses y poner default '' para cuando no se suba una imagen
const noticeSchema = new Schema({
    title: {type: String, required:true},
    description: {type: String, required: true},
    filenameimg: {type: String},
    pathimg: {type: String},
    originalnameimg: {type: String},
    mimetype: {type: String},
    sizeimg: {type: Number},
    createdimg: {type: Date, default: Date.now()}
});

const noticia = model('noticias', noticeSchema);
module.exports = noticia;