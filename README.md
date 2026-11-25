# Control de Estudios – Laboratorio Médico Polanco

Herramienta web para llevar la contabilidad y control de estudios de **Laboratorio Médico Polanco** y estudios **PET UNAM**, integrada con **Firebase Firestore** para almacenamiento en tiempo real.

## 🚀 ¿Qué hace esta herramienta?

- 📊 **Dashboard** con resumen de estudios: total, solventados, en proceso, cancelados, pendientes y PET UNAM
- 🧪 **Estudios Polanco** – registro y seguimiento de estudios del portal LMP con estatus de pago
- ⚛️ **PET UNAM** – control de estudios PET con montos cotizados, pagados y participación
- 💰 **Pagos** – vista consolidada de todos los movimientos con totales por estatus
- 🔥 Datos guardados en **Firebase Firestore** en tiempo real
- 🔐 Login seguro con usuario y contraseña

## 📋 Estatus de pago disponibles

| Estatus | Descripción |
|---|---|
| 🔵 Pendiente | No se ha procesado ningún pago |
| 🟡 En proceso | El pago está en trámite |
| 🟣 Pago parcial | Se ha pagado una parte |
| 🟢 Solventado | Pago completo recibido |
| 🔴 Cancelado | El estudio o pago fue cancelado |

## 🔧 Configuración Firebase

### 1. Habilitar Autenticación Anónima
- Ve a [Firebase Console → Authentication → Providers](https://console.firebase.google.com/project/lpolanco-a925b/authentication/providers)
- Activa **"Anónimo"**

### 2. Crear Firestore
- Ve a [Firebase Console → Firestore](https://console.firebase.google.com/project/lpolanco-a925b/firestore)
- Crear base de datos → Modo producción → `us-central1`

### 3. Publicar reglas de seguridad
- Ve a [Firebase Console → Firestore → Reglas](https://console.firebase.google.com/project/lpolanco-a925b/firestore/rules)
- Copia el contenido de `firestore.rules` y publícalo

## 🗂️ Estructura del proyecto

```
control-estudios-lmp/
├── index.html          # Aplicación completa (HTML + CSS + JS)
├── firestore.rules     # Reglas de seguridad de Firestore
└── README.md           # Este archivo
```

## 🗄️ Colecciones en Firestore

```
estudios/        ← Estudios del portal Polanco
  fecha, idpac, nombre, estudio, folio, monto, estatus, notas

pet_unam/        ← Estudios PET UNAM
  fecha, nombre, tipo, cotizado, pagado, participacion, estatus, notas
```

## 🔑 Credenciales de acceso

```
Usuario:    admin
Contraseña: Sanare2026
```

> ⚠️ **Nota de seguridad:** Nunca compartas el archivo `index.html` con usuarios no autorizados ya que contiene las credenciales de acceso y la configuración de Firebase.

## 🛠️ Tecnologías

- HTML5 + CSS3 + JavaScript (vanilla, sin frameworks)
- Firebase Firestore (base de datos en tiempo real)
- Firebase Authentication (sesiones anónimas)
- Firebase CDN SDK v10.12.2

## Registros LMP de Llenado SAI

Los registros se consultan con los permisos existentes de Supabase y aparecen
en las vistas de Dashboard, Estudios Polanco y Pagos. PET UNAM conserva su
fuente propia. Polanco actualiza los registros LMP cada 15 segundos mientras
la herramienta está visible. Las altas y ediciones se hacen en Llenado SAI.
Polanco asigna automáticamente el estado «Solventado» a los registros importados de Llenado SAI.
