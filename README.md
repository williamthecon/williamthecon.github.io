# williamthecon.github.io

Originally intended as a place to share information about some of my favourite hobbies, this site has become mostly private. There will be more content in the future, but it will take some time.

**Most areas on this website are only accessable with an account, so basically `/books/*` and `/de/*` are for private use only. Everything else can hardly be called a website ...**

## Password (`/password`, `/password2`)

These two standalone sites implement the key derivation algorithm `PBKDF2`, which basically takes a password and optionally a salt and uses a time-consuming algorithm to _convert_ it into another string. On my machine this takes between 1.5 and 3 seconds. This can be used to make writing down your passwords digitally or in real life less dangerous. You can choose one of many ways to make one of your passwords virtually impossible to crack. To name just a few:

- Choose a salt that's easy to remember and don't write it down anywhere.
- Write your passwords and salt(s) down in different places to make it harder for someone to get their hands on both.
- Change any passwords and/or salt(s) in a way that only you can undo, for example by adding a few characters to any passwords you use, but not to the ones you write down.

`/password` is just a simpler version of `/password2`, so both can be used, but neither can replace the other. However, as the latter is more secure and more customisable, it is clearly preferable.
