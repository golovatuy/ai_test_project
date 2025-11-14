# Plan: How to Build an App Project Using AI Tools (Step-by-Step Guide)


## 1. Define the Project with AI

**Goal:** Turn a raw idea into a clear specification.

### What to do
1. Describe the idea in simple language.
2. Ask AI to:
   - refine requirements  
   - propose use cases  
   - write user stories  
   - identify missing parts  

### Example Prompt
```
You are senior software engineer, build a [web/mobile] app that does X for Y users.
Help me:
	1.	List core features (MVP + future)
	2.	Write 5–10 user stories
	3.	Identify edge cases and success metrics
Put your answers into separate files: `docs/vision.md`, `docs/user-stories.md`, `docs/requirements.md`.
```
### Output Files
- `docs/vision.md`
- `docs/user-stories.md`
- `docs/requirements.md`


## 2. Choose Tech Stack and Architecture With AI

**Goal:** Create a justified stack and an architecture you can follow.

### Ask AI to
- Propose stack based on your experience  
- Compare 2–3 alternatives  
- Create high-level architecture diagrams and module breakdowns  

### Example Prompt
```
I’m comfortable with [React/Node/etc].
I’m building [project summary].
	1.	Suggest full stack (frontend, backend, DB, auth)
	2.	Explain pros/cons
	3.	Draw high-level architecture
Put your answers into separate files: `docs/architecture.md`, `docs/stack-decisions.md`.
```

### Output Files
- `docs/architecture.md`
- `docs/stack-decisions.md`


## 3. Design Data Models & API Contracts

**Goal:** Lock down the “shape” of the system before coding.

### Ask AI to
- Create DB schema (tables/collections)
- Propose REST or GraphQL endpoints
- Provide request/response examples

### Example Prompt
```
Based on these user stories (paste):
	1.	Create DB schema
	2.	Define endpoints or GraphQL schema
	3.	Provide example payloads
Put your answers into separate files: `docs/domain-model.md`, `docs/api-contracts.md`.
```
### Output Files
- `docs/domain-model.md`
- `docs/api-contracts.md`


## 4. Generate Project Scaffold & Folder Structure

**Goal:** Bootstrap your repo quickly and cleanly.

### Ask AI to
- Design folder structure  
- Generate initialization commands  
- Suggest ESLint/Prettier/TS/Jest/Vitest configs  

### Example Prompt

```
I’m using [Next.js/Nest.js/React Native/etc].
Create a clean project structure for an app with these features: […]
Provide:
	•	Folder tree
	•	Initialization commands
	•	Basic config files
Put your answers into separate file: `docs/project-setup.md`.
```

### Output Files
- `docs/project-setup.md`
- Full project scaffold in Git


## 5. Design Screens & Components With AI

**Goal:** Convert user stories → screens → UI components.

### Ask AI to
- Map stories to screens  
- Explain UI flow  
- Provide simple wireframe descriptions  
- Suggest reusable components  

### Example Prompt
```
From these user stories:
	1.	List all screens
	2.	Describe UI for each
	3.	Suggest reusable components
	4.	Build component folder structure
```


## 6. Iterative Feature Development Using AI

**Goal:** Build features step-by-step with AI as your pair programmer.

### Workflow
1. Define a single feature  
2. Show AI relevant code or patterns  
3. Ask for one step at a time  
4. Integrate → test → continue

### Example Prompt
```
I’m building a [React/Nest/etc] app.
Here’s my style and example code (paste small snippet).
I need to implement [feature].
Provide:
	1.	Steps to implement
	2.	Code for step 1 only
	3.	Instructions for integration
```


## 7.  Testing & Quality Using AI

### Ask AI to
- Generate unit tests  
- Suggest edge cases  
- Improve test coverage  
- Review your code for potential bugs  

### Example Prompt
```
Here is my code (paste).
	1.	List edge cases
	2.	Write unit tests using [Jest/Vitest/RTL]
	3.	Suggest improvements
```


## 8. DevOps, Deployment & CI/CD With AI

### Ask AI to
- Propose deployment architecture  
- Write Dockerfiles  
- Build GitHub Actions/GitLab pipelines  
- Help debug deployment issues  

### Example Prompt
```
I’m deploying a [Next.js/Nest.js/etc] app using [platform].
Provide:
	1.	Deployment architecture
	2.	Dockerfile
	3.	CI/CD pipeline config
```
