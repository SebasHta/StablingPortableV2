# AOR Fleet Status Panel

A single self-contained HTML panel (`index.html`) that renders an
annunciator-style status grid for the fleet — one tile per train unit (TU),
colored by status, with a legend, hover tooltips, click-to-acknowledge, and
an active-alerts ticker. Styled to match the reference mockup and the
existing Atenea Mon dashboard's dark control-room theme, with the Auckland
One Rail logo and brand typography in the header.

## Branding: font and logo

The header uses the **Auckland One Rail** logo (embedded directly in
`index.html` as a base64 `data:` image, so the file stays a single
self-contained document — no separate image file to keep alongside it) and
loads **Poppins** (weights 400–800) from Google Fonts as the panel's
typeface, applied site-wide via the `font-family` on `body`.

Poppins was chosen as the closest widely-available match to the geometric,
bold, rounded style of the "Auckland One Rail" wordmark that was supplied as
the font reference — the exact proprietary brand font couldn't be identified
with certainty from the image alone, so if AOR has the actual font file
(commonly something like a licensed geometric sans), swapping the Google
Fonts `<link>` and the `font-family` value in `index.html`'s `:root`/`body`
rule for the real one is a two-line change.

Because this loads from `fonts.googleapis.com`, it needs normal internet
access to render in the chosen font — which any regular browser has. If the
panel is ever opened somewhere with no internet at all, it falls back
gracefully to the system font stack already in place (`-apple-system,
"Segoe UI", Roboto, …`), same as before; nothing breaks, it just renders in
the fallback font until connectivity is available. The one exception is the
**published Artifact preview link** (if one exists for this panel) — Google
Fonts is allowed there even though other external network calls (like
Back4App) aren't, so the font renders correctly there too.

## Tile look: 3D depth and flashing alarm lights

Tiles are styled with a beveled, raised look — a diagonal light-to-dark
gradient per status color plus layered shadows (outer drop shadow, inset
highlight along the top, inset shadow along the bottom) — rather than a flat
fill, so the grid reads more like physical annunciator lights than a plain
color swatch. Hovering/focusing a tile lifts it slightly with a brighter,
deeper shadow; clicking presses it down with a flatter, darker one — a small
tactile cue that the tile is actually a button.

**Flashing:** any tile currently showing **In failure** (red), **Review
required** (amber), or **Maintenance Alert** (blue) blinks — failure fastest
(≈0.9s cycle), then review (≈1.6s), then maintenance slowest (≈2.2s),
matching the usual "more urgent blinks faster" annunciator convention. This
needed no new state to track: a unit only ever carries one of these three
status classes while it has at least one alarm nobody has acknowledged yet
(see `pickWorstActiveAlarm()`) — the existing status class *is* the "needs
attention" signal. The flash stops the instant every alarm on that unit is
acknowledged (or a manual override is set, or the live fault clears) — no
separate "new vs. seen" logic to keep in sync with acknowledge/
un-acknowledge. Healthy and Out of service tiles never flash.

The flashing is a `::after` glow ring layered on top of the tile, separate
from the tile's own box-shadow — so it doesn't fight with the 3D depth
shadow or the hover/focus ring, and can be turned off (`.tile.failure::after,
.tile.review::after, .tile.maintenance::after { animation: none; }`) without
touching the 3D styling at all if that's ever wanted. It also respects
`prefers-reduced-motion: reduce` — a steady (non-blinking) glow shows
instead for anyone with that OS/browser setting on, rather than removing
the visual cue entirely.

## Tiles / List views

Two tabs, just below the header, over the exact same live data:

