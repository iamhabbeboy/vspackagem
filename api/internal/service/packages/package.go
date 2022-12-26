package packages

type PackageManager interface {
	GetData() ([]Package, error)
}

type Package struct {
	Name        string
	Description string
	Version     string
	Published   string
	Author      string
}

func NewPackageService(search map[string]interface{}) PackageManager {
	if search["query"] == "" || search["vendor"] == "" {
		return nil
	}
	vendors := map[string]PackageManager{
		"npm":      NewNpmPackage(search),
		"goget":    NewGoGetPackage(search),
		"composer": NewComposerPackage(search),
	}
	selectedVendor := search["vendor"].(string)
	return vendors[selectedVendor]
}
