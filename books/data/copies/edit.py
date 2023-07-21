import random, string, json

def generate_token(length: int = 13):
    global tokens
    token = "".join([
        random.choice(string.ascii_letters + string.digits)
        for _ in range(length)
    ])
    while token in tokens:
        token = "".join([
            random.choice(string.ascii_letters + string.digits)
            for _ in range(length)
        ])
    tokens.append(token)
    return token

def load(filename: str):
    with open(filename) as f:
        r = json.load(f)
    return r

def save(filename: str, data: dict):
    with open(filename, "w") as f:
        json.dump(data, f, indent=4)

users = load("../users.json")
books = load("../books.json")
wishes = load("../wishes.json")
tokens = []

for user in users:
    user["token"] = generate_token()

for book in books:
    book["token"] = generate_token()

for wish in wishes:
    wish["token"] = generate_token()

save("../users.json", users)
save("../books.json", books)
save("../wishes.json", wishes)
save("../tokens.json", tokens)