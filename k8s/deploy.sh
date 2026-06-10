#!/usr/bin/env bash
# Aplica k8s/manifest.yaml en Minikube
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

eval "$(minikube docker-env)"

docker build -f packages/server/Dockerfile -t marcelillo/encuestaelcomite-back:latest .
docker build -f packages/client/Dockerfile.k8s -t marcelillo/encuestaelcomite-client:latest .

kubectl apply -f k8s/manifest.yaml

kubectl wait --for=condition=available deployment/db -n encuesta --timeout=180s
kubectl wait --for=condition=available deployment/back -n encuesta --timeout=180s

kubectl delete job init-db -n encuesta --ignore-not-found
kubectl apply -f k8s/manifest.yaml
kubectl wait --for=condition=complete job/init-db -n encuesta --timeout=300s

kubectl get pods,svc -n encuesta
minikube service client -n encuesta --url
