// Copyright (C) Parity Technologies (UK) Ltd.
// SPDX-License-Identifier: Apache-2.0

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import type { FeedEntry } from "../model/format.ts";
import type { Graph, GraphEdge, GraphNode } from "../model/graph.ts";
import { createGraph } from "../model/graph.ts";

const GRAPH_PREFIX = "constellation.graph.";
const FEED_PREFIX = "constellation.feed.";
const keyFor = (scope: string) => `${GRAPH_PREFIX}${scope}`;
const feedKeyFor = (scope: string) => `${FEED_PREFIX}${scope}`;
const LEGACY_KEY = "constellation.graph.v1";

/**
 * Drop every cached graph/feed whose scope isn't `keepScope`. The cache is now
 * scoped by the live registry address (`live:<addr>`), so a registry redeploy
 * orphans the previous deployment's entries — and the old unscoped `live` key
 * from before this scoping existed. Called once on load (live mode only) to
 * keep localStorage from accumulating dead snapshots across contract changes.
 */
export function dropStaleScopes(keepScope: string): void {
  try {
    const keep = new Set([keyFor(keepScope), feedKeyFor(keepScope)]);
    const doomed: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if ((key.startsWith(GRAPH_PREFIX) || key.startsWith(FEED_PREFIX)) && !keep.has(key)) {
        doomed.push(key);
      }
    }
    for (const key of doomed) localStorage.removeItem(key);
  } catch {
    // best-effort
  }
}

interface CachePayload {
  nodes: GraphNode[];
  edges: GraphEdge[];
  savedAt: number;
}

export function saveGraph(graph: Graph, scope = "default"): void {
  try {
    const payload: CachePayload = {
      nodes: [...graph.nodes.values()],
      edges: [...graph.edges.values()],
      savedAt: Date.now(),
    };
    localStorage.setItem(keyFor(scope), JSON.stringify(payload));
  } catch {
    // Storage full / unavailable — caching is best-effort.
  }
}

export function saveFeed(entries: FeedEntry[], scope = "default"): void {
  try {
    localStorage.setItem(feedKeyFor(scope), JSON.stringify(entries));
  } catch {
    // best-effort
  }
}

export function loadFeed(scope = "default"): FeedEntry[] | null {
  try {
    const raw = localStorage.getItem(feedKeyFor(scope));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FeedEntry[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function loadGraph(scope = "default"): Graph | null {
  try {
    // One-time cleanup of the pre-scoped key (could hold stale mock data).
    localStorage.removeItem(LEGACY_KEY);
    const raw = localStorage.getItem(keyFor(scope));
    if (!raw) return null;
    const payload = JSON.parse(raw) as CachePayload;
    if (!payload?.nodes || !payload?.edges) return null;
    const graph = createGraph();
    for (const n of payload.nodes) graph.nodes.set(n.id, n);
    for (const e of payload.edges) graph.edges.set(e.id, e);
    return graph;
  } catch {
    return null;
  }
}