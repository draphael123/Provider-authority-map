/**
 * Utilities for Provider Authority Map (exported for tests).
 */

export function decodeTopo(topology, object) {
  const { arcs: topoArcs, transform } = topology;
  const scale = transform ? transform.scale : [1, 1];
  const translate = transform ? transform.translate : [0, 0];
  function decodeArc(i) {
    const arc = topoArcs[i < 0 ? ~i : i];
    let x = 0, y = 0;
    const pts = arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
    });
    return i < 0 ? pts.reverse() : pts;
  }
  function ringCoords(ring) {
    return ring.flatMap((i) => decodeArc(i));
  }
  function toGeoJSON(geom) {
    if (geom.type === "Polygon")
      return { type: "Polygon", coordinates: geom.arcs.map(ringCoords) };
    if (geom.type === "MultiPolygon")
      return {
        type: "MultiPolygon",
        coordinates: geom.arcs.map((p) => p.map(ringCoords)),
      };
    return null;
  }
  return {
    type: "FeatureCollection",
    features: object.geometries.map((g) => ({
      type: "Feature",
      id: g.id,
      properties: g.properties || {},
      geometry: toGeoJSON(g),
    })),
  };
}

export function cleanName(n) {
  return String(n).replace(/\s+/g, " ").trim();
}

/**
 * Parse provider and state filters from URL search params.
 * @param {string} search - window.location.search
 * @returns {{ providers: string[], states: string[] }}
 */
export function parseFiltersFromUrl(search) {
  const params = new URLSearchParams(search);
  const providers = params.get("providers");
  const states = params.get("states");
  return {
    providers: providers ? providers.split(",").filter(Boolean) : [],
    states: states ? states.split(",").filter(Boolean) : [],
  };
}

/**
 * Build URL search string from current filters.
 * @param {string[]} providerFilter
 * @param {string[]} stateFilter
 * @returns {string}
 */
export function buildFiltersSearch(providerFilter, stateFilter) {
  const params = new URLSearchParams();
  if (providerFilter.length) params.set("providers", providerFilter.join(","));
  if (stateFilter.length) params.set("states", stateFilter.join(","));
  const s = params.toString();
  return s ? `?${s}` : "";
}
