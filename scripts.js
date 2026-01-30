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





// para registrarse
const registroForm = document.getElementById("registroForm");

if (registroForm) {
    registroForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = document.querySelector(".username").value;
        const password = document.querySelector(".password").value;

        // Obtener usuarios guardados o array vacío
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // Verificar si el usuario ya existe
        const existe = usuarios.some(user => user.username === username);

        if (existe) {
            alert("El usuario ya existe");
            return;
        }

        // Guardar nuevo usuario
        usuarios.push({ username, password });
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

        const username = document.querySelector(".username").value;
        const password = document.querySelector(".password").value;

        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        // Buscar usuario
        const usuarioValido = usuarios.find(
            user => user.username === username && user.password === password
        );

        if (usuarioValido) {
            alert("Inicio de sesión correcto");
            localStorage.setItem("usuarioActivo", usuarioValido.username)
            window.location.href = "paginaprincipal.html";
        } else {
            alert("Usuario o contraseña incorrectos");
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
        window.location.href = "inicioSesion.html";
    });
}


function myFunction() {
    window.location.href = 'paginaprincipal.html';
}