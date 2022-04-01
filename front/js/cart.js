let panier = JSON.parse(localStorage.getItem("panier"));
let qty = 0;
let total = 0;
contact = {
	firstName: "",
	lastName: "",
	address: "",
	city: "",
	email: "",
};
products = [];
orderId = undefined;
inputError = 0;

async function fetchApiProduct(productID){
	return new Promise(async (resolve, reject) => {
		let result = await fetch(`http://localhost:3000/api/products/${productID}`).then((res) => {
			return res.json()
		})
		resolve(result)
	})
};

//Affichage vignettes pour chaque élément du panier

// Si on se trouve dans la page panier on execute le code
if (location.href.search("confirmation") > 0) {
	// Si nous sommes sur la page de confirmation alors cela affiche le numéro de commande stocké dans l'URL + suppression du panier afin de pouvoir repasser une nouvelle commande


	orderId = window.location.search.replace("?", "");
	document.getElementById("orderId").innerHTML = orderId;
	localStorage.removeItem("panier");
} else {
	// SI le panier est vide un message est affiché

	if (panier.length == 0) {
		document.getElementById(
			"cart__items"
		).innerHTML = `<h3 style="text-align: center; margin-bottom: 50px;">Vous n'avez aucun article dans votre panier !</h3>`;
	} else {
		async function createElement(){
			for (let article of panier) {
				let article_sv = await fetchApiProduct(article.id)
				
				qty += parseInt(Number(article.quantity));
				total += parseInt(Number(article.quantity)) * Number(article_sv.price);
	
				// création de l'élément de base du produit
				let elem = document.createElement("article")
					elem.setAttribute(`class`, "cart__item")
					elem.setAttribute(`data-id`, article.id)
					elem.setAttribute(`id`, `${article.id}${article.color}`)
					elem.setAttribute(`productname`, `${article.name}${article.color}`)
					elem.setAttribute(`data-color`, article.color)
	
					//création de l'image du produit
					let img_div = document.createElement("div")
						img_div.setAttribute("class", "cart__item__img")
						let img = document.createElement("img")
							img.src = article.srcImg
							img.alt = article.altTxt
					img_div.appendChild(img)
				elem.appendChild(img_div)
				
	
					let content = document.createElement("div")
						content.setAttribute("class", "cart__item__content")
	
						let desc = document.createElement("div")
							desc.setAttribute("class", "cart__item__content__description")
							let desc_title = document.createElement("h2")
								desc_title.innerText = article.name
							let desc_col_txt = document.createElement("p")
								desc_col_txt.innerText = article.color
							let desc_price_txt = document.createElement("p")
								desc_price_txt.innerText = `${article_sv.price} €`
	
							desc.appendChild(desc_title)
							desc.appendChild(desc_col_txt)
							desc.appendChild(desc_price_txt)
						content.appendChild(desc)
	
	
						let settings = document.createElement("div")
							settings.setAttribute("class", "cart__item__content__settings")
							
							let quantity = document.createElement("div")
								quantity.setAttribute("class", "cart__item__content__settings__quantity")
							
								let qty_txt = document.createElement("p")
									qty_txt.innerText = "Qté : "
	
								let qty_input = document.createElement("input")
									qty_input.type = "number"
									qty_input.className = "itemQuantity"
									qty_input.name = "itemQuantity"
									qty_input.min = 1
									qty_input.max = 100
									qty_input.value = article.quantity
									qty_input.onchange = function(event){
										let id_col = `${article.id}${article.color}`
	
										// protection string et float
										event.target.value = parseInt(Number(event.target.value))
										if(event.target.value < 1){
											event.target.value = 1
										}
	
										// comparaison de l'élément par rapport aux articles dans le panier pour éditer le bon article séléctionné
										for(let[i,o] of Object.entries(panier)){
											if(o.id == article.id && o.color == article.color){
												panier[i].quantity = parseInt(Number(event.target.value))
											}
										}
										
	
										localStorage.setItem("panier", JSON.stringify(panier));
										recalc();
									}
	
								quantity.appendChild(qty_txt)
								quantity.appendChild(qty_input)
							settings.appendChild(quantity)
							
							let del = document.createElement("div")
								del.setAttribute("class", "cart__item__content__settings__delete")
	
								let del_txt = document.createElement("p")
									del_txt.innerText = "Supprimer"
									del_txt.className = "deleteItem"
									del_txt.onclick = function(){
										let id_col = `${article.id}${article.color}`
										let elem_id = document.querySelector(`article[id="${id_col}"]`)
	
										// comparaison de l'élément par rapport aux articles dans le panier pour supprimer le bon article séléctionné
										for(let[i,o] of Object.entries(panier)){
											if(o.id == article.id && o.color == article.color){
												panier.splice(i,1)
											}
										}
										elem_id.remove()
										localStorage.setItem("panier", JSON.stringify(panier));
										recalc();
									}
	
								del.appendChild(del_txt)
							settings.appendChild(del)
						content.appendChild(settings)
	
				elem.appendChild(content)
				document.getElementById("cart__items").appendChild(elem)
			}

			// Affichage quantité et prix total
			document.getElementById("totalQuantity").innerHTML = qty;
			document.getElementById("totalPrice").innerHTML = Intl.NumberFormat(
				"fr-FR",
				{
					style: "currency",
					currency: "EUR",
				}
			).format(total);
		}
		createElement() // Créer les élément en ASYNC pour pouvoir fetch les prix actuels sans possibilité de modifier le localStorage
	}
	//Fonction pour recalculer le montant du panier si changement
	async function recalc() {
		let cart = JSON.parse(localStorage.getItem("panier"));
		let quantity = 0;
		let total = 0;
		for (article of cart) {
			let article_sv = await fetchApiProduct(article.id)
			quantity += parseInt(Number(article.quantity));
			total += parseFloat(article_sv.price) * parseInt(article.quantity);
		}
		document.getElementById("totalQuantity").innerHTML = quantity;
		document.getElementById("totalPrice").innerHTML = Intl.NumberFormat(
			"fr-FR",
			{
				style: "currency",
				currency: "EUR",
			}
		).format(total);

		if (panier.length == 0) {
			let panierElem = document.createElement("h3")
				panierElem.style = "text-align: center; margin-bottom: 50px;"
				panierElem.innerText = "Vous n'avez aucun article dans votre panier !"

			//réinitialisation de la balise au cas où répétition de la phrase "Aucun article ..."
			document.querySelector("section#cart__items").innerHTML = ""
			document.getElementById("cart__items").append(panierElem)
		}
	}

	// Formulaire utilisateur

	// Récupération balises input
	inputFirstName = document.querySelectorAll(
		".cart__order__form__question input"
	)[0];
	inputLastName = document.querySelectorAll(
		".cart__order__form__question input"
	)[1];
	inputAddress = document.querySelectorAll(
		".cart__order__form__question input"
	)[2];
	inputCity = document.querySelectorAll(
		".cart__order__form__question input"
	)[3];
	inputEmail = document.querySelectorAll(
		".cart__order__form__question input"
	)[4];
	// Récupération balises erreur
	errFirstName = document.querySelectorAll(".cart__order__form__question p")[0];
	errLastName = document.querySelectorAll(".cart__order__form__question p")[1];
	errAddress = document.querySelectorAll(".cart__order__form__question p")[2];
	errCity = document.querySelectorAll(".cart__order__form__question p")[3];
	errEmail = document.querySelectorAll(".cart__order__form__question p")[4];
	// Récupération du bouton de commande
	submitInfo = document.getElementById("order");

	validForm = false;
	// Récupération prénom
	inputFirstName.addEventListener("change", (e) => {
		validFirstName(e.target.value);
		contact.firstName = e.target.value;
	});
	// Récupération nom
	inputLastName.addEventListener("change", (e) => {
		validLastName(e.target.value);
		contact.lastName = e.target.value;
	});
	// Récupération addresse
	inputAddress.addEventListener("change", (e) => {
		validAddress(e.target.value);
		contact.address = e.target.value;
	});
	// Récupération ville
	inputCity.addEventListener("change", (e) => {
		validCity(e.target.value);
		contact.city = e.target.value;
	});
	// Récupération email
	inputEmail.addEventListener("change", (e) => {
		validEmail(e.target.value);
		contact.email = e.target.value;
	});
	// Fonction avec Regex pour vérifier l'absence de chiffres dans le champ prénom
	function validFirstName(firstName) {
		if (firstName.length == 0) {
			errFirstName.innerHTML = "Votre prénom n'est pas renseigné !";
			validForm = false;
		} else if (!/[0-9]/.test(firstName)) {
			errFirstName.innerText = "";
			validForm = true;
		} else {
			errFirstName.innerText = "Votre prénom ne peut pas contenir de chiffre";
			validForm = false;
		}
	}
	// Fonction avec Regex pour vérifier l'absence de chiffres dans le champ nom
	function validLastName(lastName) {
		if (lastName.length == 0) {
			errLastName.innerHTML = "Votre nom n'est pas renseigné !";
			validForm = false;
		} else if (!/[0-9]/.test(lastName)) {
			errLastName.innerText = "";
			validForm = true;
		} else {
			errLastName.innerText = "Votre nom ne peut pas contenir de chiffre";
			return false;
		}
	}
	function validAddress(address) {
		if (address.length == 0) {
			errAddress.innerHTML = "Votre adresse n'est pas renseigné !";
			validForm = false;
		} else {
			errAddress.innerHTML = "";
			validForm = true;
		}
	}
	function validCity(city) {
		if (city.length == 0) {
			errCity.innerHTML = "Votre ville n'est pas renseigné !";
			validForm = false;
		} else {
			errCity.innerHTML = "";
			validForm = true;
		}
	}
	// Fonction RegExp champ email est au format xxx@xx.xx
	function validEmail(email) {
		let emailRegExp = new RegExp(
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
		);
		if (email.length == 0) {
			errEmail.innerHTML = "Votre mail n'est pas renseigné !";
			validForm = false;
		} else if (emailRegExp.test(email)) {
			errEmail.innerHTML = "";
			validForm = true;
		} else {
			errEmail.innerHTML = "Votre mail n'est pas valide !";
			validForm = false;
		}
	}

	// Eventlistener qui s'active uniquemeent si champs bien remplis
	submitInfo.addEventListener("click", (e) => {
		e.preventDefault();
		// Fonction fetch qui envoie à l'API un objet contenant "contact"(un objet) et "products"(un tableau)
		async function sendData() {
			await fetch("http://localhost:3000/api/products/order", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ contact, products }),
			})
				// Stockage réponse API (orderId)
				.then(function (response) {
					return response.json();
				})
				.then(function (data) {
					orderId = data.orderId;
				});
			// Si l'API nous a renvoyé un orderID --> redirection de l'utilisateur
			if (orderId != undefined || orderId != "") {
				location.href = "confirmation.html?" + orderId;
			}
		}
		function collectDatas() {
			for (let article of panier) {
				products.push(article.id);
			}
		}
		if (validForm) {
			collectDatas();
			sendData();
		} else {
			validFirstName(inputFirstName.value);
			validLastName(inputLastName.value);
			validAddress(inputAddress.value);
			validCity(inputCity.value);
			validEmail(inputEmail.value);
		}
	});
}
