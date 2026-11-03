# Direction previews

Use with the visual direction gate in SKILL.md section 3. The aim: a person picks a direction from what it looks like, not from words, and is not overwhelmed while doing it.

## Show directions as real previews

- Show each direction as one or two key screens of the deliverable, rendered, not described. Key screens by deliverable: a web page is the hero plus one content section; a slide deck is the title slide plus one data slide; an email is the header plus the call to action; a product flow is the key screen plus one state.
- Use the deliverable's own content: real names, captions and numbers the owner supplied, taken from the project files. Never reuse copy from another deliverable. A deck preview must not carry landing-page headlines. Missing content is a bracketed placeholder. Mock interface is labeled Illustrative.
- These are direction previews, not the design. Label them so, build each once, and do not extend them into full screens until a direction is chosen.
- Reuse before rebuilding. If the owner already has explorations or branches, capture those and show them as options.

## Craft bar for previews

A flat preview fails the gate. Each preview has real typefaces from the brand or research (never a system fallback), one signature idea traced to a gap in the research or to the brand, depth or texture that suits the direction, one carefully drawn detail, and its own navigation treatment.

## Tests before showing anything

- **Layout test:** the options differ in layout and structure, not only in color, borders and type. Three skins of one layout are one option.
- **Swap test:** put a different product into the direction. If it still fits, it is generic. Rebuild it.
- **Slop pass:** the slop checklist and its additional checks.
- **Context check, yes or no for each:** the preview uses the deliverable's real format; its copy is this deliverable's own, for this audience; it respects the decision record and every stated preference; it uses what already exists, or says why not; it claims nothing the owner cannot yet claim, so stage-appropriate placeholders stand in for logos, reviews and traction. Fix any no first.

## Keep the choice small

- At most three options per decision. One is recommended and pre-selected, with a one-line reason tied to evidence.
- One decision per message. Do not stack unrelated choices.
- After a direction is chosen, build one prototype with recommended defaults for everything else, and ask one question: what is the one thing to change.
- Show type, style, component or layout alternatives only when the user asks about that thing, as one row of at most three variants on the same sample.
- Allow "mix": the user names what to take from each option. Keep likes and vetoes in the decision record and never offer a vetoed item again.
- Spend effort where a choice is real. Capture about five references, not a survey, and do not re-render finished work.

## Existing product, better direction

- Capture the current design as it is and show it first, labeled Current.
- Audit it plainly: what works, what does not, tested against the research and the slop checklist.
- Lock what must not change: brand, copy, structure, technical limits, and anything the owner says they love.
- Put Current beside two improved options, one of them an evolution that keeps the identity. For each, say what it keeps and what it changes.
- Never overwrite the owner's files. Build previews in a clearly separate folder or branch and say where they are.

## Capturing previews

- Serve the files over local http. The in-app browser refuses file URLs.
- To fit a 1440 px design into the pane, set the page zoom to about 0.55 twice with a short wait between, scroll to the top, then capture. Screenshots are capped at about 800 px wide.
- If the pane stops painting or captures time out, render at the design width with headless Edge or Chrome instead: `msedge --headless=new --disable-gpu --hide-scrollbars --window-size=1440,900 --virtual-time-budget=9000 --screenshot=out.png URL`. Read the image back to check it.
- Entrance animations freeze on their first frame in a background pane. Finish them in the page before capturing.
- Prefix class names per file. Shared names silently restyle other elements.
- Record any capture that failed or was only partial, and say so. Never describe a page you did not open.

<!-- figma-short:start -->
**Direction previews (short form).** Used with the visual direction gate, so a person picks a direction from what it looks like and is not overwhelmed.

- Show each direction as one or two key screens of the deliverable, rendered, not described, in its own real content from the project files. Label them as direction previews, build each once, and do not extend them until a direction is chosen. Reuse existing explorations as options.
- **Craft bar:** real typefaces from the brand or research, one signature idea traced to the research or brand, and real depth or texture. A flat preview fails the gate.
- **Tests before showing:** the options differ in layout and structure, not only color, borders, and type (three skins of one layout are one option); the swap test, where a different product would still fit means the direction is generic; the slop pass; and a context check that the preview uses the deliverable's format and copy and respects the decision record and stated preferences.
- **Keep the choice small:** at most three options, one recommended and pre-selected with a one-line reason; one decision per message. After a choice, build one prototype with recommended defaults and ask for the one thing to change. Allow "mix", keep likes and vetoes in the decision record, and never re-offer a vetoed item. Spend effort where a choice is real.
<!-- figma-short:end -->
