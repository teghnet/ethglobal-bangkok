package web

import (
	"embed"
	"net/http"
)

//go:embed assets/*.js
//go:embed assets/*.css
//go:embed assets/*.png
var assets embed.FS

//encore:api public raw path=/web/assets/*path
func Assets(w http.ResponseWriter, r *http.Request) {
	http.StripPrefix("/web/", http.FileServerFS(assets)).ServeHTTP(w, r)
}

//go:embed *.html
var index embed.FS

//encore:api public raw path=/web/request.html
func Index(w http.ResponseWriter, r *http.Request) {
	http.StripPrefix("/web/", http.FileServerFS(index)).ServeHTTP(w, r)
}
