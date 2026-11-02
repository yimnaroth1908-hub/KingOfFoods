console.log("NEW APP JS VERSION 123");
// ==========================================
// SYSTEM SELL - CUSTOMER APP
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    let cart = [];
    let allFoods = [];

    // ==========================================
    // DOM ELEMENTS
    // ==========================================

    const foodGrid = document.getElementById("foodGrid");
    const searchInput = document.getElementById("searchInput");
    const categoryButtons = document.querySelectorAll(".category");

    const cartBar = document.querySelector(".cart-bar");
    const cartDrawer = document.getElementById("cartDrawer");
    const cartOverlay = document.getElementById("cartOverlay");
    const closeCart = document.getElementById("closeCart");

    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    const drawerSubtotal =
        document.getElementById("drawerSubtotal");

    const drawerTotal =
        document.getElementById("drawerTotal");

    const placeOrderBtn =
        document.getElementById("placeOrderBtn");

    const orderOverlay =
        document.getElementById("orderOverlay");

    const orderNumber =
        document.getElementById("orderNumber");

    const successTotal =
        document.getElementById("successTotal");

    const trackOrderBtn =
        document.getElementById("trackOrderBtn");


    // ==========================================
    // CHECK IMPORTANT ELEMENTS
    // ==========================================

    console.log("SYSTEM SELL APP STARTED");

    console.log("foodGrid:", foodGrid);
    console.log("placeOrderBtn:", placeOrderBtn);


    // ==========================================
    // ESCAPE HTML
    // ==========================================

    function escapeHTML(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    // ==========================================
    // LOAD MENU FROM MYSQL
    // ==========================================

    async function loadMenu() {

        if (!foodGrid) {
            console.error(
                "Food grid not found."
            );
            return;
        }

        try {

            foodGrid.innerHTML = `
                <div style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 50px;
                ">
                    <p>Loading menu...</p>
                </div>
            `;


            const response = await fetch(
                "../api/get_menu.php",
                {
                    method: "GET",
                    cache: "no-cache"
                }
            );


            console.log(
                "MENU HTTP STATUS:",
                response.status
            );


            const responseText =
                await response.text();


            console.log(
                "MENU API RESPONSE:",
                responseText
            );


            if (!response.ok) {

                throw new Error(
                    `Menu API error: ${response.status}`
                );

            }


            let foods;

            try {

                foods =
                    JSON.parse(responseText);

            } catch (error) {

                throw new Error(
                    "Menu API did not return valid JSON."
                );

            }


            if (!Array.isArray(foods)) {

                throw new Error(
                    "Invalid menu data."
                );

            }


            allFoods = foods;


            console.log(
                "MENU LOADED:",
                allFoods
            );


            renderMenu(allFoods);


        } catch (error) {

            console.error(
                "MENU ERROR:",
                error
            );


            foodGrid.innerHTML = `
                <div style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 50px;
                ">
                    <h3>Unable to load menu</h3>
                    <p>${escapeHTML(error.message)}</p>
                </div>
            `;

        }

    }


    // ==========================================
    // RENDER MENU
    // ==========================================

    function renderMenu(foods) {

        if (!foodGrid) return;


        foodGrid.innerHTML = "";


        if (
            !foods ||
            foods.length === 0
        ) {

            foodGrid.innerHTML = `
                <div style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 50px;
                ">
                    <h3>No food found</h3>
                    <p>Try another search.</p>
                </div>
            `;

            return;
        }


        foods.forEach(food => {

            const card =
                document.createElement("article");

            card.className =
                "food-card";


            const price =
                parseFloat(food.price) || 0;


            const rating =
                parseFloat(food.rating) || 0;


            const image =
                food.image || "";


            const description =
                food.description ||
                "Delicious food made fresh for you.";


            card.innerHTML = `

                <div class="food-image">

                    <img
                        src="${escapeHTML(image)}"
                        alt="${escapeHTML(food.name)}"
                        onerror="this.style.display='none'"
                    >

                    ${
                        rating >= 4.8
                        ? `
                            <span class="popular-badge">
                                🔥 Popular
                            </span>
                        `
                        : ""
                    }

                </div>


                <div class="food-info">

                    <div class="rating">
                        ⭐ ${rating.toFixed(1)}
                    </div>


                    <h3>
                        ${escapeHTML(food.name)}
                    </h3>


                    <p>
                        ${escapeHTML(description)}
                    </p>


                    <div class="food-bottom">

                        <strong>
                            $${price.toFixed(2)}
                        </strong>


                        <button
                            class="add-btn"
                            data-id="${food.id}"
                            type="button"
                        >
                            +
                        </button>

                    </div>

                </div>

            `;


            foodGrid.appendChild(card);

        });


        connectAddButtons();

    }


    // ==========================================
    // CONNECT ADD BUTTONS
    // ==========================================

    function connectAddButtons() {

        const buttons =
            document.querySelectorAll(".add-btn");


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const foodId =
                        parseInt(
                            button.dataset.id
                        );


                    const food =
                        allFoods.find(
                            item =>
                                parseInt(item.id) ===
                                foodId
                        );


                    if (!food) {

                        console.error(
                            "Food not found:",
                            foodId
                        );

                        return;
                    }


                    addToCart(food);


                    button.textContent = "✓";


                    setTimeout(() => {

                        button.textContent = "+";

                    }, 700);

                }
            );

        });

    }


    // ==========================================
    // ADD TO CART
    // ==========================================

    function addToCart(food) {

        const foodId =
            parseInt(food.id);


        const existingItem =
            cart.find(
                item =>
                    parseInt(item.id) ===
                    foodId
            );


        if (existingItem) {

            existingItem.quantity += 1;

        } else {

            cart.push({

                id: foodId,

                name: food.name,

                price:
                    parseFloat(food.price) || 0,

                image:
                    food.image || "",

                quantity: 1

            });

        }


        console.log(
            "CART UPDATED:",
            cart
        );


        updateCart();

    }


    // ==========================================
    // UPDATE CART
    // ==========================================

    function updateCart() {

        let totalItems = 0;
        let totalPrice = 0;


        cart.forEach(item => {

            totalItems +=
                Number(item.quantity);


            totalPrice +=
                Number(item.price) *
                Number(item.quantity);

        });


        if (cartCount) {

            cartCount.textContent =
                `${totalItems} ${
                    totalItems === 1
                        ? "item"
                        : "items"
                }`;

        }


        if (cartTotal) {

            cartTotal.textContent =
                `$${totalPrice.toFixed(2)}`;

        }


        renderCart();

    }


    // ==========================================
    // RENDER CART
    // ==========================================

    function renderCart() {

        if (!cartItems) return;


        if (cart.length === 0) {

            cartItems.innerHTML = `

                <div class="empty-cart">

                    <div class="empty-cart-icon">
                        🛒
                    </div>

                    <h3>
                        Your cart is empty
                    </h3>

                    <p>
                        Add something delicious!
                    </p>

                </div>

            `;


            if (drawerSubtotal) {
                drawerSubtotal.textContent =
                    "$0.00";
            }


            if (drawerTotal) {
                drawerTotal.textContent =
                    "$0.00";
            }


            return;
        }


        let total = 0;


        cartItems.innerHTML = "";


        cart.forEach((item, index) => {

            const itemPrice =
                Number(item.price);


            const quantity =
                Number(item.quantity);


            const itemTotal =
                itemPrice * quantity;


            total += itemTotal;


            cartItems.innerHTML += `

                <div class="cart-item">

                    <img
                        src="${escapeHTML(item.image)}"
                        class="cart-item-image"
                        alt="${escapeHTML(item.name)}"
                    >


                    <div class="cart-item-info">

                        <h4>
                            ${escapeHTML(item.name)}
                        </h4>


                        <div class="cart-item-price">
                            $${itemPrice.toFixed(2)}
                        </div>


                        <div class="quantity-control">

                            <button
                                type="button"
                                onclick="changeQuantity(${index}, -1)"
                            >
                                −
                            </button>


                            <span>
                                ${quantity}
                            </span>


                            <button
                                type="button"
                                onclick="changeQuantity(${index}, 1)"
                            >
                                +
                            </button>

                        </div>

                    </div>


                    <strong>
                        $${itemTotal.toFixed(2)}
                    </strong>

                </div>

            `;

        });


        if (drawerSubtotal) {

            drawerSubtotal.textContent =
                `$${total.toFixed(2)}`;

        }


        if (drawerTotal) {

            drawerTotal.textContent =
                `$${total.toFixed(2)}`;

        }

    }


    // ==========================================
    // CHANGE QUANTITY
    // ==========================================

    window.changeQuantity =
        function(index, amount) {

            if (!cart[index]) return;


            cart[index].quantity += amount;


            if (
                cart[index].quantity <= 0
            ) {

                cart.splice(index, 1);

            }


            updateCart();

        };


    // ==========================================
    // OPEN CART
    // ==========================================

    if (cartBar) {

        cartBar.addEventListener(
            "click",
            function () {

                if (cartDrawer) {

                    cartDrawer.classList.add(
                        "active"
                    );

                }


                if (cartOverlay) {

                    cartOverlay.classList.add(
                        "active"
                    );

                }

            }
        );

    }


    // ==========================================
    // CLOSE CART
    // ==========================================

    function closeCartDrawer() {

        if (cartDrawer) {

            cartDrawer.classList.remove(
                "active"
            );

        }


        if (cartOverlay) {

            cartOverlay.classList.remove(
                "active"
            );

        }

    }


    if (closeCart) {

        closeCart.addEventListener(
            "click",
            closeCartDrawer
        );

    }


    if (cartOverlay) {

        cartOverlay.addEventListener(
            "click",
            closeCartDrawer
        );

    }


    // ==========================================
    // PLACE ORDER
    // ==========================================

    if (placeOrderBtn) {

        placeOrderBtn.addEventListener(
            "click",
            async function () {

                console.log(
                    "PLACE ORDER BUTTON CLICKED"
                );


                if (cart.length === 0) {

                    alert(
                        "Your cart is empty."
                    );

                    return;
                }


                const tableNumber = 5;


                const orderData = {

                    table_number:
                        tableNumber,

                    items:
                        cart.map(item => ({

                            id:
                                parseInt(item.id),

                            name:
                                item.name,

                            price:
                                Number(item.price),

                            quantity:
                                Number(item.quantity)

                        }))

                };


                console.log(
                    "SENDING ORDER TO SERVER:",
                    orderData
                );


                placeOrderBtn.disabled =
                    true;

                placeOrderBtn.textContent =
                    "Sending Order...";


                try {

                    const response =
                        await fetch(
                            "../api/create_order.php",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json",

                                    "Accept":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        orderData
                                    )
                            }
                        );


                    console.log(
                        "HTTP STATUS:",
                        response.status
                    );


                    const responseText =
                        await response.text();


                    console.log(
                        "SERVER RESPONSE:",
                        responseText
                    );


                    if (!response.ok) {

                        throw new Error(
                            `Server error: ${response.status}`
                        );

                    }


                    let result;


                    try {

                        result =
                            JSON.parse(
                                responseText
                            );

                    } catch (error) {

                        throw new Error(
                            "PHP did not return valid JSON."
                        );

                    }


                    console.log(
                        "ORDER RESULT:",
                        result
                    );


                    if (!result.success) {

                        throw new Error(
                            result.message ||
                            "Failed to create order."
                        );

                    }


                    if (orderNumber) {

                        orderNumber.textContent =
                            result.order_number;

                    }


                    if (successTotal) {

                        successTotal.textContent =
                            `$${Number(
                                result.total
                            ).toFixed(2)}`;

                    }


                    closeCartDrawer();


                    if (orderOverlay) {

                        orderOverlay.classList.add(
                            "active"
                        );

                    }


                    cart = [];

                    updateCart();


                    console.log(
                        "ORDER CREATED SUCCESSFULLY"
                    );


                } catch (error) {

                    console.error(
                        "ORDER ERROR:",
                        error
                    );


                    alert(
                        "Failed to place order.\n\n" +
                        error.message
                    );

                } finally {

                    placeOrderBtn.disabled =
                        false;

                    placeOrderBtn.textContent =
                        "Place Order →";

                }

            }
        );

    } else {

        console.error(
            "PLACE ORDER BUTTON NOT FOUND"
        );

    }


    // ==========================================
    // TRACK ORDER
    // ==========================================

    if (trackOrderBtn) {

        trackOrderBtn.addEventListener(
            "click",
            function () {

                if (orderOverlay) {

                    orderOverlay.classList.remove(
                        "active"
                    );

                }

            }
        );

    }


    // ==========================================
    // SEARCH
    // ==========================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                const keyword =
                    searchInput.value
                        .toLowerCase()
                        .trim();


                if (!keyword) {

                    renderMenu(
                        allFoods
                    );

                    return;
                }


                const filteredFoods =
                    allFoods.filter(food => {

                        const name =
                            String(
                                food.name || ""
                            ).toLowerCase();


                        const description =
                            String(
                                food.description || ""
                            ).toLowerCase();


                        const category =
                            String(
                                food.category || ""
                            ).toLowerCase();


                        return (
                            name.includes(keyword) ||
                            description.includes(keyword) ||
                            category.includes(keyword)
                        );

                    });


                renderMenu(
                    filteredFoods
                );

            }
        );

    }


    // ==========================================
    // CATEGORY FILTER
    // ==========================================

    categoryButtons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                categoryButtons.forEach(
                    btn => {
                        btn.classList.remove(
                            "active"
                        );
                    }
                );


                button.classList.add(
                    "active"
                );


                const buttonText =
                    button.textContent
                        .trim()
                        .toLowerCase();


                if (
                    buttonText === "all"
                ) {

                    renderMenu(
                        allFoods
                    );

                    return;
                }


                let filteredFoods = [];


                if (
                    buttonText.includes("burger")
                ) {

                    filteredFoods =
                        allFoods.filter(
                            food =>
                                String(
                                    food.category || ""
                                ).toLowerCase() ===
                                "burger"
                        );

                }

                else if (
                    buttonText.includes("noodle")
                ) {

                    filteredFoods =
                        allFoods.filter(
                            food =>
                                String(
                                    food.category || ""
                                ).toLowerCase() ===
                                "noodles"
                        );

                }

                else if (
                    buttonText.includes("chicken")
                ) {

                    filteredFoods =
                        allFoods.filter(
                            food =>
                                String(
                                    food.category || ""
                                ).toLowerCase() ===
                                "chicken"
                        );

                }

                else if (
                    buttonText.includes("drink")
                ) {

                    filteredFoods =
                        allFoods.filter(
                            food =>
                                String(
                                    food.category || ""
                                ).toLowerCase() ===
                                "drink"
                        );

                }

                else if (
                    buttonText.includes("dessert")
                ) {

                    filteredFoods =
                        allFoods.filter(
                            food =>
                                String(
                                    food.category || ""
                                ).toLowerCase() ===
                                "dessert"
                        );

                }


                renderMenu(
                    filteredFoods
                );

            }
        );

    });


    // ==========================================
    // START APPLICATION
    // ==========================================

    loadMenu();

    updateCart();

});
