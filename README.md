# Google Books Web Application

This is a simples Web Application that uses Google Books API integration that was made as a challenge. Future versions may have more features and also be re-writen to use modern frameworks like React or Angular 2


## Used in this project
* Bootstrap 4 alpha - (http://v4-alpha.getbootstrap.com)
* Font Awesome (http://fontawesome.io)
* Google Books API (https://developers.google.com/books/docs/v1/reference/volumes/list)

## Dev Environment Packages
### Just run `npm install` and it will install all Dev Env packages:
- gulp
- gulp-sass
- browser-sync
- gulp-useref
- gulp-uglify
- gulp-if
- gulp-clean-css
- gulp-imagemin
- gulp-cache
- del
- run-sequence

### All taks are well documented in the _gulpfile.js_ but to explain the 2 main tasks:

#### `gulp watcher` that will: 
- run the server / pop on your browser 
- watch any CSS / HTML / JS file modification and reload the browser

#### `gulp build` when you want to create your DIST / final application that will:
- make sure your CSS files are updated from SCSS
- minify all CSS and JS files and save them on DIST folder
- change HTML's to point to minified files and save them to DIST folder
- optime images / new images (that have a local cache so don't run if there is no changes)

## Source / Dist structures and deploy
For the sake of this project I'm using **GitHub Pages** and a non conventional SRC/DIST strucutre / method:

- SRC and DIST folders/files are presented inside master branch
- A "gh-page" branch with only DIST folder created using `git subtree push --prefix dist origin gh-pages`
- And after a `git push` to MASTER (that updates DIST) I can just `npm run deploy` to update the GH-PAGES branch (DIS) and access on https://github.com/fleps/gbooks-webapp
