import assert from 'assert';
import request from 'supertest';
import app from '../index';

describe('the Welcome/api endpoint', () => {
  it('Welcome message', async () => {
    const response = await request(app).get('/');
    assert.equal(response.text, 'Hello from Quick Credit');
    assert.equal(response.statusCode, 200);
  });
});

describe('the signup /signup api endpoint', () => {
  it('returns a newly created user', async () => {
    const payload = {
      firstname: 'Nantha',
      lastname: 'J',
      email: 'joy@gmail.com',
      password: 'hello',
      address: 'ikeja Gra',
      bvn: '22307021876',
    };
    const { body, status } = await request(app).post('/api/v1/signup').send(payload);
    const {
      data,
      message,
      success,
    } = body;
    assert.equal(status, 201);
    assert.equal(message, 'Great! Sign up successful');
    assert.equal(success, true);
    assert.equal(data.isAdmin, false);
    assert.ok(data.id);
    assert.ok(data.password);
    assert.equal(data.bvn, payload.bvn);
    assert.equal(data.token, 'Bearer 1234567899999888');
    assert.equal(data.firstname, payload.firstname);
    assert.equal(data.lastname, payload.lastname);
    assert.equal(data.email, payload.email);
    assert.equal(data.address, payload.address);
    assert.equal(data.status, 'unverified');
  });
  it('signup returns a 400 ', async () => {
    const payload = {};
    const response = await request(app).post('/api/v1/signup').send(payload);
    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
    assert.ok(response.body.error);
  });
});

describe('the signin /signin endpoint', () => {
  it('the user signin', async () => {
    const payload = {
      email: 'joy@gmail.com',
      password: 'hello',
    };
    const { body, status } = await request(app).post('/api/v1/signin').send(payload);
    const {
      data,
      message,
      success,
    } = body;
    assert.equal(success, true);
    assert.equal(message, 'Great! login successful');
    assert.ok(data.password);
    assert.equal(data.email, payload.email);
    assert.ok(data.status);
    assert.ok(data.id);
    assert.ok(data.firstname);
    assert.ok(data.lastname);
    assert.equal(status, 200);
  });
  it('returns a 400 ', async () => {
    const payload = {};
    const { body, status } = await request(app).post('/api/v1/signin').send(payload);
    assert.equal(body.success, false);
    assert.ok(body.error);
    assert.equal(status, 400);
  });
  it('returns a 404 ', async () => {
    const payload = {
      email: 'joy6@gmail.com',
      password: 'hello',
    };
    const { body, status } = await request(app).post('/api/v1/signin').send(payload);
    assert.equal(body.success, false);
    assert.equal(body.error, `User with this email address ${payload.email} does not exist`);
    assert.equal(status, 404);
  });
});

describe('the repayment history /loans/:loanId/repayments api endpoint', () => {
  it('View loan repayment history', async () => {
    const { body, status } = await request(app).get('/api/v1/loans/5661233/repayments');
    assert.equal(body.success, true);
    assert.ok(body.data);
    assert.equal(status, 200);
  });
});

describe('the POST /loans/<:loan-id>/repayment', () => {
  it('Create a loan repayment record', async () => {
    const payload = {
      amount: 10000,
      userId: '612332',
      monthlyInstallment: 1312.5,
      paidAmount: '1000',
    };
    const params = '827350';
    const { body, status } = await request(app).post(`/api/v1/loans/${params}/repayment`).send(payload);
    assert.equal(body.success, true);
    assert.ok(body.data);
    assert.ok(body.data.id);
    assert.ok(body.data.userId);
    assert.equal(body.data.loanId, params);
    assert.equal(body.data.paidAmount, payload.paidAmount);
    assert.ok(body.data.balance);
    assert.ok(body.data.createdOn);
    assert.equal(body.data.monthlyInstallment, payload.monthlyInstallment);
    assert.equal(status, 200);
  });
  it('Create a loan repayment record', async () => {
    const payload = {
      amount: 10000,
      userId: '612332',
      monthlyInstallment: 1312.5,
      paidAmount: '1000',
    };
    const params = '827350';
    const { body, status } = await request(app).post(`/api/v1/loans/${params}/repayment`).send(payload);
    assert.equal(body.success, true);
    assert.ok(body.data);
    assert.ok(body.data.id);
    assert.ok(body.data.userId);
    assert.equal(body.data.loanId, params);
    assert.equal(body.data.paidAmount, payload.paidAmount);
    assert.ok(body.data.balance);
    assert.ok(body.data.createdOn);
    assert.equal(body.data.monthlyInstallment, payload.monthlyInstallment);
    assert.equal(status, 200);
  });
  it('Create a loan repayment record returns 400', async () => {
    const params = '82735099';
    const { body, status } = await request(app).post(`/api/v1/loans/${params}/repayment`);
    assert.equal(body.success, false);
    assert.ok(body.error);
    assert.equal(status, 400);
    assert.equal(body.error, 'Error! Loan application does not exist');
  });
});
describe('GET /loans', () => {
  it('Get all loans', async () => {
    const { body, status } = await request(app).get('/api/v1/loans');
    assert.equal(body.success, true);
    assert.ok(body.data);
    assert.equal(status, 200);
  });

  it('Get all loans returns 400', async () => {
    const { body, status } = await request(app).get('/api/v1/loans?status=approveds');
    assert.equal(body.success, false);
    assert.ok(body.error);
    assert.equal(status, 400);
    assert.equal(body.error, 'Oops, Invalid query parameter');
  });

  it('Get all loans returns 400 on invalid querys', async () => {
    const { body, status } = await request(app).get('/api/v1/loans?status').query({ status: 'approvedy', repaid: 'truei' });
    assert.equal(status, 400);
    assert.equal(body.error, 'Oops, Invalid query parameter');
  });
  it('Get all loans returns 400 on invalid status query parmeter', async () => {
    const { body, status } = await request(app).get('/api/v1/loans?status').query({ status: 'approvedy' });
    assert.equal(status, 400);
    assert.equal(body.error, 'Oops, Invalid query parameter');
  });
});

