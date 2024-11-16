package vlayer

import (
	"embed"
	"io/fs"
	"net/http"
)

//go:embed dist/assets/*
var assets embed.FS

//encore:api public raw path=/assets/*path
func Assets(w http.ResponseWriter, r *http.Request) {
	sub, err := fs.Sub(assets, "dist")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	http.FileServerFS(sub).ServeHTTP(w, r)
}

//go:embed dist/*.html
var index embed.FS

//encore:api public raw path=/vlayer/*path
func Index(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/vlayer/index.html" {
		http.ServeFileFS(w, r, index, "dist/index.html")
		return
	}
	sub, err := fs.Sub(index, "dist")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	http.StripPrefix("/vlayer/", http.FileServerFS(sub)).ServeHTTP(w, r)
}
