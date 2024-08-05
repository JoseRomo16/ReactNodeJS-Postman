
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const saltRounds = 10;

const  UserSchema = new mongoose.Schema(
    {
        usuario:   {type: String, required: true},
        password:  {type: String, required: true, unique:true}
    }
);

// función que se realiza antes de que se ejecute y nos permite guardar el password

UserSchema.pre('save', function(next){  //antes que se ejecute ejecutamos la sgte funcion
    if(this.isNew || this.isModified('password')){ //validamos si es nuevo o será modificado
        const document = this;

        bcrypt.hash(document.password, saltRounds, (err, hashedPassword)=>{  //encripta el passw, por ultimo es un collback
            if(err){
                next(err); //continue el fllujo de la función
            }else{
                document.password = hashedPassword; //el password es el nuevo has
                next();
            }
        })

    }else{
        next(); //no redirige a la siguiente función
    }
});

UserSchema.methods.isCorrectPassword = function(password, collback){
    bcrypt.compare(password, this.password, function(err, same){
        if(err){
            collback(err);
        }else{
            collback(err, same);
        }
    });

}

module.exports = mongoose.model('User',UserSchema);
