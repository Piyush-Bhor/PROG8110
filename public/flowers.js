import 'https://cdnjs.cloudflare.com/ajax/libs/framework7/5.7.10/js/framework7.bundle.js';
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.0/firebase-app.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.0/firebase-database.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/firebase/7.16.1/firebase-auth.min.js";
import app from "./F7App.js";

const $$ = Dom7;

$$("#tab2").on("tab:show", () => {
    //put in firebase ref here
    const sUser = firebase.auth().currentUser.uid;
    firebase.database().ref("flowers/" + sUser).on("value", (snapshot) =>{
        const oItems = snapshot.val();
        const aKeys = Object.keys(oItems);
        $$("#flowersList").html("");
        for(let n = 0; n < aKeys.length; n++){ 
           let sCard = `
            <div class="card">
                <div class="card-content card-content-padding ${oItems[aKeys[n]].datePurchased ? 'purchased' : ''}">
                    <p>Flower: ${oItems[aKeys[n]].item}</p>
                    <p>Store: ${oItems[aKeys[n]].store}</p>
                    <p><img src="${oItems[aKeys[n]].imgUrl}" alt="${oItems[aKeys[n]].title}"</p>
                </div>
                <div class="card-footer">
                    <button class="button bought-button" data-key="${aKeys[n]}">Purchased Before</button>
                    <button class="button delete-button" data-key="${aKeys[n]}">Delete</button>
                </div>
            </div>
            `
            $$("#flowersList").append(sCard);
        }
    });

    // To mark item as purchased
    $$("#flowersList").on("click", ".bought-button", function() {
        const keyToUpdate = $$(this).data("key");
        if (keyToUpdate) {
            const sUser = firebase.auth().currentUser.uid;
            firebase.database().ref("flowers/" + sUser + "/" + keyToUpdate).update({
                datePurchased: new Date().toISOString()
            }).catch((error) => {
                console.error("Error updating data: ", error);
            });
        }
    });

    // To delete the item
    $$("#flowersList").on("click", ".delete-button", function() {
        const keyToDelete = $$(this).data("key");
        if (keyToDelete) {
            const sUser = firebase.auth().currentUser.uid;
            firebase.database().ref("flowers/" + sUser + "/" + keyToDelete).remove().catch((error) => {
                console.error("Error deleting data: ", error);
            });
        }
    });

});

$$(".my-sheet").on("submit", e => {
    //submitting a new note
    e.preventDefault();
    const oData = app.form.convertToData("#addItem");
    const sUser = firebase.auth().currentUser.uid;
    const sId = new Date().toISOString().replace(".", "_");
    firebase.database().ref("flowers/" + sUser + "/" + sId).set(oData);
    app.sheet.close(".my-sheet", true);
});