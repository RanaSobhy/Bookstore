const request = require("supertest");
var validateId = require("uuid-validate");
const expect = require("expect");

var { app } = require("./app");

describe("Categories", () => {
  it("should return all categories", done => {
    request(app)
      .post("/api/categories")
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Success"
        });
      })
      .end(done);
  });

  it("should filter categories by name asce and sort them by ID desc ", done => {
    request(app)
      .post("/api/categories")
      .send({
        filter: {
          name: "Rana Sobhy"
        },
        sort: {
          name: 1,
          id: -1
        }
      })
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Success"
        });
      })
      .end(done);
  });

  it("should get a page of categories with a limit per page", done => {
    request(app)
      .post("/api/categories")
      .send({
        page: 100,
        limit: 3
      })
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Success"
        });
        expect(res.body.response.length).toBeLessThanOrEqual(3);
      })
      .end(done);
  });
  {
    // it('should create a category', (done) => {
    //     request(app)
    //         .put("/api/categories")
    //         .send({
    //             name: "Ahmed Sobhy"
    //         })
    //         .expect(200)
    //         .expect((res) => {
    //             expect(res.body).toMatchObject({
    //                 status: "Success",
    //                 response:{
    //                     name: "Ahmed Sobhy"
    //                 }
    //             });
    //             expect(validateId(res.body.response.id)).toBeTruthy();
    //         })
    //         .end(done);
    // });
  }
  it("should reject creating a category", done => {
    request(app)
      .put("/api/categories")
      .send({
        sff: "Ahmed Sobhy"
      })
      .expect(400)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Error"
        });
      })
      .end(done);
  });

  it("should update a category", done => {
    request(app)
      .put("/api/categories/9f992542-296f-4952-bce3-422027acf99a")
      .send({
        name: "Hi"
      })
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Success",
          response: {
            name: "Hi"
          }
        });
      })
      .end(done);
  });

  it("should reject updating a category due to invalid ID", done => {
    request(app)
      .put("/api/categories/9f992542-296f-4952-bce3-422027ac")
      .send({
        name: "Hi"
      })
      .expect(400)
      .expect(res => {
        expect(res.body).toEqual({ status: "Error", response: "Invalid ID" });
      })
      .end(done);
  });

  it("should reject updating a category due to invalid Data", done => {
    request(app)
      .put("/api/categories/9f992542-296f-4952-bce3-422027acf99a")
      .send({
        x: "Hi"
      })
      .expect(400)
      .expect(res => {
        expect(res.body).toMatchObject({ status: "Error" });
      })
      .end(done);
  });

  it("should reject updating a category due to ID not existing", done => {
    request(app)
      .put("/api/categories/9f992542-296f-4952-bce3-422027acf99b")
      .send({
        name: "Hi"
      })
      .expect(404)
      .expect(res => {
        expect(res.body).toEqual({
          status: "Error",
          response: "No category with that id exists"
        });
      })
      .end(done);
  });

  {
    // it('should delete a category', (done) => {
    //     request(app)
    //         .delete("/api/categories/540a7938-fe30-4e07-bd84-932745aa8be5")
    //         .expect(200)
    //         .expect((res) => {
    //             expect(res.body).toEqual({ status: "Success", response: "Category removed" });
    //         })
    //         .end(done);
    // });
  }

  it("should reject deleting a category due to invalid ID", done => {
    request(app)
      .delete("/api/categories/9f992542-296f-4952-bce3-422027acf")
      .expect(400)
      .expect(res => {
        expect(res.body).toEqual({ status: "Error", response: "Invalid ID" });
      })
      .end(done);
  });

  it("should reject deleting a category due FK relationship", done => {
    request(app)
      .delete("/api/categories/bca15b9c-3ef2-47a7-8f4d-0ae177c77ee6")
      .expect(400)
      .expect(res => {
        expect(res.body).toEqual({
          status: "Error",
          response: "Can't delete due to FK relationship"
        });
      })
      .end(done);
  });
});

