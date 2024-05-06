function obtenerCarritoLS() {
    let carrito = []

    let carritoLS = JSON.parse(localStorage.getItem("carrito"))
    if(carritoLS){
        carrito = carritoLS
    }

    return carrito
}

function agregarAlCarrito(servicios, e) {
    let carrito = obtenerCarritoLS()

    let idServicio = Number(e.target.id)
    let posicion = carrito.findIndex((service) => service.id === idServicio);
    let servicioBuscado = servicios.find((service) => service.id === idServicio);

    if (posicion !== -1) {
        carrito[posicion].unidades++
        carrito[posicion].subtotal = carrito[posicion].precio * carrito[posicion].unidades
    } else {
        carrito.push({
            id: servicioBuscado.id,
            img: servicioBuscado.img,
            nombre: servicioBuscado.nombre,
            precio: servicioBuscado.precio,
            subtotal: servicioBuscado.precio,
            unidades: 1,
        })
    }

    localStorage.setItem("carrito", JSON.stringify(carrito))
    renderizarCarrito(carrito)
}

function crearTarjetas(servicios) {
    let sectionMantenimiento = document.getElementById("mantenimiento")
    let sectionReparacion = document.getElementById("reparacion")
    let sectionOptimizacion = document.getElementById("optimizacion")

    sectionMantenimiento.innerHTML = ""
    sectionReparacion.innerHTML = ""
    sectionOptimizacion.innerHTML = ""

    servicios.forEach(servicio => {
        let tarjetaServicio = document.createElement("article")

        tarjetaServicio.innerHTML = `
            <img src=../img/${servicio.img} class="card-img-top">
            <div class="card-body">
                <h3 class="card-title">${servicio.nombre}</h3>
                <p class="card-text">${servicio.descripcion}</p>
                <p class="card-text"> $${servicio.precio}</p>
                <button class="mi-button">Ver más</button>
                <button id="${servicio.id}" class="mi-button">Agregar al carrito</button>
            </div>
        `
        tarjetaServicio.className = "card mb-3 shadow"
        if(servicio.categoria === "MANTENIMIENTO"){
            sectionMantenimiento.append(tarjetaServicio)
        }else if(servicio.categoria === "REPARACION")
        {
            sectionReparacion.append(tarjetaServicio)
        }else{
            sectionOptimizacion.append(tarjetaServicio)
        }

        let botonCarrito = document.getElementById(servicio.id)
        botonCarrito.addEventListener("click", (e) => agregarAlCarrito(servicios, e))
    })
} 


function filtrarServicios(servicios, categoria) {
    let serviciosFiltrados = servicios.filter(servicio => servicio.categoria === categoria.toUpperCase())
    return serviciosFiltrados;
}

function renderizar(servicios, categoria) {

    let serviciosFiltrados = ""

    if(categoria === ""){
        serviciosFiltrados = servicios
    }else{
        serviciosFiltrados = filtrarServicios(servicios, categoria)
    }

    crearTarjetas(serviciosFiltrados)
}

function eliminarServicio(e) {
    let carrito = obtenerCarritoLS()
    let id = Number(e.target.id.substring(7))
    
    carrito = carrito.filter((servicio) => servicio.id !== id)

    localStorage.setItem("carrito", JSON.stringify(carrito))

    e.target.parentElement.remove()
}

function renderizarCarrito(){
    let carrito = obtenerCarritoLS()

    let contenedor = document.getElementById("contenedorCarrito")
    contenedor.innerHTML = ""

    carrito.forEach((servicio) => {
        let tarjetaCarrito = document.createElement("div")

        tarjetaCarrito.className = "tarjetaCarrito"
        tarjetaCarrito.innerHTML = `
            <img src=../img/${servicio.img}>
            <h3>${servicio.nombre}</h3>
            <p> Unidades: ${servicio.unidades}</p>
            <p> Precio: $${servicio.subtotal}</p>
            <button id="carrito${servicio.id}" class="mi-button">Eliminar</button>
        `
        contenedor.append(tarjetaCarrito)

        let botonEliminar = document.getElementById(`carrito${servicio.id}`)
        botonEliminar.addEventListener("click", eliminarServicio)
    })
}

function switchCarrito(e) {
    let contenedorServicios = document.getElementById("contenedorServicios")
    let contenedorCarrito = document.getElementById("contenedorCarrito")

    contenedorCarrito.classList.toggle("oculto")
    contenedorServicios.classList.toggle("oculto")

    if(e.target.innerText === "Ver servicios"){
        e.target.innerText = "Ver carrito"
    }else{
        e.target.innerText = "Ver servicios"
    }
}

function finalizarCompra() {
    localStorage.removeItem("carrito")
    renderizarCarrito([])
    alert("¡Muchas gracias por su compra!")
}

function main() {
    let servicios = [
        {id: 1, categoria: "MANTENIMIENTO", nombre: "Mantenimiento de PC y Notebook", descripcion: "Nuestro servicio de Mantenimiento es uno de los más completos del mercado. Y te lo vamos a detallar a continuación...", precio: 20000, img: "mantenimientoPC.webp"},
        {id: 2, categoria: "MANTENIMIENTO", nombre: "Limpieza de PC y Notebook",descripcion: "Nuestro servicio de limpieza, se enfoca más especificamente en el Hardware, en los componentes físicos...", precio: 15000, img: "limpiezaPC.webp"},
        {id: 3, categoria: "REPARACION", nombre: "Reparación de PC y Notebook", descripcion: "Nuestro servicio de reparación se centra en la búsqueda exhaustiva y diagnóstico del problema, para aplicar la solución adecuada...", precio: 30000, img:"reparacionPC.webp"},
        {id: 4, categoria: "REPARACION", nombre: "Reemplazo de componentes", descripcion:"En este caso, vamos a reemplazar un componente del equipo para optimizarlo o repararlo, implica...", precio: 5000, img: "remplazoComponentesPC.webp"},
        {id: 5, categoria: "OPTIMIZACION", nombre: "Mejora de rendimiento en PC y Notebook", descripcion: "Cuando quieras mejorar el rendimiento de tu equipo, ya sea para trabajo o gaming, elegí esta opción...", precio: 15000, img: "optimizacionPC.webp"},
        {id: 6, categoria: "OPTIMIZACION", nombre: "Actualización de PC y Notebook", descripcion:"Realizamos un Upgrade de tu equipo para llevarlo al siguiente nivel...", precio: 10000, img:"actualizacionPC.webp"},
    ];

    renderizarCarrito()

    let botonComprar = document.getElementById("comprar")
    botonComprar.addEventListener("click", finalizarCompra)

    let botonOcultar = document.getElementById("ocultar")
    botonOcultar.addEventListener("click", switchCarrito)

    let drop = document.getElementById("dropDown")
    renderizar(servicios, "")
    drop.addEventListener("change", () => renderizar(servicios, drop.value))
}
//Llamamos a la función Principal
main();