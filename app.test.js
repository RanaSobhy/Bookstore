const request = require("supertest");
var validateId = require("uuid-validate");
const expect = require("expect");

var {
  app
} = require("./app");

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
        expect(res.body.response.length).toBe(2);
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

  it('should create a category', (done) => {
    request(app)
      .put("/api/categories")
      .send({
        name: "Ahmed Sobhy"
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({
          status: "Success",
          response: {
            name: "Ahmed Sobhy"
          }
        });
        expect(validateId(res.body.response.id)).toBeTruthy();
      })
      .end(done);
  });

  it("should reject creating a category due to invalid input", done => {
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
        name: "Sameh"
      })
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Success",
          response: {
            name: "Sameh"
          }
        });
      })
      .end(done);
  });

  it("should reject updating a category due to invalid ID", done => {
    request(app)
      .put("/api/categories/9f992542-296f-4952-bce3-422027ac")
      .send({
        name: "Sameh"
      })
      .expect(400)
      .expect(res => {
        expect(res.body).toEqual({
          status: "Error",
          response: "Invalid ID"
        });
      })
      .end(done);
  });

  it("should reject updating a category due to invalid Data", done => {
    request(app)
      .put("/api/categories/9f992542-296f-4952-bce3-422027acf99a")
      .send({
        x: "Sameh"
      })
      .expect(400)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Error"
        });
      })
      .end(done);
  });

  it("should reject updating a category due to ID not existing", done => {
    request(app)
      .put("/api/categories/9f992542-296f-4952-bce3-422027acf99b")
      .send({
        name: "Sameh"
      })
      .expect(404)
      .expect(res => {
        expect(res.body).toEqual({
          status: "Error",
          response: "No category with that ID exists"
        });
      })
      .end(done);
  });

  it('should delete a category', (done) => {
    request(app)
      .delete("/api/categories/540a7938-fe30-4e07-bd84-932745aa8be5")
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({
          status: "Success",
          response: "Category removed"
        });
      })
      .end(done);
  });


  it("should reject deleting a category due to invalid ID", done => {
    request(app)
      .delete("/api/categories/9f992542-296f-4952-bce3-422027acf")
      .expect(400)
      .expect(res => {
        expect(res.body).toEqual({
          status: "Error",
          response: "Invalid ID"
        });
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
        expect(res.body.response.length).toBe(2);
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

  it('should create an author', (done) => {
    request(app)
      .put("/api/authors")
      .send({
        name: "Ahmed Sobhy",
        jobTitle: "Software Engineer"
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({
          status: "Success",
          response: {
            name: "Ahmed Sobhy",
            jobTitle: "Software Engineer"
          }
        });
        expect(validateId(res.body.response.id)).toBeTruthy();
      })
      .end(done);
  });

  it("should reject creating an author due to invalid input", done => {
    request(app)
      .put("/api/authors")
      .send({
        name: "Ahmed Sobhy"
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
      .put("/api/authors/1fb64057-cffc-46e6-a347-4bb5631f0e83")
      .send({
        name: "Sameh",
        jobTitle:"Engineer"
      })
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Success",
          response: {
            name: "Sameh",
        jobTitle:"Engineer"
          }
        });
      })
      .end(done);
  });

  it("should reject updating an author due to invalid ID", done => {
    request(app)
      .put("/api/authors/9f992542-296f-4952-bce3-422027ac")
      .send({
        name: "Sameh"
      })
      .expect(400)
      .expect(res => {
        expect(res.body).toEqual({
          status: "Error",
          response: "Invalid ID"
        });
      })
      .end(done);
  });

  it("should reject updating an author due to invalid Data", done => {
    request(app)
      .put("/api/authors/1fb64057-cffc-46e6-a347-4bb5631f0e83")
      .send({
        x: "Sameh"
      })
      .expect(400)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Error"
        });
      })
      .end(done);
  });

  it("should reject updating an author due to ID not existing", done => {
    request(app)
      .put("/api/authors/1fb64057-cffc-46e6-a347-4bb5631f0e84")
      .send({
        name: "Sameh",
        jobTitle:"Engineer"
      })
      .expect(404)
      .expect(res => {
        expect(res.body).toEqual({
          status: "Error",
          response: "No author with that ID exists"
        });
      })
      .end(done);
  });

  {
    it('should delete an author', (done) => {
      request(app)
        .delete("/api/authors/540a7938-fe30-4e07-bd84-932745aa8be5")
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({
            status: "Success",
            response: "Author removed"
          });
        })
        .end(done);
    });
  }

  it("should reject deleting an author due to invalid ID", done => {
    request(app)
      .delete("/api/authors/9f992542-296f-4952-bce3-422027acf")
      .expect(400)
      .expect(res => {
        expect(res.body).toEqual({
          status: "Error",
          response: "Invalid ID"
        });
      })
      .end(done);
  });

  it("should reject deleting an author due FK relationship", done => {
    request(app)
      .delete("/api/authors/5b66e246-de15-4e28-81c3-070852ee5551")
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

  it("should filter books by title asce and sort them by publishYear desc ", done => {
    request(app)
      .post("/api/books")
      .send({
        filter: {
          title: "Rana Sobhy"
        },
        sort: {
          name: 1,
          publishYear: -1
        }
      })
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Success"
        });
        expect(res.body.response.length).toBe(2);
      })
      .end(done);
  });

  it("should get a page of books with a limit per page", done => {
    request(app)
      .post("/api/books")
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

  it('should create a book', (done) => {
    request(app)
      .put("/api/books")
      .send({
        title: "Ahmed Sobhy",
        author: "8dec0840-5ab5-4e07-8452-a0c787fa8805",
        category:"bca15b9c-3ef2-47a7-8f4d-0ae177c77ee6"
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({
          status: "Success",
          response: {
            title: "Ahmed Sobhy",
            author: "8dec0840-5ab5-4e07-8452-a0c787fa8805",
            category:"bca15b9c-3ef2-47a7-8f4d-0ae177c77ee6"
          }
        });
        expect(validateId(res.body.response.id)).toBeTruthy();
      })
      .end(done);
  });

  it("should reject creating a book due to invalid input", done => {
    request(app)
      .put("/api/books")
      .send({
        title: "Ahmed Sobhy"
      })
      .expect(400)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Error"
        });
      })
      .end(done);
  });

  it("should reject creating a book due to invalid category ID", done => {
    request(app)
      .put("/api/books")
      .send({
        title: "Ahmed Sobhy",
        author: "8dec0840-5ab5-4e07-8452-a0c787fa8805",
        category:"bca15b9c-3ef2-47a7-8f4d-0ae177c7"
      })
      .expect(400)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Error", response: "Invalid category ID"
        });
      })
      .end(done);
  });

  it("should reject creating a book due to invalid author ID", done => {
    request(app)
      .put("/api/books")
      .send({
        title: "Ahmed Sobhy",
        author: "8dec0840-5ab5-4e07-8452-a0c787fa8",
        category:"bca15b9c-3ef2-47a7-8f4d-0ae177c77ee6"
      })
      .expect(400)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Error", response: "Invalid author ID"
        });
      })
      .end(done);
  });

  it("should reject creating a book due to category not existing", done => {
    request(app)
      .put("/api/books")
      .send({
        title: "Ahmed Sobhy",
        author: "8dec0840-5ab5-4e07-8452-a0c787fa8805",
        category:"bca15b9c-3ef2-47a7-8f4d-0ae177c77ee7"
      })
      .expect(404)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Error", response: "Category doesn't exist"
        });
      })
      .end(done);
  });

  it("should reject creating a book due to author not existing", done => {
    request(app)
      .put("/api/books")
      .send({
        title: "Ahmed Sobhy",
        author: "8dec0840-5ab5-4e07-8452-a0c787fa8806",
        category:"bca15b9c-3ef2-47a7-8f4d-0ae177c77ee6"
      })
      .expect(404)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Error", response: "Author doesn't exist"
        });
      })
      .end(done);
  });
  
  it("should update a book", done => {
    request(app)
      .put("/api/books/c7ae9365-3f91-4dca-98d7-2fdfbaf3c169")
      .send({
        title: "Sameh",
        author: "8dec0840-5ab5-4e07-8452-a0c787fa8805",
        category:"bca15b9c-3ef2-47a7-8f4d-0ae177c77ee6"
      })
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Success",
          response: {
            title: "Sameh",
            author: "8dec0840-5ab5-4e07-8452-a0c787fa8805",
            category:"bca15b9c-3ef2-47a7-8f4d-0ae177c77ee6"
          }
        });
      })
      .end(done);
  });

  it("should reject updating a book due to invalid ID", done => {
    request(app)
      .put("/api/books/9f992542-296f-4952-bce3-422027ac")
      .send({
        name: "Sameh"
      })
      .expect(400)
      .expect(res => {
        expect(res.body).toEqual({
          status: "Error",
          response: "Invalid ID"
        });
      })
      .end(done);
  });

  it("should reject updating a book due to invalid Data", done => {
    request(app)
      .put("/api/books/9f992542-296f-4952-bce3-422027acf99a")
      .send({
        title: "Sameh"
      })
      .expect(400)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Error"
        });
      })
      .end(done);
  });

  it("should reject updating a book due to ID not existing", done => {
    request(app)
      .put("/api/books/9f992542-296f-4952-bce3-422027acf99b")
      .send({
        title: "Sameh",
        author: "8dec0840-5ab5-4e07-8452-a0c787fa8805",
        category:"bca15b9c-3ef2-47a7-8f4d-0ae177c77ee6"
      })
      .expect(404)
      .expect(res => {
        expect(res.body).toEqual({
          status: "Error",
          response: "No book with that ID exists"
        });
      })
      .end(done);
  });

  it("should reject updating a book due to invalid category ID", done => {
    request(app)
      .put("/api/books/c7ae9365-3f91-4dca-98d7-2fdfbaf3c169")
      .send({
        title: "Ahmed Sobhy",
        author: "8dec0840-5ab5-4e07-8452-a0c787fa8805",
        category:"bca15b9c-3ef2-47a7-8f4d-0ae177c7"
      })
      .expect(400)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Error", response: "Invalid category ID"
        });
      })
      .end(done);
  });

  it("should reject updating a book due to invalid author ID", done => {
    request(app)
      .put("/api/books/c7ae9365-3f91-4dca-98d7-2fdfbaf3c169")
      .send({
        title: "Ahmed Sobhy",
        author: "8dec0840-5ab5-4e07-8452-a0c787fa8",
        category:"bca15b9c-3ef2-47a7-8f4d-0ae177c77ee6"
      })
      .expect(400)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Error", response: "Invalid author ID"
        });
      })
      .end(done);
  });

  it("should reject updating a book due to category not existing", done => {
    request(app)
      .put("/api/books/c7ae9365-3f91-4dca-98d7-2fdfbaf3c169")
      .send({
        title: "Ahmed Sobhy",
        author: "8dec0840-5ab5-4e07-8452-a0c787fa8805",
        category:"bca15b9c-3ef2-47a7-8f4d-0ae177c77ee7"
      })
      .expect(404)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Error", response: "Category doesn't exist"
        });
      })
      .end(done);
  });

  it("should reject updating a book due to author not existing", done => {
    request(app)
      .put("/api/books/c7ae9365-3f91-4dca-98d7-2fdfbaf3c169")
      .send({
        title: "Ahmed Sobhy",
        author: "8dec0840-5ab5-4e07-8452-a0c787fa8806",
        category:"bca15b9c-3ef2-47a7-8f4d-0ae177c77ee6"
      })
      .expect(404)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Error", response: "Author doesn't exist"
        });
      })
      .end(done);
  });


  it('should delete a book', (done) => {
    request(app)
      .delete("/api/books/540a7938-fe30-4e07-bd84-932745aa8be5")
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({
          status: "Success",
          response: "Book removed"
        });
      })
      .end(done);
  });



  it("should reject deleting a book due to invalid ID", done => {
    request(app)
      .delete("/api/books/9f992542-296f-4952-bce3-422027acf")
      .expect(400)
      .expect(res => {
        expect(res.body).toEqual({
          status: "Error",
          response: "Invalid ID"
        });
      })
      .end(done);
  });
});