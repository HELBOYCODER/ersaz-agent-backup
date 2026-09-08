# Audit Checklist

## Typography
- [ ] Browser default fonts or Inter everywhere → Replace with Geist, Outfit, Cabinet Grotesk, Satoshi
- [ ] Headlines lack presence → Increase size, tighten letter-spacing, reduce line-height
- [ ] Body text too wide → Limit to ~65 chars, increase line-height
- [ ] Only Regular (400) and Bold (700) used → Add Medium (500), SemiBold (600)
- [ ] Numbers in proportional font → Use monospace or tabular-nums
- [ ] Missing letter-spacing → Negative tracking for headers, positive for labels
- [ ] All-caps subheaders → Try lowercase italics, sentence case, small-caps
- [ ] Orphaned words → Fix with text-wrap: balance or text-wrap: pretty

## Color and Surfaces
- [ ] Pure #000000 background → Replace with off-black (#0a0a0a, #121212)
- [ ] Oversaturated accent colors → Keep saturation below 80%
- [ ] More than one accent color → Pick one, remove the rest
- [ ] Mixing warm and cool grays → Stick to one gray family
- [ ] Purple/blue "AI gradient" aesthetic → Replace with neutral bases + single accent
- [ ] Generic box-shadow → Tint shadows to match background hue
- [ ] Flat design with zero texture → Add subtle noise, grain, or micro-patterns
- [ ] Perfectly even gradients → Break with radial, noise overlays, or mesh
- [ ] Inconsistent lighting direction → Audit all shadows for single light source
- [ ] Random dark sections in light mode → Commit to full dark mode or consistent tone
- [ ] Empty flat sections → Add imagery, patterns, or ambient gradients

## Layout
- [ ] Everything centered and symmetrical → Break with offset margins, mixed aspect ratios
- [ ] Three equal card columns → Replace with 2-col zig-zag, asymmetric grid, horizontal scroll, masonry
- [ ] height: 100vh → Replace with min-height: 100dvh
- [ ] Complex flexbox percentage math → Replace with CSS Grid
- [ ] No max-width container → Add constraint (1200-1440px) with auto margins
- [ ] Cards of equal height forced by flexbox → Allow variable heights or masonry
- [ ] Uniform border-radius → Vary: tighter on inner, softer on containers
- [ ] No overlap or depth → Use negative margins for layering
- [ ] Symmetrical vertical padding → Bottom padding often needs slight increase
- [ ] Dashboard always has left sidebar → Try top nav, floating command menu, collapsible panel
- [ ] Missing whitespace → Double the spacing
- [ ] Buttons not bottom-aligned in card groups → Pin buttons to bottom
- [ ] Feature lists starting at different Y positions → Use consistent spacing above lists
- [ ] Inconsistent vertical rhythm → Align shared elements across items
- [ ] Mathematical alignment looks optically wrong → Add 1-2px optical adjustments

## Interactivity and States
- [ ] No hover states on buttons → Add background shift, slight scale, or translate
- [ ] No active/pressed feedback → Add subtle scale(0.98) or translateY(1px)
- [ ] Instant transitions with zero duration → Add smooth transitions (200-300ms)
- [ ] Missing focus ring → Ensure visible focus indicators for keyboard nav
- [ ] No loading states → Replace spinners with skeleton loaders
- [ ] No empty states → Design composed "getting started" view
- [ ] No error states → Add clear inline error messages, no window.alert()
- [ ] Dead links (buttons linking to #) → Link to real destinations or visually disable
- [ ] No current page indication in nav → Style active nav link differently
- [ ] Scroll jumping → Add scroll-behavior: smooth
- [ ] Animations using top/left/width/height → Switch to transform and opacity

## Content
- [ ] Generic names (John Doe, Jane Smith) → Use diverse, realistic names
- [ ] Fake round numbers (99.99%, 50%, $100.00) → Use organic data (47.2%, $99.00)
- [ ] Placeholder company names (Acme Corp, Nexus) → Invent contextual brand names
- [ ] AI copywriting cliches → Never use: Elevate, Seamless, Unleash, Next-Gen, Game-changer, Delve, Tapestry
- [ ] Exclamation marks in success messages → Remove them
- [ ] "Oops!" error messages → Be direct: "Connection failed. Please try again."
- [ ] Passive voice → Use active voice
- [ ] All blog post dates identical → Randomize dates
- [ ] Same avatar image for multiple users → Use unique assets
- [ ] Lorem Ipsum → Never use placeholder latin text
- [ ] Title Case on every header → Use sentence case

## Component Patterns
- [ ] Generic card look (border + shadow + white bg) → Remove border, or use only bg color, or only spacing
- [ ] Always one filled + one ghost button → Add text links or tertiary styles
- [ ] Pill-shaped "New"/"Beta" badges → Try square badges, flags, or plain text labels
- [ ] Accordion FAQ sections → Use side-by-side list, searchable help, or inline progressive disclosure
- [ ] 3-card carousel testimonials with dots → Replace with masonry wall, embedded social posts, single rotating quote
- [ ] Pricing table with 3 towers → Highlight recommended tier with color and emphasis
- [ ] Modals for everything → Use inline editing, slide-over panels, or expandable sections
- [ ] Avatar circles exclusively → Try squircles or rounded squares
- [ ] Light/dark toggle always sun/moon switch → Use dropdown, system preference, or integrate into settings
- [ ] Footer link farm with 4 columns → Simplify to main navigational paths + legal links

## Iconography
- [ ] Lucide or Feather icons exclusively → Use Phosphor, Heroicons, or custom set
- [ ] Rocketship for "Launch", shield for "Security" → Replace cliche metaphors
- [ ] Inconsistent stroke widths → Standardize to one stroke weight
- [ ] Missing favicon → Always include branded favicon
- [ ] Stock "diverse team" photos → Use real photos, candid shots, or consistent illustration style

## Code Quality
- [ ] Div soup → Use semantic HTML (nav, main, article, aside, section)
- [ ] Inline styles mixed with CSS classes → Move all styling to project's styling system
- [ ] Hardcoded pixel widths → Use relative units (%, rem, em, max-width)
- [ ] Missing alt text on images → Describe content, never alt="" or alt="image"
- [ ] Arbitrary z-index values (9999) → Establish clean z-index scale
- [ ] Commented-out dead code → Remove all debug artifacts
- [ ] Import hallucinations → Verify every import exists in package.json
- [ ] Missing meta tags → Add title, description, og:image, social sharing meta tags

## Strategic Omissions
- [ ] No legal links → Add privacy policy and terms of service in footer
- [ ] No "back" navigation → Every page needs a way back
- [ ] No custom 404 page → Design helpful branded "page not found"
- [ ] No form validation → Add client-side validation for emails, required fields
- [ ] No "skip to content" link → Essential for keyboard users
- [ ] No cookie consent → Add compliant banner if required by jurisdiction