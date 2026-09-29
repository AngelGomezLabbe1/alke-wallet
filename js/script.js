// ==========================================
// MI WALLET
// ==========================================

// ==========================================
// OBTENER SALDO
// ==========================================

let saldo = Number(localStorage.getItem("saldo"));

if (isNaN(saldo)) {
    saldo = 500000;
    localStorage.setItem("saldo", saldo);
}


// ==========================================
// OBTENER MOVIMIENTOS
// ==========================================

let movimientos = [];

try {

    const datosGuardados = localStorage.getItem("movimientos");

    if (datosGuardados) {
        movimientos = JSON.parse(datosGuardados);
    }

    if (!Array.isArray(movimientos)) {
        movimientos = [];
    }

} catch (error) {

    console.log("Error al leer movimientos:", error);

    movimientos = [];

}


// ==========================================
// GUARDAR DATOS
// ==========================================

function guardarDatos() {

    localStorage.setItem("saldo", saldo);

    localStorage.setItem(
        "movimientos",
        JSON.stringify(movimientos)
    );

}


// ==========================================
// MOSTRAR SALDO
// ==========================================

function mostrarSaldo() {

    const elementoSaldo = document.getElementById("saldo");

    if (elementoSaldo) {

        elementoSaldo.textContent =
            "$" + saldo.toLocaleString("es-CL");

    }

}


// ==========================================
// REALIZAR DEPÓSITO
// ==========================================

function realizarDeposito(event) {

    event.preventDefault();

    const campoMonto = document.getElementById("monto");

    if (!campoMonto) {
        alert("No se encontró el campo del monto.");
        return;
    }

    const monto = Number(campoMonto.value);

    // Validar monto
    if (isNaN(monto) || monto <= 0) {

        alert("Ingrese un monto válido.");

        return;
    }


    // Aumentar saldo
    saldo += monto;


    // Obtener fecha
    const fecha = new Date().toLocaleDateString("es-CL");


    // Crear movimiento
    const nuevoMovimiento = {

        tipo: "Depósito",

        fecha: fecha,

        monto: monto,

        clase: "text-success"

    };


    // Agregar movimiento
    movimientos.unshift(nuevoMovimiento);


    // Guardar
    guardarDatos();


    // Confirmación
    alert(
        "Depósito realizado correctamente.\n\n" +
        "Monto: $" +
        monto.toLocaleString("es-CL") +
        "\nNuevo saldo: $" +
        saldo.toLocaleString("es-CL")
    );


    // Ir al menú
    window.location.href = "menu.html";

}


// ==========================================
// MOSTRAR MOVIMIENTOS
// ==========================================

function mostrarMovimientos() {

    const lista =
        document.getElementById("listaMovimientos");


    if (!lista) {
        return;
    }


    // Limpiar lista
    lista.innerHTML = "";


    // No hay movimientos
    if (movimientos.length === 0) {

        lista.innerHTML = `
            <li class="list-group-item text-center">
                No hay movimientos registrados.
            </li>
        `;

        return;
    }


    // Mostrar movimientos
    movimientos.forEach(function(movimiento) {

        const elemento =
            document.createElement("li");


        elemento.className =
            "list-group-item d-flex justify-content-between align-items-center";


        elemento.innerHTML = `

            <div>

                <strong>
                    ${movimiento.tipo}
                </strong>

                <br>

                <small class="text-muted">
                    ${movimiento.fecha}
                </small>

            </div>

            <span class="${movimiento.clase}">
                +$${Number(movimiento.monto).toLocaleString("es-CL")}
            </span>

        `;


        lista.appendChild(elemento);

    });

}


// ==========================================
// INICIAR LA PÁGINA
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

    // Mostrar saldo
    mostrarSaldo();


    // Mostrar movimientos
    mostrarMovimientos();


    // Buscar formulario
    const formularioDeposito =
        document.getElementById("formDeposito");


    // Activar depósito
    if (formularioDeposito) {

        formularioDeposito.addEventListener(
            "submit",
            realizarDeposito
        );

    }

});
