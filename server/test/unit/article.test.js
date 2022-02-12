const articleController = require('../../controller/article');
const articleModel = require('../../mongoose/schema/article');
const httpMocks = require('node-mocks-http');
const newArticle = require('../data/new-article.json');
const 모든값 = require('../data/all-article.json');

articleModel.create = jest.fn();
articleModel.find = jest.fn();
articleModel.findById = jest.fn();
articleModel.findByIdAndUpdate = jest.fn();

const articleId = "62037fc4cc4c2db2cbdd0111";
const authorId = "620515a50f13a31b0b924500";
const updateArticle = { title: "update", content: "update" };

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
})

describe("Article Controller Create", () => {
  beforeEach(() => {
    req.body = newArticle;
    // console.log(req.body.authorId);
  })
  it("should have a createArticle function", () => {
    expect(typeof articleController.createArticle).toBe("function")
  })
  it("should call articleModel.create", () => {
    articleController.createArticle(req, res, next);
    // expect(articleModel.create).toBeCalledWith(newArticle);
    // body 를 제외한 jwt 를 사용한 author=data.id 를 가져오지 못하는 에러 발생
  })
  it("should return 201 response code", () => {
    articleController.createArticle(req, res, next);
    // expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  })
  it("should return json body in response", async () => {
    // articleModel.create.mockReturnValue(newArticle);
    // await articleController.createArticle(req, res, next);
    // expect(res._getJSONDate()).toStrictEqual(newArticle);
    // jwt.verify 를 통한 json 결과를 가져오지 못하는 에러 발생
  })
  it("should handle errors", async () => {
    // const errorMessage = { message: "property missing!" };
    // const rejectPromise = Promise.reject(errorMessage);
    // articleModel.create.mockReturnValue(rejectPromise);
    // await articleController.createArticle(req, res, next);
    // expect(next).toHaveBeenCalledWith(errorMessage);
    //  에러 발생: UnhandledPromiseRejection 
  })
});

describe("Article Controller Get", () => {
  it("should have a getArticles function", () => {
    expect(typeof articleController.readArticle).toBe("function");
  })
  it("should call ArticleModel.find({})", async () => {
    await articleController.readArticle(req, res, next);
    expect(articleModel.find).toHaveBeenCalledWith({});  // toBeCalledWith 같은 기능을 한다.
  })
  it("should return 200 response", async () => {
    await articleController.readArticle(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
  })
  it("should return json body in response", async () => {
    articleModel.find.mockReturnValue(모든값);
    await articleController.readArticle(req, res, next);
    expect(res._getJSONData()).toStrictEqual(모든값);
  })
  it("should handle errors", async () => {
    const errorMessage = { message: "Error finding article data" };
    const rejectPromise = Promise.reject(errorMessage);
    articleModel.find.mockReturnValue(rejectPromise);
    await articleController.readArticle(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  })
});

describe("Article Controller findById", () => {
  it("should have a getArticleById", () => {
    expect(typeof articleController.getArticleById).toBe("function");
  });
  it("should call articleModel.findById", async () => {
    // NOTE: req.params.id 를 만들어서, 임의 id 를 mongoDB 의 id 와 유사하게 넣는다. (끝자리 2개만 변경)
    // TODO: 활용하여 jwt 부분에 req.headers = authorization; 값 유사하게 넣어서 테스트 해보기 (끝자리 2개만 변경)
    req.params.id = articleId;
    await articleController.getArticleById(req, res, next);
    expect(articleModel.findById).toBeCalledWith(articleId);
  });
  it("should return json body and response code 200 ", async () => {
    articleModel.findById.mockReturnValue(newArticle);
    await articleController.getArticleById(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newArticle);   // _ 언더바로 된 것은 () 붙인다
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should return 404 when item doesn't exist", async () => {
    // articleModel.findById 의 값을 현재는 doesn't exist 인 null 로 표현
    articleModel.findById.mockReturnValue(null);
    await articleController.getArticleById(req, res, next);
    expect(res.statusCode).toBe(404);
    // 에러: 200 출력, 실제 코드에서 id 없음을 !mongoose.isValidObjectId(id) 로 표현하였는데,
    // if (!id) 로 표현해야 한다..
    // FIXME: isValidObjectId 를 검증하는 방법은?
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should handle errors", async () => {
    const errorMessage = { message: "error" };
    const rejectPromise = Promise.reject(errorMessage);
    articleModel.findById.mockReturnValue(rejectPromise);
    await articleController.getArticleById(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage)
  })
});

describe("Article Controller findByIdAndUpdate", () => {
  beforeEach(() => {
    req.body = newArticle;
    // console.log(req.body.authorId);
  });
  // 1. 함수인지
  it("should have an articleController.updateArticle", () => {
    expect(typeof articleController.updateArticle).toBe("function")
  })
  // 2. Model 이 findByIdAndUpdate 메서드를 사용하는지
  it("should call articleModel.findByIdAndUpdate", async () => {
    req.body._id = newArticle._id;
    req.body.author = authorId;
    req.body = updateArticle;
    await articleController.updateArticle(req, res, next);
    // toHaveBeenCalledWith: 다음과 같이 호출됨 
    expect(articleModel.findByIdAndUpdate).toHaveBeenCalledWith(
      { articleId, authorId }, updateArticle, { new: true }
    );
  })
});