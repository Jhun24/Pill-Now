#Pill-Now

# Server Schema

### User Schema

- name : 유저 이름

- id : 유저 ID

- password : 유저 비밀번호

- sex : 유저 성별

- age : 유저 나이

- token : 유저 토큰

### medicine Schema

- number : 약 코드

- division : 전문 의약품 OR 일반 의약품

- use : 사용 방법

- notice : 주의 사항

- saveMedic : 저장용기

- ingridient : 재료

- name : 약 이름

- img : 약 사진 URL

# /Auth 

### POST : /auth/login

>> Require 

> id : 유저 ID

> password : 유저 비밀번호

>> Response

>> Success 

> status : 200

> token : 유저 토큰

>> Fail

> status : 404

### POST : /auth/signup

>> Require

> id : 유저 ID

> password : 유저 비밀번호

> age : 유저 나이

> sex : 유저 성별

> name : 유저 이름

>> Response

>> Success 

> status : 200

> token : 유저 토큰

>> Fail

> status : 401

# /location

### GET : /location

>> Require

> latitude : 위도

> longitude : 경도

>> Response

>> Success

> 주변 병원 위치 JSON

>> Fail

> 비어있는 JSON