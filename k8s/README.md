# Despliegue en Minikube (frontend + backend + db)

Guía para la entrega del proyecto con **tres componentes** en Kubernetes:

| Componente | Recurso K8s | Imagen |
|------------|-------------|--------|
| **db** | Deployment `db` + PVC | `postgres:16-alpine` |
| **backend** | Deployment `back` | `encuestaelcomite-back:k8s` |
| **frontend** | Deployment `client` | `encuestaelcomite-client:k8s` (nginx) |
| **Prometheus** | Deployment `prometheus` | `prom/prometheus` (recolecta métricas) |
| **Grafana** | Deployment `grafana` | `grafana/grafana` (visualiza métricas) |

El frontend expone **NodePort 30080** y nginx reenvía `/api` al backend dentro del clúster.

**Prometheus vs Grafana:** Prometheus **guarda y consulta** las métricas numéricas. Grafana **muestra gráficos** leyendo datos desde Prometheus (no sustituye a Prometheus).

---

## Requisitos previos (instalar una sola vez)

1. **Docker Desktop** (con Kubernetes opcional desactivado si solo usas Minikube).
2. **Minikube**: https://minikube.sigs.k8s.io/docs/start/
3. **kubectl**: suele venir con Docker Desktop o Minikube.
4. En Windows, usa **Git Bash** o PowerShell para los comandos.

Verificar:

```bash
minikube version
kubectl version --client
docker version
```

---

## Paso 1 — Iniciar Minikube

```bash
minikube start --driver=docker --cpus=4 --memory=4096
```

Si ya estaba iniciado:

```bash
minikube status
```

---

## Paso 2 — Apuntar Docker al daemon de Minikube

Las imágenes deben construirse **dentro** del entorno de Minikube:

```bash
eval $(minikube docker-env)
```

En **PowerShell**:

```powershell
& minikube -p minikube docker-env | Invoke-Expression
```

Comprueba que funciona:

```bash
docker images | head
```

---

## Paso 3 — Construir las imágenes del proyecto

Desde la **raíz del repositorio**:

```bash
cd "C:/Users/samue/Documents/Proyectos programacion/EncuestaElComite"

docker build -f packages/server/Dockerfile -t encuestaelcomite-back:k8s .
docker build -f packages/client/Dockerfile.k8s -t encuestaelcomite-client:k8s .
```

---

## Paso 4 — Desplegar en Kubernetes

### Opción rápida (script)

```bash
chmod +x k8s/deploy.sh
./k8s/deploy.sh
```

### Opción manual (paso a paso)

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/postgres-secret.yaml
kubectl apply -f k8s/postgres-pvc.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/postgres-service.yaml

kubectl wait --for=condition=available deployment/db -n encuesta --timeout=180s

kubectl apply -f k8s/back-deployment.yaml
kubectl apply -f k8s/back-service.yaml
kubectl wait --for=condition=available deployment/back -n encuesta --timeout=180s

kubectl apply -f k8s/job-init-db.yaml
kubectl wait --for=condition=complete job/init-db -n encuesta --timeout=300s

kubectl apply -f k8s/client-deployment.yaml
kubectl apply -f k8s/client-service.yaml
kubectl wait --for=condition=available deployment/client -n encuesta --timeout=180s

kubectl apply -f k8s/monitoring/
kubectl wait --for=condition=available deployment/prometheus deployment/grafana -n encuesta --timeout=180s

---

## Paso 5 — Verificar que todo está corriendo

```bash
kubectl get pods -n encuesta
```

Debes ver algo como:

```
NAME                      READY   STATUS      RESTARTS   AGE
back-xxxxx                1/1     Running     0          ...
client-xxxxx              1/1     Running     0          ...
db-xxxxx                  1/1     Running     0          ...
prometheus-xxxxx          1/1     Running     0          ...
grafana-xxxxx             1/1     Running     0          ...
init-db-xxxxx             0/1     Completed   0          ...
```

```bash
kubectl get svc -n encuesta
```

---

## Paso 6 — Abrir la aplicación

```bash
minikube service client -n encuesta --url
```

Abre la URL que imprime (por ejemplo `http://127.0.0.1:30080`).

**Login de prueba** (tras el job `init-db`):

