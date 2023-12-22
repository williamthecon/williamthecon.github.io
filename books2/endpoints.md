# Endpoints

Just to prevent you from getting confused: This endpoint, although currently being named `/books2/`, is a new version of the current `/books/` endpoint (as of `10.12.23`). To not hinder the `/books/` traffic, this is developed here and later when finished transfered back to the other address. The reason, why this can't really be a branch on Github, is that only the main branch is used for Github Pages. Because this needs to be checked to ensure that it works, this endpoint `/books2/` was created and is used.

__Content-Overview__:

- [Endpoints](#endpoints)
  - [/index](#index)
  - [/login](#login)
  - [/logout](#logout)
  - [/profile](#profile)
  - [/booklist](#booklist)
  - [/book](#book)
  - [/miscellaneous](#miscellaneous)
  - [/authors](#authors)
  - [/author](#author)
  - [/publishers](#publishers)
  - [/publisher](#publisher)
  - [/helps](#helps)
  - [/help](#help)

---

In general the website should feel simple and be easy to navitage. The light theme might need to be improved, as it now feels kind of ... _too light_.

**TODO**:

- Adjust the light theme of the website to make it be a bit easier on the eyes
- _OR_ add more themes, both light and dark, to not force the user to use the dark theme.

## /index

The homepage should show a kind of news-board and give a quick overview over the most important functionalities of this endpoint `/books/`.

**TODO**:

- Add __everything__!

## /login

This login page should a popup-like login box with a heavy shadow.

**TODO**:

- Add `show/hide password` option
- _(Optional) Add `Forgot Password` option_

## /logout

There is no need for fancy looks, if everything goes fine the user doesn't even recognize being on this endpoint.

**TODO**:

- Add javascript for logging out

## /profile

If the URL parameter `id` or `name` is not given, your profile is shown with a settings option, otherwise you can view other users profiles.

**TODO**:

- Add __everything__!

## /booklist

This page should by default showcase the full list of books. There will also be a search bar and possibly an `advanced search` option too to make less complicated to search with different filters. The search happens server-side, because the presented books will only count up to something like 20 and there the user has to, that's still unclear, either go to the next _page_ or he has to click a `load more` button, and make a new request to the server. There will also be a sort selection menu, but the sorting is also supposed to happen server side because of the same reason as for the search.

**TODO**:

- Add __everything__!

## /book

On this page a book is showcased with all it's features and there will be numerous (local) links to for example all the owners ([/profile](#profile)), that have that same book, the author(s) ([/author](#author)), who wrote that book, and the publisher ([/publisher](#publisher)) of that book.

**TODO**:

- Add __everything__!

## /miscellaneous

This page basically only exists, because [/authors](#authors) and [/publishers](#publishers) didn't fit on the navigation bar together nicely. And so, here are and will be all the pages of this endpoint collected, that didn't fit on the navigation bar properly and that need to somewhat be presented in a way. Maybe later there will be added a few more pages.

**TODO**:

- Add __everything__!

## /authors

This page will be almost identical to [/booklist](#booklist). The only difference will be, that an author has other properties than a book, so everything will look a little different.

**TODO**:

- Add __everything__!

## /author

With page and [/book](#book) it's obviously the same as with [/authors](#authors) and [/booklist](#booklist). An author has different properties than a book, but apart from that, the pages ought to be the same.

**TODO**:

- Add __everything__!

## /publishers

Again, look at [/booklist](#booklist) and [/authors](#authors) and apply it to here.

**TODO**:

- Add __everything__!

## /publisher

Another time, it's like with [/book](#book) and [/author](#author)

**TODO**:

- Add __everything__!

## /helps

This is supposed to be a help for starters, but idealy everything that could possibly be helped with is covered here. There should be search bar too. Each item is linked to the specific [/help](#help) page.

**TODO**:

- Add __everything__!

## /help

This showcases just one of the items from the [/helps](#helps) page. It is basically an article of variable length, that helps to use and/or understand one specific feature of this `/books/` endpoint

**TODO**:

- Add __everything__!
