package vlayer

import (
	"embed"
	"io/fs"
	"net/http"
)

//go:embed dist/assets/*
var assets embed.FS

//encore:api public raw path=/assets/*path
func Assets(w http.ResponseWriter, r *http.Request) error {
	sub, err := fs.Sub(assets, "dist")
	if err != nil {
		return err
	}
	http.FileServerFS(sub).ServeHTTP(w, r)
	return nil
}

//go:embed dist/*.html
var index embed.FS

//encore:api public raw path=/vlayer/index.html
func Index(w http.ResponseWriter, r *http.Request) {
	http.StripPrefix("/vlayer/", http.FileServerFS(index)).ServeHTTP(w, r)
}
