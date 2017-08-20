#Pill-Now

# Server Schema

### User Schema

    name : 유저 이름

    id : 유저 ID

    password : 유저 비밀번호

    sex : 유저 성별

    age : 유저 나이

    token : 유저 토큰

### medicine Schema

    number : 약 코드

    division : 전문 의약품 OR 일반 의약품

    use : 사용 방법

    notice : 주의 사항

    saveMedic : 저장용기

    ingridient : 재료

    name : 약 이름

    img : 약 사진 URL

### userMedicine Schema

    number : 약 코드

    token : 사용자 토큰


### alarm Schema

    token : 토큰
    
    name : 약 이름
    
    time : 시간 ( EX : 9 , EX : 14)


# /Auth 

### POST : /auth/login

> Require 

    id : 유저 ID

    password : 유저 비밀번호

> Response

>> Success 

    status : 200

    token : 유저 토큰

>> Fail

    status : 404

### POST : /auth/signup

> Require

    id : 유저 ID

    password : 유저 비밀번호

    age : 유저 나이

    sex : 유저 성별

    name : 유저 이름

> Response

>> Success 

    status : 200

    token : 유저 토큰

>> Fail

    status : 401

# /location

### GET : /location?latitude=위도&longitude=경도

> Require

    latitude : 위도

    longitude : 경도

> Response

>> Success

     주변 병원 위치 JSON

>> Fail

    Null Json

# /medicine

### GET : /medicine/getData?medicNum=PID 번호&token=유저 토큰

> Require

    medicNum : 약의 PID 번호
    
    token : 유저 토큰
    
> Response

>> Success

    status : 200
    
    userData : 유저 약 object (medicine Schema 참고)

>> Fail : PID Number 오류

    status : 404
    message : PID number undefinded

>> Fail : token 오류

    status : 404
    message : token undefinded

>> Fail : PID Number 길이 오류

    status : 404
    message : PID Number length is too short
    
### GET : /medicine/userList?token=유저 토큰

> Require
    
    token : 유저 토큰

> Response

>> Success

    status : 200
    userList : 유저 약 종류(userMedicine Schema 참고)
    
>> Fail
    
    stauts:404
    
### POST : /medicine/delete

> Require
    
    token : 유저 토큰
    
    number : 약 PID 번호
    
> Response

>> Success
    
    stauts : 200
    
>> Fail

    stauts : 401

# /alarm

### GET : /alarm/setting?token=유저 토큰&name=약 이름&time=약 먹을 시간

> Require

    token : 유저 토큰
    
    name : 약 이름
    
    time : 약 먹을 시간 (시간만 보내주세요 EX : 9 , EX : 23)

> Response

>> Success

    status : 200
 
### GET : /alarm/user


> Require

    token : 유저 토큰
    

> Response

>> Success

    status : 200
    
    list : 유저 알람 리스트 (alarmModel 참고

>> Fail : overlap
    
    status : 404


# /push

### GET : /push

> Require
    
    token : 유저 토큰
    
    fcm : 안드로이드 클라이언트 FCM 토큰

> Response

>> Success

    일치하는 시간이 있다면 fcm 전송
    
>> Fail
    
    아무일도 일어나지 않았다
    