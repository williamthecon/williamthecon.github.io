function toggleFold(id) {
    var div = document.getElementById(id);
    var chevronDown = document.getElementById(id + "--chevron-down")
    var chevronUp = document.getElementById(id + "--chevron-up")
    if (div.style.display === "none") {
        div.style.display = "block";
        chevronDown.style.display = "none";
        chevronUp.style.display = "inline-block";
        localStorage.setItem(id + "--folded", "false");
    } else {
        div.style.display = "none";
        chevronDown.style.display = "inline-block";
        chevronUp.style.display = "none";
        localStorage.setItem(id + "--folded", "true");
    }
}

function logout() {
    localStorage.removeItem("user");
    localStorage.setItem("redirect-to", window.location.href);
    window.location.href = "/books/login";
}

document.addEventListener("DOMContentLoaded", function() {
    const helpfulLinksFolded = localStorage.getItem('helpful-links--folded');
    if (helpfulLinksFolded !== null) {
        if (helpfulLinksFolded === "true") {
            toggleFold("helpful-links");
        }
    } else {
        localStorage.setItem('helpful-links--folded', "false");
    }
});