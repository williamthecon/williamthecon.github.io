function openPopup(id) {
    const overlay = document.getElementById("overlay");
    overlay.style.display = "block";
    const popup = document.getElementById(id);
    popup.style.display = "block";
    popup.parentElement.style.display = "flex";
}

function closePopup() {
    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";
    const popupBackground = document.getElementById("popup-background");
    popupBackground.style.display = "none";
    for (const popup of document.getElementsByClassName("popup")) {
        popup.style.display = "none";
    }
}

function resetDeductions() {
    localStorage.clear();
    switchToPage("start");
    closePopup();
}

function loadDeductions(filepaths) {
    // Load the content of the file at the given paths
    const reader = new FileReader();
    let index = 0;
    let loadedFiles = 0;
    reader.onload = function(e) {
        let data = null;
        try {
            data = JSON.parse(e.target.result)
            loadedFiles++;

            // TODO: Add the real code to load the file
            console.log(data);
        } catch (error) {
            // TODO: Display an error message
            console.error("There was an error loading the file: '" + filepaths[index - 1].name + "'");
            return;
        }

    }

    for (const filepath of filepaths) {
        reader.readAsText(filepath);
        index++;
    }

    if (loadedFiles > 0) {
        // Switch to the load page if not already there
        if (currentPage != "load") {
            switchToPage("load");
        }

        closePopup();
    }
}

function saveDeductions(filepath) {
    // TODO: Add the real code to save the file
    console.log(filepath);
    return closePopup();
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar.style.display == "block") {
        sidebar.style.display = "none";
        document.body.style.overflow = "auto";
    } else {
        sidebar.style.display = "block";
        document.body.style.overflow = "hidden";
    }
}

let currentPage = "start";
function switchToPage(name) {
    const oldPage = document.getElementById("page-" + currentPage);
    oldPage.classList.remove("page-active");

    const page = document.getElementById("page-" + name);
    page.classList.add("page-active");

    currentPage = name;

    const inactiveButtons = ["navbar--reset", "sidebar--reset", "navbar--save", "sidebar--save"].map(id => document.getElementById(id))
    if (name == "start") {
        inactiveButtons.forEach(button => button.classList.add("inactive-link-button"));
    } else {
        inactiveButtons.forEach(button => button.classList.remove("inactive-link-button"));
    }
}

async function init() {
    ["navbar--reset", "sidebar--reset", "navbar--save", "sidebar--save"].forEach(id => document.getElementById(id).classList.add("inactive-link-button"));

    // TODO: Is it really necessary to make the popup closable by pressing the ESC key?
    // document.addEventListener("keydown", e => {
    //     if (document.getElementById("overlay").style.display == "block" && e.key == "Escape") {
    //         closePopup();
    //     }
    // });
}