describe('POST /loans api endpoint', () => {
  it('Create a loan application', async () => {
    const payload = {
      amount: 10000,
      tenor: 8,
      loanType: 'SF',
      accountNo: '2048801364',
      userId: '612332',
    };

    const { body, status } = await request(app).post('/api/v1/loans/').send(payload);
    assert.equal(body.success, true);
    assert.ok(body.data);
    assert.equal(status, 201);
  });
  it('Create a loan application returns 400', async () => {
    const payload = {};
    const { body, status } = await request(app).post('/api/v1/loans/').send(payload);
    assert.equal(body.success, false);
    assert.ok(body.error);
    assert.equal(status, 400);
  });
  it('Create a loan application returns 404', async () => {
    const payload = {
      amount: 10000,
      tenor: 8,
      loanType: 'SF',
      accountNo: '2048801364',
      userId: '6123382',
    };
    const { body, status } = await request(app).post('/api/v1/loans/').send(payload);
    assert.equal(body.success, false);
    assert.ok(body.error);
    assert.equal(status, 404);
    assert.equal(body.error, 'Invalid User details');
  });
});

describe('PATCH /loans/<:loan-id>', () => {
  it('Approve or reject a loan application', async () => {
    const payload = {
      status: 'rejected',
    };
    const params = '827350';
    const { body, status } = await request(app).patch(`/api/v1/loans/${params}`).send(payload);
    assert.equal(body.success, true);
    assert.ok(body.data);
    assert.equal(status, 200);
  });
  it('Approve or reject a loan application returns 400', async () => {
    const payload = {};
    const params = '827350';
    const { body, status } = await request(app).patch(`/api/v1/loans/${params}`).send(payload);
    assert.equal(body.success, false);
    assert.ok(body.error);
    assert.equal(status, 400);
    assert.equal(body.error, 'Error! status can only be approved or rejected');
  });
  it('Approve or reject a loan application returns 404', async () => {
    const payload = {
      status: 'rejected',
    };
    const params = '82735099';
    const { body, status } = await request(app).patch(`/api/v1/loans/${params}`).send(payload);
    assert.equal(body.success, false);
    assert.ok(body.error);
    assert.equal(status, 404);
    assert.equal(body.error, 'Error, loan application does not exist');
  });
});

describe('/GET /loans/<:loan-id>', () => {
  it('Get a specific loan application', async () => {
    const params = '827350';
    const { body, status } = await request(app).get(`/api/v1/loans/${params}`);
    assert.equal(body.success, true);
    assert.ok(body.data);
    assert.equal(status, 200);
  });

  it('Get a specific loan application returns 404', async () => {
    const params = '82735099';
    const { body, status } = await request(app).get(`/api/v1/loans/${params}`);
    assert.equal(body.success, false);
    assert.ok(body.error);
    assert.equal(status, 404);
    assert.equal(body.error, 'Error, loan application does not exist');
  });
});

describe('PATCH /users/<:user-email>/verify', () => {
  it('Mark a user as verified', async () => {
    const params = 'joy@gmail.com';
    const { body, status } = await request(app).patch(`/api/v1/users/${params}/verify`);
    assert.equal(body.success, true);
    assert.ok(body.data);
    assert.equal(status, 200);
  });
  it('Mark a user as verified returns 400', async () => {
    const params = '827350';
    const { body, status } = await request(app).patch(`/api/v1/users/${params}/verify`);
    assert.equal(body.success, false);
    assert.ok(body.error);
    assert.equal(status, 400);
  });
  it('Mark a user as verified returns 404', async () => {
    const params = 'jiiioy@gmail.com';
    const { body, status } = await request(app).patch(`/api/v1/users/${params}/verify`);
    assert.equal(body.success, false);
    assert.ok(body.error);
    assert.equal(status, 404);
    assert.equal(body.error, `User with ${params} not found, confirm email address`);
  });
});