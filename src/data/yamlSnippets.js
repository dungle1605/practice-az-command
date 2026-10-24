// YAML Manifests cho bài lab AKS - AI-200
export const yamlSnippets = [
  {
    id: "deployment-yaml",
    title: "Deployment (aks-api)",
    description: "Định nghĩa Deployment với 1 replica, liveness probe HTTP và resource limits cho AI Inference API.",
    category: "Workload",
    filename: "deployment.yaml",
    code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: aks-api
  labels:
    app: aks-api
    version: v1
spec:
  replicas: 1
  selector:
    matchLabels:
      app: aks-api
      version: v1
  template:
    metadata:
      labels:
        app: aks-api
        version: v1
    spec:
      containers:
      - name: api
        image: <ACR_NAME>.azurecr.io/aks-api:latest
        imagePullPolicy: Always
        ports:
        - name: http
          containerPort: 8000
          protocol: TCP
        livenessProbe:
          httpGet:
            path: /healthz
            port: http
          initialDelaySeconds: 10
          periodSeconds: 30
          timeoutSeconds: 5
          failureThreshold: 3
        envFrom:
        - configMapRef:
            name: aks-api-config
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"`,
  },
  {
    id: "service-yaml",
    title: "Service (LoadBalancer)",
    description: "Expose API ra Internet qua Azure Load Balancer trên cổng 80 → container port 8000.",
    category: "Networking",
    filename: "service.yaml",
    code: `apiVersion: v1
kind: Service
metadata:
  name: aks-api-service
  labels:
    app: aks-api
  annotations:
    service.beta.kubernetes.io/azure-load-balancer-internal: "false"
spec:
  type: LoadBalancer
  selector:
    app: aks-api
    version: v1
  ports:
  - name: http
    port: 80
    targetPort: http
    protocol: TCP
  sessionAffinity: None`,
  },
  {
    id: "configmap-yaml",
    title: "ConfigMap (cấu hình API)",
    description: "Lưu trữ các biến môi trường không nhạy cảm: tên model, endpoint AI, max tokens.",
    category: "Configuration",
    filename: "configmap.yaml",
    code: `apiVersion: v1
kind: ConfigMap
metadata:
  name: aks-api-config
  labels:
    app: aks-api
data:
  MODEL_NAME: "gpt-4o-mini"
  AI_ENDPOINT: "https://<foundry-project>.openai.azure.com/"
  MAX_TOKENS: "1024"
  LOG_LEVEL: "INFO"
  PORT: "8000"`,
  },
  {
    id: "hpa-yaml",
    title: "HorizontalPodAutoscaler (HPA)",
    description: "Tự động scale số replica từ 1 đến 5 dựa trên mức CPU trung bình 70%.",
    category: "Scaling",
    filename: "hpa.yaml",
    code: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: aks-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: aks-api
  minReplicas: 1
  maxReplicas: 5
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70`,
  },
  {
    id: "ingress-yaml",
    title: "Ingress (NGINX)",
    description: "Định tuyến traffic HTTP vào Service qua Ingress Controller — hỗ trợ path-based routing.",
    category: "Networking",
    filename: "ingress.yaml",
    code: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: aks-api-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/proxy-read-timeout: "300"
spec:
  ingressClassName: nginx
  rules:
  - host: aks-api.<EXTERNAL_IP>.nip.io
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: aks-api-service
            port:
              name: http`,
  },
  {
    id: "all-in-one",
    title: "Full Deploy (tất cả trong 1 file)",
    description: "Triển khai toàn bộ: ConfigMap + Deployment + Service trong một lần apply duy nhất.",
    category: "Full Stack",
    filename: "aks-full-deploy.yaml",
    code: `# ── ConfigMap ─────────────────────────────────────
apiVersion: v1
kind: ConfigMap
metadata:
  name: aks-api-config
data:
  MODEL_NAME: "gpt-4o-mini"
  PORT: "8000"
---
# ── Deployment ────────────────────────────────────
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aks-api
  labels:
    app: aks-api
spec:
  replicas: 1
  selector:
    matchLabels:
      app: aks-api
  template:
    metadata:
      labels:
        app: aks-api
    spec:
      containers:
      - name: api
        image: <ACR_NAME>.azurecr.io/aks-api:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 8000
          name: http
        envFrom:
        - configMapRef:
            name: aks-api-config
        livenessProbe:
          httpGet:
            path: /healthz
            port: http
          initialDelaySeconds: 10
          periodSeconds: 30
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
# ── Service ───────────────────────────────────────
apiVersion: v1
kind: Service
metadata:
  name: aks-api-service
  labels:
    app: aks-api
spec:
  type: LoadBalancer
  selector:
    app: aks-api
  ports:
  - port: 80
    targetPort: http
    protocol: TCP`,
  },
];