document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    loadRecipes();

    var button = document.querySelector('#saveButton');

    button.addEventListener('click', handleButtonClick);
    window.addEventListener("load", loadRecipes);
}

/* Add JavaScript */

function saveRecipe(title, ingredients, type) {
    var allRecipes = JSON.parse(localStorage.getItem("allRecipes"));
    var date = new Date();

    if (allRecipes == null) 
        allRecipes = [];

    var recipe = {
        "title": title,
        "ingredients": ingredients,
        "type": type,
        "date": date.toLocaleDateString(),
        "time": date.toLocaleTimeString(),
        "image": "",
        "starred": "star-outline",
        "str": "danger"
    };

    allRecipes.push(recipe);
    localStorage.setItem("allRecipes", JSON.stringify(allRecipes));
    loadRecipes();
}

function handleButtonClick() {
    const titleField = document.querySelector('#title');
    const ingredientsField = document.querySelector('#ingredients');
    const typeField = document.querySelector('#type');

    var message, buttons = null

    if (titleField.value == "" || ingredientsField.value == "" || typeField.value == "") {
        message = "Please fill in all the fields"
        buttons = ['Ok']
    }
    else {
        message = "Are you sure you want to save this recipe?"
        buttons = [
            {
                text: 'Cancel',
                role: 'cancel'
            }, 
            {
                text: 'Ok',
                handler: () => {
                    saveRecipe(titleField.value, ingredientsField.value, typeField.value);
                    
                    titleField.value = '';
                    ingredientsField.value = '';
                    typeField.value = '';

                    navigator.vibrate(1000);

                    loadRecipes();
                }
            }
        ];
    }

    const alert = document.createElement('ion-alert');
    alert.header = 'MyRecipes';
    alert.message = message;
    alert.buttons = buttons;

    document.body.appendChild(alert);
    return alert.present();
}

/* Add JavaScript */

/* List JavaScript */

function loadRecipes() { 
    var item = JSON.parse(localStorage.getItem("allRecipes"));
    
    document.getElementById("recipes").innerHTML = "";

    if (item != null) {
        for(var i = 0; i < item.length; i++){
            document.getElementById("recipes").innerHTML += `
            <ion-card class="new-colour">
                <ion-card-header>
                    <ion-card-title class="new-colour">
                        <ion-icon size="large" name="${item[i].type}"></ion-icon>
                        ${item[i].title}
                    </ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    ${item[i].ingredients}<br>
                    ${item[i].date}
                    ${item[i].time}<br>
                    <ion-buttons>
                        <ion-button id="${i}" onclick="star(this.id)" slot="start">
                            <ion-icon id="${i}" color="${item[i].str}" size="large" name="${item[i].starred}"></ion-icon>
                        </ion-button>
                        <ion-button onclick="onTakeImg(this.id)" id="${i}">
                            <ion-icon size="large" name="camera-outline"></ion-icon>
                        </ion-button>
                        <ion-button onclick="openModal(this.id)" id="${i}">
                            <ion-icon size="large" name="image-outline"></ion-icon>
                        </ion-button>
                        <ion-button id="del" slot="end">
                            <ion-icon size="large" name="trash-outline"></ion-icon>
                        </ion-button>
                    </ion-buttons>
                </ion-card-content>
            </ion-card>
            `
        }
    }
    else {
        document.getElementById("recipes").innerHTML = '<h4 class="ion-text-center">No recipes yet. Go on, add a new one!</h4>';
    }
}

var clearBtn = document.querySelector("#clearBtn");
clearBtn.addEventListener("click", clearRecipes)

function clearRecipes() {

    var alert = document.createElement('ion-alert');
    
    alert.header = 'Delete all recipes?';
    alert.message = 'Are you sure you want to delete all recipes?';
    alert.buttons = [
        {
            text: 'No',
            role: 'cancel'
        }, 
        {
            text: 'Yes',
            handler: () => {
                localStorage.removeItem("allRecipes");
                presentToast("All recipes were cleared");
                
                navigator.vibrate(1000);

                loadRecipes();
            }
        }
    ];

    document.body.appendChild(alert);

    return alert.present();
}

function presentToast(message) {
    const toast = document.createElement('ion-toast');
    toast.message = message
    toast.duration = 1000;
    toast.position = "bottom";
    
    document.body.appendChild(toast);
    return toast.present();
}

/* List JavaScript */

/* Star JavaScript */

function star(starId){
    var savedRecipes = JSON.parse(localStorage.getItem("allRecipes"));

    if(savedRecipes[starId].starred == "star"){
        savedRecipes[starId].color = "danger";
        savedRecipes[starId].starred = "star-outline";
        localStorage.setItem("allRecipes", JSON.stringify(savedRecipes));

        navigator.vibrate(1000);

        loadRecipes();
    }
    else if(savedRecipes[starId].starred == "star-outline"){
        savedRecipes[starId].color = "warning";
        savedRecipes[starId].starred = "star";
        localStorage.setItem("allRecipes", JSON.stringify(savedRecipes));
        loadRecipes();
    }
}

/* Star JavaScript */

/* Camera JavaScript */

function onTakeImg(takeImg){

    var options = {
        quality: 70,
        destinationType: Camera.DestinationType.FILE_URI
    }
    navigator.camera.getPicture(onSuccess, onFail, options);

    function onSuccess(imageData){
        var savedRecipes = JSON.parse(localStorage.getItem("allRecipes"));
        savedRecipes[takeImg].image = imageData;
        localStorage.setItem("allRecipes", JSON.stringify(savedRecipes));

        navigator.vibrate(1000);

        loadRecipes();
    }

    function onFail(errorMsg){
    var alert = document.getElementById("ion-alert");

    alert.message = errorMsg;
    alert.buttons = [{
        text: "OK"
    }];

    document.body.appendChild(alert);
    return alert.present();
    }
}

/* Camera JavaScript */

/* Modal JavaScript */

var modalElement = document.createElement('ion-modal');
customElements.define(
  'modal-content',
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
            <ion-header translucent>
              <ion-toolbar>
                <ion-title>Image View</ion-title>
                <ion-buttons slot="end">
                  <ion-button onclick="dismissModal()">Close</ion-button>
                </ion-buttons>
              </ion-toolbar>
            </ion-header>
            <ion-content>
                <img src=${modalElement.componentProps.src}>
            </ion-content>
          `;
    }
  }
);

function openModal(idImg) {
    var savedRecipes = JSON.parse(localStorage.getItem("allRecipes"));
    modalElement.component = 'modal-content';
    modalElement.componentProps = {
        src: savedRecipes[idImg].image
    }
    //Display the modal
    document.body.appendChild(modalElement);
    return modalElement.present();
}

function dismissModal() {
  modalElement.dismiss();
}

/* Modal JavaScript */