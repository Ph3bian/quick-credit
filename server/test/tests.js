import assert from 'assert';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../index';
import connection from '../database/connection';
import userModel from '../database/models/user';
import loanModel from '../database/models/loan';
import config from '../config/index';

const userPayload = {
  firstName: 'Nanri',
  lastName: 'Jri',
  email: 'ladi@gmail.com',
  password: 'hello78090',
  address: 'ikeja Gra',
  bvn: '22307087690',
};

const getToken = async () => {
  const result = await userModel.create(userPayload);
  const user = result.rows[0];
  const token = jwt.sign({ id: user.id }, config.jwtSecret);
  return {
    user,
    token,
  };
};

// eslint-disable-next-line no-undef
beforeEach(async () => {
  await connection.query('DELETE FROM  loans;');
  await connection.query('DELETE FROM  users;');
});
describe('GET / ', () => {
  it('Welcome message', async () => {
    const response = await request(app).get('/');
    assert.equal(response.text, 'Hello from Quick Credit');
    assert.equal(response.statusCode, 200);
  });
});
describe('GET /<wrong route> ', () => {
  it('Welcome message', async () => {
    const response = await request(app).get('/aiol');
    assert.equal(response.text, 'Not found');
    assert.equal(response.statusCode, 404);
  });
});

describe('POST /auth/signup', () => {
  it('returns a newly created user', async () => {
    const { body, status } = await request(app).post('/api/v1/auth/signup').send(userPayload);
    const {
      data,
      message,
      success,
    } = body;

    assert.equal(status, 201);
    assert.equal(message, 'Sign up successful');
    assert.equal(success, true);
    assert.ok(data.id);
    assert.ok(data.token);
    assert.equal(data.bvn, userPayload.bvn);
    assert.equal(data.firstname, userPayload.firstName);
    assert.equal(data.lastname, userPayload.lastName);
    assert.equal(data.email, userPayload.email);
    assert.equal(data.address, userPayload.address);
    assert.equal(data.status, 'unverified');
  });
  it('POST /auth/signup: Invalid password length', async () => {
    const payload = {
      firstName: 'Nantha',
      lastName: 'J',
      email: 'joy34@gmail.com',
      password: 4,
      address: 'ikeja Gra',
      bvn: '22307021876',
    };
    const { body, status } = await request(app).post('/api/v1/auth/signup').send(payload);
    assert.equal(status, 422);
    assert.equal(body.success, false);
    assert.ok(body.error);
  });
  it('POST /auth/signup: signup returns a 422 ', async () => {
    const payload = {};
    const response = await request(app).post('/api/v1/auth/signup').send(payload);
    assert.equal(response.status, 422);
    assert.equal(response.body.success, false);
    assert.ok(response.body.error);
  });
  it('POST /auth/signup: email already exists', async () => {
    const { user } = await getToken();
    const payload = {
      firstName: 'Nanri',
      lastName: 'Jri',
      email: 'ladi@gmail.com',
      password: 'hello78090',
      address: 'ikeja Gra',
      bvn: '22307087690',
    };
    const response = await request(app).post('/api/v1/auth/signup').send(payload);
    assert.equal(response.status, 422);
    assert.ok(response.body.error);
    assert.equal(response.body.error, 'Email has already been taken');
  });
});

describe('POST /auth/signin', () => {
  it('the user signin', async () => {
    await userModel.create(userPayload);
    const { body, status } = await request(app).post('/api/v1/auth/signin').send(userPayload);
    const {
      data,
      message,
    } = body;

    assert.equal(message, 'Login successful');
    assert.ok(data.token);
    assert.equal(data.email, userPayload.email);
    assert.ok(data.status);
    assert.ok(data.id);
    assert.ok(data.firstname);
    assert.ok(data.lastname);
    assert.equal(status, 200);
  });
  it('POST /auth/signin: returns a 422 ', async () => {
    const payload = {};
    const { body, status } = await request(app).post('/api/v1/auth/signin').send(payload);
    assert.equal(body.success, false);
    assert.ok(body.error);
    assert.equal(status, 422);
  });
  it('POST /auth/signin: returns a 404 ', async () => {
    const payload = {
      email: 'joy6@gmail.com',
      password: 'hello',
    };
    const { body, status } = await request(app).post('/api/v1/auth/signin').send(payload);
    assert.equal(body.success, false);
    assert.ok(body.error);
    assert.equal(status, 404);
  });
});


