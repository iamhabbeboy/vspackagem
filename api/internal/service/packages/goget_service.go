package packages

import (
	"fmt"

	"github.com/gocolly/colly"
)

type GoGetPackageHandler struct {
	q string
}

func NewGoGetPackage(query map[string]interface{}) *GoGetPackageHandler {
	return &GoGetPackageHandler{
		q: query["query"].(string),
	}
}

func (param *GoGetPackageHandler) GetData() ([]Package, error) {
	c := colly.NewCollector(
		// Visit only domains: hackerspaces.org, wiki.hackerspaces.org
		colly.AllowedDomains("pkg.go.dev"),
	)

	var pkgs []Package

	// On every a element which has href attribute call callback
	c.OnHTML("div.SearchSnippet", func(e *colly.HTMLElement) {
		// Visit link found on page
		pkgName := e.ChildText("a")
		description := e.ChildText("p.SearchSnippet-synopsis")
		version := e.ChildText("span.go-textSubtle strong")
		publish := e.ChildText("span[data-test-id=snippet-published] strong")

		res := Package{
			Name:        pkgName,
			Version:     version,
			Published:   publish,
			Description: description,
		}

		pkgs = append(pkgs, res)
	})

	// Before making a request print "Visiting ..."
	c.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting", r.URL.String())
	})

	c.Visit(fmt.Sprintf("https://pkg.go.dev/search?q=%s", param.q))

	return pkgs, nil
}
