const classCards = document.querySelectorAll(".class-card");

classCards.forEach((card) => {
    card.addEventListener("click", () => {
        const selectedClass = card.querySelector("h2").textContent.trim();

        if (selectedClass === "VII კლასი") {
            window.location.href = "grade7.html";
        }

        if (selectedClass === "VIII კლასი") {
            window.location.href = "grade8.html";
        }

        if (selectedClass === "IX კლასი") {
            window.location.href = "grade9.html";
        }

        if (selectedClass === "X კლასი") {
            window.location.href = "grade10.html";
        }

        if (selectedClass === "XI კლასი") {
            window.location.href = "grade11.html";
        }

        if (selectedClass === "XII კლასი") {
            window.location.href = "grade12.html";
        }
    });
});