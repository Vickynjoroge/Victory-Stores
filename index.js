// cart
let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");
// Open cart
cartIcon.onclick = () => {
  cart.classList.add("active");
};
// close cart
closeCart.onclick = () => {
  cart.classList.remove("active");
};

// Cart working JS
if (document.readyState == "loading"){
  document.addEventListener("DOMContentLoaded", ready)
} else {
  ready();
}

// Making funtion
function ready(){
  // fetch products from server
  fetch('http://localhost:3000/products/')
    .then(response => response.json())
    .then(data => {
      const productContainer = document.querySelector('.shop-content');
      data.forEach((product) => {
        const productCard = document.createElement('div')
        productCard.classList.add('products-card');
        productCard.innerHTML = `
        <div class ="product-box">
        <img src="${product.image}" alt="${product.title}" class="product-img">
        <h2 class="product-title"><a href=''>${product.title}</a></h2>
        <span class="price">$${product.price}</span>
        <i class='bx bxs-cart-add add-cart'></i>
        </div>
        `;
        productContainer.appendChild(productCard);
      });
    })
  // Remove items from cart
  var removeCartButton = document.getElementsByClassName("cart-remove");
  console.log(removeCartButton);
  for (var i = 0; i < removeCartButton.length; i++) {
    var button = removeCartButton[i];
    button.addEventListener("click", removeCartItem);
  }
  // Quantity changes
  var quantityInputs = document.getElementsByClassName('cart-quantity');
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener('change', quantityChanged);
  }
  // Add to cart
  var addCart = document.getElementsByClassName("add-cart");
  for (var i = 0; i < addCart.length; i++){
    var button = addCart[i];
    button.addEventListener("click", addCartClicked);
  }
// Buy button work
  document
  .getElementsByClassName("btn-buy")[0]
  .addEventListener("click", buyButtonClicked);

}
// Buy button
function buyButtonClicked(){
  alert('Your order has been placed')
  var cartContent = document.getElementsByClassName('cart-content')[0]
  while (cartContent.hasChildNodes()){
    cartContent.removeChild(cartContent.firstChild);
  }
  updatetotal();
}

// remove items from cart
function removeCartItem(event){
var buttonClicked = event.target
buttonClicked.parentElement.remove()
updatetotal();
}
// Quantity changed
function quantityChanged(event) {
    var input = event.target;
    var cartBox = input.parentElement.parentElement;
    var titleElement = cartBox.getElementsByClassName("cart-product-title")[0];
    var title = titleElement.innerText;
    var priceElement = cartBox.getElementsByClassName("cart-price")[0];
    var price = parseFloat(priceElement.innerText.replace("$", ""));
    var quantity = input.value;
    var productId = cartBox.getAttribute("data-product-id");
  
    if (isNaN(quantity) || quantity <= 0) {
      input.value = 1;
      quantity = 1;
    }
  
    // Update the quantity on the server
    fetch(`http://localhost:3000/products/`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity: quantity,
      }),
    }
      .then((response) => response.json())
      .then((data) => {
        // Update the total price and the quantity of the item in the cart box
        var totalPriceElement = cartBox.getElementsByClassName("cart-total-price")[0];
        var totalPrice = parseFloat(data.quantity * price).toFixed(2);
        totalPriceElement.innerText = "$" + totalPrice;
        updatetotal();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
//Add to cart 
function addCartClicked(event){
  var button = event.target;
  var shopProducts = button.parentElement;
  var title = shopProducts.getElementsByClassName("product-title")[0].innerText;
  var price = shopProducts.getElementsByClassName("price")[0].innerText;
  var productid = shopProducts.getAttribute("data-id");

  // send a POST request to add the product to the cart on the server
  fetch('http://localhost:3000/products'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: title, price: price, productid: productid })
  }
  .then(response => response.json())
  .then(data => {
    // add the cart item to the UI
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");
    cartShopBox.setAttribute("data-id", data.id);
    var cartItems = document.getElementsByClassName("cart-content")[0];
    var cartItemsNames = cartItems.getElementsByClassName("cart-product-title");
    for (var i = 0; i < cartItemsNames.length; i++) {
      if (cartItemsNames[i].innerText === title) {
        alert("You have already added item to cart");
        return;
      }
    }
    var cartBoxContent = `
      <img src="${data.image}" alt="" class="cart-img">
      <div class="detail-box">
        <div class="cart-product-title">${data.title}</div>
        <div class="cart-price">${data.price}</div>
        <input type="number" value="1" class="cart-quantity">
      </div>
      <!-- Remove Cart -->
      <i class='bx bxs-trash-alt cart-remove' ></i>
    `;
    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox);
    cartShopBox
    .getElementsByClassName('cart-remove')[0]
    .addEventListener('click', removeCartItem );
    cartShopBox
    .getElementsByClassName('cart-quantity')[0]
    .addEventListener('change', quantityChanged);

    updatetotal();
  })
  .catch(error => console.error('Error adding product to cart:', error));
}

// update Total
function updatetotal() {
  fetch(`http://localhost:3000/products/${price}`)
    .then(response => response.json())
    .then(data => {
      var total = 0;
      data.forEach((cartItem) => {
        total += parseFloat(cartItem.price) * cartItem.quantity;
      });
      // if price contains some cents value
      total = Math.round(total * 100) / 100;
      document.getElementsByClassName("total-price")[0].innerText = "$" + total;
    })
    .catch(error => console.log(error));
}
// How to send a POST request to add the product to the cart on the server?   