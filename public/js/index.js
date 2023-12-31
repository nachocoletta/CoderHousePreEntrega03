(function () {
    // let username;


    const socket = io();


    // const socket = io('http://localhost:8080', {
    //     transportOptions: {
    //         polling: {
    //             extraHeaders: {
    //                 Authorization: `Bearer ${access_token}`
    //             }
    //         }
    //     }
    // });




    // console.log("socket", socket)
    const buttonsAddProductToCart = document.getElementsByClassName("boton")
    const arrayOfButtons = Array.from(buttonsAddProductToCart)
    arrayOfButtons.forEach(element => {
        element.addEventListener('click', async (event) => {
            event.preventDefault();
            // console.log(`Click en el boton con id ${element.id}`);
            // alert(element.id)
            // let valor = document.getElementById(`${element.id}`).value
            // alert(valor)
            let product = {};
            let cantidad = document.getElementById(`${element.id}`).value
            let row = element.closest('tr');

            // Accede al elemento de la columna que contiene el stock
            let stockElement = row.querySelector('td:nth-child(6)'); // Ajusta el índice según la posición de la columna

            // Obtiene el valor del stock desde el contenido del elemento
            let stockValue = stockElement.textContent.trim();
            let data

            // console.log("cantidad", cantidad)
            try {
                const response = await fetch('http://localhost:8080/auth/current')

                // console.log("response", response)
                if (response.ok) {
                    data = await response.json();
                    product = {
                        cartId: data.cartId,
                        _id: element.id,
                        quantity: cantidad
                    }
                    // console.log("product", product)

                }
            } catch (error) {
                console.error("Error", error.message)
            }

            // console.log("valor", valor)
            // const product = {
            //     cartId: valor,
            //     _id: element.id,
            //     quantity: 1
            // }

            if (data.rol != 'admin') {
                if (cantidad <= stockValue) {
                    // console.log(cantidad + ' ' + stockValue)
                    alert("Producto agregado al carrito")
                } else {
                    alert("Stock insuficiente - Producto agregado al carrito igualmente")
                }
                socket.emit('addProductToCart', product);
                document.getElementById(`${element.id}`).value = ""
            } else {
                alert('Admin no puede agregar productos al carrito')
            }
        })
    }

    )
    // console.log("arrayButtonAddProductToCart", arrayButtonAddProductToCart)
    // arrayButtonAddProductToCart.forEach(element => {
    //     console.log("element", element);
    // })
    // console.log(arrayButtonAddProductToCart.length);


    // console.log("buttonAddProductToCart", buttonAddProductToCart);
    // FORM PRODUCTS

    // form - products
    const formAddProduct = document.getElementById('form-add-product')
    const formDeleteProduct = document.getElementById('form-delete-product')
    const formUpdateProduct = document.getElementById('form-update-product');

    formAddProduct?.addEventListener('submit', (event => {
        event.preventDefault();

        const newProduct = {
            title: document.getElementById('input-title').value,
            description: document.getElementById('input-description').value,
            code: document.getElementById('input-code').value,
            price: document.getElementById('input-price').value,
            stock: document.getElementById('input-stock').value,
            category: document.getElementById('input-category').value,
            thumbnails: []
        }

        socket.emit('addProduct', newProduct)

        document.getElementById('input-title').value = '';
        document.getElementById('input-description').value = '';
        document.getElementById('input-code').value = '';
        document.getElementById('input-price').value = '';
        document.getElementById('input-stock').value = '';
        document.getElementById('input-category').value = '';
    }))

    formDeleteProduct.addEventListener('submit', (event) => {
        event.preventDefault();
        const idProduct = document.getElementById('input-id-product').value;
        socket.emit('deleteProduct', idProduct)
        document.getElementById('input-id-product').value = '';
    })

    formUpdateProduct.addEventListener('submit', (event) => {
        event.preventDefault();
        const productToBeUpdated = {
            _id: document.getElementById('input-id-product-update').value,
            title: document.getElementById('input-title-update').value,
            description: document.getElementById('input-description-update').value,
            code: document.getElementById('input-code-update').value,
            price: document.getElementById('input-price-update').value,
            stock: document.getElementById('input-stock-update').value,
            category: document.getElementById('input-category-update').value,
            thumbnails: []
        }

        const idProduct = document.getElementById('input-id-product-update').value;
        socket.emit('updateProduct', productToBeUpdated)
        document.getElementById('input-id-product-update').value = '';
        document.getElementById('input-title-update').value = '';
        document.getElementById('input-description-update').value = '';
        document.getElementById('input-code-update').value = '';
        document.getElementById('input-price-update').value = '';
        document.getElementById('input-stock-update').value = '';
        document.getElementById('input-category-update').value = '';
    })

    socket.on('listProducts', (products) => {
        const container = document.getElementById('log-products-in-real-time')

        // Limpiar el contenido previo
        container.innerHTML = "";

        // Crear la tabla
        const table = document.createElement('table');
        table.classList.add('product-table');

        // Crear la fila de encabezados
        const headerRow = document.createElement('tr');
        const headers = ['ID', 'Title', 'Description', 'Code', 'Price', 'Stock', 'Category'];

        headers.forEach((header) => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });

        table.appendChild(headerRow);

        // Agregar filas de productos
        products.forEach((prod) => {
            const row = document.createElement('tr');
            const cells = [prod._id, prod.title, prod.description, prod.code, `$${prod.price}`, prod.stock, prod.category];

            cells.forEach((cell) => {
                const td = document.createElement('td');
                td.textContent = cell;
                row.appendChild(td);
            });

            table.appendChild(row);
        });

        // Agregar la tabla al contenedor
        container.appendChild(table);
    });

    // socket.on('listProducts', (products) => {
    //     const container = document.getElementById('log-products-in-real-time')

    //     container.innerHTML = "";
    //     products.forEach((prod) => {
    //         const p = document.createElement('p');
    //         p.innerText = `ID: ${prod._id} - Title: ${prod.title} - Description: ${prod.description} - Code: ${prod.code} - Price: $${prod.price} - Stock: ${prod.stock} - Category: ${prod.category}`;
    //         const hr = document.createElement('hr')
    //         container.appendChild(hr)
    //         container.appendChild(p);
    //     });
    //     container.appendChild(document.createElement('hr'))
    // });

    const formCreateCart = document.getElementById('create-cart')
    const formAddProductToCart = document.getElementById('add-product-to-cart')
    const formRemoveCart = document.getElementById('remove-cart');

    formCreateCart?.addEventListener('submit', (event => {
        event.preventDefault();
        // let newCart = {}
        socket.emit('createCart')
    }))

    socket.on('listCarts', (carts) => {
        // console.log('entra');
        const container = document.getElementById('carts');
        container.innerHTML = "";

        carts.forEach((cart) => {
            const cartElement = document.createElement('article');
            cartElement.innerHTML = `<header><strong>ID Cart:</strong> ${cart._id}</header>
            <strong>Products:</strong>`;

            cart.products?.forEach((prod) => {
                const productElement = document.createElement('div');
                productElement.innerHTML = `<strong>productId:</strong> ${prod?.productId?._id}
                <strong>title:</strong> ${prod?.productId?.title} <strong>price:</strong> $${prod.productId.price} <strong>stock:</strong> ${prod?.productId?.stock} <strong>category:</strong> ${prod.productId.category} 
                <strong>code:</strong> ${prod?.productId?.code} <strong>quantity:</strong> ${prod.quantity}`;

                cartElement.appendChild(productElement);
            });

            const buyButton = document.createElement('button');
            buyButton.innerText = 'Comprar';
            buyButton.addEventListener('click', () => {
                // Lógica para procesar la compra del carrito
                // Puedes llamar a una función o emitir un evento al servidor aquí
                socket.emit('cartPurchase', cart._id)
                alert("Ticket generado, en el cart quedaron los productos sin stock suficente")
                console.log(`Comprar carrito ${cart._id}`);
            });

            cartElement.appendChild(buyButton);
            const hr = document.createElement('hr');
            container.appendChild(cartElement);
            container.appendChild(hr);
        });

        container.appendChild(document.createElement('hr'));
    });

    formAddProductToCart.addEventListener('submit', async (event) => {
        event.preventDefault();
        // alert('hola')
        // const product = {
        //     cartId: document.getElementById('cart-input-id-product-to-cart').value,
        //     _id: document.getElementById('input-id-product-to-cart').value,
        //     quantity: document.getElementById('input-quantity-product-in-cart').value
        // }

        try {
            const response = await fetch('http://localhost:8080/auth/cart')

            if (response.ok) {
                const data = await response.json();

                const product = {
                    cartId: data.cartId,
                    _id: document.getElementById('input-id-product-to-cart').value,
                    quantity: document.getElementById('input-quantity-product-in-cart').value
                }
                console.log('product', product)

                socket.emit('addProductToCart', product);

                document.getElementById('cart-input-id-product-to-cart').value = ""
                document.getElementById('input-id-product-to-cart').value = ""
                document.getElementById('input-quantity-product-in-cart').value = ""

            }
        } catch (error) {
            console.error("Error", error.message)
        }
        console.log(product);
    })

    // formAddProductToCart?.addEventListener('submit', (event => {
    //     event.preventDefault();

    //     const product = {
    //         cartId: document.getElementById('cart-input-id-product-to-cart').value,
    //         _id: document.getElementById('input-id-product-to-cart').value,
    //         quantity: document.getElementById('input-quantity-product-in-cart').value
    //     }

    //     socket.emit('addProductToCart', product);

    //     document.getElementById('cart-input-id-product-to-cart').value = ""
    //     document.getElementById('input-id-product-to-cart').value = ""
    //     document.getElementById('input-quantity-product-in-cart').value = ""

    // }))

    formRemoveCart?.addEventListener('submit', (event => {
        event.preventDefault();

        const cartId = document.getElementById('cart-input-id-product-to-remove').value;

        socket.emit('deleteCart', cartId);
        document.getElementById('cart-input-id-product-to-remove').value = ''
    }))

    Handlebars.registerHelper('JSONstringify', function (context) {
        return JSON.stringify(context);
    });

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
})();