describe('GET /loans/:loanId/repayments', () => {
  it('View loan repayment history', async () => {
    const { body, status } = await request(app)
      .get('/api/v1/loans/5661233/repayments');
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
  it('the POST /loans/<:loan-id>/repayment: Create a loan repayment record', async () => {
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
  it('the POST /loans/<:loan-id>/repayment: returns 400', async () => {
    const params = '82735099';
    const { body, status } = await request(app).post(`/api/v1/loans/${params}/repayment`).send();
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

  it('GET /loans: returns 422', async () => {
    const { body, status } = await request(app).get('/api/v1/loans?status=approveds');
    assert.equal(body.success, false);
    assert.ok(body.error);
    assert.equal(status, 422);
    assert.equal(body.error, 'Oops, Invalid query parameter');
  });

  it('GET /loans: returns 422 on invalid querys', async () => {
    const { body, status } = await request(app).get('/api/v1/loans?status').query({ status: 'approvedy', repaid: 'truei' });
    assert.equal(status, 422);
    assert.equal(body.error, 'Oops, Invalid query parameter');
  });
  it('GET /loans: returns 422 on invalid status query parmeter', async () => {
    const { body, status } = await request(app).get('/api/v1/loans?status').query({ status: 'approvedy' });
    assert.equal(status, 422);
    assert.equal(body.error, 'Oops, Invalid query parameter');
  });
});

describe('POST /loans', () => {
  it('Create a loan application', async () => {
    const { user } = await getToken();
    const payload = {
      amount: 2000,
      tenor: 6,
      interest: 100,
      loanType: 'SF',
      accountNo: '2048801364',
      userId: user.id,
    };
    const { body, status } = await request(app).post('/api/v1/loans/').send(payload);
    assert.ok(body.loan);
    assert.equal(status, 201);
  });
  it('POST /loans: Error', async () => {
    const payload = {
      amount: 10000,
      tenor: 8,
      loanType: 'SF',
      accountNo: '2048801364',
      bankName: 'Skyebank',
      userId: '612332',
    };

    const { body, status } = await request(app).post('/api/v1/loans/').send(payload);
    assert.equal(body.success, false);
    assert.ok(body.error);
    assert.equal(status, 400);
  });
  it('POST /loans: returns 400', async () => {
    const payload = {};
    const { body, status } = await request(app).post('/api/v1/loans/').send(payload);
    assert.equal(body.success, false);
    assert.ok(body.error);
    assert.equal(status, 422);
  });
  it('POST /loans: returns 400', async () => {
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
    assert.equal(status, 400);
    assert.ok(body.error);
  });
  it('POST /loans: negative amount', async () => {
    const payload = {
      amount: -10000,
      tenor: '',
      loanType: 'SF',
      accountNo: '2048801364',
      bankName: 'Skyebank',
      userId: '612332',
    };
    const { body, status } = await request(app).post('/api/v1/loans/').send(payload);
    assert.equal(body.success, false);
    assert.ok(body.error);
    assert.equal(status, 422);
    assert.ok(body.error);
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
  it('Approve or reject a loan application returns 400', async () => {
    const payload = {
      status: 'rejected',
    };
    const params = '82735099';
    const { body, status } = await request(app).patch(`/api/v1/loans/${params}`).send(payload);
    assert.equal(body.success, false);
    assert.ok(body.error);
    assert.equal(status, 400);
    assert.equal(body.error, 'Error, loan application does not exist');
  });
});

describe('/GET /loans/<:loan-id>', () => {
  it('Get a specific loan application', async () => {
    const { user, token } = await getToken();
    const result = await loanModel.create({
      amount: 2000,
      tenor: 6,
      interest: 100,
      userId: user.id,
      loanType: 'SF',
      accountNo: '2048801364',
    });
    const params = result.rows[0];
    const { body, status } = await request(app).get(`/api/v1/loans/${params.id}`).send({ token });
    // assert.equal(body.success, true);
    assert.ok(body.data);
    assert.equal(status, 200);
  });

  it('Get a specific loan application returns 401', async () => {
    const params = '82735099';
    const { body, status } = await request(app).get(`/api/v1/loans/${params}`);
    assert.ok(body.error);
    assert.equal(status, 401);
    assert.ok(body.error);
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
    assert.equal(status, 422);
  });
  it('Mark a user as verified returns 404', async () => {
    const params = 'jiiioy@gmail.com';
    const { body, status } = await request(app).patch(`/api/v1/users/${params}/verify`);
    assert.equal(body.success, false);
    assert.ok(body.error);
    assert.equal(status, 404);
    assert.equal(body.error, 'User does not exist');
  });
});
