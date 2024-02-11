function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) {
            return value;
        }
    }
    return null;
}

// Check if user has a session
const isUsernamePage = ["https://williamthecon.github.io/de/chat/username", "https://williamthecon.github.io/de/chat/username.html"].includes(window.location.href);
if (!getCookie("sessionId")) {
    if (!isUsernamePage) {
        window.location.href = "/de/chat/username";
    }
} else if (isUsernamePage) {
    window.location.href = "/de/chat/";
}