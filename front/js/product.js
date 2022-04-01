// Récupération ID dans URL pour cibler notre canapé dans l'API
let productId = window.location.search.replace("?id=", "");
let image = document.querySelector(".item__img");
let prix = document.getElementById("price");
let description = document.getElementById("description");
let colorSelector = document.getElementById("colors");
let quantitySelector = document.getElementById("quantity");
let validateInput = document.getElementById("addToCart");

let product = [];
let cartUser = {
  name: "",
  price: "",
  id: "",
  color: "",
  quantity: "1",
  srcImg: "",
  altTxt: "",
};

// Récupération produit depuis API 
const fetchApiProduct = async () => {
  await fetch(`http://localhost:3000/api/products/${productId}`)
    .then((res) => res.json())
    .then((data) => (product = data));
};

// Modification éléments page selon le produit séléctionné
const productAddInfos = async () => {
  await fetchApiProduct();
  //Nom produit
  document.title = product.name;
  title.innerHTML = product.name;
  
  //Image
  image.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}"></img>`;

  //Prix
  prix.innerHTML = product.price;

  //Description
  description.innerHTML = product.description;

  //Boucle liste déroulante choix couleur
  for (let i = 0; i < product.colors.length; i++) {
    selectorColor = document.getElementById("colors");
    selectorColor.innerHTML += `
    <option value="${product.colors[i]}">${product.colors[i]}</option>`;
  }
  //Stockage infos dans objet cartUser
  cartUser.name = product.name;
  cartUser.id = product._id;
  cartUser.srcImg = product.imageUrl;
  cartUser.altTxt = product.altTxt;
};
productAddInfos();

// Envoi de la couleur selectionnée dans l'objet cartUser
colorSelector.addEventListener("input", (e) => {
  cartUser.color = e.target.value;
});
// Récupération quantité choisie dans l'objet cartUser
quantitySelector.addEventListener("change", (e) => {
  // protection string et float
  e.target.value = parseInt(Number(e.target.value))
  if(e.target.value < 1){
    e.target.value = 1
  }
  cartUser.quantity = parseInt(e.target.value);
});

// Validation de formulaire
validateInput.addEventListener("click", () => {
  // Vérification champs quantité et couleur bien remplis
  function verifyInvalidInput() {
    if (cartUser.color == "") {
      // Avertissement erreur couleur
      alert("Veuillez choisir une couleur valide");
    } else if (cartUser.quantity == 0 || cartUser.quantity == "") {
      // Avertissement erreur quantité
      alert("Veuillez choisir une quantité");
    } else {
      setToLocalStorage();
    }
  }
  // Fonction envoi objet vers localStorage
  function setToLocalStorage() {
    let storage = JSON.parse(localStorage.getItem("panier"));

    // SI le panier est rempli
    if (storage) {
      // Recherche de l'article ayant le meme id et couleur que l'objet cartUser
      let getProduct = storage.find(
        (element) =>
          element.id == cartUser.id && element.color == cartUser.color
      );
      // Mise à jour de la quantité en conséquence
      if (getProduct) {
        getProduct.quantity += cartUser.quantity;
        // Envoi du panier mis à jour dans le localstorage
        localStorage.setItem("panier", JSON.stringify(storage));
        alert("Votre quantité à bien été mise a jour");

        return;
      }
      // Création nouvel objet dans panier si couleur différente
      storage.push(cartUser);
      localStorage.setItem("panier", JSON.stringify(storage));
      alert("Votre produit à bien été ajouté au panier");
    }
   // Si panier vide création du premier objet
    else {
      const cart = [];
      cart.push(cartUser);
      localStorage.setItem("panier", JSON.stringify(cart));
      alert("Votre produit à bien été ajouté au panier");
    }
  }
  verifyInvalidInput();
});
