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

import type { LogicalEvent } from "../chain/types.ts";

export type Effect =
  | { type: "birth"; nodeId: string; start: number }
  | { type: "pulse"; nodeId: string; start: number }
  | { type: "lineage"; from: string; to: string; start: number }
  | { type: "star"; from: string; to: string; start: number };

export const EFFECT_DURATION: Record<Effect["type"], number> = {
  birth: 1400,
  pulse: 1200,
  lineage: 1800,
  star: 1100,
};

/** Translate a logical event into the transient animations it should trigger. */
export function effectsForEvent(e: LogicalEvent, now: number): Effect[] {
  switch (e.kind) {
    case "deploy":
      return [
        { type: "birth", nodeId: e.app, start: now },
        { type: "pulse", nodeId: e.app, start: now },
      ];
    case "mod": {
      const fx: Effect[] = [
        { type: "birth", nodeId: e.app, start: now },
        { type: "pulse", nodeId: e.app, start: now },
      ];
      if (e.source) fx.push({ type: "lineage", from: e.source, to: e.app, start: now });
      return fx;
    }
    case "star":
      return e.actor
        ? [{ type: "star", from: e.actor.toLowerCase(), to: e.app, start: now }, { type: "pulse", nodeId: e.app, start: now }]
        : [{ type: "pulse", nodeId: e.app, start: now }];
    default:
      return [{ type: "pulse", nodeId: e.app, start: now }];
  }
}

/** Drop effects whose animation window has elapsed. */
export function pruneEffects(effects: Effect[], now: number): Effect[] {
  return effects.filter((fx) => now - fx.start < EFFECT_DURATION[fx.type]);
}