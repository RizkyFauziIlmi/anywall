import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../index.ts";

const { expect } = chai;
chai.use(chaiHttp);

// Test case for the /api/v1/search route
describe("GET /api/v1/search", () => {
  it("should return a 200 status code and valid response", async () => {
    const res = await chai.request(app).get("/api/v1/search").query({
      page: 1,
      q: "naruto",
      categories: "general,anime",
      sort: "views",
    });

    expect(res).to.have.status(200);
    expect(res.body.status).to.equal(true);
    expect(res.body.message).to.be.a("string");
    expect(res.body.queryDetail).to.be.an("object");
    expect(res.body.queryDetail.page).to.equal(1);
    expect(res.body.queryDetail.query).to.equal("naruto");
    expect(res.body.queryDetail.categoryArrToLowerCase).to.deep.equal([
      "general",
      "anime",
    ]);
    expect(res.body.queryDetail.sorting).to.equal("views");
    expect(res.body.data).to.be.an("array");
  });
});

// Test case for the /api/v1/wallpaper/{imageEndpoint} route
describe("GET /api/v1/wallpaper/{imageEndpoint}", () => {
  it("should return a 200 status code and valid response", async () => {
    const imageEndpoint = "9mjoy1";
    const res = await chai
      .request(app)
      .get(`/api/v1/wallpaper/${imageEndpoint}`);

    expect(res).to.have.status(200);
    expect(res.body.status).to.equal(true);
    expect(res.body.message).to.be.a("string");
    expect(res.body.queryDetail.imageEndpoint).to.equal(imageEndpoint);
    expect(res.body.data).to.be.an("object");
  });
});
