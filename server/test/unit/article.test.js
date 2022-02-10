/* eslint-disable no-undef */
const articleController = require('../../controller/article');
const Article = require('../../mongoose/schema/article');
const httpMocks = require('node-mocks-http');
const newArticle = require('../data/new-article.json');

Article.create = jest.fn();

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
})

describe("Article Controller Create", () => {
  beforeEach(() => {
    req.body = newArticle;
  })
  it("should have a createArticle function", () => {
    expect(typeof articleController.createArticle).toBe("function")
  })
  it("should call Article.create", () => {
    articleController.createArticle(req, res, next);
    // expect(Article.create).toBeCalledWith(newArticle);
  })
  it("should return 201 response code", () => {
    articleController.createArticle(req, res, next);
    // expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  })
  it("should return json body in response", async () => {
    Article.create.mockReturnValue(newArticle);
    await articleController.createArticle(req, res, next);
    expect(res._getJSONDate()).toStrictEqual(newArticle);
  })
})