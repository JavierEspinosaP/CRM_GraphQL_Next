# Usamos la imagen de Node.js oficial como base
FROM node:18

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos el package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Deshabilitar eslint para la creacion de la imagen
ENV ESLINT_NO_DEV_ERRORS=true

# Copiamos el resto del código de la aplicación
COPY . .

# Compilamos la aplicación
RUN npm run build

# Exponemos el puerto en el que la aplicación se servirá
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
