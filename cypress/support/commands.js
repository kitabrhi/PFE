function loginViaAAD(username, password) {
  cy.visit('https://redsumeb2c.b2clogin.com/redsumeb2c.onmicrosoft.com/b2c_1a_redsen_signup_signin/oauth2/v2.0/authorize?client_id=8d75626b-cfb5-4ea2-9ff7-a054b817818f&scope=openid%20profile%20offline_access&redirect_uri=https%3A%2F%2Fredsumedev.z6.web.core.windows.net%2F&client-request-id=057ad937-10d0-4068-932a-1535197cda8b&response_mode=fragment&response_type=code&x-client-SKU=msal.js.browser&x-client-VER=3.0.2&client_info=1&code_challenge=nzVFASxcb-RQ46_KHSN3aXDSuUVXqSUcApy8bBdbmR4&code_challenge_method=S256&nonce=a13437d7-66f5-4a88-a792-9c8f8c0b6cbf&state=eyJpZCI6ImQyNTNiNjI5LTk1NzQtNGZiMy04NTk2LWQ2OTk2ZjQ5Mzc4OCIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicmVkaXJlY3QifX0%3D');
 
  // Login to your AAD tenant.
  cy.origin(
    'https://redsumeb2c.b2clogin.com/redsumeb2c.onmicrosoft.com/b2c_1a_redsen_signup_signin/oauth2/v2.0/authorize?client_id=8d75626b-cfb5-4ea2-9ff7-a054b817818f&scope=openid%20profile%20offline_access&redirect_uri=https%3A%2F%2Fredsumedev.z6.web.core.windows.net%2F&client-request-id=057ad937-10d0-4068-932a-1535197cda8b&response_mode=fragment&response_type=code&x-client-SKU=msal.js.browser&x-client-VER=3.0.2&client_info=1&code_challenge=nzVFASxcb-RQ46_KHSN3aXDSuUVXqSUcApy8bBdbmR4&code_challenge_method=S256&nonce=a13437d7-66f5-4a88-a792-9c8f8c0b6cbf&state=eyJpZCI6ImQyNTNiNjI5LTk1NzQtNGZiMy04NTk2LWQ2OTk2ZjQ5Mzc4OCIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicmVkaXJlY3QifX0%3D',
    {
      args: {
        username,
        password,
      },
    },
    ({ username, password }) => {
      cy.get('input[id="signInName"]').type(username, {
        log: false,
      });
      cy.get('input[id="password"]').type(password, {
        log: false,
      });
      cy.get('button[type="submit"]').click();
    }
  );
 
  cy.url().should('include', '/home');
}
 
Cypress.Commands.add('loginViaAAD', (username, password) => {
  cy.session([username, password], () => {
    const log = Cypress.log({
      displayName: 'Azure Active Directory Login',
      message: [`🔐 Authenticating | ${username}`],
      autoEnd: false,
    });
    log.snapshot('before');
 
    loginViaAAD(username, password);
 
    log.snapshot('after');
    log.end();
  });
});