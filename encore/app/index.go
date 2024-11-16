package app

import (
	"embed"
	"net/http"
)

//go:embed *.html
var index embed.FS

//encore:api public raw path=/app/*path
func Index(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/app/index.html" {
		http.ServeFileFS(w, r, index, "index.html")
		return
	}
	http.StripPrefix("/app/", http.FileServerFS(index)).ServeHTTP(w, r)
}