- **▦ Tiles** — the annunciator grid described above (unchanged).
- **☰ List** — every alarm on every unit, acknowledged and not, as a flat
  table: TU, severity, alarm code, message, **timestamp** (that alarm's own
  `AteneaTimestamp` from Back4App — see "Field names" above — shown in the
  browser's locale date/time format, or `—` if that record doesn't have
  one), and an Acknowledged Yes/No badge. One row per *alarm*, not per unit
  — a unit carrying two alarms at once (see "Multiple alarms on one unit"
  above) gets two rows. Sorted worst-severity first (failure, then review,
  then maintenance), and within the same severity, not-yet-acknowledged
  rows before acknowledged ones. Three filter buttons (**All** / **Not
  acknowledged** / **Acknowledged**) narrow the table without changing
  what's counted in the summary line above it. Clicking (or Enter/Space on)
  any row opens that unit's usual detail modal — the same
  Acknowledge/Un-acknowledge button available from a tile is right there. A
  **💾 Export CSV** button next to the filters downloads exactly what's
  currently shown in the table — respecting whichever filter is active and
  the same worst-first sort order — as
  `aor_fleet_alarm_list_<filter>_<timestamp>.csv` (columns: TU, unit
  status, that alarm's own severity, alarm code, message,
  **AteneaTimestamp** — the raw ISO value, not the locale-formatted display
  — acknowledged, Back4App object ID, exported at). It's disabled when the
  current filter has nothing to export (e.g. **Acknowledged** with nothing
  acknowledged yet). This is a live export of what's on screen, separate
  from the Reset Alarms button's own CSV (see "Daily reset" below), which
  always exports every alarm regardless of the List tab's filter.

Both tabs render from `lastUnitsByTu` on every poll — switching tabs never
re-fetches anything, and the List table is never a stale snapshot of
whenever it was last viewed. Which tab is open is remembered per browser
(`localStorage`, key `aor_fleet_active_tab_v1`) so a reload doesn't bounce
back to Tiles if someone was working from List.

## Folder structure

```
fleet-status-panel/
├── index.html        the panel itself (all CSS/JS inline, no build step)
├── data/
│   └── units.js       current fleet roster + status, loaded by index.html
└── README.md          this file
```

The 95 units in `data/units.js` come from `TU_LIST.xlsx`. **The status,
alert code, and alert message on each unit are placeholder/demo data** —
`TU_LIST.xlsx` only had the roster, not live status, so this was generated
to preview the panel with the real TU codes. That's flagged both in the
file (`_meta.source`) and in the panel itself (the "DEMO DATA" badge).

## Local preview vs. live data

`data/units.js` is plain JSON assigned to a variable —
`window.__FLEET_DATA__ = { ... };` — loaded via an ordinary
`<script src="./data/units.js">` tag, not `fetch()`. That's deliberate:
browsers block `fetch()`/XHR against local files opened directly
(`file://…/index.html`), which is what breaks a lot of "just open the
HTML file" tools, but a `<script src>` pointed at a file in the same
folder loads fine either way. **That means you can just double-click
`index.html` and it works — no local server needed.**

`index.html` checks for `window.__FLEET_DATA__` first and renders it
immediately if present; it only falls back to `fetch(DATA_URL)` (see the
`DATA_SOURCE` comment in the `<script>` tag) if `data/units.js` isn't
there. So going live later is: delete or rename `data/units.js`, point
`DATA_URL` at the real API, and the fallback path takes over — nothing
else in `index.html` changes.

## Adding units later

Add an entry to the `units` array in `data/units.js`:

```json
{ "tu": "AM1260", "status": "healthy" }
```

`status` is one of `healthy | review | out_of_service | failure`. Add
`alert_code` / `alert_message` for any unit in `review` or `failure` — those
two statuses are what populate the alert ticker. Nothing in `index.html`
needs to change; the legend counts, grid, and ticker all recompute from
whatever is in the file. This is also the exact shape the future
PostgreSQL-backed feed needs to produce — see the data contract below.

## Data contract

Whatever eventually serves this panel — a static file or a live API —
needs to return this shape:

```json
{
  "units": [
    { "tu": "AM103", "status": "healthy" },
    { "tu": "AM836", "status": "failure",
      "alert_code": "Brake system failure",
      "alert_message": "Emergency brake applied — remove from service" }
  ]
}
```

