//Clases
class capitulo {
    constructor(titulo,descripcion,miniatura){
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.miniatura = miniatura;      
    }
}
class contenido {
    constructor(titulo, descripcion, miniatura) {
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.duracion = 0;
        this.miniatura = miniatura;
        this.capitulos = [];
    }
    calcularDuracion() {
        let duracionTemp = 0;
        this.capitulos.forEach(c => {
            duracionTemp += Number(c.duracion);
        });
        this.duracion = duracionTemp;
    }
    agregarCapitulo(titulo, descripcion, duracion, miniatura = "") {
        const nuevoCapitulo = new capitulo(titulo,descripcion,duracion,miniatura);
        this.capitulos.push(nuevoCapitulo);
        this.calcularDuracion();
    }
}

class gestorDeContenido {
    constructor(){
        this.contenidos = [];
    }
    agregarContenido(titulo,descripcion,miniatura){
        const content = new contenido(titulo,descripcion,miniatura);
        this.contenidos.push(content);
    }
}
//Funciones de overlay
function mostrarDetalle(index){
    const contenido = gestor.contenidos[index];

    overlay.innerHTML = `
        <button class = "cerrar">X</button>
        <img src="${contenido.miniatura}" class="dettalle-img">
        <h1>${contenido.titulo}</h1>
        <p>${contenido.descripcion}</p>

        <h3>Capítulos</h3>
        <ul>
        ${
            contenido.capitulos.length
            ? contenido.capitulos.map(c => 
                `<li>${c.titulo} - ${c.duracion} min</li>`
                ).join('')
            : '<li>No Chapters</li>'
        }
        </ul>
    `;
    overlay.classList.add("activo");
    document.body.style.overflow = "hidden";

    overlay.querySelector(".cerrar").onclick = cerrarDetalle;
}
function cerrarDetalle(){
    overlay.classList.remove("activo");
    document.body.style.overflow = "";
}

//Codigo de la página
const overlay = document.getElementById("detalle-overlay")
const gestor = new gestorDeContenido();
let contenedor = document.getElementById("contenedor-catalogo");

const lorem = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam mollitia doloremque molestias saepe temporibus, autem ipsa impedit natus dolorem. Minus expedita assumenda deleniti ea aliquid laudantium quas porro voluptas earum?";
gestor.agregarContenido("ej1",lorem,"./assets/img/imagen-1.webp");
gestor.agregarContenido("ej2",lorem,"./assets/img/imagen-2.webp");
gestor.agregarContenido("ej3",lorem,"./assets/img/imagen-3.webp");
gestor.agregarContenido("ej4",lorem,"./assets/img/imagen-4.webp");
gestor.agregarContenido("ej5",lorem,"./assets/img/imagen-5.webp");
gestor.agregarContenido("ej6",lorem,"./assets/img/imagen-6.webp");

gestor.contenidos.forEach((elemento,index) => {
    let tarjeta = document.createElement('img');
    tarjeta.setAttribute('class', 'card');
    tarjeta.src = elemento.miniatura;
    
    tarjeta.addEventListener("click", ()=> {
        mostrarDetalle(index);
    })

    contenedor.appendChild(tarjeta);
})