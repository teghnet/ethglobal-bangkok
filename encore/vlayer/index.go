package vlayer

import (
	"embed"
	"net/http"
)

//go:embed dist/assets/*.js
//go:embed dist/assets/*.css
//go:embed dist/assets/*.png
var assets embed.FS

//encore:api public raw path=/assets/*path
func Assets(w http.ResponseWriter, r *http.Request) {
	http.FileServerFS(assets).ServeHTTP(w, r)
}

//go:embed dist/*.html
var index embed.FS

//encore:api public raw path=/vlayer/index.html
func Index(w http.ResponseWriter, r *http.Request) {
	http.StripPrefix("/vlayer/", http.FileServerFS(index)).ServeHTTP(w, r)
}
