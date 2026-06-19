# 🛠️ Team Git Workflow & Branching Rules

Welcome to the team! To ensure we move fast during the hackathon without breaking our core application, we are using a strict branching strategy. 

> **🚨 THE GOLDEN RULE:** > **Absolutely NO ONE touches the `main` branch.** All active development happens on your personal/feature branches and gets merged into `dev`. `main` is our sacred, deploy-ready branch for the final demo.

---

## 🚀 1. Initial Setup (Do this once)

### Step 1: Clone the Repository
Open your terminal and clone the repository to your local machine:
```bash
git clone [https://github.com/your-username/ziwaclear.git](https://github.com/your-username/ziwaclear.git)
cd ziwaclear

```

### Step 2: Switch to the `dev` Branch

The `dev` branch is our central integration branch. Pull it down to your local machine:

```bash
git fetch origin
git checkout dev
git pull origin dev

```

### Step 3: Create Your Personal Branch

Never write code directly on `dev`. Instead, branch off from `dev` to create your own workspace:

```bash
# Replace 'dev-yourname' with your actual name or the feature you are building 
# e.g., git checkout -b feat-sms-parser
git checkout branch-name

```

---

## 💻 2. The Daily Workflow (Do this while coding)

### Step 1: Write Code & Commit

As you build out your features, save your progress regularly on your branch:

```bash
git add .
git commit -m "feat: added M-Pesa payout integration"

```

### Step 2: Keep Your Branch Updated (Crucial!)

While you are working, other devs will be merging their code into `dev`. To prevent massive merge conflicts later, pull those changes into your branch frequently:

```bash
# Make sure you are still on your personal branch, then run:
git pull origin dev

```

*(If there are merge conflicts, resolve them locally in your code editor, then commit the resolved files).*

### Step 3: Push to Your Branch

When you are ready to share your work or save it to the cloud, push **only to your personal branch**:

```bash
# For the FIRST time you push this branch, use:
git push -u origin dev-yourname

# For all FUTURE pushes on this branch, just use:
git push

```

---

## 🔀 3. Merging Your Work (Pull Requests)

When your feature is complete and tested, it is time to merge it into the shared `dev` branch.

1. Go to the GitHub repository in your web browser.
2. You will see a green button that says **"Compare & pull request"** next to your recently pushed branch. Click it.
3. **🚨 STOP AND CHECK THE TARGET BRANCH:** * **Base:** `dev` *(Make sure this is set to dev!)*
* **Compare:** `dev-yourname`
* *Ensure the base is NOT set to `main`.*


4. Add a brief title and description of what you built.
5. Click **"Create pull request"**.
6. Have another team member quickly review your code and click **"Merge pull request"**.

Once merged, your code is safely in `dev`! You can now pull the latest `dev` and start your next feature.

```

```