const productList = document.getElementById("products");
const moreProductsBtn = document.getElementById("more-products");
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const searchType = document.getElementById("search-type");

const API_KEY = "AIzaSyCD6_MYB4Gxs6ieldAI-RyTJ_I_QqV9DFA";
const genre = "subject:Fiction";
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
         if(bookData.items?.length>0){
            dataAPI.push(...bookData.items);
            }
        return dataAPI;
    }
    catch(err){
        console.log(err);
    }
}

const loadProducts = (dataAPI) =>{
    fragment = document.createDocumentFragment();
    for(let i=0; i<maxResults;i++){
        const content = document.createElement("div");

        const span = document.createElement("span");
        span.className = "book";

        const img = document.createElement("img");
        img.src = dataAPI[i+startIndex].volumeInfo.imageLinks?.thumbnail || "../multimedia/placeholder.webp";;
        img.alt = dataAPI[i].volumeInfo.title;

        const titleAuthor =document.createElement("p");
        titleAuthor.textContent = `${dataAPI[i].volumeInfo.title} - ${author = dataAPI[i+startIndex].volumeInfo.authors?.join(", ") || "Autor desconocido"}`;

        const price = document.createElement("p");
        price.textContent = `Precio: ${dataAPI[i+startIndex].volumeInfo.pageCount ? (10000 + dataAPI[i+startIndex].volumeInfo.pageCount*10) + "$": "Sin stock"}`;
        
        const seeMoreBtn = document.createElement("button");
        seeMoreBtn.textContent = "Ver más";
        seeMoreBtn.addEventListener("click",()=>{
            productExtra.style.display = productExtra.style.display === 'block' ? 'none' : 'block';
            seeMoreBtn.textContent = seeMoreBtn.textContent === "Ver más" ? "Ver menos" : "Ver más";
            span.classList.toggle("expanded");
        })
        
        const addToCartBtn = document.createElement("button");
        addToCartBtn.textContent = "Añadir al carrito";
        
        const productExtra = document.createElement("div");
        productExtra.className= "product-extra";
        
        const publisher = document.createElement("p");
        publisher.textContent = `Editorial: ${dataAPI[i+startIndex].volumeInfo.publisher || "Desconocido"}`;
        
        const description = document.createElement("p");
        description.textContent = `Descripción: ${dataAPI[i+startIndex].volumeInfo.description}`;
        description.classList.add("description");

        const releaseDate = document.createElement("p");
        releaseDate.textContent = `Año de publicación: ${dataAPI[i+startIndex].volumeInfo.publishedDate || "Desconocido"}`;

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

const searchBooks = (search) =>{
    removeData();
    if(search!=""){
        if(searchType.value === "title"){
            query="intitle:"+search;
        }
        else{
            query="inauthor:"+search;
        }
    }else{
        query="";
    }
    fetchBooksAPI().then((dataAPI)=>loadProducts(dataAPI));
}

const removeData = () => {
    dataAPI=[];
    productList.innerHTML="";
}

fetchBooksAPI().then((dataAPI)=>loadProducts(dataAPI));

moreProductsBtn.addEventListener("click",()=>{
    startIndex+=maxResults;
    fetchBooksAPI().then((dataAPI)=>loadProducts(dataAPI));
});

searchBtn.addEventListener("click",()=>searchBooks(searchInput.value));