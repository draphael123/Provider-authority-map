import { describe, it, expect } from "vitest";
import { cleanName, decodeTopo, parseFiltersFromUrl, buildFiltersSearch } from "./utils";

describe("cleanName", () => {
  it("trims leading and trailing whitespace", () => {
    expect(cleanName("  Alice  ")).toBe("Alice");
  });
  it("collapses multiple spaces", () => {
    expect(cleanName("Alice    Bob")).toBe("Alice Bob");
  });
  it("returns empty string for empty input", () => {
    expect(cleanName("")).toBe("");
  });
  it("handles single word", () => {
    expect(cleanName("Smith")).toBe("Smith");
  });
});

describe("parseFiltersFromUrl", () => {
  it("returns empty arrays when no params", () => {
    expect(parseFiltersFromUrl("")).toEqual({ providers: [], states: [] });
    expect(parseFiltersFromUrl("?")).toEqual({ providers: [], states: [] });
  });
  it("parses providers", () => {
    expect(parseFiltersFromUrl("?providers=Alice,Bob")).toEqual({
      providers: ["Alice", "Bob"],
      states: [],
    });
  });
  it("parses states", () => {
    expect(parseFiltersFromUrl("?states=CA,TX")).toEqual({
      providers: [],
      states: ["CA", "TX"],
    });
  });
  it("parses both", () => {
    expect(parseFiltersFromUrl("?providers=Alice&states=CA")).toEqual({
      providers: ["Alice"],
      states: ["CA"],
    });
  });
});

describe("buildFiltersSearch", () => {
  it("returns empty string when no filters", () => {
    expect(buildFiltersSearch([], [])).toBe("");
  });
  it("builds providers param", () => {
    expect(buildFiltersSearch(["Alice", "Bob"], [])).toContain("providers=");
    expect(buildFiltersSearch(["Alice", "Bob"], [])).toMatch(/Alice.*Bob/);
  });
  it("builds states param", () => {
    expect(buildFiltersSearch([], ["CA", "TX"])).toContain("states=");
    expect(buildFiltersSearch([], ["CA", "TX"])).toMatch(/CA.*TX/);
  });
  it("builds both", () => {
    const s = buildFiltersSearch(["Alice"], ["CA"]);
    expect(s).toContain("providers=Alice");
    expect(s).toContain("states=CA");
  });
});

describe("decodeTopo", () => {
  it("returns FeatureCollection with features for minimal topology", () => {
    // arcs are delta-encoded: [dx,dy] per point
    const topology = {
      arcs: [[[1, 0], [0, 1], [-1, 0], [0, -1]]],
      transform: { scale: [1, 1], translate: [0, 0] },
      objects: {
        states: {
          geometries: [
            {
              type: "Polygon",
              arcs: [[0]],
              id: "01",
              properties: { name: "Test" },
            },
          ],
        },
      },
    };
    const result = decodeTopo(topology, topology.objects.states);
    expect(result.type).toBe("FeatureCollection");
    expect(Array.isArray(result.features)).toBe(true);
    expect(result.features.length).toBe(1);
    expect(result.features[0].type).toBe("Feature");
    expect(result.features[0].id).toBe("01");
    expect(result.features[0].geometry.type).toBe("Polygon");
    expect(Array.isArray(result.features[0].geometry.coordinates)).toBe(true);
  });
});