describe("Authors", () => {
  it("should return all authors", done => {
    request(app)
      .post("/api/authors")
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Success"
        });
      })
      .end(done);
  });

  it("should filter authors by name asce and sort them by ID desc ", done => {
    request(app)
      .post("/api/authors")
      .send({
        filter: {
          name: "Rana Sobhy"
        },
        sort: {
          name: 1,
          id: -1
        }
      })
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Success"
        });
      })
      .end(done);
  });

  it("should get a page of authors with a limit per page", done => {
    request(app)
      .post("/api/authors")
      .send({
        page: 100,
        limit: 3
      })
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Success"
        });
        expect(res.body.response.length).toBeLessThanOrEqual(3);
      })
      .end(done);
  });
  {
    // it('should create an author', (done) => {
    //     request(app)
    //         .put("/api/authors")
    //         .send({
    //             name: "Ahmed Sobhy"
    //         })
    //         .expect(200)
    //         .expect((res) => {
    //             expect(res.body).toMatchObject({
    //                 status: "Success",
    //                 response:{
    //                     name: "Ahmed Sobhy"
    //                 }
    //             });
    //             expect(validateId(res.body.response.id)).toBeTruthy();
    //         })
    //         .end(done);
    // });
  }
  it("should reject creating an author", done => {
    request(app)
      .put("/api/authors")
      .send({
        sff: "Ahmed Sobhy"
      })
      .expect(400)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Error"
        });
      })
      .end(done);
  });

  it("should update an author", done => {
    request(app)
      .put("/api/authors/9f992542-296f-4952-bce3-422027acf99a")
      .send({
        name: "Hi"
      })
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Success",
          response: {
            name: "Hi"
          }
        });
      })
      .end(done);
  });

  it("should reject updating an author due to invalid ID", done => {
    request(app)
      .put("/api/authors/9f992542-296f-4952-bce3-422027ac")
      .send({
        name: "Hi"
      })
      .expect(400)
      .expect(res => {
        expect(res.body).toEqual({ status: "Error", response: "Invalid ID" });
      })
      .end(done);
  });

  it("should reject updating an author due to invalid Data", done => {
    request(app)
      .put("/api/authors/9f992542-296f-4952-bce3-422027acf99a")
      .send({
        x: "Hi"
      })
      .expect(400)
      .expect(res => {
        expect(res.body).toMatchObject({ status: "Error" });
      })
      .end(done);
  });

  it("should reject updating an author due to ID not existing", done => {
    request(app)
      .put("/api/authors/9f992542-296f-4952-bce3-422027acf99b")
      .send({
        name: "Hi"
      })
      .expect(404)
      .expect(res => {
        expect(res.body).toEqual({
          status: "Error",
          response: "No author with that id exists"
        });
      })
      .end(done);
  });

  {
    // it('should delete an author', (done) => {
    //     request(app)
    //         .delete("/api/authors/540a7938-fe30-4e07-bd84-932745aa8be5")
    //         .expect(200)
    //         .expect((res) => {
    //             expect(res.body).toEqual({ status: "Success", response: "Author removed" });
    //         })
    //         .end(done);
    // });
  }

  it("should reject deleting an author due to invalid ID", done => {
    request(app)
      .delete("/api/authors/9f992542-296f-4952-bce3-422027acf")
      .expect(400)
      .expect(res => {
        expect(res.body).toEqual({ status: "Error", response: "Invalid ID" });
      })
      .end(done);
  });

  it("should reject deleting an author due FK relationship", done => {
    request(app)
      .delete("/api/authors/bca15b9c-3ef2-47a7-8f4d-0ae177c77ee6")
      .expect(400)
      .expect(res => {
        expect(res.body).toEqual({
          status: "Error",
          response: "Can't delete due to FK relationship"
        });
      })
      .end(done);
  });
});

describe("Books", () => {
  it("should return all books", done => {
    request(app)
      .post("/api/books")
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Success"
        });
      })
      .end(done);
  });
});
