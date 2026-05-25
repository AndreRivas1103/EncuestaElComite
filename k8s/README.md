# Despliegue en Minikube (frontend + backend + db)

Guía para la entrega del proyecto con **tres componentes** en Kubernetes:

| Componente | Recurso K8s | Imagen |
|------------|-------------|--------|
| **db** | Deployment `db` + PVC | `postgres:16-alpine` |
| **backend** | Deployment `back` | `encuestaelcomite-back:k8s` |
| **frontend** | Deployment `client` | `encuestaelcomite-client:k8s` (nginx) |

El frontend expone **NodePort 30080** y nginx reenvía `/api` al backend dentro del clúster.

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
```

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

## Paso 7 — Qué mostrar en la entrega (evidencia)

1. Captura de `kubectl get pods -n encuesta` con **db**, **back** y **client** en `Running`.
2. Captura del navegador en la URL del `minikube service`.
3. (Opcional) `kubectl describe deployment -n encuesta`.

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
```

---

## Problemas frecuentes

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
                                      +--> /api/* --> Service back:3000 --> [Express]
                                                                                |
                                                                                v
                                                                          Service db:5432
                                                                          [PostgreSQL]
```
