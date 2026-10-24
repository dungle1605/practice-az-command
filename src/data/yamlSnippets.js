// YAML Manifests cho bài lab AKS: 02-aks-configure-container (Microsoft AI-200)
export const yamlSnippets = [
  {
    id: "configmap-yaml",
    title: "1. ConfigMap (k8s/configmap.yaml)",
    description: "Lưu trữ cấu hình ứng dụng không nhạy cảm (Student Name, API Version, Log Path) cho aks-config-api.",
    category: "Configuration",
    filename: "configmap.yaml",
    code: `apiVersion: v1
kind: ConfigMap
metadata:
  name: api-config
  labels:
    app: aks-config-api # Label for the AKS configuration API
data:
  # Store non-sensitive configuration values
  STUDENT_NAME: "AI200Student"
  API_VERSION: "1.0.0"
  LOG_PATH: "/var/log/api" # Path for API logs`,
  },
  {
    id: "secrets-yaml",
    title: "2. Secrets (k8s/secrets.yaml)",
    description: "Lưu trữ thông tin nhạy cảm (API Endpoint bí mật, Access Key) sử dụng stringData tự động encode base64.",
    category: "Security",
    filename: "secrets.yaml",
    code: `apiVersion: v1
kind: Secret
metadata:
  name: api-secrets
  labels:
    app: aks-config-api
type: Opaque
stringData:
  # Store sensitive credentials as base64-encoded values
  secret-endpoint: "SecretEndpointValue"
  secret-access-key: "SecretAccessKey123456"`,
  },
  {
    id: "pvc-yaml",
    title: "3. PersistentVolumeClaim (k8s/pvc.yaml)",
    description: "Yêu cầu lưu trữ bền vững Azure Disk (managed-csi, 1Gi) để lưu log file không bị mất khi Pod restart.",
    category: "Storage",
    filename: "pvc.yaml",
    code: `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: api-logs-pvc
  labels:
    app: aks-config-api # Label for the AKS configuration API
spec:
  accessModes:
    - ReadWriteOnce  # Allow single pod to mount volume for read/write
  resources:
    requests:
      storage: 1Gi  # Request minimum Azure Disk size
  storageClassName: managed-csi  # Use Azure Disk CSI driver (default)
  volumeMode: Filesystem  # Default mode`,
  },
  {
    id: "deployment-yaml",
    title: "4. Deployment (k8s/deployment.yaml)",
    description: "Khởi tạo Pod API tích hợp ConfigMap envFrom, Secret env, VolumeMounts cho log storage, Liveness & Readiness probe.",
    category: "Workload",
    filename: "deployment.yaml",
    code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: aks-config-api
  labels:
    app: aks-config-api # Label for the AKS configuration API
    version: v1
spec:
  replicas: 1
  selector:
    matchLabels:
      app: aks-config-api
      version: v1
  template:
    metadata:
      labels:
        app: aks-config-api
        version: v1
    spec:
      containers:
      - name: api
        image: <YOUR_ACR_ENDPOINT>/aks-config-api:latest
        imagePullPolicy: Always
        ports:
        - name: http
          containerPort: 8000
          protocol: TCP

        # Inject environment variables from ConfigMap
        envFrom:
        - configMapRef:
            name: api-config

        # Inject environment variables from Secrets
        env:
        - name: SECRET_ENDPOINT
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: secret-endpoint
        - name: SECRET_ACCESS_KEY
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: secret-access-key

        # Attach persistent volume for logs
        volumeMounts:
        - name: log-storage
          mountPath: /var/log/api

        # Liveness probe - checks if container is alive
        livenessProbe:
          httpGet:
            path: /healthz
            port: http
          initialDelaySeconds: 10
          periodSeconds: 30
          timeoutSeconds: 5
          failureThreshold: 3

        # Readiness probe - checks if container is ready to serve traffic
        readinessProbe:
          httpGet:
            path: /readyz
            port: http
          initialDelaySeconds: 15
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3

        # Resource limits
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"

      # Volume definition for persistent storage
      volumes:
      - name: log-storage # Volume for API logs
        persistentVolumeClaim:
          claimName: api-logs-pvc # PVC for API logs`,
  },
  {
    id: "service-yaml",
    title: "5. Service (k8s/service.yaml)",
    description: "Mở cổng công khai ra Internet qua Azure Public LoadBalancer (Port 80 -> Target Port 8000).",
    category: "Networking",
    filename: "service.yaml",
    code: `apiVersion: v1
kind: Service
metadata:
  name: aks-config-api-service
  labels:
    app: aks-config-api
  annotations:
    service.beta.kubernetes.io/azure-load-balancer-internal: "false"  # Use public load balancer
spec:
  type: LoadBalancer  # Expose service externally via Azure Load Balancer
  selector:  # Route traffic to pods matching these labels
    app: aks-config-api
    version: v1
  ports:  # Map external port to container port
  - name: http
    port: 80  # External port for incoming traffic
    targetPort: http  # Forward to container's http port (8000)
    protocol: TCP
  sessionAffinity: None  # Distribute requests across all pods`,
  },
  {
    id: "deploy-all-script",
    title: "6. Script triển khai chuẩn Lab (deploy.sh)",
    description: "Thứ tự thực thi các lệnh kubectl chuẩn trong bài lab để tạo cấu hình, storage, workload và service.",
    category: "Full Stack",
    filename: "deploy.sh",
    code: `#!/usr/bin/env bash
# Quy trình apply manifests chuẩn bài lab 02 AKS Configure
set -e

echo "[1/5] Applying ConfigMap..."
kubectl apply -f k8s/configmap.yaml

echo "[2/5] Applying Secrets..."
kubectl apply -f k8s/secrets.yaml

echo "[3/5] Applying PersistentVolumeClaim..."
kubectl apply -f k8s/pvc.yaml

echo "[4/5] Applying Deployment..."
kubectl apply -f k8s/deployment.yaml

echo "[5/5] Creating LoadBalancer Service..."
kubectl apply -f k8s/service.yaml

echo "Waiting for External IP..."
kubectl get svc aks-config-api-service -w`,
  }
];