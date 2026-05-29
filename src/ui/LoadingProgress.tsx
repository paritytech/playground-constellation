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

import type { LoadProgress } from "../chain/source.ts";

export function LoadingProgress({ progress }: { progress: LoadProgress | null }) {
  if (!progress) return null;
  const pct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;
  return (
    <div className="loading">
      <div className="loading-label">{progress.label}…</div>
      <div className="loading-bar">
        <div className="loading-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="loading-count">
        {progress.done} / {progress.total}
      </div>
    </div>
  );
}