package packages

import (
	"log"
)

type PackageManager interface {
	GetData() ([]Package, error)
}

type Package struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Version     string `json:"version"`
	Published   string `json:"published"`
	Author      string `json:"author"`
}

func NewPackageService(search map[string]interface{}) PackageManager {
	if search["query"] == "" || search["vendor"] == "" {
		log.Fatal("query or vendor must not be empty")
	}
	vendors := map[string]PackageManager{
		"npm":      NewNpmPackage(search),
		"goget":    NewGoGetPackage(search),
		"composer": NewComposerPackage(search),
	}
	selectedVendor := search["vendor"].(string)
	if _, ok := vendors[selectedVendor]; !ok {
		log.Fatal("Vendor not found")
	}

	return vendors[selectedVendor]
}
