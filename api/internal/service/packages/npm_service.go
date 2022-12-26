package packages

import (
	"fmt"
	"strings"

	"github.com/gocolly/colly"
)

type NpmPackageHandler struct {
	q       string
	perPage int
	page    int
}

func NewNpmPackage(query map[string]interface{}) *NpmPackageHandler {
	return &NpmPackageHandler{
		q:       query["query"].(string),
		page:    query["page"].(int),
		perPage: query["per_page"].(int),
	}
}

func (param *NpmPackageHandler) GetData() ([]Package, error) {
	c := colly.NewCollector()
	var pkgs []Package
	// On every a element which has href attribute call callback
	c.OnHTML("section.ef4d7c63", func(e *colly.HTMLElement) {
		pkgName := e.ChildText("a > h3")
		description := e.ChildText("p")
		publish := e.ChildText("span._66c2abad")
		author := e.ChildText("a.e98ba1cc")

		publishedDate := strings.Split(publish, "published ")
		version := strings.Split(publishedDate[1], "•")

		res := Package{
			Name:        pkgName,
			Author:      author,
			Published:   publish,
			Version:     version[0],
			Description: description,
		}

		pkgs = append(pkgs, res)
	})

	// Before making a request print "Visiting ..."
	c.OnRequest(func(r *colly.Request) {
		fmt.Println("Visiting", r.URL.String())
	})

	c.Visit(fmt.Sprintf("https://www.npmjs.com/search?q=%s", param.q))

	return pkgs, nil
}
