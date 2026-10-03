# States and copy (Steps 6-7)

This file owns what each state shows and how every visible string reads. It does not own state mechanics (native-slop #19 and the data layer the architecture skill documents, bindings §10), alert policy (#10), input and validation mechanics (the forms skill, bindings §10), haptics (expo-animation step 8) or any timing. Where a sibling owns the mechanism, this file names it and adds only the taste.

Examples use generic nouns (events, members, photos). Real keys, locale files, formatter helpers and component gaps are in bindings §3, bindings §6 and bindings §8.

## 1. State matrix

Design every row a data-backed screen can reach before polishing content. Rows that cannot happen on this screen are written off in one clause in the answer, not skipped silently.

| State | Show | Keep | Action | Copy formula |
| --- | --- | --- | --- | --- |
| Loading, revalidating | Mechanics per #19; taste in section 2 | Chrome | None | None beside a skeleton; section 2 for a wait the user notices |
| Empty, first-run | Symbol + title + sentence + action (section 3) | Header; hide the header create while the empty action shows (T17) | Create, verb + object | “<Objects> you <verb> appear here” + how it gets populated |
| Empty, no-results | Echo of the query + one recovery sentence | Search field, active filters | None extra with native header search (its own clear/cancel is the clear action); Clear filters only for non-search filters | No <objects> match “{{query}}” + “Try fewer or different words.” |
| Empty, nothing now | One plain line stating the fact (cleared, caught up, or nothing current or scheduled) | Header | None | “You’re all caught up” / “No <objects> scheduled” |
| Error, field | Message under the field (forms skill) | Everything typed | Fix the field | “Enter <field>” / “<Field> needs <rule>.” |
| Error, section | Inline message in the section’s slot | Every other section | Retry | “Could not load <object>.” + Retry |
| Error, screen | Symbol + title + sentence + Retry, only when nothing can render | Header and back | Retry, or the step that unblocks | “Could not load <object>. <Next step>.” |
| Content | The archetype’s anatomy | n/a | Archetype primary | Steps 5 and 7 |
| Pending write | The triggering control’s own loading state; an optimistic row in its final place | The rest of the screen, interactive | None extra | Label unchanged, or “<Verb>ing…” |
| Offline | Content + one non-blocking notice at the top of the content region | Cached content; queued writes as pending rows | None (resumes on reconnect) | “You’re offline. Showing saved <objects>.” |
| Partial | Loaded parts + a section error or media placeholder where a part failed | Every loaded part | Retry per failed part | Section formula; at a list’s end “Could not load more.” + Retry |

Rules across rows:

- Loading and refresh mechanics: #19. Empty is never error: a failed fetch never shows “No <objects>”.
- One state per region. A screen can be content above and section-error below (partial); it is never a spinner over content.
- A locked view (no permission, signed out of a feature, plan limit) is not an empty. It is a screen- or section-scope error that names the lock and offers the one step that removes it (“Allow photo access” + Open Settings).
- An error over older content marks the problem inline and keeps the content (#19).

## 2. Loading: taste only

Mechanics (four-state split, stale-while-revalidate, refresh control, when a skeleton beats a spinner) are #19. Taste adds:

- Skeleton blocks use the muted surface fill and the radius role of the element they stand in for: a grouped section keeps the group radius, an avatar is a full circle, a text line uses the smallest radius step, media keeps its aspect ratio (C10). No borders, no shadows, no second surface level (C7).
- Geometry matches the first viewport, not a generic stack: the real number of rows that fit, text lines at uneven widths, the identity block where it will render. Three identical bars is a template, not a skeleton.
- No shimmer, pulse or gradient sweep at M<=2. At M>=3 a loading animation is still a candidate motion: write its sentence (Step 8) and run expo-animation step 1. Reduced motion shows the static blocks.
- Text never appears inside a skeleton. Real chrome (header title, search field, tabs) renders at once; only data regions are blocks.
- Loading copy: no “Loading…” next to a skeleton, no “Please wait”, no “Fetching data”. A button’s pending state keeps its label width (no layout jump) and either keeps the label or uses the in-progress verb with the single ellipsis character: “Saving…”. A long wait names the work and the count: “Importing 42 members…”.

## 3. Empty: three kinds

First-run (nothing yet, the user or someone else will add it), no-results (a query or filter hides what exists) and nothing now (there was content, or there will be, but none applies at the moment: an inbox cleared, every task done, a season over with nothing scheduled). Never “No data”, “Nothing here yet”, or one shared string for all three kinds (T18). The parent keeps its container and header; the empty block sits in the content region where the content would be. Centering is allowed here (C5).

| Part | First-run | No-results | Nothing now |
| --- | --- | --- | --- |
| Symbol | Muted, literal platform symbol from the declared family at the empty-state size (bindings §2); at V>=3 it may sit on the accent-container circle; illustration only at V>=5 on non-frequent screens | None, or the search symbol | Optional checkmark-type symbol, muted |
| Title | At most 6 words, says what lives here: “Events you join appear here” | No events match “{{query}}” | The current fact: “You’re all caught up”, “No events scheduled” |
| Sentence | One sentence on how it gets populated: “Browse upcoming events and join one to save your spot.” | One recovery step: “Check the spelling or try fewer words.” (or “Remove a filter.” when non-search filters are active) | None, or one fact on when content returns: “New requests show up here.”, “Next season’s events appear once the calendar is out.” |
| Action | Verb + object when the user can create or find it: “Find events”. None when someone else populates it (say who) | None with native header search: its own clear/cancel control clears the query, so a Clear search button is a duplicate (T17). Clear filters only for non-search filters (chips, a filter sheet) | None (a create action belongs to first-run; a past-items view, if the screen has one, stays reachable through its normal control) |

- The first-run sentence is where the app explains itself, never a welcome block on the Hub (T1).
- No emoji (#3), no giant illustration on a screen opened tens of times a day, no exclamation mark, no “Let’s get started”.
- When only another person can populate it, the sentence names them: “Your host adds sessions here.”
- No-results never shows the first-run create action, and the query is echoed exactly as typed inside curly quotes.
- Nothing now is not first-run: it never explains the app and never offers the create action unless the user is the one who schedules the content (then it is first-run copy for that user).

## 4. Errors: scope and wording

Formula: **“Could not <verb> <object>. <Next step>.”** The verb is what the user tried (load, save, send, join), the object is the domain noun, the next step is one concrete instruction. Never raw server text, error.message, status codes, exception names or stack text on screen (T15, T19).

Placement by scope:

| Scope | Where | Keep | Notes |
| --- | --- | --- | --- |
| Field | Under the field (forms skill owns timing and focus) | Every value typed | Missing: “Enter your email”. Invalid: “Password needs 8 or more characters.” Server-side field errors land on the field too: “This email already has an account.” Never in a banner |
| Write action | Next to the control that triggered it, or the optimistic row reverts and shows a one-line note | The screen | Never a toast for an error the user must act on (T20), never an alert for a routine failure (#10) |
| Section | In the section’s slot, one line + Retry | Other sections | Retry is a secondary or ghost control, never a second filled primary (C2) |
| Screen | Content region: symbol + title + sentence + Retry | Header and back, so the user can leave | Only when nothing can render. Stale content always outranks this |
| Off-screen | Where the affected item lives (a failed upload shows on its row) | Everything | A transient message only to point at it, never as the only record |

Map error kinds to copy in the data layer (bindings §6 and bindings §10), never by matching message text:

| Kind | Next step |
| --- | --- |
| No connection | “Check your connection.” + Retry |
| Timeout, 5xx | “The server didn’t respond. Retry in a moment.” + Retry |
| Not found | “This <object> was removed.” + Back |
| No access | “You don’t have access to this <object>.” + who can grant it |
| Conflict | “Someone else changed this <object>. Reload to see the latest.” + Reload |
| Rate limited | “Too many attempts. Wait a minute, then retry.” |
| Validation | On the field (row above) |
| Unknown | “Could not <verb> <object>.” + Retry. Still names the object |

Session expiry is not a screen error: the auth gate handles it (navigation skill).

## 5. Success and Undo

Confirmation, success and Undo policy: native-slop #10. Taste adds what the change looks like:

- The UI change is the confirmation: the row appears in its sorted place, the value updates where it was, the sheet dismisses onto the updated parent, the button returns to rest. No “Saved successfully” anywhere (T20).
- A transient message exists only to offer Undo or to report a result the user cannot see. Copy: past-tense fact + object, no “successfully”, no exclamation: “Event archived” + Undo.
- A big outcome (payment, submitted application) is a Result archetype screen with one Done, not a toast.
- Success haptics follow expo-animation step 8; this file sets none.

Undo policy:

- Offer Undo when the action is reversible on the device: the item leaves the UI at once, the real commit runs after the Undo window, and Undo restores it exactly (position, selection, scroll).
- No Undo for effects that already left the device (a sent message, a payment, a notification to others). Those are confirmed first or are not reversible by design.
- One transient message at a time. A new one replaces the old, never stacks.
- Label “Undo” (es “Deshacer”), one action only, announced to the screen reader.
- When the app has no snackbar component, Undo needs a design decision before the first use (bindings §6). Never fake it with an alert.

## 6. Destructive confirmation

Whether to confirm is #10. When the native confirmation is used:

- Title: **“<Verb> <object>?”** (“Delete event?”, “Remove Marta from the group?”). Spanish keeps the opening “¿”: “¿Eliminar evento?”.
- Message: one sentence with a consequence the user might not know (“Members lose access to its photos.”), or none. Never “Are you sure?”, never “This action cannot be undone” as filler.
- The destructive button repeats the verb (“Delete”) in the platform’s destructive style; the other is “Cancel”. Never Yes/No, never OK.

## 7. Copy rules

**Register lock.** One register per app per language, written in the bible (bindings §2): person, formality, pronoun. The user is “you” (or the bible’s pronoun in each language). The app does not call itself “we” unless the bible says so. A string in the wrong register is a bug even when grammatical.

**Voice.**
- Active voice with the real actor: “Your host cancelled the session”, not “The session was cancelled”. Errors use the formula in section 4, never “An error has occurred”.
- Plain verbs and the domain’s nouns. Say what happens, not how it feels.
- Sentence case for titles, buttons, tabs, rows, section headers and alerts. Capitals only for proper nouns. Case transforms belong to the grouped-list header the bible names, never to copy.
- “Tap” only when the gesture is not obvious. Never click, hover, scroll down.
- “Your” on a header only when it separates the user’s items from others’.

**Formulas.**

| String | Formula | Example |
| --- | --- | --- |
| Button, CTA | Verb + object, at most 3 words, names the outcome | “Join event”, never “Submit” or “Continue to next step” |
| Section header | Noun phrase, at most 3 words | “Upcoming”, “Payment method” |
| Field label | Noun, no colon, no asterisk; optional fields end “(optional)” | “Phone (optional)” |
| Helper text | Only when the format is not obvious, one line | “Shown to other members” |
| Empty, error, offline | Sections 3, 4, 1 | |
| Destructive title | “<Verb> <object>?” | “Leave group?” |
| Success transient | Past-tense fact + object | “Photo removed” |
| Permission primer | Title = what the user gets; primary “Allow <capability>”; secondary “Not now” | “Get reminders before each session” |

A placeholder never replaces a label. One verb per intent app-wide: if it is “Join” on one screen it is not “Become a member” on another (T17).

**Punctuation.**

| Rule | Detail |
| --- | --- |
| No em dash (U+2014) or en dash (U+2013) | Binary, every locale, mock data included (T13). Use a period, comma, colon, parentheses or two strings |
| Ranges | i18n strings: “{{from}} to {{to}}” / “de {{from}} a {{to}}”. Never Intl formatRange: it prints U+2013 in en and es and may be missing in Hermes |
| Quotes and apostrophes | Curly: “ ” and ‘ ’ in English, the apostrophe is ’ (you’re, don’t). Other languages use the one style the bible fixes per language (this app's choice: bindings §8), the same style in every string. Never straight " or ' in visible text |
| Ellipsis | The single character … (U+2026), never three periods. Only for an in-progress verb (“Saving…”) and system truncation |
| Exclamation | Zero, except one in a rare-tier celebration. Spanish therefore never uses “¡” outside it; “¿” stays for questions |
| Middle dot | At most once per line, as a metadata separator (“18:30 · Room 2”), never as decoration |
| Periods | On full sentences. None on buttons, titles, labels, tabs or single-phrase rows |

**Numbers, dates, plurals.**
- Never assemble count + noun by hand (`${n} members`). Use i18n plural keys with every category the language needs (en and es: _one / _other, the count passed as the variable). A zero that means “nothing yet” is an empty state, not “0 members”.
- Dates, times, numbers and currency come from the locale-aware formatter wrappers with the app’s current language (bindings §3), never toFixed or a bare toLocaleString(). Currency uses the currency style with its code. 12/24-hour follows the locale.
- Relative time for recent activity (“2 h ago”), absolute dates for anything scheduled.
- No fake precision: decimals only when the data has them. Aligned or updating numbers use tabular figures (C13).
- Never concatenate translated fragments: word order changes per language. One key per sentence, with interpolation. A word used in two meanings gets two keys.

## 8. Banned words

Core list. Each language’s additions and the grep regex live in the bible (bindings §2 and bindings §0). The T14 grep in tells.md is the check.

| Kind | English | Spanish |
| --- | --- | --- |
| Filler verbs, adjectives | elevate, seamless(ly), unleash, unlock (your potential), supercharge, effortless(ly), next-gen, revolutionize, empower, game-changer, cutting-edge, all-in-one, world-class, journey, magic(al), delightful, take X to the next level | eleva, sin esfuerzo, sin fisuras, desata, desbloquea (tu potencial), potencia tu, de nueva generación, revoluciona, empodera, cambia las reglas del juego, de vanguardia, todo en uno, de clase mundial, tu viaje, mágico, lleva X al siguiente nivel |
| AI clichés | delve, tapestry, in the world of, smarter than ever, transform your day, dive in, embark, navigate the | sumérgete, adéntrate, en el mundo de, más inteligente que nunca, transforma tu día, embárcate |
| Performative labels | Field notes, From the field, Quietly trusted by, On our desks, Currently on the bench | Notas de campo, Desde el terreno, Con la confianza discreta de |
| Interjections, applause | Oops, Whoops, Uh-oh, Yay, Awesome, Great job, successfully | Ups, Uy, Vaya, Genial, ¡Bien!, con éxito, correctamente (as in “guardado correctamente”) |
| Minimizers | just, simply, easily, quick and easy | solo tienes que, simplemente, fácilmente |
| Web idioms | click, hover, scroll down, learn more ->, read more, back to top | haz clic, pasa el ratón, desplázate, más información ->, leer más |
| Developer voice | mock, starter, template, placeholder, test, no data, item 1, screen and route names (“detail screen”, “sheet”, “pushed”) | de prueba, plantilla, sin datos, elemento 1, “pantalla de detalle” |
| Placeholders | Lorem ipsum, John/Jane Doe, Jane Smith, Acme, Nexus, SmartFlow, NovaCore, Flowbit, Quantix, VeloPay, Foo/Bar, test@test.com | Fulano, Mengano, Juan Pérez, Empresa S.A. |
| Labels | “Welcome to <App>!” as content, version labels (v2.1, BETA) outside the About footer, “New” pills without a real filter | “¡Bienvenido a <App>!”, BETA, “Nuevo” |

“please” follows the register; the default is none. When a banned word is the domain’s real term (a “journey” in a travel app), the bible lists the exception.

## 9. Mock data

Mock data is designed content: the screen is judged on it (T16).

- Names: locale-realistic, mixed cultures and lengths, including one long compound name that wraps and one very short one. Distinct initials across the visible set.
- Avatars: never the same person symbol or photo for everyone. Missing photos use initials with a deterministic tint from the name, inside the roles the bible allows. At least one record has no image so the fallback is seen.
- Dates and times: varied and plausible, not all today, not all on the hour, past and future where the screen shows both, spread across weeks.
- Counts and values: imperfect (23, 1, 0, 147), never 99.9%, 1,234, 4.8 stars on everything. Lists are not always exactly 5 items: include the 0, 1 and long cases the screen must survive (hard rule 8).
- Text fields: one empty description, one long one, one in the longest locale.
- No stock brands or people from the banned table. Mocks live in the mock seam, carry the mock prefix (bindings §0 and bindings §8) and are labeled as mock in code, never in the UI unless the product shows sample content on purpose, which then says “Sample”.

## 10. i18n length budget

Check at default text size on a 320pt-wide screen in the longest locale (Spanish, French and German run about 25-35% longer than English). Wrapping at the largest accessibility size is allowed; truncating primary content is not (C14, mechanics in expo-design-system Typography “Dynamic Type”).

| String | Budget |
| --- | --- |
| Tab label | 1 word, no truncation |
| Navigation title | Fits beside the back button without truncation |
| Button | At most 3 words, one line |
| Section header | At most 3 words, one line |
| Row title / metadata | One line each; the title wraps before it truncates |
| Empty title | At most 6 words, at most 2 lines |
| Empty or error sentence | One sentence, at most 3 lines |
| Destructive title | One line where possible |

When a string breaks the budget in any locale, rewrite it in every locale; never shrink the type or cap scaling to fit.

## 11. Copy Self-Audit

Run once per screen before Step 9, on the strings, not the code.

1. List every visible string the screen can show, from every locale file: titles, headers, rows, buttons, field labels, helper and error text, every state from section 1, alerts, accessibility labels and mock data.
2. Read each one as the user, in context (one hand, mid-task, after the action that produced it). Flag a string that is:
   - grammatically broken, or broken by its interpolation (plural, gender, a long name);
   - vague, or with an unclear referent (“it”, “this”, “item”);
   - cute-but-wrong wordplay, a forced metaphor, or a phrase that sounds elegant and says nothing;
   - trying to sound thoughtful (mock humility, poetic labels, craftsman voice);
   - naming the mechanism (screen, sheet, query, sync, mock) instead of the user’s task;
   - drifting from the bible’s register, pronoun or quote style;
   - on the banned table, or with a dash, an exclamation mark, straight quotes or three periods.
3. Rewrite every flagged string in every locale. When unsure, write the plain functional sentence. Boring and clear beats clever.
4. Re-check the longest locale against section 10 on a rendered screen.
5. Run the T13 and T14 greps from tells.md, including the T14 advisory line for straight quotes, straight apostrophes and three-dot ellipses inside i18n values (hits are candidates, not failures).

The [States] and [Copy] boxes in preflight.md are the done check.
