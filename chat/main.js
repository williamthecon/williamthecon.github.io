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
// if (!getCookie("sessionId")) {
//     window.location.href = "/chat/username";
// }