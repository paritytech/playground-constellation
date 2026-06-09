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

import { getChainHandle, type ChainMode } from "./client.ts";
import { subscribeLive } from "./live.ts";
import { loadSnapshot } from "./reads.ts";
import type { ConstellationSource } from "./source.ts";

/**
 * Real chain source. `mode: "host"` routes through Polkadot Desktop (production);
 * `mode: "direct"` connects straight to the RPC (dev-only, for viewing real
 * data in a plain browser).
 */
export function createChainSource(mode: ChainMode): ConstellationSource {
  return {
    loadSnapshot: (onProgress) => loadSnapshot(mode, onProgress),
    subscribe: (handlers) => subscribeLive(mode, handlers),
    // Reuses the memoized chain handle (same one loadSnapshot/subscribe use),
    // so this adds no extra connection — it just surfaces the live-resolved
    // registry address for cache scoping.
    getRegistryAddress: async () => (await getChainHandle(mode)).registryAddress,
  };
}