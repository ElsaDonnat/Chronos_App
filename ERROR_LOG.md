# Error Log

Track bugs, issues, and resolutions during development.

## Format
```
### [Date] - [Brief description]
- **Severity**: Low / Medium / High / Critical
- **Description**: What went wrong
- **Resolution**: How it was fixed
- **Files affected**: List of files
```

---

### 2026-03-13 - L2 lesson rev-4 has only 2 eventIds (should be 3)
- **Severity**: Medium
- **Description**: Lesson `rev-4` ("Revolution in Our Time") in the Revolutions chapter has only 2 eventIds (`f66`, `f67`) instead of the expected 3. All other L1 and L2 lessons correctly have 3 events each.
- **Likely cause**: Pre-existing since the Revolutions chapter was first added. Not caused by any recent change.
- **Files affected**: `src/data/lessons.js` (line 291)
- **Suggested fix**: Either add a 3rd event to the lesson (would require creating a new event in `events.js` with distractors in `descriptionDistractors.js`), or confirm this is intentionally a 2-event lesson and update the data integrity check expectations.
