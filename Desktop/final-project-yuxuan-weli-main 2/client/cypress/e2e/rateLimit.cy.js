describe("Rate Limiting Tests", () => {
  beforeEach(() => {
    cy.exec("npm run --prefix ../server remove_db mongodb://127.0.0.1:27017/fake_so");
    cy.exec("npm run --prefix ../server populate_db mongodb://127.0.0.1:27017/fake_so");
    cy.visit("http://localhost:3000");
  });

  it("should allow posting a question after waiting", () => {
    // 第一次发帖
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("First Question");
    cy.get("#formTextInput").type("First question content");
    cy.get("#formTagInput").type("javascript");
    cy.get("#formUsernameInput").type("testuser");
    cy.contains("Post Question").click();

    // 等待1分钟
    cy.wait(61000); // 等待61秒以确保超过限制时间

    // 第二次发帖
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Second Question");
    cy.get("#formTextInput").type("Second question content");
    cy.get("#formTagInput").type("javascript");
    cy.get("#formUsernameInput").type("testuser");
    cy.contains("Post Question").click();

    // 验证第二个问题是否成功发布
    cy.contains("Second Question").should("exist");
  });

  it("should block frequent question posting", () => {
    // 第一次发帖
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("First Question");
    cy.get("#formTextInput").type("First question content");
    cy.get("#formTagInput").type("javascript");
    cy.get("#formUsernameInput").type("testuser");
    cy.contains("Post Question").click();

    // 立即尝试第二次发帖
    cy.contains("Ask a Question").click();
    cy.get("#formTitleInput").type("Second Question");
    cy.get("#formTextInput").type("Second question content");
    cy.get("#formTagInput").type("javascript");
    cy.get("#formUsernameInput").type("testuser");
    cy.contains("Post Question").click();

    // 验证是否显示限频错误消息
    cy.contains("You are posting too frequently").should("exist");
    
    // 验证表单输入被保留
    cy.get("#formTitleInput").should("have.value", "Second Question");
    cy.get("#formTextInput").should("have.value", "Second question content");
    cy.get("#formTagInput").should("have.value", "javascript");
    cy.get("#formUsernameInput").should("have.value", "testuser");
  });
}); 