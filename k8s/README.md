# Kubernetes — Encuesta El Comité

Guía del despliegue en Kubernetes para este proyecto: qué es, cómo funciona y cómo usarlo paso a paso.

---

## ¿Qué es Kubernetes?

**Kubernetes** (K8s) es un orquestador de contenedores: automatiza dónde corren tus aplicaciones empaquetadas en Docker, las reinicia si fallan y las expone en la red del clúster.

En este proyecto usamos **Minikube**, un clúster Kubernetes local que corre en tu máquina (ideal para desarrollo y entregas académicas).

| Herramienta | Rol |
|-------------|-----|
| **Docker** | Construye las imágenes (`encuestaelcomite-back:k8s`, `encuestaelcomite-client:k8s`) |
| **Minikube** | Crea el clúster K8s local |
| **kubectl** | CLI para aplicar manifiestos y consultar el estado |
| **manifest.yaml** | Describe *qué* debe existir en el clúster (YAML declarativo) |

---

## ¿Cómo funciona?

Kubernetes trabaja con un modelo **declarativo**: tú describes el estado deseado y el clúster se encarga de alcanzarlo.

```
Tú escribes manifest.yaml  →  kubectl apply  →  Kubernetes crea/actualiza recursos
                                                      ↓
                                              Pods corriendo en nodos
                                                      ↓
                                              Services exponen la red
```

### Conceptos clave (aplicados a este proyecto)

| Concepto | Qué es | En Encuesta El Comité |
|----------|--------|------------------------|
| **Namespace** | Carpeta lógica que agrupa recursos | `encuesta` — todo vive aquí |
| **Pod** | Uno o más contenedores que comparten red | Cada Deployment crea pods |
| **Deployment** | Mantiene N réplicas de un pod; reinicia si fallan | `db`, `back`, `client`, `prometheus`, `grafana` |
| **Service** | IP estable y DNS interno para llegar a los pods | `back:3000`, `db:5432`, `client:80` |
| **NodePort** | Expone un servicio en un puerto fijo del nodo | App `:30080`, Grafana `:30300`, Prometheus `:30090` |
| **Secret** | Credenciales (no van en texto plano en el repo en prod.) | `postgres-secret` → `DATABASE_URL` |
| **PVC** | Disco persistente para datos | `postgres-pvc` — datos de PostgreSQL |
| **ConfigMap** | Configuración no sensible | Prometheus scrape, dashboards Grafana |
| **Job** | Tarea que corre una vez y termina | `init-db` — migración y seed de la BD |
| **Probe** | Comprueba si un contenedor está listo o vivo | `/health` en backend, `pg_isready` en Postgres |

### Arquitectura del clúster

```
[Navegador]
     │
     ▼ NodePort 30080
[client / nginx] ──proxy /api/*──► [back / Express :3000]
                                        │
                                        ├── /metrics ──► [Prometheus :30090]
                                        │                      │
                                        ▼                      ▼
                                   [db / PostgreSQL]    [Grafana :30300]
                                   (PVC persistente)    (lee Prometheus)

Job init-db (una vez): migrate + seed ──► db
```

El frontend (nginx) sirve los archivos estáticos de React y reenvía las peticiones `/api/*` al backend dentro del clúster, sin que el navegador hable directamente con Express.

---

## Requisitos previos

Instala una sola vez:

