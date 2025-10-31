# stay-booking-server

# 🧠 숙소 예약 서버 — 트랜잭션 & 동시성 제어 설계

---

## 📘 공부할 수 있는 지식

- 트랜잭션 (Transaction)
- 격리 수준 (Isolation Level)
- 비관적 락 vs 낙관적 락 (Pessimistic vs Optimistic Lock)
- 병목 현상 (Bottleneck)

---

## 🎯 목표

- 여러 사용자가 동시에 같은 방을 예약할 때  
  → **단 한 명만 성공**하고, 나머지는 **실패**
- 트랜잭션과 격리 수준을 이해하고 제어

---

## 🎯 예약 시스템에 적합한 격리 수준

> 💡 **REPEATABLE READ (반복 가능한 읽기)**  
> 또는 PostgreSQL 기본값 그대로 사용  
> PostgreSQL 기본: **READ COMMITTED**

---

## 💬 이유

| 항목 | 설명 |
|------|------|
| **READ COMMITTED** | 일반적인 비즈니스 트랜잭션에 충분함. PostgreSQL 기본값. 커밋된 데이터만 보기 때문에 Dirty Read 방지 |
| **REPEATABLE READ** | 중간에 다른 트랜잭션이 데이터를 바꿔도 내 트랜잭션 내에서는 일관된 데이터 유지 |
| **SERIALIZABLE** | 완벽한 정합성이 보장되지만, 락 충돌이 많아지고 속도가 매우 느려짐 |

📘 현실적으로 **“READ COMMITTED + FOR UPDATE”** 조합이면 충분히 안전하다.  
대부분의 은행, 예약, 결제 시스템이 이 방식을 사용한다.

---

## 🧩 Prisma 트랜잭션 구현 (with `FOR UPDATE`)

### ⚙️ `FOR UPDATE`의 역할

> 트랜잭션이 실행 중인 동안,  
> 해당 Row(방)에 대해 **다른 트랜잭션이 읽거나 수정하지 못하도록 잠금(lock)** 을 거는 SQL 구문이다.

- A가 Room #1을 `FOR UPDATE`로 조회 → **락 걸림**
- B가 같은 Row 접근 시 → **A 트랜잭션 끝날 때까지 대기(block)**
- A가 커밋(commit)하면 B가 실행됨
- A가 방을 예약 완료 후 `isAvailable=false`로 바꾸면  
  B는 그걸 보고 “이미 예약된 방입니다.” 에러 발생

---

## 🧠 Prisma 트랜잭션의 동작 원리

| Prisma 기능 | 설명 |
|--------------|------|
| `prisma.$transaction()` | 여러 쿼리를 하나로 묶는 트랜잭션 실행 |
| `isolationLevel` | 트랜잭션 격리 수준 설정 (PostgreSQL 기준 `ReadCommitted` / `RepeatableRead` / `Serializable` 지원) |
| `$queryRawUnsafe` | 직접 SQL 실행 (여기서 `FOR UPDATE` 사용 가능) |

---

## 📊 요청 동작 시나리오

| 시점 | 유저 A | 유저 B |
|------|---------|---------|
| T1 | Room #1 조회 (`FOR UPDATE` → Lock 획득) | 대기 중 |
| T2 | Room 예약 → `isAvailable = false` | 대기 중 |
| T3 | 트랜잭션 Commit | Lock 해제 |
| T4 | Room 조회 → `isAvailable = false` 확인 | 예약 실패 (이미 예약됨) |

---

## ✅ 결론 요약

| 개념 | 의미 | 설정 |
|------|------|------|
| **트랜잭션** | 여러 쿼리를 하나로 묶는 논리 단위 | `prisma.$transaction()` |
| **격리 수준** | 트랜잭션 간 데이터 접근 범위 | `ReadCommitted` |
| **락 (FOR UPDATE)** | 특정 데이터(row)에 접근 잠금 | `SELECT ... FOR UPDATE` |
| **이 조합 결과** | 동시에 여러 요청이 와도 단 한 명만 예약 가능 | ✅ 완벽한 데이터 정합성 보장 |

---

> 💡 **결론:**  
> 동시에 100명이 같은 방을 예약하더라도,  
> **단 한 명만 성공**하는 안전한 트랜잭션 기반 서버 구조를 만든다.

