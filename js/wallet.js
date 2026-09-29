// ==========================================
// MI WALLET - JAVASCRIPT PRINCIPAL
// ==========================================


// ==========================================
// FUNCIONES GENERALES
// ==========================================

function obtenerSaldo() {

    let saldo = Number(localStorage.getItem("saldo"));

    if (isNaN(saldo)) {

        saldo = 500000;

        localStorage.setItem("saldo", saldo);
    }

    return saldo;
}


function guardarSaldo(saldo) {

    localStorage.setItem("saldo", saldo);
}


function formatoDinero(monto) {

    return "$" + Number(monto).toLocaleString("es-CL");
}


function mostrarSaldo() {

    if ($("#saldoActual").length) {

        $("#saldoActual").text(
            formatoDinero(obtenerSaldo())
        );

    }

}


// ==========================================
// MOVIMIENTOS
// ==========================================

function obtenerMovimientos() {

    let movimientos =
        JSON.parse(
            localStorage.getItem("movimientos")
        );

    if (!Array.isArray(movimientos)) {

        movimientos = [];

    }

    return movimientos;
}


function guardarMovimiento(movimiento) {

    let movimientos = obtenerMovimientos();

    movimientos.unshift(movimiento);

    localStorage.setItem(
        "movimientos",
        JSON.stringify(movimientos)
    );

}


function getTipoTransaccion(tipo) {

    switch (tipo) {

        case "deposito":
            return "Depósito";

        case "retiro":
            return "Retiro";

        case "compra":
            return "Compra";

        case "transferencia_recibida":
            return "Transferencia recibida";

        case "transferencia_enviada":
            return "Transferencia enviada";

        default:
            return "Movimiento";

    }

}


// ==========================================
// ALERTAS BOOTSTRAP
// ==========================================

function mostrarAlerta(mensaje, tipo) {

    if (!$("#alert-container").length) {

        return;

    }

    let alerta = `
        <div
            class="alert alert-${tipo} alert-dismissible fade show"
            role="alert"
        >

            ${mensaje}

            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="alert"
            ></button>

        </div>
    `;

    $("#alert-container").html(alerta);

}


// ==========================================
// LOGIN
// ==========================================

$("#loginForm").on("submit", function (e) {

    e.preventDefault();

    let email = $("#email").val().trim();

    let password = $("#password").val().trim();


    // Credenciales de prueba
    if (
        email === "usuario@wallet.cl" &&
        password === "123456"
    ) {

        localStorage.setItem(
            "usuarioLogueado",
            email
        );

        window.location.href = "menu.html";

    } else {

        mostrarAlerta(
            "Correo electrónico o contraseña incorrectos.",
            "danger"
        );

    }

});

// ==========================================
// MENÚ PRINCIPAL
// ==========================================

$(document).ready(function () {

    mostrarSaldo();


    $("#btnDepositar").on("click", function () {

        window.location.href = "deposit.html";

    });


    $("#btnRetirar").on("click", function () {

        window.location.href = "withdraw.html";

    });


    $("#btnEnviar").on("click", function () {

        window.location.href = "sendmoney.html";

    });


    $("#btnMovimientos").on("click", function () {

        window.location.href = "transactions.html";

    });

});


// ==========================================
// DEPÓSITOS
// ==========================================

$("#depositForm").on("submit", function (e) {

    e.preventDefault();


    let monto = Number(
        $("#montoDeposito").val()
    );


    if (isNaN(monto) || monto <= 0) {

        mostrarAlerta(
            "Ingresa un monto válido.",
            "danger"
        );

        return;

    }


    let saldoActual = obtenerSaldo();

    let nuevoSaldo = saldoActual + monto;


    guardarSaldo(nuevoSaldo);


    guardarMovimiento({

        tipo: "deposito",

        monto: monto,

        descripcion: "Depósito realizado",

        fecha: new Date().toLocaleString("es-CL")

    });


    $("#depositoRealizado").html(`

        <div class="alert alert-success mt-3">

            Depósito realizado correctamente.

            <br>

            Monto:

            <strong>
                ${formatoDinero(monto)}
            </strong>

            <br>

            Nuevo saldo:

            <strong>
                ${formatoDinero(nuevoSaldo)}
            </strong>

        </div>

    `);


    mostrarAlerta(
        "Depósito realizado correctamente.",
        "success"
    );


    $("#depositForm")[0].reset();


    setTimeout(function () {

        window.location.href = "menu.html";

    }, 2000);

});


// ==========================================
// RETIROS
// ==========================================

