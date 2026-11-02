// ==========================================
// SYSTEM SELL - KITCHEN
// ==========================================


// ==========================================
// ACCEPT ORDER
// ==========================================

function acceptOrder(button) {

    const orderCard =
        button.closest(".order-card");

    if (!orderCard) return;


    // Change card status
    orderCard.classList.remove("new-order");

    orderCard.classList.add("preparing-order");


    // Change status text
    const status =
        orderCard.querySelector(".order-status");

    status.textContent = "PREPARING";

    status.classList.remove("new");

    status.classList.add("preparing");


    // Change time
    const time =
        orderCard.querySelector(".order-time");

    time.textContent =
        "Preparing just now";


    // Change button
    button.textContent =
        "Mark as Ready";

    button.classList.remove("accept-btn");

    button.classList.add("ready-btn");


    // Change function
    button.setAttribute(
        "onclick",
        "markReady(this)"
    );


    updateStats();

}


// ==========================================
// MARK AS READY
// ==========================================

function markReady(button) {

    const orderCard =
        button.closest(".order-card");

    if (!orderCard) return;


    // Change card
    orderCard.classList.remove(
        "preparing-order"
    );

    orderCard.classList.add(
        "ready-order"
    );


    // Change status
    const status =
        orderCard.querySelector(".order-status");

    status.textContent = "READY";

    status.classList.remove("preparing");

    status.classList.add("ready");


    // Change time
    const time =
        orderCard.querySelector(".order-time");

    time.textContent =
        "Ready just now";


    // Change button
    button.textContent =
        "✓ Completed";

    button.classList.remove("ready-btn");

    button.classList.add("done-btn");


    // Disable button
    button.disabled = true;

    button.removeAttribute("onclick");


    updateStats();

}


// ==========================================
// UPDATE ORDER STATS
// ==========================================

function updateStats() {

    const newOrders =
        document.querySelectorAll(
            ".new-order"
        ).length;


    const preparingOrders =
        document.querySelectorAll(
            ".preparing-order"
        ).length;


    const readyOrders =
        document.querySelectorAll(
            ".ready-order"
        ).length;


    const newCount =
        document.getElementById("newCount");

    const preparingCount =
        document.getElementById(
            "preparingCount"
        );

    const readyCount =
        document.getElementById(
            "readyCount"
        );


    if (newCount) {
        newCount.textContent =
            newOrders;
    }


    if (preparingCount) {
        preparingCount.textContent =
            preparingOrders;
    }


    if (readyCount) {
        readyCount.textContent =
            readyOrders;
    }

}


// ==========================================
// CURRENT TIME
// ==========================================

function updateTime() {

    const timeElement =
        document.getElementById(
            "currentTime"
        );


    if (!timeElement) return;


    const now = new Date();


    let hours =
        now.getHours();

    let minutes =
        now.getMinutes();


    hours =
        hours.toString().padStart(2, "0");

    minutes =
        minutes.toString().padStart(2, "0");


    timeElement.textContent =
        `${hours}:${minutes}`;

}


updateTime();


// Update every minute
setInterval(
    updateTime,
    60000
);


// Initial stats
updateStats();