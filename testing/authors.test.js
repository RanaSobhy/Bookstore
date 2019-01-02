const request = require("supertest");
var validateId = require("uuid-validate");
const expect = require("expect");

var { app } = require("../app");

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

  it("should create an author", done => {
    request(app)
      .put("/api/authors")
      .send({
        name: "Ahmed Sobhy",
        jobTitle: "Software Engineer"
      })
      .expect(200)
      .expect(res => {
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

  it("should reject creating an author due to it already existing", done => {
    request(app)
      .put("/api/authors")
      .send({
        name: "Miss Simeon O'Keefe",
        jobTitle: "Software Engineer"
      })
      .expect(400)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Error",
          response: "Author already exists"
        });
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
        jobTitle: "Engineer"
      })
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchObject({
          status: "Success",
          response: {
            name: "Sameh",
            jobTitle: "Engineer"
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
        jobTitle: "Engineer"
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
    it("should delete an author", done => {
      request(app)
        .delete("/api/authors/540a7938-fe30-4e07-bd84-932745aa8be5")
        .expect(200)
        .expect(res => {
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
