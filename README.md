# **Code Challenge — Simplifying Dynamic Data for no-code tools**

**Version 1 - March 2026**

## Prototype write-up

This prototype explores a simple mental model for dynamic data: instead of asking non-technical users to write expressions, the editor lets them compose a readable sentence with labeled answer chips. The preview updates immediately as the sample visitor fills in `Name` and `Age`.

### How to run

```bash
npm install
npm run dev
```

Validation commands:

```bash
npm run lint
npm run test
npm run build
```

### Approach

The product idea is "smart text without code." A text element is a single inline editor where the user types regular words and drops in labeled answer chips like `Name`, `Age`, or `Age group`. The chips represent answers from the form, but the user never sees templating syntax or code-like bindings.

The prototype demonstrates the three behaviors from the challenge:

- **Dynamic display:** changing the `Name` or `Age` answer updates the text element immediately.
- **Conditional display:** a plain-language rule hides the text when the answer doesn't match. The rule reads as a sentence, e.g. `Show this text when Age is at least 18`.
- **Transformation and combining:** a derived `Age group` chip turns `Age` into `adult visitor` or `younger visitor`, and combines naturally with the rest of the sentence.

The editor itself is the main piece of design work:

- One inline editable line. You can type, delete, and wrap text anywhere; chips behave as atomic objects in the flow.
- Drag-and-drop chips. Dragging a chip from the shelf, or an existing chip from the line, shows a soft ghost preview at the caret position so the surrounding text reflows around its future home.
- Hover-only `×` on each chip to remove it, with no extra controls cluttering the resting state of the chip.
- Type-aware comparison operators in the condition builder: `Age` (number) shows `is at least` and `is at most`; `Name` (text) shows `includes`. Switching the answer keeps the operator if it still makes sense, and falls back to a safe default if not.

#### Walkthrough (Loom)

[**Open the 5-minute Loom walkthrough →**](https://www.loom.com/share/46821141d00a4f02a8d349e83aa8e7eb)

### How a non-technical user would use it

1. Fill in the sample answers on the left to see the smart text update live.
2. In the editor on the right, type the sentence you want.
3. Drag answer chips like `Name`, `Age`, or `Age group` from the shelf into the sentence wherever a value should appear.
4. Drag a chip to a new position to reorder it, or hover it and click `×` to remove it.
5. Open `When should this text appear?` and describe the rule in plain language, for example: `Show this text when Age is at least 18`.

### Why this is better than traditional bindings

Traditional low-code bindings expose implementation details. They're powerful, but they ask users to understand references, punctuation, and expression syntax before they can make a small dynamic change. They also let users build rules that don't apply to the data, like `name greater than 5`.

This prototype keeps the same underlying structure but changes the surface:

- Dynamic values are visible as labeled chips, not opaque expressions.
- Conditional logic is expressed as a sentence, not a formula.
- The condition builder constrains itself to the operators that make sense for the chosen answer.
- Feedback is immediate. Every edit is reflected in the preview within the same frame.

Underneath, the data stays clean: smart text is a serializable list of segments, the visibility rule is a small structured object, and the rendering and rule evaluation are pure functions. That keeps the prototype small, testable, and easy to extend in the directions a real product would care about.

### What I deliberately left out

To keep the prototype focused on the mental model rather than feature breadth:

- One text element, not a full canvas of components.
- One condition row, not nested AND/OR groups.
- One derived value (`Age group`) to demonstrate transformation, instead of a formula editor.
- A fixed two-answer schema. Users can rename the form labels but not add new fields.

These are the natural next steps if the model proves itself, but the challenge rewards a clear first interaction over feature depth.



## Original challenge brief

## **Context**

Non-technical users struggle with concepts like `{{input.value}}` but have a strong desire to create dynamic apps.

An example of a low-code version is [retool](https://retool.com/) which uses `{{}}` that works great for technical users but becomes difficult for non-technical users.

Your goal is to design a **simpler, more intuitive way** to work with dynamic data in a UI.

If you're not familiar with low-code tools you can signup for retool and try to drag and drop an input and a text component to bind the input value to the text

## **Challenge**

Create a small prototype that allows a non-technical user to:

1. Display dynamic data (e.g. show a name entered in an input)

2. Perform at least **2 additional actions**, such as:
   - Conditional logic (e.g. show/hide based on input)

   - Combining values (e.g. list of names sperated by comma)

   - Transformations (e.g. date to age)

⚠️ Constraint:

- Do **not** use syntax like `{{ }}` or anything code-like in the UX

---

## **Provided UI**

- Text element

- Example input fields: Name & age

You can change this if needed, but keep it simple.

---

## **Deliverables**

- Working prototype (rough is fine)

- 5–10 min Loom (or short write-up) explaining:
  - Your approach

  - How a non-technical user would use it

  - Why it’s better than traditional approaches

---

## **What we care about**

- Your **thinking**, not polish

- Simplicity over complexity

- Clear mental model 

**Delivery**

When you are finished, send an invite to your github, bitbucket or gitlab repository to: ismail-doitbig

Include a loom with your thought process.

**You will be judged on:**

- 7 points: Thought process and coming up with a solution
- 3 points: The ease of use for the solution

Max reachable score 10/10 points

Besides the above points your app will be compared against other developer submissions.

Goodluck!