`status` is one of `healthy | review | maintenance | out_of_service |
failure` — `maintenance` is the blue **Maintenance Alert** tile (see "Tile
look" and "Connecting to Back4App" below); `alert_code`/`alert_message` are
only meaningful when `status` is `review`, `maintenance`, or `failure`.

## Connecting to Back4App (live status) — implemented

`index.html` can now pull live fault severity from the same `Live_Alarms`
Parse class that `atenea_dashboard.html` already syncs to (see that
project's v1.9 changelog entry). This is wired up, not just documented as
an option — find the `BACK4APP_CONFIG` block near the top of the second
`<script>` tag:

```js
const BACK4APP_CONFIG = {
  appId: '',   // paste your Back4App Application ID here
  jsKey: ''    // paste your Back4App JavaScript Key here
};
```

Same pattern as `atenea_dashboard.html`: paste your own Application ID and
JavaScript Key in directly (open the file in a text editor — nothing needs
installing). Leave either blank and this is fully disabled, exactly as
before — no network calls, no errors, the panel just renders `data/units.js`
like it always has.

**Severity mapping:** `L1` → red (In failure). `MA` → blue (**Maintenance
Alert** — informational, the lowest urgency of the three; a heads-up like
"inspection due" or "update pending," not a fault in progress). Any other
non-empty severity (`L2`, `L3`, …) or an alarm record with a severity field
that's missing/unreadable → amber (Review required). A TU with no matching
`Live_Alarms` record at all → green (Healthy). A unit that's **Out of
Service** — a live `TU_Status` record with `STOP=true`, or (only when
Back4App isn't configured) pinned in `data/units.js` or set as a local
override — always renders gray, regardless of what any alarm for it says:
that check happens before any live alarm is even looked at (see
"Connecting to TU_Status" below), so severity and Out of Service can never
fight over a tile's color.

**Multiple alarms on one unit:** a unit can have more than one active
`Live_Alarms` record at the same time (e.g. an `L1` and an `MA` together).
The tile's own color always reflects the single worst *unacknowledged* one
— failure beats review beats maintenance (`pickWorstActiveAlarm()`) — but
every alarm for that unit is kept, not just the worst, and shown as a list
when you **hover the tile** (or open its detail modal, if there's more than
one). That's the only place multiple alarms on one unit are visible; the
tile itself can only ever show one color at a time. If a unit has enough
active alarms that the list runs taller than the screen, the detail modal
scrolls internally (rather than growing past the edge of the browser
window) so the **Acknowledge**/**Un-acknowledge** button at the bottom
always stays reachable.

**Suppressed alarms (`flag`):** a `Live_Alarms` record whose `flag` field is
`"off"` (also accepts boolean `false` or `0`) is fetched but never shown —
it's treated exactly as if that alarm didn't exist, same as a TU with no
matching record at all. A record with no `flag` field at all is still shown
(only an *explicit* "off" hides it), so this is safe to leave out of older
records. This is checked in `index.html`'s `isFlagOff()`, matched against
`LIVE_ALARMS_FIELDS.flag`.

**Field names — confirmed against the real `Live_Alarms` schema** (exported
from Back4App, 2026-08-25):

```js
const LIVE_ALARMS_FIELDS = {
  tu:                ['tu'],
  severity:          ['severity'],
  code:              ['description', 'alarmId'],
  message:           ['message', 'description'],
  flag:              ['flag'],
  acknowledged:      ['acknowledged'],
  atenea_timestamp:  ['AteneaTimestamp', 'ateneaTimestamp']
};
```

`tu` and `severity` map straight to the real fields of the same name. The
schema also has both `description` and `message` as separate free-text
fields (plus `alarmId`), with no sample data available to confirm which
one reads better where — `code` (the short label next to the TU in the
ticker, e.g. `AM103 — …`) defaults to `description`, and `message` (the
longer tooltip detail) defaults to the `message` field, each falling back
to the other/to `alarmId` if blank. **If it reads backwards once real data
flows** — the ticker shows a raw ID instead of readable text, or the
tooltip just repeats the ticker label — swap the order in the two arrays
above; nothing else needs to change.

**`AteneaTimestamp`** — a Date field, read straight from the record and
shown alongside each alarm (List tab, tooltips aren't affected, but every
CSV export that includes alarm rows carries it — see "Tiles / List views"
and "Daily reset" below). Back4App's raw REST API
returns a Date field as `{ "__type": "Date", "iso": "…" }` rather than a
plain string on a straight GET — `normalizeAteneaTimestamp()` in
`index.html` reads either shape and stores a plain ISO string internally,
so CSVs always get a clean sortable value and on-screen displays
(`formatAteneaTimestamp()`) get the browser's locale date/time format. A
record with no readable `AteneaTimestamp` just shows `—` on screen and an
empty cell in CSVs — it's never required for an alarm to display.

The schema also has `actionRequired` (Boolean, already computed upstream —
see `atenea_dashboard.html`'s own "action required" keyword-matching logic
in its README), `location`, and `group`/`alarmGroup`, none of which this
panel uses since the ask was severity-only (red/amber/blue) — they're
there if this needs to grow later (e.g. showing which car a fault is on,
matching `atenea_dashboard.html`'s "Location" column).

Each entry in `LIVE_ALARMS_FIELDS` is still a list, not a single string —
that's a safety net in case a field ever gets renamed on Back4App, not
guesswork: if nothing in a fetched record matches any candidate for `tu`,
an amber warning banner appears above the grid and the raw record is
logged to the browser console (F12 → Console) instead of silently
rendering everyone as healthy.

**Refresh:** once configured, the panel re-polls `Live_Alarms` every 30
seconds on its own (`LIVE_REFRESH_MS` in `index.html`), matching
`atenea_dashboard.html`'s own interval. There's also an initial fetch as
soon as the page loads, so it's never waiting a full 30 seconds just to show
the first result.

**Troubleshooting "I have data in Back4App that isn't showing on the
panel":** the tile itself tells you which case this is. If the unit's tile
is **completely missing from the grid**, or is **present but plain green
(Healthy) with no ✓ badge**, it's one of the first four cases below. If the
tile is **green with a small ✓ badge in its corner**, that's the fifth case
— acknowledged, not dropped. Every case is now logged to the browser
console (F12 → Console) so it's diagnosable rather than a mystery:

- **The record's TU isn't in the current roster** (`data/units.js`) — the
  most common cause of a tile being missing outright, or showing plain
  Healthy with no fault. Only the 95 TUs in the roster get tiles at all, so
  an alarm for a TU that's misspelled, differently-cased, has stray
  whitespace, or is genuinely a unit not yet added to `data/units.js`
  simply has nowhere to render. This one also shows an amber banner above
  the grid listing exactly which TU(s) — check that against
  `data/units.js` character-for-character, or add the unit there if it's
  new.
- **`flag` is off** on the record — suppressed on purpose (see "Suppressed
  alarms" above). Logged as a plain count, not a warning, since this is
  usually intentional. Double-check the actual value in Back4App if you
  expected this one to show — `"on"`/`"off"` (any case), or boolean/`0`,
  are all read correctly; anything else reads as on.
- **No readable `tu` field at all** on the record (tried:
  `LIVE_ALARMS_FIELDS.tu`) — logged as a warning with the count.
- **`acknowledged` is already `true` on that specific record** — a real
  fault that matched fine and has `flag` on, but renders plain Healthy
  anyway because it's marked acknowledged (see "Acknowledging faults"
  below — that flag lives directly on the Live_Alarms record now). This is
  the one case where the tile still shows a small ✓ badge in its corner, so
  it's visually distinct from "genuinely no fault." Logged by TU whenever
  it happens: `"N unit(s) have an active Live_Alarms fault but show
  Healthy because acknowledged=true..."`. Click the tile to see the real
  status underneath and an **Un-acknowledge** button, or check why that
  record already has `acknowledged: true` in Back4App if nobody
  acknowledged it from this panel.

If a record isn't showing and none of the log lines above appear for it
either, it's worth double-checking the polling is actually reaching that
record: confirm `BACK4APP_CONFIG` has both `appId` and `jsKey` filled in
(blank means fully disabled, silently rendering roster/demo data only —
no error either), and that the JavaScript Key's `find` permission on
`Live_Alarms` covers it (a permissions-scoped query would simply return
fewer records, not an error).

**Permissions:** reading needs `find` allowed for the JavaScript Key in
`Live_Alarms`'s Class-Level Permissions on Back4App (the same permission
`atenea_dashboard.html` already needs to *write* there, so if that
dashboard's sync is working, reads should already be allowed too).
Acknowledging a fault also needs `update` allowed on `Live_Alarms` — see
"Acknowledging faults" below for why. **Reset Alarms** needs `delete`
allowed on `Live_Alarms` too, since it removes each alarm's record outright
rather than just updating it — see "Daily reset" below.

**Note for the hosted preview link:** the published Artifact version of
this panel can't reach `parseapi.back4app.com` — published Artifacts run
in a sandbox that blocks requests to external hosts. Live Back4App data
only works in this local `index.html`, opened directly or embedded in the
real dashboard. That same sandbox also blocks file downloads, so **Reset
Alarms**, the List tab's **Export CSV**, and saving/clearing **Out of
service** from the **Set unit status** modal (which writes to `TU_Status`
— see below) are all inert on the hosted preview link — all work normally
in this local `index.html`.

## Connecting to TU_Status (Out of Service)

Out of Service is backed by its own Parse class, separate from
`Live_Alarms`: **`TU_Status`**, one row per unit that's ever been touched —

| Field    | Type    | Meaning                                              |
|----------|---------|-------------------------------------------------------|
| `TU`     | String  | Unit code, e.g. `AM103`                               |
| `STOP`   | Boolean | `true` = pulled from service, shown Out of Service    |
| `REASON` | String  | Free text — why it's out of service                   |

A TU with `STOP=true` renders Out of Service everywhere in the panel —
gray tile, in the KPI counts, the List tab, CSV exports, and skipped by
**Reset Alarms** — with `REASON` shown as its description. This is the
same `BACK4APP_CONFIG` (Application ID / JavaScript Key) as `Live_Alarms`
above; leave it blank and this is disabled the same way, with the panel
falling back to a unit pinned `out_of_service` in `data/units.js` or a
local override, exactly like before this feature existed.

**Precedence** (see `applyManualOverride()` in `index.html`): a live
`TU_Status` record with `STOP=true` wins outright over everything else for
that TU — a roster `out_of_service` pin, a local override, even a live
`Live_Alarms` fault. It's the single source of truth for Out of Service
once Back4App is configured. Underneath it, in order: a local **Review
required** override (always local — `TU_Status` has no concept of
"review," only stop/not-stop), then a roster-level `out_of_service` pin in
`data/units.js`, then whatever `Live_Alarms` says. A local **Out of
service** override in `localStorage` is only ever consulted as a fallback
when Back4App isn't configured at all (demo mode) — see "Manual status
overrides" below.

**Setting/clearing from the panel:** the **Set unit status** modal
(and a tile's own **Set manually**/**Clear out-of-service status** button)
writes straight to `TU_Status` for "Out of service" whenever Back4App is
configured — creating a new record (`POST`) the first time a TU is marked
out of service, or updating its existing one (`PUT`) after that. Clearing
sets `STOP` back to `false` on the existing record rather than deleting
it, so `REASON` stays as history — the same pattern "Un-acknowledge" uses
on `Live_Alarms`.

**Permissions:** the JavaScript Key needs `find`, `create`, and `update`
allowed for `TU_Status` in its Class-Level Permissions — `find` for every
device to see the same Out of Service list, `create`/`update` for the
Set unit status modal to actually save a change.

**Field names** are matched the same tolerant way as `Live_Alarms` (see
`TU_STATUS_FIELDS` in `index.html`, tried `TU`/`tu`, `STOP`/`stop`,
`REASON`/`reason`) — if a fetched record doesn't have a readable `TU`
field under any of those names, it's skipped and logged to the browser
console rather than breaking the rest of the panel.

## Acknowledging faults

Click (or tab to + press Enter/Space on) any tile to open its detail — TU,
true status, and the fault's `alert_code`/`alert_message` if it has one —
with an **Acknowledge fault** button. Acknowledging a `review` or `failure`
unit makes its tile render as Healthy (green, no amber/red) and drops it
out of the alert ticker, but a small checkmark badge stays on the corner of
the tile so it's visibly different from a unit with no fault at all — the
underlying severity isn't lost, just not shown as red/amber. Opening that
same tile again shows the real status (e.g. "IN FAILURE") plus an
"✓ Acknowledged" note and an **Un-acknowledge** button to undo it.

**Where this is stored.** Acknowledging a fault writes directly onto the
SAME `Live_Alarms` record the alarm came from — a plain Back4App `PUT` to
`Live_Alarms/<objectId>` setting its `acknowledged` field to `true` (and
back to `false` to un-acknowledge). Nothing is written to any other class —
`Live_Alarms` is the single source of truth for both the fault and its
acknowledged state. On every 30-second poll, the panel just reads
`acknowledged` straight off each fetched record (see `LIVE_ALARMS_FIELDS`
above) — there's no separate lookup, matching key, or cleanup step to keep
in sync, since the flag lives on the same row it describes.

This does mean the panel is relying on `Live_Alarms` records being updated
in place rather than deleted and recreated wholesale — if whatever populates
that class ever switches to a "replace the whole table" sync instead, an
`acknowledged: true` written by this panel could get silently overwritten
back to blank/false on the next sync. Worth a quick check with however
`Live_Alarms` gets populated if acknowledgments start looking like they're
not sticking.

**One-time setup on Back4App:** the JavaScript Key needs `update` allowed
on `Live_Alarms` in its Class-Level Permissions, in addition to the `find`
it already needs for reading (see "Permissions" above). If a save fails —
wrong permissions, or the `acknowledged` column doesn't exist yet and
Back4App's schema is set to reject new fields on write — the panel shows
the exact Back4App error right in the modal, with a pointer to check that
permission, rather than failing silently.

**Without Back4App configured** (`BACK4APP_CONFIG` left blank), the
Acknowledge button still works so the feature can be tried out against the
demo roster, but it's session-only — held in memory, labeled "(demo — not
saved)" in the modal, and gone on reload. Nothing is written anywhere.

## Manual status overrides (Review required — local; Out of service — Back4App)

The **Set unit status** button in the header opens a modal to manually pin
any unit to **Review required** or **Out of service**, with a short free-text
description (e.g. "Bogie inspection — depot 3"). Any unit tile can also be
manually set from its own detail modal — click a tile, then **Set manually**
(or **Edit**/**Clear out-of-service status**, if it's already set).

**The two choices are stored differently, on purpose:**

- **Review required** is stored only in the browser's `localStorage` (key
  `aor_fleet_manual_overrides_v1`) — nothing is sent to Back4App. It's a
  per-workstation note, not a shared operational record: specific to one
  browser on one machine, not visible to someone viewing the panel
  elsewhere, and it survives page reloads but not clearing site data.
- **Out of service** is written straight to the `TU_Status` Parse class
  (see "Connecting to TU_Status" above) whenever Back4App is configured —
  so it's visible to every device viewing this panel, not just the one that
  set it. It only falls back to a local `localStorage` override, exactly
  like Review required, when Back4App isn't configured at all (demo mode,
  for trying the panel out without a live `TU_Status` class to point at).

**Precedence.** See "Connecting to TU_Status" above for the full chain. In
short: a live `TU_Status` `STOP=true` record wins outright once Back4App is
configured; otherwise a local override (either status) wins over a live
Back4App `L1`/`L2` alarm or the roster's own `out_of_service` pin in
`data/units.js`. The live/roster status isn't lost while overridden, just
not shown: opening the tile's detail modal while it's set shows both the
override's status/description **and** a "Live status underneath" line with
what the panel would otherwise be showing. Clearing the override reveals
whatever the live/roster status actually is at that moment — if a live
fault is still active, the tile goes back to red/amber immediately, it
doesn't reset to healthy.

**Tiles under an override** (either kind) show a small ⚑ badge in the
top-left corner (distinct from the ✓ acknowledge badge, top-right) and
their tooltip/aria label gets a "(manually set)" suffix, so they're
visually distinguishable from both a normal fault and an acknowledged one
at a glance.

The header button's modal also lists every currently-set unit in one
place — local overrides and live `TU_Status` records alike, the latter
tagged **(Back4App)** — with a **Clear** button per row, so nothing has to
be found one tile at a time to be undone.

## KPI summary (top and bottom)

The same five counts — **In failure**, **Review required**, **Maintenance
Alert**, **Out of service**, **Healthy** — appear twice: as compact badges
in the header (next to the logo) and again as a larger stat-card row
(`#kpiBottom`) below the alert ticker, so the totals are visible whether
someone's looking at the top or has scrolled to the bottom of a long grid.
Both are driven from the exact same `counts` computed once in `render()` —
there's no separate counting logic to keep in sync, so they can never
disagree with each other or with the grid.

## Daily reset

**Manual only** — the **Reset Alarms** header button, nothing
automatic. There's no midnight timer and no catch-up-on-load; this only
ever runs when someone clicks the button and then confirms the warning
dialog it opens (an earlier version of this feature ran itself once a day
automatically — that's been removed, by request, in favor of this single
explicit control).

Clicking it opens a confirm/cancel warning describing exactly what's about
to happen. **Cancel** does nothing at all. **Accept** does the following,
in order:

1. **Downloads a CSV of every alarm** currently held for every unit —
   acknowledged ones AND un-acknowledged ones, one row per alarm (not one
   row per unit — a unit with two active alarms gets two rows) — as
   `aor_fleet_daily_reset_<timestamp>.csv`. This happens first, before
   anything is changed, so it's a complete audit record of exactly what
   existed at the moment of the reset. Columns: TU, unit status, that
   alarm's own severity, alarm code, alarm message, **AteneaTimestamp**,
   whether it was already acknowledged, and its Back4App object ID. This
   CSV is now the **only** surviving record of what's deleted in step 2 —
   see below.
2. **Permanently deletes** every one of those alarms' records from
   `Live_Alarms` — a Back4App `DELETE` on each matching `Live_Alarms/
   <objectId>`, not a PUT — **except** alarms belonging to a unit that's
   currently **Out of Service**, which are left completely untouched (not
   read, not deleted). A unit manually flagged **Review required** (see
   "Manual status overrides" above) has that override cleared too, for the
   same "back to healthy" effect — **and**, separately, any real
   `Live_Alarms` record still underneath it is deleted just like any other
   unit's. Those are two independent things this button does for that
   unit, not one-or-the-other: a unit can be manually flagged *and* have a
   live fault at the same time (the manual flag doesn't replace the
   underlying alarm, it just overlays it — see "Manual status overrides"),
   so clearing the flag without also deleting the alarm underneath would
   leave that alarm sitting there with nothing left visibly pointing at it.

This is a deliberate change from how this button used to work: it no
longer just marks alarms `acknowledged: true` (a reversible flag on a
record that's still there) — it removes the record from `Live_Alarms`
entirely. The single-alarm **Acknowledge fault** / **Un-acknowledge**
button (see "Acknowledging faults" above) is unchanged and still uses the
non-destructive PUT — this deletion behavior is specific to the **Reset
Alarms** button.

Out of Service is still the one standing exception, exactly as originally
specified for this feature — whatever set a unit Out of Service (a live
`TU_Status` record, a roster pin, or a local override), its alarms are
left alone by this button.

**Pacing and retries.** Writes go to Back4App one at a time, in sequence,
with a short pause between each (`DAILY_RESET_WRITE_DELAY_MS`, 150ms) —
firing dozens of DELETE requests back-to-back with no gap at all is enough
to trip Back4App's per-second burst limit on a fleet with a lot of active
alarms, and a request that gets rate-limited (or hits any other transient
error) needs a moment before it's worth trying again. Each deletion that
fails is retried once, after a 500ms backoff, before being counted as a
real failure — so a momentary blip doesn't silently leave that one alarm
undeleted. Because of the pacing, a large fleet with many active alarms can
take several seconds to a low number of tens of seconds to fully run; the
button stays disabled-against-double-click for the whole run (a second
click while one is still in flight is ignored, not queued), and there's no
need to wait and watch it — the confirmation dialog already warns that the
run is not reversible, and the CSV downloads immediately so the "before"
state is captured regardless of how the deletes that follow it go.

**If something still couldn't be deleted** even after its retry, an alert
names which unit(s) and alarm(s) failed once the run finishes — this used
to fail silently (visible only as a `console.warn` in the browser console),
which is exactly the kind of failure that's easy to miss until someone
notices a fault that should have been cleared still showing up the next
day. In this case the alarm's record is still safely sitting in
`Live_Alarms` — nothing is lost when a delete fails, only when it
succeeds — and running Reset Alarms again is always safe: it just tries to
delete those same still-present alarms again. The most likely cause of a
persistent (non-transient) failure here is the JavaScript Key missing
`delete` Class-Level Permission on `Live_Alarms` — see "One-time setup on
Back4App" below.

**One-time setup on Back4App:** in addition to `find` (for reading, see
"Permissions" above) and `update` (still needed for the single-alarm
**Acknowledge fault** button), the JavaScript Key now also needs `delete`
allowed on `Live_Alarms` in its Class-Level Permissions for **Reset
Alarms** to be able to remove records. Without it, every Reset Alarms run
will download its CSV successfully but then fail every deletion with a
permissions error, surfaced in the failure alert described above.

## Connecting to PostgreSQL

Back4App (above) is what's actually wired up for live status today. The
options below are still here in case fault data moves to Postgres later
instead — same underlying question, different source.

As shipped, `index.html` renders whatever's in `data/units.js`
(`window.__FLEET_DATA__`, see "Local preview vs. live data" above), and
only calls `fetch(DATA_URL)` as a fallback when that file is absent (see
the `DATA_SOURCE` comment block at the top of the `<script>` tag). Going
live with any option below means: delete/rename `data/units.js`, and set
`DATA_URL` in `index.html` to point at that option's endpoint. A browser
can never query Postgres directly — there always has to be something
between the panel and the database. The options, roughly cheapest-to-set-up
first:

**1. Scheduled export to a static JSON file.** A cron job / scheduled
script runs a query against Postgres on an interval, shapes the result into
the JSON above, and writes it wherever the dashboard serves static files
from — `DATA_URL` just points at that file's URL. This is the same "no
server, just files" pattern the sibling Atenea Mon dashboard already uses
for its alarm log, and the same trick `data/units.js` already uses for
local preview, just served over http instead of loaded from disk. Simplest
to build and operate, no live DB connection ever exposed to the browser,
but freshness is bounded by the export interval (e.g. every 1–5 minutes)
rather than truly live.

**2. PostgREST in front of the database.** Point PostgREST at a view (e.g.
`fleet_status_view`) shaped to match the contract above, and it auto-generates
a REST endpoint with no backend code to write. Point `DATA_URL` at that
endpoint. Near-zero code, but you're managing a DB role and PostgREST's own
auth/exposure rules to make sure only that view is reachable.

**3. A small custom API service** (FastAPI/Flask, Express, Go, etc.) that
queries Postgres and returns JSON at something like `GET /api/fleet-status`.
Most control over the query, auth, and response shaping; most common fit if
there's already a backend/API layer for this dashboard. Requires writing
and running that service.

**4. Hasura / PostGraphile (GraphQL layer).** Similar to PostgREST but
GraphQL, and both support live subscriptions so the panel could receive
pushed updates instead of polling. More moving parts to stand up than
PostgREST; worth it mainly if other panels in the same dashboard also want
GraphQL or subscriptions.

**5. Real-time push via `LISTEN`/`NOTIFY`.** Pair with option 3 or 4: a
database trigger on the fleet-status table fires `NOTIFY`, a small
WebSocket/SSE service relays it to connected panels instantly. Gives
instant updates instead of polling, at the cost of the most infrastructure
of any option here (a persistent-connection service to run and keep
healthy).

**6. If "dashboard panel" means an existing BI tool** (Grafana, Metabase,
Superset, etc.) rather than embedding this HTML file as-is: those tools can
add Postgres as a native data source directly, and either this panel gets
rebuilt as a native panel type there, or `index.html` gets embedded via an
iframe/HTML panel and still needs one of options 1–5 behind it to get data
in. Worth knowing before picking one of the above, since it changes where
the "API layer" question even applies.

**Recommendation, given this panel started as a static local-file app:**
start with **option 1** (scheduled export) to get it live with the least
new infrastructure — it's a one-line `DATA_URL` change in `index.html` once
`data/units.js` is removed. Move to **option 2 (PostgREST)** if near-real-
time turns out to matter and a lightweight API is acceptable; reach for
option 4/5 only if the dashboard already needs subscriptions elsewhere.

## Embedding in a dashboard

`index.html` is a single file with everything inlined except its network
calls — it can be dropped into an `<iframe>` in another dashboard as-is.
Two things to check once it's embedded:
- **CORS**: Back4App's Parse REST API sends the necessary CORS headers for
  browser calls, same as `atenea_dashboard.html` already relies on. If
  fault data moves to Postgres later (options 2–5 above) and that API lives
  on a different origin than wherever `index.html` is served from, that API
  needs to send `Access-Control-Allow-Origin` for the panel's origin too,
  or the `fetch()` will be blocked by the browser.
- **Refresh**: once `BACK4APP_CONFIG` is filled in, the panel already
  re-polls every 30s on its own (`LIVE_REFRESH_MS`) — nothing else to add.
  If fault data moves to Postgres later instead and `DATA_URL` is what's
  driving the panel, add the same `setInterval(loadFleet, LIVE_REFRESH_MS)`
  to that path too.
