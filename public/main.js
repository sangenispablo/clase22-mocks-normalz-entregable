// referencias al dom
const lblOnline = document.querySelector("#lblOnline");
const lblOffline = document.querySelector("#lblOffline");
// Formulario de Productos
const title = document.querySelector("#title");
const price = document.querySelector("#price");
const thumbnail = document.querySelector("#thumbnail");
const formProductos = document.querySelector("#formProductos");
// Formulario del Chat
const authorId = document.querySelector("#authorId");
const authorNombre = document.querySelector("#authorNombre");
const authorApellido = document.querySelector("#authorApellido");
const authorEdad = document.querySelector("#authorEdad");
const authorAlias = document.querySelector("#authorAlias");
const authorAvatar = document.querySelector("#authorAvatar");
const mensaje = document.querySelector("#mensaje");

const formChat = document.querySelector("#formChat");

// normalizacion
const authorSchema = new normalizr.schema.Entity("authors");
const messageSchema = new normalizr.schema.Entity(
  "mensajes",
  { author: authorSchema },
  { idAttribute: "_id" }
);
const global = new normalizr.schema.Entity("global", {
  messages: [messageSchema],
});

const socket = io();

// Consumo el endPoint de productos generados por FakerJS
fetch("/api/productos-test")
  .then((response) => response.json())
  .then(({ data }) => {
    // renderizo el modal para mostrar
    let html = "";
    console.log(data);
    data.forEach((prod) => {
      html =
        html +
        `<tr>
          <th scope="row">${prod.id}</th>
          <td>${prod.nombre}</td>
          <td>${prod.precio}</td>
          <td><img src=${prod.foto} alt='foto'${prod.id}></td>
        </tr>`;
    });
    document.querySelector("#bodyProductosFaker").innerHTML = html;
  });

socket.on("connect", (payload) => {
  // para cuando es la primera vez que se conecta

  lblOffline.style.display = "none";
  lblOnline.style.display = "";
});

socket.on("disconnect", () => {
  lblOffline.style.display = "";
  lblOnline.style.display = "none";
});

// funcion para recuperar la plantilla y renderizar en la tabla
async function renderProducto(productos) {
  const hbs = await fetch("/plantilla/productos.hbs");
  const textHbs = await hbs.text();
  const functionTemplate = Handlebars.compile(textHbs);
  const html = functionTemplate({ productos });
  document.querySelector("#bodyTable").innerHTML = html;
}

// pongo a escuchar al cliente lo que envia el server
socket.on("enviar-producto", (payload) => {
  renderProducto(payload);
});

formProductos.addEventListener("submit", (e) => {
  e.preventDefault();
  const producto = {
    title: title.value,
    price: price.value,
    thumbnail: thumbnail.value,
  };
  // uso el callback del server para recuperar todos los productos
  socket.emit("enviar-producto", producto, (productos) => {
    renderProducto(productos);
  });
  title.value = "";
  price.value = "";
  thumbnail.value = "";
});

const renderChat = (chat) => {
  let html = "";
  chat.forEach((element) => {
    html =
      html +
      `<li class="list-group-item">
          <span class="text-primary">${element.author.id}</span>
          <span class="text-danger">[${moment(element.fecha).format(
            "DD/MM/YYYY HH:MM:SS"
          )}]</span>
          : <span class="text-success fst-italic">${element.mensaje}</span>
       </li>`;
  });
  document.querySelector("#bodyChat").innerHTML = html;
};

// pongo a escuchar al cliente lo que envia el server
socket.on("enviar-mensaje", (payload) => {
  // aca recibo el payload normalizado y tengo que desnormalizarlo
  console.log(payload);
  const dataDeNormalized = normalizr.denormalize(
    payload.result,
    global,
    payload.entities
  );

  const chatFront = JSON.parse(dataDeNormalized.messages);

  renderChat(chatFront);
});

formChat.addEventListener("submit", (e) => {
  e.preventDefault();
  const payload = {
    author: {
      id: authorId.value,
      nombre: authorNombre.value,
      apellido: authorApellido.value,
      edad: authorEdad.value,
      alias: authorAlias.value,
      avatar: authorAvatar.value,
    },
    mensaje: mensaje.value,
    fecha: moment(),
  };
  socket.emit("enviar-mensaje", payload, (chat) => {
    renderChat(chat);
  });
  mensaje.value = "";
});