| Correo | Uso |
|--------|-----|
| `coord.local@ejemplo.dev` | Coordinador de prueba |
| `carolina.estrada@elcomite.org.co` | Coordinador seed |

---

## Paso 7 — Monitoreo (Prometheus + Grafana)

Tras el despliegue de la app, el script aplica `k8s/monitoring/`. También puedes hacerlo manual:

```bash
kubectl apply -f k8s/monitoring/
kubectl wait --for=condition=available deployment/prometheus deployment/grafana -n encuesta --timeout=180s
```

### Prometheus (datos / consultas)

```bash
minikube service prometheus -n encuesta --url
```

- Puerto NodePort: **30090**
- En la UI: **Status → Targets** → el job `encuesta-backend` debe estar **UP**
- Consulta de ejemplo: `encuesta_http_requests_total`

El backend expone métricas en `GET /metrics` (ruta interna `http://back:3000/metrics`).

### Grafana (gráficos)

```bash
minikube service grafana -n encuesta --url
```

- Puerto NodePort: **30300**
- Usuario: `admin`
- Contraseña: `encuesta`
- Dashboard precargado: **Encuesta El Comité — Resumen**

Paneles incluidos:

- Peticiones por segundo y errores 5xx
- Latencia p95 del API
- Memoria del backend
- Contadores de encuestas, usuarios y coordinadores en BD
- Top de rutas más usadas

Genera tráfico usando la app (login, listar encuestas) y verás cambios en Grafana tras ~15–30 s.

---

## Paso 8 — Qué mostrar en la entrega (evidencia)

1. Captura de `kubectl get pods -n encuesta` con **db**, **back**, **client**, **prometheus** y **grafana** en `Running`.
2. Captura del navegador en la URL del `minikube service` (app).
3. Captura del dashboard de Grafana con métricas visibles.
4. (Opcional) Prometheus → Targets con `encuesta-backend` en verde.

Comandos útiles:

```bash
kubectl logs deployment/back -n encuesta
kubectl logs deployment/client -n encuesta
kubectl logs deployment/db -n encuesta
minikube dashboard   # UI visual del clúster
```

---

## Actualizar después de cambiar código

```bash
eval $(minikube docker-env)
docker build -f packages/server/Dockerfile -t encuestaelcomite-back:k8s .
docker build -f packages/client/Dockerfile.k8s -t encuestaelcomite-client:k8s .
kubectl rollout restart deployment/back deployment/client -n encuesta
# Si cambiaste solo manifiestos de monitoreo:
kubectl apply -f k8s/monitoring/
kubectl rollout restart deployment/prometheus deployment/grafana -n encuesta
```

---

## Problemas frecuentes

### Grafana muestra "No data" en todos los paneles

1. En Prometheus (`minikube service prometheus -n encuesta --url`) ve a **Status → Targets**.
2. Si `encuesta-backend` está **DOWN** con error **404** en `/metrics`, el backend corre una **imagen vieja** (sin métricas). Reconstruye y reinicia:

```bash
eval $(minikube docker-env)
docker build --no-cache -f packages/server/Dockerfile -t encuestaelcomite-back:k8s .
kubectl rollout restart deployment/back -n encuesta
```

3. Espera ~30 s, recarga Grafana (rango **Last 15 minutes**).
4. Genera tráfico en la app (login, listar encuestas) para ver gráficos de peticiones.

### `ImagePullBackOff`

Construiste la imagen fuera del Docker de Minikube. Repite el **Paso 2** y vuelve a construir.

### El job `init-db` falla

```bash
kubectl logs job/init-db -n encuesta
kubectl delete job init-db -n encuesta
kubectl apply -f k8s/job-init-db.yaml
```

### Puerto 30080 ocupado

Edita `nodePort` en `k8s/client-service.yaml` (rango 30000–32767) y vuelve a aplicar.

### Borrar todo y empezar de cero

```bash
kubectl delete namespace encuesta
minikube delete
minikube start
```

---

## Arquitectura (resumen)

```
[Navegador] --> NodePort 30080 --> [client/nginx]
                                      |
                                      +--> /api/* --> Service back:3000 --> [Express] --/metrics--> [Prometheus]
                                                                                |                        |
                                                                                v                        v
                                                                          Service db:5432          [Grafana :30300]
                                                                          [PostgreSQL]           (lee Prometheus)
```
