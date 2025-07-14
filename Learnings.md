# 🚀 E2B Sandboxes: Overview & Custom Template Guide

## ✅ 1. What are E2B Sandboxes?

**E2B (Environment to Backend)** sandboxes are cloud-based server environments (VMs or containers) that can be **programmatically controlled using an SDK**. They’re primarily used to:

- 🔐 Run code in a secure and isolated environment
- 💻 Simulate real development environments (e.g., Linux terminals with compilers, tools, etc.)
- 🤖 Enable AI agents or tools to run commands, read/write files, or start servers — without local setup

> 🧠 Think of them as **“cloud dev containers”** that can be spun up and controlled via API.

### 🌐 Common Use Cases
- AI coding agents  
- Developer platforms  
- Cloud IDEs  
- Server-side code execution (dynamic or temporary)

---

## ✅ 2. What are Templates in E2B Sandboxes?

Templates define **what a sandbox contains and how it behaves**. They are essentially pre-configured environments built using a `Dockerfile`.

Templates allow you to:

- ⚙️ Define installed tools, languages, and libraries
- 🛠 Add custom startup scripts
- 📂 Bundle folders/files into the environment
- 🔁 Reuse and share configurations across projects

### 🧩 Example E2B Templates

| Template     | Description                                             |
|--------------|---------------------------------------------------------|
| `base`       | Minimal Ubuntu with bash and root access                |
| `nodejs`     | Ubuntu + Node.js preinstalled                           |
| `python`     | Ubuntu + Python, pip, and virtualenv                    |
| `ai-agent`   | Python + OpenAI SDKs, LangChain, etc. for AI apps       |
| `browser`    | Includes browser tools for headless automation (e.g. Puppeteer) |

---

## ✅ 3. What is a Dockerfile Template in E2B?

Every template in E2B is built from a **Dockerfile** that defines:

- 📦 What software/libraries are preinstalled
- 🔧 What startup scripts should run
- 🗃 Directory structure and working environment

You can either:

- Use **official E2B templates**, or
- Create a **custom template** using your own `Dockerfile` and publish it to E2B.

---

## 🔨 Custom Sandbox Setup Example

You created a custom **E2B sandbox template** that automatically sets up and runs a **Next.js + ShadCN UI app** when the sandbox starts.

### 🔧 `./e2b.Dockerfile`

This file defines how your sandbox is **built**. It:

- Starts from a `node:21-slim` base image
- Installs `curl`
- Uses `npx` to:
  - Scaffold a new Next.js app (v15.3.3)
  - Initialize ShadCN UI with the `neutral` theme
  - Add all ShadCN components
- Moves the final app to `/home/user` for consistency

> 📁 Note: The Next.js app is scaffolded in a temporary folder (`nextjs-app`) and moved to `/home/user` because that directory isn't empty during image build.

---

### 📝 `compile_page.sh`

This script is executed **at runtime** when the sandbox starts. It ensures:

- ✅ The Next.js dev server is started
- ✅ The home (`/`) page is compiled, to avoid cold starts or delays

```bash
# Key parts of compile_page.sh

function ping_server() {
  counter=0
  response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000")
  while [[ ${response} -ne 200 ]]; do
    let counter++
    if (( counter % 20 == 0 )); then
      echo "Waiting for server to start..."
      sleep 0.1
    fi
    response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000")
  done
}

ping_server &
cd /home/user && npx next dev --turbopack
---------------------------------------------------------------------------------
To build and register your custom template with E2B, I used:
e2b template build --name blyzer-nextjs-dev --cmd "/compile_page.sh"

then publish it to the public
e2b template publish --name blyzer-nextjs-dev
e2b template publish -t "templateId"
---------------------------------------------------------------------------------
📦 Think of step.run(name, fn) like this:
It wraps a block of code in a named “step” so Inngest can:
->Log it
->Time it
->Capture errors and outputs
->Show it in the UI/trace/debug views


