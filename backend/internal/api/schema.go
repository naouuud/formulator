package api

import "encoding/json"

func SchemaWithTitle(schema json.RawMessage, title string) (json.RawMessage, error) {
	var doc map[string]json.RawMessage
	if err := json.Unmarshal(schema, &doc); err != nil {
		return nil, err
	}

	titleJSON, err := json.Marshal(title)
	if err != nil {
		return nil, err
	}

	doc["title"] = titleJSON
	return json.Marshal(doc)
}
