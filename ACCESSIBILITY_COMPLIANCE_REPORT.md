# Accessibility Compliance Report
## CarbonQuest — Gamified Carbon Footprint Coach

**Standard**: WCAG 2.1 Level AA  
**Status**: ✅ Compliant  

---

## 1. WCAG 2.1 Success Criteria Mapping

### Perceivable

| Criterion | Implementation in CarbonQuest |
|-----------|--------------------------------|
| **1.1.1 Non-text Content** | Decorative SVG symbols and Lucide icons have `aria-hidden="true"`. Interactive elements have distinct labels. |
| **1.3.1 Info and Relationships** | Form control fields explicitly group options (such as diet or transport choices) using standard semantic structure. |
| **1.4.1 Use of Color** | Color is never used as the sole indicator of status; numerical readouts, descriptive headers, and badges convey achievements and levels. |
| **1.4.3 Contrast (Minimum)** | All primary text elements maintain a minimum contrast ratio of 4.5:1 against their backgrounds. Focus rings and badges conform to 3:1 minimum graphic contrasts. |
| **1.4.10 Reflow** | Liquid viewport layouts scale down gracefully to a single-column layout at 320px width without losing functional options. |

### Operable

| Criterion | Implementation in CarbonQuest |
|-----------|--------------------------------|
| **2.1.1 Keyboard** | Every card, tab, text field, and button is fully focusable and triggerable via keyboard (`Tab`, `Space`, `Enter`). |
| **2.4.1 Bypass Blocks** | Skip-to-main-content link is present on layout loads to let keyboard/screen-readers bypass navigation headers. |
| **2.4.4 Link Purpose** | Context-specific text labels or `aria-label` tags explain the target destination of links and buttons. |
| **2.4.7 Focus Visible** | Distinct ring overlays style keyboard navigation outlines using `:focus-visible` selectors. |

### Understandable

| Criterion | Implementation in CarbonQuest |
|-----------|--------------------------------|
| **3.1.1 Language of Page** | Document HTML header explicitly declares `lang="en"`. |
| **3.3.1 Error Identification** | Input verification identifies boundaries, showing inline feedback and linking descriptions with inputs. |
| **3.3.3 Error Suggestion** | Form messages offer explicit suggestions (e.g. valid entry ranges, units) if calculations fail. |

---

## 2. Screen Reader Compatibility

We design for NVDA (Windows) and VoiceOver (macOS/iOS) with these practices:
1. **Interactive Indicators**: Action status (like loading state, streaks increments, and level ups) announce via `aria-live="polite"`.
2. **Tab Index Flow**: DOM node structures align with visual page order, preventing focus jumping.
3. **Alt Labels**: Visual canvases (like the dynamic EcoWorld SVG ecosystem) are described with clear alternative labels and titles.

---

## 3. Reduced Motion Support

We integrate motion rules in our CSS system:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

When users toggle "Reduce Motion" in their system preferences, transitions and animations are skipped to prevent motion sickness.
