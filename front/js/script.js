  //Initialisation variable données API

  let articles = [];

  //Fonction qui récupère les articles depuis l'API

  async function fetchApi() {
    await fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      // Stockage de data dans une variable articles
      .then((data) => (articles = data));
  }

  //Fonction avec boucle pour afficher les vignettes
  async function KanapShow() {
    await fetchApi();
    let items = document.getElementById("items");

    for (let i = 0; i < articles.length; i++) {
      let link = document.createElement("a");
      let cart__item = document.createElement("article");
      let cart__item_img = document.createElement("img");
      let cart__item_h3 = document.createElement("h3");
      let cart__item_p = document.createElement("p");

      items.appendChild(link);
      link.appendChild(cart__item);
      cart__item.append(cart__item_img, cart__item_h3, cart__item_p);

      link.href = `./product.html?id=${articles[i]._id}`;
      cart__item_img.alt = articles[i].altTxt;
      cart__item_img.src = articles[i].imageUrl;
      cart__item_h3.classList.add("productName");
      cart__item_h3.textContent = articles[i].name;
      cart__item_p.classList.add("productDescription");
      cart__item_p.textContent = articles[i].description;
    }
  }
  KanapShow();


