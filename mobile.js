// Mobile shell for the Web build (2026-09-11).
//
// Two things the founder could not get past on a phone, neither of which is the game's fault
// and neither of which the game can fix from inside the canvas:
//
//   1. **Portrait.** Dragon Isles is a 640x360 landscape game with `aspect=keep`, so a phone
//      held upright shows it as a small strip in the middle of a black screen. Rather than
//      letterbox, the page says so: turn the phone.
//   2. **Browser chrome.** A tab with an address bar over it is not a game. On the first touch
//      the page asks for fullscreen and, where the browser allows it, locks landscape - and the
//      manifest already asks for both when the game is installed to the home screen.
//
// Deliberately outside Godot: it has to work before the engine has loaded, and it must keep
// working if a scene is missing a node.

(function () {
	var STYLE = [
		'#rotate-me{display:none}',
		'@media (orientation:portrait) and (pointer:coarse){',
		'  #rotate-me{display:flex;position:fixed;inset:0;z-index:100;background:#26313c;',
		'    color:#f1e5d4;align-items:center;justify-content:center;flex-direction:column;',
		'    gap:1.1rem;text-align:center;padding:2rem;',
		'    font-family:system-ui,-apple-system,sans-serif;-webkit-user-select:none;user-select:none}',
		'  #canvas,#status{visibility:hidden}',
		'}',
		'#rotate-me .glyph{font-size:3.4rem;line-height:1}',
		'#rotate-me .big{font-size:1.25rem;font-weight:600}',
		'#rotate-me .small{font-size:.95rem;opacity:.62;max-width:22rem;line-height:1.45}'
	].join('\n');

	function build() {
		var css = document.createElement('style');
		css.textContent = STYLE;
		document.head.appendChild(css);

		var d = document.createElement('div');
		d.id = 'rotate-me';
		d.innerHTML =
			'<div class="glyph">&#8635;</div>' +
			'<div class="big">Telefonu yan &ccedil;evir</div>' +
			'<div class="small">Dragon Isles yatay oynan&#305;r. Daha iyisi: tarayıcı men&uuml;s&uuml;nden ' +
			'<b>Ana Ekrana Ekle</b> &mdash; o zaman tam ekran, kendi simgesiyle a&ccedil;&#305;l&#305;r.</div>';
		document.body.appendChild(d);
	}

	// Fullscreen and, where it is allowed, a landscape lock. Both need a user gesture, so the
	// first touch is where they are asked for - and both are allowed to fail silently: iOS
	// Safari grants neither, and the rotate screen above is what covers that case.
	function immerse() {
		var el = document.documentElement;
		if (!document.fullscreenElement && el.requestFullscreen) {
			el.requestFullscreen({ navigationUI: 'hide' }).catch(function () {});
		}
		if (screen.orientation && screen.orientation.lock) {
			try { screen.orientation.lock('landscape').catch(function () {}); } catch (e) {}
		}
	}

	function arm() {
		if (!window.matchMedia || !window.matchMedia('(pointer: coarse)').matches) {
			return;                      // a mouse: leave the window alone
		}
		window.addEventListener('touchend', immerse, { once: true, passive: true });
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () { build(); arm(); });
	} else {
		build();
		arm();
	}
})();
