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

console.log(document.cookie);
console.log(getCookie("sessionId"));
// Check if user has a session
// if (!getCookie("sessionId")) {
//     window.location.href = "/chat/username";
// }