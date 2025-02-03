const productList = document.getElementById("products");
const moreProductsBtn = document.getElementById("more-products");
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const searchType = document.getElementById("search-type");
const goUp = document.getElementById("go-to-top");
const API_KEY = "AIzaSyCD6_MYB4Gxs6ieldAI-RyTJ_I_QqV9DFA";
let genre = "subject:Fiction";
let query = "";
let dataAPI = [];
let startIndex = 0;
const maxResults = 40;

const fetchBooksAPI = async () =>{
    try{
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}+${genre}&startIndex=${startIndex}&maxResults=${maxResults}&langRestrict=es&key=${API_KEY}`);
        if(!response.ok){
            throw new Error("Error on HTTP request");
        }
        const bookData = await response.json();
        if(bookData.totalItems!=0){
            dataAPI.push(...bookData.items);  
            moreProductsBtn.style.display="block";
        }
        else{
            moreProductsBtn.style.display="none";
            productList.innerHTML= "<p>Ningún elemento cumple con los criterios de búsqueda</p>";
            throw new Error("Bad query");
        }
        return dataAPI;
    }
    catch(err){
        console.log(err);
        return null;
    }
}

const loadProducts = (dataAPI) =>{
    const fragment = document.createDocumentFragment();
    for(let i=0; i<dataAPI.length;i++){
        const content = document.createElement("div");

        const span = document.createElement("span");
        span.className = "book";

        const img = document.createElement("img");
        img.src = dataAPI[i]?.volumeInfo.imageLinks?.thumbnail || "../multimedia/placeholder.webp";
        img.alt = dataAPI[i]?.volumeInfo.title;

        const titleAuthor = document.createElement("p");
        titleAuthor.textContent = `${dataAPI[i]?.volumeInfo.title} - ${author = dataAPI[i]?.volumeInfo.authors?.join(", ") || "Autor desconocido"}`;

        const price = document.createElement("p");
        price.textContent = `Precio: ${dataAPI[i]?.volumeInfo.pageCount ? (10000 + dataAPI[i]?.volumeInfo.pageCount*10) + "$": "Sin stock"}`;
        
        const seeMoreBtn = document.createElement("button");
        seeMoreBtn.textContent = "Ver más";
        seeMoreBtn.addEventListener("click",()=>{
            productExtra.style.display = productExtra.style.display === 'block' ? 'none' : 'block';
            seeMoreBtn.textContent = seeMoreBtn.textContent === "Ver más" ? "Ver menos" : "Ver más";
            span.classList.toggle("expanded");
        })
        
        const addToCartBtn = document.createElement("button");
        addToCartBtn.textContent = "Añadir al carrito";
        addToCartBtn.className="purchase-btn";
        addToCartBtn.addEventListener("click",()=>{
            saveProductData(addToCartBtn.parentElement);
        })
        
        const productExtra = document.createElement("div");
        productExtra.className= "product-extra";
        
        const publisher = document.createElement("p");
        publisher.textContent = `Editorial: ${dataAPI[i]?.volumeInfo.publisher || "Desconocido"}`;
        
        const description = document.createElement("p");
        description.textContent = `Descripción: ${dataAPI[i]?.volumeInfo.description}`;
        description.classList.add("description");

        const releaseDate = document.createElement("p");
        releaseDate.textContent = `Año de publicación: ${dataAPI[i]?.volumeInfo.publishedDate || "Desconocido"}`;

        productExtra.appendChild(publisher);
        productExtra.appendChild(description);
        productExtra.appendChild(releaseDate);
        content.appendChild(img);
        content.appendChild(titleAuthor);
        content.appendChild(price);
        content.appendChild(seeMoreBtn);
        content.appendChild(addToCartBtn);
        span.appendChild(content);
        span.appendChild(productExtra);
        fragment.appendChild(span);
    }
    productList.appendChild(fragment);
}

const saveProductData = (parentElement) =>{
    const children = parentElement.children;
    if(children[2].textContent!=="Precio: Sin stock"){
        let productData = {
            imgLink:children[0].src,
            title:children[1].textContent,
            price:children[2].textContent.replace(/\D/g,"")
        };
        localStorage.setItem(productData.title,JSON.stringify(productData));
    }
    else{
        alert("No hay más stock del producto deseado, elija otro o intentelo más tarde");
    }
}

const searchBooks = (search) =>{
    removeData();
    query=search;
    fetchBooksAPI().then((dataAPI)=>{
        if(dataAPI){
            loadProducts(dataAPI);
        }
    });
}

const removeData = () => {
    dataAPI=[];
    productList.innerHTML="";
    moreProductsBtn.style.display="none";
    startIndex=0;
}

const thereAreMoreProducts = () =>{
    dataAPI=[];
    startIndex+=maxResults;
    fetchBooksAPI();
    startIndex-=maxResults;
    if(dataAPI){
        moreProductsBtn.style.display="none";
    }
}

const applyButtonStyle = (button) => {
    document.body.style.cursor="wait";
    button.disabled=true;
    button.textContent="Cargando...";
}

const removeButtonStyle = (button) =>{
    document.body.style.cursor="default";
    button.disabled=false;
    button.textContent="Cargar mas resultados";
}

fetchBooksAPI().then((dataAPI)=>loadProducts(dataAPI));

moreProductsBtn.addEventListener("click",()=>{
    applyButtonStyle(moreProductsBtn);
    dataAPI=[];
    startIndex+=maxResults; 
    fetchBooksAPI().then((dataAPI)=>{
        if(dataAPI){
            loadProducts(dataAPI);
            thereAreMoreProducts();
        }
    });
    setTimeout(()=>removeButtonStyle(moreProductsBtn),650);
});

searchBtn.addEventListener("click",()=>searchBooks(searchInput.value));

searchInput.addEventListener("keydown",(event)=>{
    if(event.key==="Enter"){
    searchBooks(searchInput.value);
    }
    });



window.addEventListener("scroll",()=>{
    if(window.scrollY >200){
        goUp.style.display= "block";
    }
    else{
        goUp.style.display= "none";
    }   
})
