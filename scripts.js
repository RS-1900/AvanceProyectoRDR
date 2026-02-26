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

/************ */

// para registrarse
const registroForm = document.getElementById("registroForm");

if (registroForm) {
    registroForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const correo = document.querySelector(".correo").value;        
        const username = document.querySelector(".username").value;
        const password = document.querySelector(".password").value;

        // Obtener usuarios guardados o array vacío
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        let correos = JSON.parse(localStorage.getItem("correos")) || [];

        // Verificar si el usuario ya existe
        const existe = usuarios.some(user => user.username === username);
        // Verificar si el correo ya existe
        const existe2 = correos.some(email => email.correo === correo);        

        if (existe) {
            alert("El usuario ya existe");
            return;
        }

        if (existe2) {
            alert("El correo no es valido");
            return;
        }


        // Guardar nuevo usuario
        usuarios.push({ username, password, correo });
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        alert("Usuario creado correctamente");

        // Redirigir a pagos.html despues de crear cuenta
        window.location.href = "pagos.html";
    });
}

// iniciar sesion
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const correo = document.querySelector(".correo").value;        
        const username = document.querySelector(".username").value;
        const password = document.querySelector(".password").value;

        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // Buscar usuario
        const usuarioValido = usuarios.find(
            user => user.username === username && user.password === password && user.correo
        );

        if (usuarioValido) {
            alert("Inicio de sesión correcto");
            localStorage.setItem("usuarioActivo", usuarioValido.username)
            window.location.href = "paginaprincipal.html";
        } else {
            alert("Usuario, contraseña o correo incorrectos");
        }
    });
}


//pa cerrar la sesion
const logoutBtn = document.querySelector(".logout-btn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        // Borra la sesión activa
        localStorage.removeItem("usuarioActivo");

        // Redirige al login
        window.location.href = "index.html";
    });
}


function myFunction() {
    window.location.href = "paginaprincipal.html";
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

const movies = [
    { 
        title: "Acción 1", 
        genre: "action",
        image: "./assets/img/images (1).jpg",
        synopsis: "Una explosiva misión donde el héroe debe salvar la ciudad."
    },
    { 
        title: "Comedia 1", 
        genre: "comedy",
        image: "assets/img/image.webp",
        synopsis: "Una historia llena de humor y situaciones inesperadas."
    },
    { 
        title: "Drama 1", 
        genre: "drama",
        image: "assets/img/famous-memes-as-posters-for-disney-pixar-movies-v0-ip2hni6h3lhc1.jpg",
        synopsis: "Un drama profundo sobre decisiones difíciles."
    },
    { 
        title: "Acción 2", 
        genre: "action",
        image: "assets/img/images.jpg",
        synopsis: "Un ex-agente vuelve para una última misión."
    },
];

const moviesContainer = document.getElementById('movies');
const filterBtns = document.querySelectorAll('.filter-btn');

function displayMovies(genre = 'all') {

    moviesContainer.innerHTML = '';

    const filteredMovies = genre === 'all'
        ? movies
        : movies.filter(m => m.genre === genre);

    filteredMovies.forEach((movie, index) => {

        const card = document.createElement('div');
        card.className = 'movie-card';

        card.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}">
            <h3>${movie.title}</h3>
        `;

        card.addEventListener("click", () => {
            mostrarDetalleMovies(index);
        });

        moviesContainer.appendChild(card);
    });
}

function mostrarDetalleMovies(index){

    const movie = movies[index];

    overlay.innerHTML = `
        <div class="detalle-contenido">
            <button class="cerrar">X</button>
            <img src="${movie.image}" class="detalle-img">
            <div class="detalle-info">
                <h1>${movie.title}</h1>
                <p>${movie.synopsis}</p>
            </div>
        </div>
    `;

    overlay.classList.add("activo");
    document.body.style.overflow = "hidden";

    overlay.querySelector(".cerrar").onclick = cerrarDetalle;
}

function cerrarDetalle(){
    overlay.classList.remove("activo");
    document.body.style.overflow = "auto";
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {

        document.querySelector('.filter-btn.active')
            ?.classList.remove('active');

        btn.classList.add('active');
        displayMovies(btn.dataset.genre);
    });
});

displayMovies();