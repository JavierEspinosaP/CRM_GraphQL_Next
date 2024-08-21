# Usamos la imagen de Node.js oficial como base
FROM node:18

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos el package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código de la aplicación
COPY . .

# Exponemos el puerto en el que el servidor está corriendo
EXPOSE 4000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
