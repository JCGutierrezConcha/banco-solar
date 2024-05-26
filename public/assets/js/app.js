const setInfoModal = (nombre, balance, id) => {
    $("#nombreEdit").val(nombre);
    $("#balanceEdit").val(balance);
    $("#editButton").attr("onclick", `editUsuario('${id}')`);
};

const editUsuario = async (id) => {
    const nombre = $("#nombreEdit").val();
    const balance = $("#balanceEdit").val();

    if (!nombre || !balance) {
        alert("Ingrese la información del nombre y el balance");
        return false;
    }
    try {
        const { data } = await axios.put(
            `http://localhost:3000/usuario?id=${id}`,
            {
                nombre,
                balance,
            }
        );
        $("#exampleModal").modal("hide");
        location.reload();
    } catch (e) {
        alert("Algo salió mal..." + e);
    }
};

$("form:first").submit(async (e) => {
    e.preventDefault();
    let nombre = $("form:first input:eq(0)").val();
    let balance = $("form:first input:eq(1)").val();

    if (!nombre || !balance) {
        alert("Ingrese la información del nombre y el balance");
        return false;
    }
    try {
        const response = await fetch("http://localhost:3000/usuario", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nombre,
                balance,
            }),
        });
        $("form:first input:eq(0)").val("");
        $("form:first input:eq(1)").val("");
        location.reload();
    } catch (e) {
        alert("Algo salió mal ..." + e);
    }
});

$("form:last").submit(async (e) => {
    e.preventDefault();
    let emisor = $("form:last select:first").val();
    let receptor = $("form:last select:last").val();
    let monto = $("#monto").val();

    if (!monto || !emisor || !receptor) {
        alert("Debe seleccionar un emisor, receptor y monto a transferir");
        return false;
    }

    if (emisor === receptor) {
        alert("El emisor y el receptor deben ser distintos");
        return false;
    }

    try {
        const response = await fetch("http://localhost:3000/transferencia", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                emisor,
                receptor,
                monto,
            }),
        });
        const data = await response.json();
        location.reload();
    } catch (e) {
        console.log(e);
        alert("Algo salió mal..." + e);
    }
});

const getUsuarios = async () => {
    const response = await fetch("http://localhost:3000/usuarios");
    let data = await response.json();
    $(".usuarios").html("");

    $.each(data, (i, c) => {
        $(".usuarios").append(`
              <tr>
                <td>${c.nombre}</td>
                <td>${c.balance}</td>
                <td>
                  <button
                    class="btn btn-warning mr-2"
                    data-toggle="modal"
                    data-target="#exampleModal"
                    onclick="setInfoModal('${c.nombre}', '${c.balance}', '${c.id}')"
                  >
                    Editar</button
                  ><button class="btn btn-danger" onclick="eliminarUsuario('${c.id}')">Eliminar</button>
                </td>
              </tr>
         `);

        $("#emisor").append(`<option value="${c.nombre}">${c.nombre}</option>`);
        $("#receptor").append(`<option value="${c.nombre}">${c.nombre}</option>`);
    });
};

const eliminarUsuario = async (id) => {
    const response = await fetch(`http://localhost:3000/usuario?id=${id}`, {
        method: "DELETE",
    });
    getUsuarios();
};

const getTransferencias = async () => {
    const { data } = await axios.get("http://localhost:3000/transferencias");
    $(".transferencias").html("");

    data.forEach((t) => {
        $(".transferencias").append(`
       <tr>
         <td> ${formatDate(t.fecha)} </td>
         <td> ${t.emisor} </td>
         <td> ${t.receptor} </td>
         <td> ${t.monto} </td>
       </tr>
     `);
    });
};

getUsuarios();
getTransferencias();

const formatDate = (date) => {
    const dateFormat = moment(date).format("L");
    const timeFormat = moment(date).format("LTS");
    return `${dateFormat} ${timeFormat}`;
};
formatDate();
