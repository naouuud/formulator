package api

import (
	"encoding/json"
	"testing"
)

func TestSchemaWithTitle(t *testing.T) {
	schema := json.RawMessage(`{"title":"","pages":[{"id":"p1","title":"","elements":[]}],"extra":"keep"}`)

	withTitle, err := SchemaWithTitle(schema, "Edition 1")
	if err != nil {
		t.Fatalf("SchemaWithTitle() error = %v", err)
	}

	var parsed map[string]json.RawMessage
	if err := json.Unmarshal(withTitle, &parsed); err != nil {
		t.Fatalf("unmarshal result: %v", err)
	}

	var title string
	if err := json.Unmarshal(parsed["title"], &title); err != nil {
		t.Fatalf("unmarshal title: %v", err)
	}
	if title != "Edition 1" {
		t.Fatalf("title = %q, want %q", title, "Edition 1")
	}

	var extra string
	if err := json.Unmarshal(parsed["extra"], &extra); err != nil {
		t.Fatalf("unmarshal extra: %v", err)
	}
	if extra != "keep" {
		t.Fatalf("extra = %q, want %q", extra, "keep")
	}

	if _, ok := parsed["pages"]; !ok {
		t.Fatal("pages field missing from result")
	}
}
