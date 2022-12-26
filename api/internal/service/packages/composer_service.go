package packages

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type ComposerPackageHandler struct {
	q string
}

type Payload struct {
	Result []Result `json:"result"`
}

type Result struct {
	Hits struct {
		Object struct {
			Name        string `json:"name"`
			PackageName string `json:"package_name"`
			Description string `json:"description"`
			Meta        struct {
				Downloads string `json:"downloads"`
				Favorite  string `json:"favers"`
			} `json:"meta"`
		} `json:"Object"`
	}
}

type Request struct {
	Requests []Requests `json:"requests"`
}

type Requests struct {
	IndexName string `json:"indexName"`
	Params    string `json:"params"`
}

func NewComposerPackage(query map[string]interface{}) *ComposerPackageHandler {
	return &ComposerPackageHandler{
		q: query["query"].(string),
	}
}

func (param *ComposerPackageHandler) GetData() ([]Package, error) {
	url := "https://m58222sh95-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia for JavaScript (3.35.1); Browser (lite); instantsearch.js 2.10.5; JS Helper (2.28.1)&x-algolia-application-id=M58222SH95&x-algolia-api-key=5ae4d03c98685bd7364c2e0fd819af05"

	re := make([]Requests, 1)
	re[0].IndexName = "packagist"
	re[0].Params = "query=laravel&maxValuesPerFacet=100&page=0&facets=%5B%22tags%22%2C%22type%22%2C%22type%22%5D&tagFilters="

	req := Request{
		Requests: re,
	}

	j, _ := json.Marshal(req)
	r, err := http.Post(url, "application/json", bytes.NewBuffer(j))
	if err != nil {
		log.Fatal(err)
	}

	defer r.Body.Close()

	var post map[string]interface{}
	derr := json.NewDecoder(r.Body).Decode(&post)
	if derr != nil {
		log.Fatal(derr)
	}

	fmt.Println(post)

	if r.StatusCode != 200 {
		log.Fatalf("Error: code returning %v", r.StatusCode)
	}

	return nil, nil
}
