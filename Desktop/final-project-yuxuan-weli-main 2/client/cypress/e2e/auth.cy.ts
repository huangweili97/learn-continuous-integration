describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should show login and signup buttons', () => {
    cy.get('[data-testid="login-button"]').should('be.visible')
    cy.get('[data-testid="signup-button"]').should('be.visible')
  })

  it('should open signup modal when clicking signup button', () => {
    cy.get('[data-testid="signup-button"]').click()
    cy.get('[data-testid="signup-modal"]').should('be.visible')
  })

  it('should show validation messages for empty fields', () => {
    cy.get('[data-testid="signup-button"]').click()
    cy.get('[data-testid="submit-button"]').click()
    
    cy.get('[data-testid="username-error"]').should('be.visible')
    cy.get('[data-testid="email-error"]').should('be.visible')
    cy.get('[data-testid="password-error"]').should('be.visible')
    cy.get('[data-testid="confirm-password-error"]').should('be.visible')
  })
}) 