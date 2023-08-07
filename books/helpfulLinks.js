function toggleFold() {
    var div = document.getElementById("helpful-links");
    var chevron_down = document.getElementById("chevron-down")
    var chevron_up = document.getElementById("chevron-up")
    if (div.style.display === "none") {
        div.style.display = "block";
        chevron_down.style.display = "none";
        chevron_up.style.display = "inline-block";
        localStorage.setItem('helpfulLinksFolded', "false");
    } else {
        div.style.display = "none";
        chevron_down.style.display = "inline-block";
        chevron_up.style.display = "none";
        localStorage.setItem('helpfulLinksFolded', "true");
    }
}

function logout() {
    localStorage.removeItem("user");
    localStorage.setItem("redirect-to", window.location.href);
    window.location.href = "/books/login";
}

document.addEventListener("DOMContentLoaded", function() {
    const helpfulLinksFolded = localStorage.getItem('helpfulLinksFolded');
    if (helpfulLinksFolded !== null) {
        if (helpfulLinksFolded === "true") {
            toggleFold();
        }
    } else {
        localStorage.setItem('helpfulLinksFolded', "false");
    }
});