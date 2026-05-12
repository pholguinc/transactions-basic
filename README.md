# Transactions Microservice - AWS Serverless Architecture

Este proyecto implementa un microservicio de transacciones robusto, desacoplado y listo para ser desplegado en la nube.

## Documentación de la API

### Autenticación

#### 1. Registro de Usuario
`POST /api/v1/auth/register`
```json
{
  "email": "usuario@ejemplo.com",
  "password": "Password123!",
  "name": "Juan Perez"
}
```

#### 2. Login
`POST /api/v1/auth/login`
```json
{
  "email": "usuario@ejemplo.com",
  "password": "Password123!"
}
```
*Respuesta: Devuelve un `access_token` que debe usarse como Bearer Token en las rutas protegidas.*

---

### Transacciones (Requieren Auth)

#### 1. Registrar Transacción
`POST /api/v1/transactions`
```json
{
  "amount": 150.50,
  "description": "Compra de insumos",
  "userId": "uuid-del-usuario"
}
```

#### 2. Actualizar Estado (Manual)
`PATCH /api/v1/transactions/{id}/status`
```json
{
  "status": "APPROVED" 
}
```
*Estados permitidos: `PROCESSING`, `APPROVED`, `REJECTED`.*

---

## Arquitectura AWS Recomendada (Serverless)

Para desplegar esta solución de forma serverless, escalable y segura en AWS, se recomienda la siguiente arquitectura:

### Diagrama Conceptual
```text
[ Cliente ] 
    |
    v
[ API Gateway ] (Endpoint Público con Auth)
    |
    v
[ AWS Lambda ] (Función de Registro / Auth)
    |
    +------> [ DynamoDB ] (Persistencia de Transacciones/Usuarios)
    |
    +------> [ AWS SQS ] (Cola de Mensajes para Procesamiento Asíncrono)
               |
               v
         [ AWS Lambda ] (Worker de Procesamiento de Fraude)
               |
               +------> [ AWS S3 ] (Almacenamiento de Recibos JSON)
               |
               +------> [ AWS SES ] (Notificación opcional por Email)
```

### Componentes y Justificación:

1.  **API Gateway**: Para el control de solicitudes y la conexión con Cognito o un Autorizador Lambda para comprobar los tokens JWT generados en este proyecto.
2.  **AWS Lambda**: Realiza la lógica de negocio de manera temporaria. Al ser sin servidor, se ajusta automáticamente a la demanda y el costo se basa únicamente en el tiempo que se utiliza.
3.  **Amazon SQS**: Cuando se lleva a cabo una transacción, el primer Lambda envía un mensaje a la cola SQS. De este modo, el cliente recibe ya su respuesta 201 Created sin interrupciones.
4.  **Amazon DynamoDB**: Una base de datos NoSQL de baja latencia ideal para manejar un alto volumen de transacciones, permitiendo una escalabilidad casi ilimitada sin la necesidad de administrar servidores.
5.  **Amazon S3**: Con la interfaz IStorageProvider aplicada en el código, cambiar de almacenamiento local a S3 solo requiere crear un nuevo adaptador.
6.  **Secrets Manager**: Aquí se guardarían las credenciales sensibles y serían inyectadas en las Lambdas a través de roles IAM, eliminando la necesidad de usar variables de entorno en texto visible.

## Gestión de Credenciales Seguras

Para guardar las credenciales de base de datos o secretos de JWT:
*   **AWS Secrets Manager**: Para la rotación de contraseñas automáticamente y tiene integración nativa con el SDK de AWS para que las Lambdas recuperen los valores en tiempo de ejecución.
## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en la siguiente configuración:

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `NODE_ENV` | Entorno de ejecución | `development` / `production` |
| `PORT` | Puerto del servidor | `3007` |
| `DB_HOST` | Host de la base de datos | `localhost` / `db` |
| `DB_PORT` | Puerto de la base de datos | `5432` |
| `DB_USER` | Usuario de PostgreSQL | `postgres` |
| `DB_PASSWORD` | Contraseña de PostgreSQL | `tu_password` |
| `DB_NAME` | Nombre de la base de datos | `transactions_db` |
| `JWT_SECRET` | Clave secreta para firmar tokens | `un_secreto_muy_seguro` |

---

## Ejecución con Docker

El proyecto está configurado para ejecutarse fácilmente con Docker.

### 1. Desarrollo (con Hot Reload)
Usa este comando para levantar la base de datos y la aplicación en modo desarrollo. Los cambios que hagas en el código se reflejarán automáticamente.
```bash
docker-compose up --build
```

### 2. Producción
Si deseas simular el entorno de producción usando Docker Compose:
```bash
# Levantar en segundo plano
docker-compose up -d --build

# Ver logs
docker-compose logs -f
```

---

## Ejecución Local (sin Docker)

1. Instalar dependencias:
   ```bash
   bun install
   ```
2. Iniciar en modo desarrollo:
   ```bash
   bun run dev
   ```