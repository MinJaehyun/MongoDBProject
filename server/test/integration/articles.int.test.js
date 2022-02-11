const request = require('supertest');
const app = require('../../server');
// const newArticle = require('../data/new-article.json');
let firstArticle;

it("POST /article/create", async () => {
  // FIXME: jwt.verify 적용된 속성이라 당장 테스트 안됨. 추 후 수정하기
  // const response = await request(app)
  //   .post('/article/create')
  //   .send(newArticle);
  // expect(response.statusCode).toBe(200);
  // expect(response.body.title).toBe(newArticle.title)
  // expect(response.body.content).toBe(newArticle.content)
})

it("should return 500 on POST /article/create", async () => {

})

it("GET /article/read", async () => {
  const response = await request(app).get('/article/read');
  expect(response.statusCode).toBe(200);
  expect(Array.isArray(response.body)).toBeTruthy();
  expect(response.body[0].title).toBeDefined();
  expect(response.body[0].content).toBeDefined();
  // response.body[0].board 는 출력하는 속성이 아니다. postman read 조회하기 
  firstArticle = response.body[0];
})

it("GET /article/detail/:id", async () => {
  const response = await request(app).get('/article/detail/' + firstArticle._id);
  expect(response.statusCode).toBe(200);
  expect(response.body.title).toBe(firstArticle.title);
  expect(response.body.content).toBe(firstArticle.content);
})

it("GET id doesn't exist /article/detail/:id", async () => {
  // 에러를 출력하기 위한 mongoDB ObjectId 를 2자리만 변형하여 테스트
  const response = await request(app).get('/article/detail/620517b8eb3972e2e21d5811');
  // 경로가 잘못되거나, 자원이 없는 경우 404 상태코드 사용
  expect(response.statusCode).toBe(404);
})