package app

import (
	"embed"
	"net/http"
)

//go:embed *.html
var index embed.FS

//encore:api public raw path=/app/*path
func Index(w http.ResponseWriter, r *http.Request) {
	http.StripPrefix("/app/", http.FileServerFS(index)).ServeHTTP(w, r)
}
