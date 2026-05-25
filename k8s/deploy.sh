#!/usr/bin/env bash
# Despliegue en Minikube — Encuesta El Comité
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Usando Docker de Minikube"
eval "$(minikube docker-env)"

echo "==> Construyendo imágenes"
docker build -f packages/server/Dockerfile -t encuestaelcomite-back:k8s .
docker build -f packages/client/Dockerfile.k8s -t encuestaelcomite-client:k8s .

echo "==> Aplicando manifiestos Kubernetes"
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/postgres-secret.yaml
kubectl apply -f k8s/postgres-pvc.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/postgres-service.yaml

echo "==> Esperando PostgreSQL..."
kubectl wait --for=condition=available deployment/db -n encuesta --timeout=180s

kubectl apply -f k8s/back-deployment.yaml
kubectl apply -f k8s/back-service.yaml

echo "==> Esperando backend..."
kubectl wait --for=condition=available deployment/back -n encuesta --timeout=180s

echo "==> Inicializando base de datos (migrate + seed)"
kubectl delete job init-db -n encuesta --ignore-not-found
kubectl apply -f k8s/job-init-db.yaml
kubectl wait --for=condition=complete job/init-db -n encuesta --timeout=300s

kubectl apply -f k8s/client-deployment.yaml
kubectl apply -f k8s/client-service.yaml

echo "==> Esperando frontend..."
kubectl wait --for=condition=available deployment/client -n encuesta --timeout=180s

echo ""
echo "=== Despliegue listo ==="
kubectl get pods,svc -n encuesta
echo ""
echo "Abrir aplicación:"
minikube service client -n encuesta --url
echo ""
echo "Login de prueba: coord.local@ejemplo.dev"
