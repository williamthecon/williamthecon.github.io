function toggleFold(id) {
    var div = document.getElementById(id);
    var chevron_down = document.getElementById(id + "--chevron-down")
    var chevron_up = document.getElementById(id + "--chevron-up")
    if (div.style.display === "none") {
        div.style.display = "block";
        chevron_down.style.display = "none";
        chevron_up.style.display = "inline-block";
        localStorage.setItem(id + "--folded", "false");
    } else {
        div.style.display = "none";
        chevron_down.style.display = "inline-block";
        chevron_up.style.display = "none";
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