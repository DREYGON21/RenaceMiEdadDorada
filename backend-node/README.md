# Backend Node.js - Renace Mi Edad Dorada

Backend desarrollado en **Node.js con Express y TypeScript** para la ONG "Renace Mi Edad Dorada" que gestiona actividades para adultos mayores en la Comuna 17 de Bucaramanga.

## 🚀 Características

- **Framework**: Express.js con TypeScript
- **Base de datos**: MongoDB con Mongoose
- **Validación**: express-validator
- **Seguridad**: Helmet, CORS
- **Logging**: Morgan
- **Arquitectura**: RESTful API

## 📁 Estructura del Proyecto

```
backend-node/
├── src/
│   ├── config/          # Configuraciones (DB, env)
│   ├── middleware/      # Middlewares (errores, validación)
│   ├── models/          # Modelos de MongoDB (Mongoose)
│   ├── routes/          # Rutas de la API
│   ├── types/           # Tipos TypeScript
│   └── server.ts        # Servidor principal
├── dist/                # Archivos compilados
├── package.json         # Dependencias y scripts
└── tsconfig.json        # Configuración TypeScript
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js >= 18.0.0
- MongoDB corriendo en localhost:27017
- Yarn (recomendado) o npm

### Pasos de instalación

1. **Instalar dependencias**:
   ```bash
   cd backend-node
   yarn install
   ```

2. **Configurar variables de entorno** (archivo `.env`):
   ```env
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=test_database
   PORT=8001
   NODE_ENV=development
   CORS_ORIGIN=*
   ```

3. **Compilar TypeScript**:
   ```bash
   yarn build
   ```

4. **Iniciar servidor**:
   ```bash
   # Desarrollo (con hot reload)
   yarn dev
   
   # Producción
   yarn start
   ```

## 📊 API Endpoints

### Base
- `GET /` - Información del servidor
- `GET /health` - Health check
- `GET /api/` - Información de la API

### Actividades (`/api/activities`)
- `GET /api/activities` - Obtener todas las actividades activas
- `POST /api/activities` - Crear nueva actividad
- `PUT /api/activities/:id` - Actualizar actividad
- `DELETE /api/activities/:id` - Eliminar actividad (soft delete)

#### Estructura de datos - Activity
```json
{
  "week": 1,                    // Número de semana (1-5)
  "title": "Título",           // Título (1-200 caracteres)
  "description": "Descripción", // Descripción (1-1000 caracteres)
  "images": ["url1", "url2"]   // Array de URLs de imágenes (opcional)
}
```

### Videos/Noticias (`/api/news-videos`)
- `GET /api/news-videos` - Obtener todos los videos activos
- `POST /api/news-videos` - Crear nuevo video
- `PUT /api/news-videos/:id` - Actualizar video
- `DELETE /api/news-videos/:id` - Eliminar video (soft delete)

#### Estructura de datos - NewsVideo
```json
{
  "title": "Título del video",           // Título (1-200 caracteres)
  "video_id": "dQw4w9WgXcQ",            // ID de YouTube (11 caracteres)
  "thumbnail": "https://...",            // URL del thumbnail
  "week": "2024-W03"                     // Formato: YYYY-WNN
}
```

### Contacto (`/api/contact`)
- `POST /api/contact` - Enviar mensaje de contacto
- `GET /api/contact/messages` - Obtener mensajes (admin)
- `GET /api/contact/messages/:id` - Obtener mensaje específico
- `PUT /api/contact/messages/:id` - Actualizar estado del mensaje

#### Estructura de datos - ContactMessage
```json
{
  "name": "Nombre",                    // Nombre (1-200 caracteres)
  "email": "correo@ejemplo.com",       // Email válido
  "subject": "Asunto",                 // Asunto (1-300 caracteres)
  "message": "Mensaje completo"        // Mensaje (1-2000 caracteres)
}
```

## 🔧 Scripts Disponibles

- `yarn dev` - Desarrollo con nodemon y hot reload
- `yarn build` - Compilar TypeScript a JavaScript
- `yarn start` - Iniciar servidor en producción
- `yarn start:dev` - Desarrollo con ts-node

## 📝 Formato de Respuestas API

Todas las respuestas siguen el formato consistente:

```json
{
  "success": true,                    // Indica si la operación fue exitosa
  "data": {...},                      // Datos de la respuesta
  "message": "Mensaje descriptivo"    // Mensaje para el usuario
}
```

En caso de error:
```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalles técnicos del error"
}
```

## 🔒 Validaciones Implementadas

### Actividades
- `week`: Entero entre 1 y 5
- `title`: String entre 1 y 200 caracteres
- `description`: String entre 1 y 1000 caracteres
- `images`: Array opcional de URLs válidas
- Prevención de actividades duplicadas por semana

### Videos
- `video_id`: Exactamente 11 caracteres (formato YouTube)
- `thumbnail`: URL válida
- `week`: Formato YYYY-WNN (ej: 2024-W03)
- `title`: String entre 1 y 200 caracteres

### Contacto
- `email`: Formato de email válido
- `name`: String entre 1 y 200 caracteres
- `subject`: String entre 1 y 300 caracteres
- `message`: String entre 1 y 2000 caracteres

## 🛡️ Características de Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Control de acceso desde otros dominios
- **Validación**: Validación robusta de entrada de datos
- **Rate limiting**: Listo para implementar
- **Soft delete**: Eliminación lógica de registros

## 📋 Logging y Monitoreo

- **Morgan**: Logging HTTP automático
- **Console logging**: Logs estructurados de aplicación
- **Error tracking**: Manejo centralizado de errores
- **Health check**: Endpoint para monitoreo

## 🔄 Migración desde Python/FastAPI

Este backend reemplaza completamente el backend original en Python/FastAPI manteniendo:
- ✅ **API compatibility**: Mismos endpoints y estructura de datos
- ✅ **Database compatibility**: Misma base de datos MongoDB
- ✅ **Response format**: Mismo formato de respuestas JSON
- ✅ **Validation rules**: Mismas reglas de validación
- ✅ **UUID support**: IDs compatibles con el frontend existente

## 🚦 Configuración del Servidor

El servidor está configurado para:
- **Host**: `0.0.0.0` (acepta conexiones de cualquier IP)
- **Puerto**: `8001` (configurable via `PORT` env var)
- **CORS**: Habilitado para todos los orígenes (`*`)
- **JSON limit**: 10MB para uploads
- **Graceful shutdown**: Manejo correcto de señales SIGTERM/SIGINT

## 📞 Soporte y Contacto

Para soporte técnico o preguntas sobre el backend, contacte al equipo de desarrollo.

---

*Desarrollado con ❤️ para la ONG "Renace Mi Edad Dorada"*