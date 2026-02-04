# Encuesta El Comité

Aplicación full-stack: frontend React (Vite) y backend Express con PostgreSQL (NeonDB).

## Requisitos (Ubuntu / Linux)

- **Node.js** 18 o superior (recomendado 20 LTS)
- **npm** (viene con Node.js)
- No hace falta instalar PostgreSQL en local: la app usa NeonDB en la nube.

### Instalar Node.js en Ubuntu

```bash
# Opción 1: NodeSource (recomendado, última LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Opción 2: desde los repos de Ubuntu
sudo apt update
sudo apt install nodejs npm
```

Comprueba la versión:

```bash
node -v   # debe ser v18 o superior
npm -v
```

---

## Cómo ejecutar el proyecto en Linux

### 1. Entrar en la carpeta del proyecto

```bash
cd /home/krampus/Documentos/CodigosGit/EncuestaElComite/ENCUESTAELCOMITE
```

(O la ruta donde tengas clonado el repo.)

### 2. Instalar dependencias

```bash
npm install
```

### 3. Variables de entorno (opcional)

El servidor usa el archivo `server/.env`. Si no existe, créalo con:

```bash
# En server/.env (opcional si ya usas la BD por defecto)
PORT=3000
NEONDB_CONNECTION_STRING=postgresql://usuario:contraseña@tu-host.neon.tech/tu-db?sslmode=require
NODE_ENV=development
```

Si no defines `NEONDB_CONNECTION_STRING`, se usará la cadena por defecto en `server/db/connection.js`.

### 4. Arrancar la aplicación

**Opción A – Todo junto (recomendado en desarrollo)**

```bash
npm run dev
```

Esto levanta:

- **Frontend (Vite):** http://localhost:5173  
- **Backend (Express):** http://localhost:3000  

**Opción B – Por separado (dos terminales)**

Terminal 1 – servidor:

```bash
npm run dev:server
```

Terminal 2 – cliente:

```bash
npm run dev:client
```

### 5. Usar la aplicación

- Abre el navegador en: **http://localhost:5173**

---

## Scripts disponibles

| Comando            | Descripción                          |
|--------------------|--------------------------------------|
| `npm run dev`      | Cliente + servidor en modo desarrollo |
| `npm run dev:client`| Solo frontend (Vite)                 |
| `npm run dev:server`| Solo backend (nodemon)                |
| `npm run start:server` | Solo backend (node, sin recarga)  |
| `npm run build:client` | Build de producción del frontend   |
| `npm run preview:client` | Vista previa del build           |

---

## Resumen rápido (copiar y pegar)

```bash
cd /home/krampus/Documentos/CodigosGit/EncuestaElComite/ENCUESTAELCOMITE
npm install
npm run dev
```

Luego abre **http://localhost:5173** en el navegador.

---

## Si un puerto está en uso

- **Puerto 3000 (servidor):** Pon en `server/.env` otro puerto, por ejemplo `PORT=3001`. Si cambias el puerto del API, el frontend sigue usando `http://localhost:3000` por defecto; tendrías que ajustar las URLs en el cliente o usar el mismo puerto.
- **Puerto 5173 (Vite):** Vite probará el siguiente libre (5174, 5175…) y lo mostrará en la terminal.
