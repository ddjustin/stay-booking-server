# stay-booking-server

# 🏨 StayLab — 숙소 예약 서버 (NestJS)

> **Node.js (NestJS)** 기반 숙소 예약 서버입니다.  
> 실무 수준의 **예약 시스템 아키텍처**, **트래픽 부하 테스트(k6)**, **Redis 캐시 및 동시성 제어**를 학습하기 위한 프로젝트입니다.  
> 본 프로젝트는 "대규모 트래픽 환경에서도 안정적으로 동작하는 서버"를 목표로 합니다.

---

## 🚀 프로젝트 개요

### 🎯 목표
- 숙소 예약 시스템의 기본 CRUD 및 결제 흐름 구현  
- 다중 유저 동시 예약(Concurrency) 제어  
- Redis 캐시 및 큐 시스템을 통한 서버 부하 분산  
- k6 부하 테스트를 통한 성능 측정 및 개선  

### 💬 한 줄 요약
> “NestJS로 구현한 **대규모 트래픽 대응형 숙소 예약 서버** 실험 프로젝트”

---

## ⚙️ 기술 스택

| 분류 | 기술 |
|------|------|
| **언어** | Node.js (TypeScript) |
| **프레임워크** | NestJS |
| **데이터베이스** | PostgreSQL (Prisma ORM) |
| **캐시 / 큐** | Redis (ioredis / BullMQ) |
| **테스트** | k6 (부하 테스트), Jest (유닛 테스트) |
| **배포 환경** | 로컬 (Mac) 및 Render (무료 서버) |
| **기타** | Docker Compose, ESLint, Prettier, Swagger |

---

## 🧩 시스템 아키텍처

```mermaid
graph TD
A[Client] --> B[API Gateway / Nginx]
B --> C[NestJS Server]
C --> D[PostgreSQL DB]
C --> E[Redis Cache]
C --> F[BullMQ Queue]
E --> C
F --> C
