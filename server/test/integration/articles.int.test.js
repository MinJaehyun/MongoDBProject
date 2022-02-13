const request = require('supertest');
const app = require('../../server');
// const newArticle = require('../data/new-article.json');
let firstArticle;

// let token;

// beforeAll(async () => {
//   const res = await request(app)
//     .post('/user/login')
//     .send({ email: "krism02@naver.com", password: 1234567 })
// .end((err, response) => {
//   token = response.body.token;
// })
// console.log('res.body: ', res.body);
// token = response.body.token;
// console.log('token: ', token);
// })


// 아래에서 token 을 받기 위해, 위에서 전역으로 token 가져온다.
// login 시, token 을 받는다.

// create
it("POST /article/create", async () => {
  const res = await request(app)
    .post('/article/create')
    // .set('Authorization', `Bearer ${token}`)
    .send({ board: "category1", content: "titleRequire", title: "contentRequire" });
  // authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMDUxNWE1MGYxM2EzMWIwYjkyNDUxOSIsImVtYWlsIjoia3Jpc20wMUBuYXZlci5jb20iLCJuaWNrbmFtZSI6ImpoODIiLCJpYXQiOjE2NDQ1MDAzOTksImV4cCI6MTY0NTEwNTE5OX0.wkIEl5IcPmxytssFWTBIjGqx8xKnh6sqaqlyLMRecyA"
  // console.log('res.headers: ', res.headers);
  // console.log('res.headers.authorization: ', res.headers.authorization);
  expect(res.statusCode).toBe(200);
  // expect(res.body.title).toBe(newArticle.title)
  // expect(res.body.content).toBe(newArticle.content)
})

// create
it("should return 500 on POST /article/create", async () => {

})

// read
it("GET /article/read", async () => {
  const response = await request(app).get('/article/read');
  expect(response.statusCode).toBe(200);
  expect(Array.isArray(response.body)).toBeTruthy();
  expect(response.body[0].title).toBeDefined();
  expect(response.body[0].content).toBeDefined();
  // response.body[0].board 는 출력하는 속성이 아니다. postman read 조회하기 
  firstArticle = response.body[0];
})

// detail
it("GET /article/detail/:id", async () => {
  const response = await request(app).get('/article/detail/' + firstArticle._id);
  expect(response.statusCode).toBe(200);
  expect(response.body.title).toBe(firstArticle.title);
  expect(response.body.content).toBe(firstArticle.content);
})

// detail
it("GET id doesn't exist /article/detail/:id", async () => {
  // 에러를 출력하기 위한 mongoDB ObjectId 를 2자리만 변형하여 테스트
  const response = await request(app).get('/article/detail/620517b8eb3972e2e21d5811');
  // 경로가 잘못되거나, 자원이 없는 경우 404 상태코드 사용
  expect(response.statusCode).toBe(404);
})

// update
it("PATCH /article/update", async () => {
  const res = await request(app)
    .patch("/article/update")
    .send({ id: firstArticle._id, author: firstArticle.authorId, title: "update", content: "update" });
  // 에러: 위 id 에 newArticle._id 를 입력함..
  // console.log("firstArticle._id", firstArticle._id);
  expect(res.statusCode).toBe(200);
  // res.body._id 는 실제 DB 의 첫 번째 객체의 ._id 를 의미한다!
  expect(res.body._id).toBe(firstArticle._id);
  // res.body.author 는 실제 DB 에 속성을 의미한다. 
  // firstArticle 은 /article/read 한 [0]번째 객체이다.
  expect(res.body.author).toBe(firstArticle.author);
  expect(res.body.title).toBe("update");
  expect(res.body.content).toBe("update");
})

// soft delete
it("DELETE /article/delete/soft", async () => {
  const res = await request(app)
    .delete("/article/delete/soft")
    .send({ id: firstArticle._id, author: firstArticle.authorId });
  expect(res.statusCode).toBe(200);
})

// hard delete
it("DELETE /article/delete/hard", async () => {
  const res = await request(app)
    .delete("/article/delete/hard")
    .send({ id: firstArticle._id, author: firstArticle.authorId });
  expect(res.statusCode).toBe(200);
})