$("#withdrawForm").on("submit", function (e) {

    e.preventDefault();


    let monto = Number(
        $("#montoRetiro").val()
    );


    if (isNaN(monto) || monto <= 0) {

        mostrarAlerta(
            "Ingresa un monto válido.",
            "danger"
        );

        return;

    }


    let saldoActual = obtenerSaldo();


    if (monto > saldoActual) {

        mostrarAlerta(
            "No tienes saldo suficiente para realizar este retiro.",
            "danger"
        );

        return;

    }


    let nuevoSaldo = saldoActual - monto;


    guardarSaldo(nuevoSaldo);


    guardarMovimiento({

        tipo: "retiro",

        monto: monto,

        descripcion: "Retiro de dinero",

        fecha: new Date().toLocaleString("es-CL")

    });


    $("#retiroRealizado").html(`

        <div class="alert alert-success mt-3">

            Has retirado:

            <strong>
                ${formatoDinero(monto)}
            </strong>

            <br>

            Nuevo saldo:

            <strong>
                ${formatoDinero(nuevoSaldo)}
            </strong>

        </div>

    `);


    mostrarAlerta(
        "Retiro realizado correctamente.",
        "success"
    );


    $("#withdrawForm")[0].reset();


    setTimeout(function () {

        window.location.href = "menu.html";

    }, 2000);

});


// ==========================================
// CONTACTOS
// ==========================================

function obtenerContactos() {

    let contactos =
        JSON.parse(
            localStorage.getItem("contactos")
        );


    if (!Array.isArray(contactos)) {

        contactos = [];

    }


    return contactos;

}


function guardarContactos(contactos) {

    localStorage.setItem(
        "contactos",
        JSON.stringify(contactos)
    );

}


function mostrarContactos() {

    if (!$("#listaContactos").length) {

        return;

    }


    $("#listaContactos").empty();


    let contactos = obtenerContactos();


    contactos.forEach(function (contacto) {

        let boton = `

            <button
                type="button"
                class="list-group-item
                       list-group-item-action
                       contacto"
                data-nombre="${contacto.nombre}"
                data-alias="${contacto.alias}"
                data-cbu="${contacto.cbu}"
            >

                <strong>
                    ${contacto.nombre}
                </strong>

                <br>

                <small>
                    @${contacto.alias}
                </small>

            </button>

        `;


        $("#listaContactos").append(boton);

    });

}


// Mostrar formulario nuevo contacto

$("#btnAgregarContacto").on("click", function () {

    $("#formNuevoContacto").show();

});


// Cancelar nuevo contacto

$("#btnCancelarContacto").on("click", function () {

    $("#formNuevoContacto").hide();

});


// Crear contacto

$("#nuevoContactoForm").on("submit", function (e) {

    e.preventDefault();


    let nombre =
        $("#nuevoNombre").val().trim();


    let alias =
        $("#nuevoAlias").val().trim();


    let cbu =
        $("#nuevoCBU").val().trim();


    if (
        nombre === "" ||
        alias === "" ||
        cbu === ""
    ) {

        mostrarAlerta(
            "Completa todos los datos del contacto.",
            "danger"
        );

        return;

    }


    if (!/^[0-9]{6,20}$/.test(cbu)) {

        mostrarAlerta(
            "El CBU debe contener entre 6 y 20 números.",
            "danger"
        );

        return;

    }


    let contactos = obtenerContactos();


    let existe = contactos.some(function (contacto) {

        return contacto.cbu === cbu;

    });


    if (existe) {

        mostrarAlerta(
            "Este contacto ya existe.",
            "warning"
        );

        return;

    }


    let nuevoContacto = {

        nombre: nombre,

        alias: alias,

        cbu: cbu

    };


    contactos.push(nuevoContacto);


    guardarContactos(contactos);


    mostrarContactos();


    mostrarAlerta(
        "Contacto agregado correctamente.",
        "success"
    );


    $("#nuevoContactoForm")[0].reset();

    $("#formNuevoContacto").hide();

});


// ==========================================
// SELECCIONAR CONTACTO
// ==========================================

$(document).on(
    "click",
    ".contacto",
    function () {

        $(".contacto").removeClass(
            "seleccionado"
        );


        $(this).addClass(
            "seleccionado"
        );


        let nombre =
            $(this).data("nombre");


        $("#contactoSeleccionado")
            .text(nombre);


        $("#formEnvio").show();

    }
);


// ==========================================
// BUSCAR CONTACTOS
// ==========================================

