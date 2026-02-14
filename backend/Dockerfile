FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Hugging Face default port is 7860
ENV PORT=7860
EXPOSE 7860
CMD ["node", "server.js"]
