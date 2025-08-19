#!/bin/bash

# Script para iniciar el backend de Node.js para Renace Mi Edad Dorada
# Author: Assistant AI
# Date: $(date)

echo "🚀 Iniciando backend de Node.js para Renace Mi Edad Dorada..."

# Verificar si el directorio existe
if [ ! -d "/app/backend-node" ]; then
    echo "❌ Error: Directorio /app/backend-node no encontrado"
    exit 1
fi

# Cambiar al directorio del backend
cd /app/backend-node

# Verificar si las dependencias están instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    yarn install
fi

# Compilar TypeScript si no existe el directorio dist
if [ ! -d "dist" ]; then
    echo "🔨 Compilando TypeScript..."
    yarn build
fi

# Detener cualquier proceso previo en el puerto 8001
echo "🔄 Deteniendo procesos previos en puerto 8001..."
sudo supervisorctl stop backend 2>/dev/null || true
pkill -f "node dist/server.js" 2>/dev/null || true
lsof -ti:8001 | xargs kill -9 2>/dev/null || true

# Esperar un momento para que se libere el puerto
sleep 2

# Iniciar el servidor
echo "▶️  Iniciando servidor Node.js..."
npm start

echo "✅ Backend de Node.js iniciado correctamente en puerto 8001"
echo "🌐 API disponible en: http://localhost:8001/api"
echo "❤️  Health check en: http://localhost:8001/health"