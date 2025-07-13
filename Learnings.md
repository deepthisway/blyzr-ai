✅ 1. What are E2B Sandboxes?
E2B (Environment to Backend) sandboxes are server environments (VMs or containers) that can be programmatically controlled using an SDK. They’re most commonly used to:

Run code in a secure and isolated environment

Simulate a real development environment (like Linux terminals, with access to compilers, tools, etc.)

Let AI agents or tools run commands, read/write files, or even run servers in the cloud without local setup

🧠 Think of them as “cloud dev containers” that can be spun up and controlled via API.

They're used in applications like AI coding agents, developer portals, cloud IDEs, or dynamic server-side tasks.

✅ 2. What are Templates in E2B Sandboxes?
A template defines what a sandbox contains and how it behaves. It’s essentially a pre-configured environment built with a Dockerfile.

Templates allow you to:

Define what tools/languages/libraries are installed

Control startup scripts

Bundle files or folder structures

Share reusable environments (like "Node.js template", "Python + OpenCV template", etc.)

🧩 Examples of E2B Templates:

base – Minimal Ubuntu with bash and root access

nodejs – Ubuntu + Node.js preinstalled

python – Ubuntu + Python (with pip, virtualenv, etc.)

ai-agent – Includes Python, OpenAI SDKs, LangChain, etc. for AI use cases

browser – Sandboxes with a browser for headless automation (e.g., Puppeteer)

✅ 3. What is a Dockerfile template in E2B?
Each template is built from a Dockerfile, which defines what the environment should look like. You can:

Use official E2B templates

Or create a custom template using your own Dockerfile and publish it to use with E2B