$("#buscarContacto").on(
    "input",
    function () {

        let termino =
            $(this).val()
            .toLowerCase()
            .trim();


        $(".contacto").each(function () {

            let nombre =
                String(
                    $(this).data("nombre")
                ).toLowerCase();


            let alias =
                String(
                    $(this).data("alias")
                ).toLowerCase();


            if (
                nombre.includes(termino) ||
                alias.includes(termino)
            ) {

                $(this).show();

            } else {

                $(this).hide();

            }

        });

    }
);


// ==========================================
// ENVIAR DINERO
// ==========================================

$("#sendMoneyForm").on(
    "submit",
    function (e) {

        e.preventDefault();


        let contacto =
            $(".contacto.seleccionado");


        if (!contacto.length) {

            mostrarAlerta(
                "Selecciona un contacto.",
                "danger"
            );

            return;

        }


        let monto =
            Number(
                $("#montoEnvio").val()
            );


        if (
            isNaN(monto) ||
            monto <= 0
        ) {

            mostrarAlerta(
                "Ingresa un monto válido.",
                "danger"
            );

            return;

        }


        let saldoActual =
            obtenerSaldo();


        if (monto > saldoActual) {

            mostrarAlerta(
                "No tienes saldo suficiente.",
                "danger"
            );

            return;

        }


        let nombreContacto =
            contacto.data("nombre");


        let aliasContacto =
            contacto.data("alias");


        let cbuContacto =
            contacto.data("cbu");


        let nuevoSaldo =
            saldoActual - monto;


        guardarSaldo(nuevoSaldo);


        guardarMovimiento({

            tipo: "transferencia_enviada",

            monto: monto,

            descripcion:
                "Transferencia a " +
                nombreContacto,

            destinatario:
                nombreContacto,

            alias:
                aliasContacto,

            cbu:
                cbuContacto,

            fecha:
                new Date()
                .toLocaleString("es-CL")

        });


        mostrarAlerta(
            `Transferencia realizada correctamente a ${nombreContacto} por ${formatoDinero(monto)}.`,
            "success"
        );


        $("#sendMoneyForm")[0].reset();


        $(".contacto")
            .removeClass("seleccionado");


        $("#formEnvio").hide();


        mostrarSaldo();

    }
);


// ==========================================
// MOSTRAR MOVIMIENTOS
// ==========================================

function mostrarUltimosMovimientos(
    filtro = "todos"
) {

    if (!$("#listaMovimientos").length) {

        return;

    }


    let movimientos =
        obtenerMovimientos();


    let movimientosFiltrados =
        movimientos;


    if (filtro !== "todos") {

        movimientosFiltrados =
            movimientos.filter(
                function (movimiento) {

                    return movimiento.tipo === filtro;

                }
            );

    }


    $("#listaMovimientos").empty();


    if (
        movimientosFiltrados.length === 0
    ) {

        $("#listaMovimientos").html(`

            <div class="alert alert-info">

                No existen movimientos para mostrar.

            </div>

        `);

        return;

    }


    movimientosFiltrados.forEach(
        function (movimiento) {


            let esIngreso =
                movimiento.tipo === "deposito" ||
                movimiento.tipo ===
                "transferencia_recibida";


            let clase =
                esIngreso
                    ? "border-success"
                    : "border-danger";


            let signo =
                esIngreso
                    ? "+"
                    : "-";


            let destinatario = "";


            if (movimiento.destinatario) {

                destinatario = `

                    <small class="d-block">

                        Destinatario:
                        ${movimiento.destinatario}

                    </small>

                `;

            }


            let movimientoHTML = `

                <div
                    class="border rounded p-3 mb-2 ${clase}"
                >

                    <div
                        class="d-flex
                               justify-content-between"
                    >

                        <strong>

                            ${getTipoTransaccion(
                                movimiento.tipo
                            )}

                        </strong>


                        <strong>

                            ${signo}${formatoDinero(
                                movimiento.monto
                            )}

                        </strong>

                    </div>


                    <div>

                        ${movimiento.descripcion}

                    </div>


                    ${destinatario}


                    <small class="text-muted">

                        ${movimiento.fecha}

                    </small>

                </div>

            `;


            $("#listaMovimientos").append(
                movimientoHTML
            );

        }
    );

}


// ==========================================
// FILTRO DE MOVIMIENTOS
// ==========================================

$("#filtroTipo").on(
    "change",
    function () {

        mostrarUltimosMovimientos(
            $(this).val()
        );

    }
);


// ==========================================
// INICIO
// ==========================================

$(document).ready(function () {

    mostrarContactos();

    mostrarUltimosMovimientos();

});
