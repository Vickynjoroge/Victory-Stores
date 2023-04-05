let productsEndPoint = "products"

const baseURl = `https://fakestoreapi.com/${productsEndPoint}`

let productUL = document.getElementById('products')

let image;
const imageBaseURL = `https://fakestoreapi.com`

//implement the logic to fetch the data from the API
/**
 * Title:title
 * Category:category
 * Description:description
 * Price:price
 * Rating:rate
 * Id:id
 */

function getAllProducts(){
    fetch (baseURl)
    .then(res=>res.json())
    .then(data=> {
        const product = data
        let dataArr = product.map(product => {
                let dataObj = {
                    id:product.id,
                    title:product.title,
                    description:product.description,
                    image:product.image,
                    price:product.price,
                    rating: {
                        "rate": 
                        "count" ,
                    },
                }
                return dataObj

            }
        ) 
        //MAp through the products and use displayProducts as a callback
        console.log(dataArr[0])
        dataArr.map(displayProducts)
    })
}
function displayProducts(dataObj){
    let HTMLTemplate = `
    <li class="col-md-3 mx-4">
        <div class="card md-4" style="width: 18rem;">
            <img src="${dataObj.image}" class="card-img-top" alt="${dataObj.title}">
                <div class="card-body">
                    <h5 class="card-title">${dataObj.title}</h5>
                    <p class="card-text">${dataObj.description}</p>
                    <a href="#" class="btn btn-primary">add to cart</a>
                </div>
        </div>
    </li>
    `   
    productUL.innerHTML+=HTMLTemplate
    console.log(productUL);
}
getAllProducts()