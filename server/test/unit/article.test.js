/* eslint-disable no-undef */
const articleController = require('../../controller/article');
const articleModel = require('../../mongoose/schema/article');
// const httpMocks = require('node-mocks-http');
// const newProduct = require('../data/new-product.json');

articleModel.create = jest.fn();

// let req, res, next;
// beforeEach(() => {
//   req = httpMocks.createRequest();
//   res = httpMocks.createResponse();
//   next = jest.fn();
// })

describe("Article Controller Create", () => {
  // beforeEach(() => {
  //   req.body = newProduct;
  // })
  it("should have a createArticle function", () => {
    expect(typeof articleController.createArticle).toBe("function")
  })
  it("should call ArticleModel.create", async () => {
    await articleController.createArticle();  // req, res, next
    expect(articleModel.create).toBeCalledWith();  // newProduct
  })
  // it("should call ProductModel.create", async () => {
  //   await productController.createProduct(req, res, next);
  //   expect(productModel.create).toBeCalledWith(newProduct);
  // })
})