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

export type { FeedEntry };

export function EventFeed({ entries }: { entries: FeedEntry[] }) {
  return (
    <div className="feed">
      <div className="feed-head">Live event feed</div>
      <div className="feed-rows">
        {entries.map((e) => (
          <div className="feed-row" key={e.id}>
            <span className="feed-ts">{e.time}</span>{" "}
            <span className="feed-tag">[{e.line.tag}]</span>
            <div className="feed-body">
              <span className="feed-actor">{e.line.actorLabel}</span>{" "}
              <span className="feed-sym">{e.line.symbol}</span>{" "}
              <span className="feed-target">{e.line.targetLabel}</span>
              {e.line.xp != null && <span className="feed-xp"> +{e.line.xp}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}