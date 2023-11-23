async function login(username, password) {
    const response = await fetch("https://mgp-api.j9zwm20di.repl.co/school/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });
    return response.json();
}