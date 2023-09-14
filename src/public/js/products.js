const addToCartButtons = document.querySelectorAll(".card button#addToCart");

addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".card");
    const idx = card.querySelector(".card__id").textContent;

    //Deje el carrito 1 predeterminado
    fetch(`api/cart/1/products/${idx}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
