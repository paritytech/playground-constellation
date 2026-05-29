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

export interface Totals {
  apps: number;
  stars: number;
  xp: number;
}

export function TopStrip({ totals, live }: { totals: Totals; live: boolean }) {
  return (
    <div className="top-strip">
      <span className="top-title">Web3 Summit · Playground · Berlin '26</span>
      <span className="top-stats">
        <span>{totals.apps} apps</span>
        <span>{totals.stars} stars</span>
        <span className={live ? "live on" : "live"}>{live ? "LIVE" : "CONNECTING"}</span>
      </span>
    </div>
  );
}