import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-aeba4-default-rtdb.europe-west1.firebasedatabase.app/" // Link to my firebase database
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function () {
    let inputValue = inputFieldEl.value // Here we create a new variable for the text in the inputFieldEl

    push(shoppingListInDB, inputValue)

    clearInputFieldEl() // This clears the text that was typed in the inputFieldEL

})

onValue(shoppingListInDB, function (snapshot) { // This is to show shopping list items inside our database in firebase

    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())

        clearShoppingListEl()

        for (let i = 0; i < itemsArray.length; i++) { // This is to display the items from the inputFieldEl to the ul
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]

            appendItemToShoppingListEl(currentItem)
        }
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }


})

function clearInputFieldEl() { // This is the function used within our AddEventlistener 
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) { // This is the function used within our AddEventlistener 

    let itemID = item[0]
    let itemValue = item[1]

    let newEl = document.createElement("li")

    newEl.textContent = itemValue

    shoppingListEl.append(newEl)

    newEl.addEventListener("click", function () { //This is to remove the item from the database 
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)


    })

}

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}