1. [Docker Desktop](https://www.docker.com/products/docker-desktop/) — debe estar **en ejecución**
2. [Minikube](https://minikube.sigs.k8s.io/docs/start/)
3. **kubectl** — suele instalarse con Minikube o Docker Desktop

Verificar:

```bash
docker version
minikube version
kubectl version --client
```

---

## Manifiesto del proyecto

Todo está en un único archivo: **`k8s/manifest.yaml`**

| Componente | Tipo K8s | Imagen | Acceso |
|------------|----------|--------|--------|
| **db** | Deployment + PVC + Service | `postgres:16-alpine` | Interno (`db:5432`) |
| **back** | Deployment + Service | `encuestaelcomite-back:k8s` | Interno (`back:3000`) |
| **client** | Deployment + Service (NodePort) | `encuestaelcomite-client:k8s` | **http://…:30080** |
| **init-db** | Job | `encuestaelcomite-back:k8s` | Se ejecuta una vez |
| **prometheus** | Deployment + Service (NodePort) | `prom/prometheus:v2.54.1` | **http://…:30090** |
| **grafana** | Deployment + Service (NodePort) | `grafana/grafana:11.2.2` | **http://…:30300** |

---

## Despliegue paso a paso

### 1. Iniciar Minikube

```bash
minikube start --driver=docker --cpus=4 --memory=4096
```

Si ya estaba iniciado: `minikube status`

### 2. Apuntar Docker al daemon de Minikube

Las imágenes deben construirse **dentro** del entorno de Minikube para que el clúster las encuentre sin subirlas a un registro.

**Git Bash / Linux / macOS:**

```bash
eval $(minikube docker-env)
```

**Windows PowerShell:**

```powershell
& minikube -p minikube docker-env | Invoke-Expression
```

Comprobar: `docker images` debe listar imágenes del clúster de Minikube.

### 3. Construir imágenes del proyecto

Desde la **raíz del repositorio**:

```bash
docker build -f packages/server/Dockerfile -t encuestaelcomite-back:k8s .
docker build -f packages/client/Dockerfile.k8s -t encuestaelcomite-client:k8s .
```

### 4. Aplicar el manifiesto

**Opción rápida (script):**

```bash
chmod +x k8s/deploy.sh
./k8s/deploy.sh
```

**Opción manual:**

```bash
kubectl apply -f k8s/manifest.yaml

kubectl wait --for=condition=available deployment/db -n encuesta --timeout=180s
kubectl wait --for=condition=available deployment/back -n encuesta --timeout=180s

# Job init-db: debe correr DESPUÉS de db y back
kubectl delete job init-db -n encuesta --ignore-not-found
kubectl apply -f k8s/manifest.yaml
kubectl wait --for=condition=complete job/init-db -n encuesta --timeout=300s
```

> **Orden importante:** PostgreSQL primero → backend → job de migración → frontend y monitoreo (el manifiesto los crea todos, pero el Job necesita que la BD y el backend estén listos).

### 5. Abrir la aplicación

```bash
minikube service client -n encuesta --url
```

Abre la URL que imprime (ej. `http://127.0.0.1:30080`).

**Login de prueba** (tras `init-db`):

| Correo | Rol |
|--------|-----|
| `coord.local@ejemplo.dev` | Coordinador de prueba |
| `carolina.estrada@elcomite.org.co` | Coordinador seed |

---

## Uso diario — comandos útiles

### Ver estado del clúster

```bash
kubectl get pods -n encuesta              # pods y su estado (Running, Pending…)
kubectl get svc -n encuesta               # servicios y puertos
kubectl get all -n encuesta               # resumen completo
kubectl describe pod <nombre-pod> -n encuesta   # detalle de un pod
```

### Logs

```bash
kubectl logs deployment/back -n encuesta
kubectl logs deployment/client -n encuesta
kubectl logs deployment/db -n encuesta
kubectl logs job/init-db -n encuesta
```

### Acceder a servicios

```bash
minikube service client -n encuesta --url
minikube service grafana -n encuesta --url
minikube service prometheus -n encuesta --url
minikube dashboard   # UI web del clúster
```

### Monitoreo (Grafana + Prometheus)

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| **Grafana** | `minikube service grafana -n encuesta --url` | `admin` / `encuesta` |
| **Prometheus** | `minikube service prometheus -n encuesta --url` | — |

En Prometheus: **Status → Targets** → el job `encuesta-backend` debe estar **UP**.

Dashboard precargado en Grafana: **Encuesta El Comité — Resumen** (peticiones/s, errores 5xx, latencia p95, memoria, contadores de BD).

### Actualizar tras cambiar código

```bash
eval $(minikube docker-env)
docker build -f packages/server/Dockerfile -t encuestaelcomite-back:k8s .
docker build -f packages/client/Dockerfile.k8s -t encuestaelcomite-client:k8s .
kubectl rollout restart deployment/back deployment/client -n encuesta
```

### Detener o borrar todo

```bash
kubectl delete -f k8s/manifest.yaml          # borra recursos del manifiesto
kubectl delete namespace encuesta            # borra todo el namespace
minikube stop                                # apaga el clúster
minikube delete                              # elimina el clúster por completo
```

---

## Qué hace `kubectl apply`

| Comando | Efecto |
|---------|--------|
| `kubectl apply -f k8s/manifest.yaml` | Crea o actualiza recursos según el YAML |
| `kubectl delete -f k8s/manifest.yaml` | Elimina los recursos definidos en el archivo |
| `kubectl get …` | Consulta el estado actual |
| `kubectl wait …` | Espera hasta que una condición se cumpla |

Kubernetes compara el manifiesto con lo que ya existe. Si cambias una réplica, una imagen o una variable de entorno y vuelves a aplicar, actualiza solo lo necesario.

---

## Evidencia para entrega

1. Captura de `kubectl get pods -n encuesta` con **db**, **back**, **client**, **prometheus** y **grafana** en `Running`.
2. Captura del navegador en la URL de `minikube service client`.
3. Captura del dashboard de Grafana con métricas visibles.
4. (Opcional) Prometheus → Targets con `encuesta-backend` en verde.

---

## Problemas frecuentes

### Docker no conecta / Minikube no arranca

Docker Desktop debe estar **abierto y en ejecución** antes de `minikube start`.

### `ImagePullBackOff`

Construiste la imagen fuera del Docker de Minikube. Repite:

```bash
eval $(minikube docker-env)
docker build -f packages/server/Dockerfile -t encuestaelcomite-back:k8s .
docker build -f packages/client/Dockerfile.k8s -t encuestaelcomite-client:k8s .
```

### El job `init-db` falla

```bash
kubectl logs job/init-db -n encuesta
kubectl delete job init-db -n encuesta
kubectl apply -f k8s/manifest.yaml
```

### Grafana muestra "No data"

1. Verifica en Prometheus que `encuesta-backend` esté **UP** en `/metrics`.
2. Reconstruye el backend si la imagen es antigua:

```bash
eval $(minikube docker-env)
docker build --no-cache -f packages/server/Dockerfile -t encuestaelcomite-back:k8s .
kubectl rollout restart deployment/back -n encuesta
```

3. Genera tráfico en la app (login, listar encuestas) y espera ~30 s.

### Puerto 30080 ocupado

Edita `nodePort` en la sección `Service` `client` dentro de `k8s/manifest.yaml` (rango 30000–32767) y vuelve a aplicar.

---

## Kubernetes vs Docker Compose

| | Docker Compose | Kubernetes (este proyecto) |
|--|----------------|----------------------------|
| **Uso** | Desarrollo local rápido | Orquestación, entrega académica, escalado |
| **Comando** | `docker compose up` | `kubectl apply -f k8s/manifest.yaml` |
| **Red** | Red bridge de Docker | Services + DNS interno del clúster |
| **Escalado** | Manual (`scale` limitado) | Réplicas en Deployment |
| **Persistencia** | Volúmenes Docker | PersistentVolumeClaim |

Para el día a día en desarrollo, `docker compose up` sigue siendo la opción más simple (ver README principal). Kubernetes demuestra despliegue en clúster con frontend, backend, BD y monitoreo.

---

## Referencia rápida

```bash
# Desplegar
./k8s/deploy.sh

# Estado
kubectl get pods,svc -n encuesta

# App
minikube service client -n encuesta --url

# Monitoreo
minikube service grafana -n encuesta --url    # admin / encuesta
minikube service prometheus -n encuesta --url
```
