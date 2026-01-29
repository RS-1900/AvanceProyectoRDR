class usuario{
    constructor(username, password){
        this.username = username;
        this.password = password;
    }
}


class capitulo {
    constructor(titulo,descripcion,duracion,miniatura){
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.duracion = duracion;
        this.miniatura = miniatura;
        
    }
}
class streaming {
    constructor (titulo, descripcion, categoria,miniatura){
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.duracion = 0;
        this.miniatura = miniatura;       
        this.capitulos = [];
        this.categoria = categoria;
    }
    calcularDuracion(){
        let duracionTemp;
        this.capitulos.forEach(elemento => {
            duracionTemp += Number(elemento.duracion);
        })
        this.duracion = duracionTemp;
    }
    agregarCapitulo(titulo,descripcion,duracion){
        const capitulo = new capitulo(titulo,descripcion,duracion);
        this.capitulos.push(capitulo);
        this.calcularDuracion;
    }
    
}