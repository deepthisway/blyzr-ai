FROM node:21-slim

# curl is required for the script to ping the server.
RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*


COPY compile_page.sh /compile_page.sh
RUN chmod +x /compile_page.sh

# Install dependencies and customize sandbox
WORKDIR /home/user/nextjs-app

RUN npx --yes create-next-app@15.3.3 . --yes    
# --yes flag is used to skip prompts like "Would you like to use TypeScript?" and "Would you like to use ESLint?"
RUN npx --yes shadcn@2.6.3 init --yes -b neutral --force
RUN npx --yes shadcn@2.6.3 add --all --yes

# Move the Nextjs app to the home directory and remove the nextjs-app directory
RUN mv /home/user/nextjs-app/* /home/user/ && rm -rf /home/user/nextjs-app
# we created and move and not directly created at home beacuse Next js needs an empty dir to initialize
# and home user is never empty in the beginning 
# to created at a diff place and moved here