const productList = document.getElementById("product-list");
let cartList ="";
let total =0;

const loadProductData = () =>{
    for(let i=0;i<localStorage.length;i++){
        const key = localStorage.key(i);
        const data = JSON.parse(localStorage.getItem(key));
        if(data.price!==NaN){
            total+=Number(data.price);
        }
        showData(data);
    }
}

const reloadPage = () =>{
    productList.innerHTML="";
    total=0;
    loadProductData();
    if(localStorage.length){
        buyProducts();
    }else{
        productList.innerHTML+="<p>Tu carrito está vacío</p>";
    }
}

const showData = (data) =>{
    cartList = document.createElement("div");
    cartList.className="cart-list"
    cartList.innerHTML+=`
        <img src="${data.imgLink}" alt="${data.title}"/>
        <p>${data.title}</p>
        <p>$${data.price}</p>`;
    const deleteButton = document.createElement("button");
    deleteButton.innerText="Eliminar producto del carrito";
    deleteButton.addEventListener("click",()=>{
        localStorage.removeItem(deleteButton.parentElement.children[1].textContent);
        reloadPage();
    });
    productList.appendChild(cartList);
    cartList.appendChild(deleteButton);
}

const buyProducts = () =>{
    if(localStorage.length){
        const buyDiv = document.createElement("div");
        buyDiv.id = "buy";
        const buyBtn = document.createElement("button");
        buyBtn.innerText = "Continuar con la transacción";
        buyBtn.addEventListener("click",()=>{
            localStorage.clear();
            reloadPage();
            alert("Compra realizada con exito");
        })
        const totalPrice = document.createElement("p");
        totalPrice.innerText = `Total estimado $${total}`;
        buyDiv.appendChild(totalPrice);
        buyDiv.appendChild(buyBtn);
        productList.appendChild(buyDiv);
    }
}

loadProductData();

if(localStorage.length){
    buyProducts();
}else{
    productList.innerHTML+="<p>Tu carrito está vacío</p>";
}
