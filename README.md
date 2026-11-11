<div align="center">

# Scanline

**A modern terminal emulator, drawn line by line.**

*AI-native · native on every platform · free & open source*

Pronounced `SCAN-line` — like the CRT. · Home: `scanline.sh` *(planned)*

![Status: Pre-development](https://img.shields.io/badge/status-pre--development-orange)
![License: MIT](https://img.shields.io/badge/license-MIT-blue)

▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂

</div>

## The name

Long before windows — before pixels, even — a terminal's text was *traced*: an electron beam sweeping the inside of a cathode-ray tube, painting every character one horizontal line at a time. Those lines were called **scanlines**, and for decades they were simply what a terminal looked like.

Scanline is named after that origin. The name is a small thesis: the terminal is computing's longest-lived interface, and it deserves a first-class modern implementation — GPU-rendered, spec-correct, AI-native — without forgetting where its visual language came from.

The motif shows up in the product, not just the name: a terminal drawn natively on every platform, retro CRT themes, and an optional scanline filter for when the nostalgia hits.

## Status

**Pre-development.** Architecture and design are being worked out in the open — there is nothing to install yet. Star or watch the repo to catch the first binary.

## Design principles

- **AI-native, cloud-optional.** AI is part of the core experience — but bring your own model, local or API, and Scanline remains a complete, fast terminal when no model is configured. Nothing leaves your machine without being asked.
- **Correct before clever.** ECMA-48, xterm, and modern extensions (Kitty keyboard protocol, synchronized output) treated as spec, not suggestion. `vttest` is a milestone, not a stretch goal.
- **Fast is a feature.** Native text engines driven on a strict frame budget; input latency — perceived and measured — is the metric that matters. AI must never tax the render loop.
- **Native, not Electron.** Real platform UI — AppKit, Win32, GTK 4 — through [NSH](https://github.com/longbridge/nsh). No bundled browser.
- **Typography first.** Ligatures, fallback chains, emoji widths done right. A terminal is 95% text; treat type as the product.
- **The CRT heritage, tasteful.** Retro themes are first-class — opt-in, profile-scoped, never forced. The scanline filter ships Web-first and comes to desktop via our own renderer once the core settles.

## Roadmap

### v0.1 — "First light"

*The end-to-end core loop: spawn, type, render.*

- [ ] NSH app skeleton: one window, one `Terminal` view
- [ ] Spawn your shell (ConPTY on Windows, PTY elsewhere), wired via `write` / `onData`
- [ ] Keyboard in, glyphs out — the loop everything else builds on
- [ ] NSH's built-in VT emulator (vte-based) driving the grid
- [ ] Rendering via each platform's text engine, on a measured latency budget
- [ ] Resizable window

### v0.2 – v0.4 — "Daily driver"

*Good enough to be your only terminal — and the first AI surfaces.*

- [ ] Scrollback, selection, clipboard (OSC 52)
- [ ] Tabs and splits, keyboard-first navigation
- [ ] Config file + hot reload; theme system incl. the first CRT theme
- [ ] Bracketed paste, mouse reporting, focus events
- [ ] Ligatures, emoji, fallback font chains
- [ ] **ScanlineCore** — our own `TerminalEmulator` on NSH's swap API; command blocks & AI hooks live here
- [ ] **Command blocks** — every prompt→output becomes a structured block, the substrate all AI features build on
- [ ] **Inline completions** — ghost-text suggestions at the prompt
- [ ] **"Explain this output"** on any command block

### v0.5 – v0.9 — "The differentiators"

- [ ] **Agent pane** — run Claude Code, Codex, and friends in a first-class split with terminal-aware UI
- [ ] **Natural language → command** (Ctrl+K style)
- [ ] **Bring-your-own-model**: OpenAI-compatible endpoints, Anthropic, local via Ollama
- [ ] **iOS, Android & Web targets** — the same Scanline, SSH-ing home from your pocket
- [ ] Scanline filter & CRT theme family — Web overlay first, desktop via our custom renderer component
- [ ] Image protocols: Kitty graphics, Sixel
- [ ] In-product perf HUD: frame time, input latency, cells/s

### v1.0 — "Stability"

- [ ] Protocol, config, and AI-plugin stability guarantees
- [ ] Packages: winget, Homebrew, apt/dnf/pacman
- [ ] Documentation site & theme gallery

## Tech stack

| Layer | Direction | Status |
| --- | --- | --- |
| Language | Rust | ✅ Settled |
| App shell & native UI | [NSH](https://github.com/longbridge/nsh) (Native Shell) — native widgets per platform; TSX/Rust, hot reload | ✅ Settled |
| Terminal view | NSH `Terminal` element — text drawn by each platform's own text engine (DirectWrite / CoreText / Pango) | ✅ Settled |
| VT core | **ScanlineCore** — in-house `TerminalEmulator` on NSH's swap API; command blocks & AI hooks live here. v0.1 starts on NSH's built-in vte-based emulator | ✅ Settled |
| PTY | `portable-pty` — ConPTY on Windows, wired via `write` / `onData` / `onResize` | 🧭 Leaning |
| AI backend | Pluggable, local-first (endpoint-agnostic) | 🔍 Designing |
| CRT filter | Theme-level retro first; Web-target overlay; desktop shader via a custom renderer component later | 🔍 Designing |

Architecture bets, stated honestly: NSH is young (v0.4, Apache-2.0, Longbridge-backed, very active) and its `Terminal` element doesn't yet cover mouse reporting — we track upstream and contribute. The `TerminalEmulator` swap API and the native-component escape hatch (bring your own full renderer) mean no dead ends: any layer that stops fitting gets replaced without forking the whole product.

## Contributing

The project is pre-code, so the most valuable contributions right now are design discussions. Open an issue for:

- VT quirks that bite you in your current terminal
- What an *actually useful* AI feature in a terminal looks like to you (and what annoys you about the ones that exist)
- Your dream CRT theme

## License

[MIT](LICENSE)
