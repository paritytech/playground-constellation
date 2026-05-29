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

import { beforeEach, describe, expect, it } from "vitest";
import { applySnapshot, createGraph, type GraphSnapshot } from "../model/graph.ts";
import { loadGraph, saveGraph } from "./cache.ts";

const ALICE = "0x" + "a1".repeat(20);

function seeded() {
  const g = createGraph();
  const snap: GraphSnapshot = {
    apps: [{ domain: "ballot.dot", owner: ALICE, stars: 3, mods: 1, pinned: true }],
    builders: [{ address: ALICE, xp: 42, username: "alice" }],
    lineage: [],
    usernames: { [ALICE.toLowerCase()]: "alice" },
  };
  applySnapshot(g, snap);
  return g;
}

describe("graph cache", () => {
  beforeEach(() => localStorage.clear());

  it("returns null when nothing is cached", () => {
    expect(loadGraph()).toBeNull();
  });

  it("round-trips nodes and edges through localStorage", () => {
    saveGraph(seeded());
    const restored = loadGraph();
    expect(restored).not.toBeNull();
    expect(restored!.nodes.get("ballot.dot")?.pinned).toBe(true);
    expect(restored!.nodes.get("ballot.dot")?.stars).toBe(3);
    expect(restored!.nodes.get(ALICE.toLowerCase())?.label).toBe("alice");
    expect(restored!.edges.get(`ownership:${ALICE.toLowerCase()}->ballot.dot`)).toBeDefined();
  });

  it("survives corrupt JSON without throwing", () => {
    localStorage.setItem("constellation.graph.v1", "{not json");
    expect(loadGraph()).toBeNull();
  });
});