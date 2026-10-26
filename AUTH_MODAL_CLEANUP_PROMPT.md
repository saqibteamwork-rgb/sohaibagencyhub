# 🎯 AI Prompt: Remove "Forgot Password" & "Membership Tier Dropdown" from Customer Login / Signup Modal

Copy and paste the prompt below into your AI coding assistant (Cursor, Antigravity, Claude, ChatGPT, etc.) on your second/clone project:

---

```markdown
### Task: Clean up Customer Auth Modal (Remove "Forgot Password" & "Membership Tier Dropdown")

Please clean up the customer login / sign-up modal in our project by removing two specific elements:

1. **Remove "Forgot Password?" Button / Link**:
   - Locate the password field in the customer authentication / VIP login modal.
   - Remove the "Forgot Password?" link/button that opens the password reset or WhatsApp prompt.
   - Simplify the label above the password input to just: `Password / Security PIN *`.

2. **Remove "Select Membership Tier" / Role Dropdown**:
   - Locate the dropdown that asks the user to pick a membership tier, reseller plan, or role (e.g., `<select value={authRole}>...</select>`).
   - Completely remove this dropdown and its label from the JSX/UI.
   - In the auth state and form submission handler (`handleSubmitAuth` or registration API call), keep a sensible default role string (e.g. `'Regular Customer (Free)'` or `'member'`) so that the backend API continues to receive a valid payload and user accounts are created without errors.

3. **Verify UI Flow**:
   - In **Sign In** mode, the modal should only ask for:
     1. WhatsApp Number / Email
     2. Password / Security PIN
     3. "Sign In" button
   - In **Sign Up** mode, the modal should only ask for:
     1. Full Name
     2. WhatsApp Number / Email
     3. Password / Security PIN
     4. "Create Account" button
   - No dropdowns, no "Forgot Password" link.

4. **Build & Verify**:
   - Ensure there are no unused variable warnings (e.g. `setAuthRole` if no longer used).
   - Run the project build / typecheck to verify zero errors.
```

---

### 💡 Quick Summary of What Changes:
| Before | After |
| :--- | :--- |
| Password label had a `Forgot Password?` link on the right | Plain clean label: `Password / Security PIN *` |
| Signup form had a `Select Membership Tier` dropdown | Completely removed from UI |
| User had to pick a package before signing up | Default role auto-assigned quietly in background |
