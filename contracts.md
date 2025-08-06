# API Contracts - Renace Mi Edad Dorada

## Resumen del Proyecto
Desarrollo del backend para la página web de la ONG "Renace Mi Edad Dorada" que gestiona actividades para adultos mayores en la Comuna 17 de Bucaramanga.

## Datos Mock Actuales en Frontend
1. **Actividades Semanales** - `weeklyActivities` en mock.js
2. **Videos de Noticias** - `newsVideos` en mock.js  
3. **Formulario de Contacto** - Simulación con toast notification

## Endpoints de Backend a Implementar

### 1. Gestión de Actividades Semanales

#### GET /api/activities
**Propósito:** Obtener todas las actividades semanales
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "activity_id",
      "week": 1,
      "title": "Manualidades Creativas",
      "description": "Taller de manualidades...",
      "images": ["url1", "url2"],
      "createdAt": "2024-01-15T10:30:00Z",
      "isActive": true
    }
  ]
}
```

#### POST /api/activities
**Propósito:** Crear nueva actividad
**Request Body:**
```json
{
  "week": 1,
  "title": "Nueva Actividad",
  "description": "Descripción",
  "images": ["url1", "url2"]
}
```

#### PUT /api/activities/:id
**Propósito:** Actualizar actividad existente

#### DELETE /api/activities/:id
**Propósito:** Eliminar actividad

### 2. Gestión de Videos/Noticias

#### GET /api/news-videos
**Propósito:** Obtener videos de noticias semanales
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "video_id",
      "title": "Actividades de la semana",
      "videoId": "youtube_video_id",
      "thumbnail": "thumbnail_url",
      "week": "2024-W03",
      "createdAt": "2024-01-15T10:30:00Z",
      "isActive": true
    }
  ]
}
```

#### POST /api/news-videos
**Propósito:** Agregar nuevo video

#### PUT /api/news-videos/:id
**Propósito:** Actualizar video

#### DELETE /api/news-videos/:id
**Propósito:** Eliminar video

### 3. Sistema de Contacto

#### POST /api/contact
**Propósito:** Enviar mensaje de contacto
**Request Body:**
```json
{
  "name": "María González",
  "email": "maria@example.com", 
  "subject": "Información sobre actividades",
  "message": "Me gustaría conocer más..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mensaje enviado exitosamente",
  "data": {
    "_id": "contact_id",
    "name": "María González",
    "email": "maria@example.com",
    "subject": "Información sobre actividades",
    "message": "Me gustaría conocer más...",
    "createdAt": "2024-01-15T10:30:00Z",
    "status": "pending"
  }
}
```

#### GET /api/contact-messages
**Propósito:** Obtener mensajes de contacto (admin)

## Modelos de Base de Datos

### Activity Model
```javascript
{
  week: Number (1-5),
  title: String,
  description: String,
  images: [String], // URLs de imágenes
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### NewsVideo Model
```javascript
{
  title: String,
  videoId: String, // YouTube video ID
  thumbnail: String, // YouTube thumbnail URL
  week: String, // Format: 2024-W03
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### ContactMessage Model
```javascript
{
  name: String,
  email: String,
  subject: String,
  message: String,
  status: String, // 'pending', 'replied', 'archived'
  createdAt: Date,
  updatedAt: Date
}
```

## Integración Frontend-Backend

### Archivos a Modificar:
1. **Eliminar**: `/app/frontend/src/mock.js` - Remover datos mock
2. **Modificar**: 
   - `ActivitiesSection.jsx` - Fetch desde API
   - `NewsSection.jsx` - Fetch desde API  
   - `ContactSection.jsx` - POST a API
3. **Crear**: `/app/frontend/src/api/` - Funciones de API calls

### API Service Functions:
```javascript
// api/activities.js
export const fetchActivities = async () => {
  const response = await axios.get(`${API}/activities`);
  return response.data;
};

// api/newsVideos.js  
export const fetchNewsVideos = async () => {
  const response = await axios.get(`${API}/news-videos`);
  return response.data;
};

// api/contact.js
export const submitContactForm = async (formData) => {
  const response = await axios.post(`${API}/contact`, formData);
  return response.data;
};
```

## Funcionalidades Adicionales
1. **Validación de datos** en backend
2. **Manejo de errores** robusto
3. **Logging** de actividades importantes
4. **Paginación** para mensajes de contacto (si es necesario)
5. **Rate limiting** para endpoints públicos

## Estado de Implementación
- [x] Frontend con mock data funcional
- [ ] Backend API endpoints
- [ ] Integración frontend-backend
- [ ] Testing de funcionalidades
- [ ] Deployment ready

## Notas
- Los datos mock actuales servirán como seed data inicial
- Mantener compatibilidad con la estructura actual del frontend
- Asegurar que todas las URLs de redes sociales y contacto reales permanezcan funcionales