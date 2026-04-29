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

The product idea is "smart text without code." A text element can include normal words plus friendly chips like `Name` and `Age`. Those chips represent answers from the form, but the user never sees templating syntax or code-like bindings in the UI.

The prototype demonstrates:

- Dynamic display: changing the `Name` or `Age` fields updates the text element immediately.
- Conditional logic: a plain-language `Show when` control hides the text when the visitor's age is below the selected minimum.
- Combining and transformation: the preview creates a friendly visitor summary by combining the name with an age-based label.

### How a non-technical user would use it

1. Fill in the sample visitor fields on the preview side.
2. Look at the text settings panel to understand which answers are used in the smart text.
3. Adjust the `Show when` setting using normal language: `Age is at least 18`.
4. Watch the preview update without writing or reading code.

### Why this is better than traditional bindings

Traditional low-code bindings expose implementation details. They are powerful, but they ask users to understand references, punctuation, and expression syntax before they can make a small dynamic change.

This prototype keeps the same useful behavior but changes the interaction model:

- Dynamic values are visible as labeled chips.
- Logic is expressed as a sentence.
- Feedback is immediate in the preview.
- The implementation stays small: plain React state, serializable segment data, and pure helper functions.


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
