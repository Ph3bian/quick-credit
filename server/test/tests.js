import assert from 'assert';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../index';
import connection from '../database/connection';
import userModel from '../database/models/user';
import loanModel from '../database/models/loan';
import repaymentModel from '../database/models/repayment';
import config from '../config/index';

const userPayload = {
  firstName: 'nanri',
  lastName: 'jri',
  email: 'ladi@gmail.com',
  password: 'hello78090',
  address: 'ikeja Gra',
  bvn: '22307087690',
};
const userData = {
  firstName: 'nanri',
  lastName: 'jri',
  email: 'helon@gmail.com',
  password: 'hello78090',
  address: 'ikoyi lagos',
  bvn: '22307087690',
};

const getToken = async () => {
  try {
    const result = await userModel.create(userPayload);
    const details = await userModel.create(userData);
    const user = result.rows[0];
    const userdetails = details.rows[0];
    const token = jwt.sign({ id: user.id }, config.jwtSecret);
    const usertoken = jwt.sign({ id: userdetails.id }, config.jwtSecret);
    return {
      user,
      token,
      userdetails,
      usertoken,
    };
  } catch (e) {
    return console.log(e);
  }
};


// eslint-disable-next-line no-undef
beforeEach(async () => {
  await connection.query('DELETE FROM  repayments;');
  await connection.query('DELETE FROM  loans;');
  await connection.query('DELETE FROM  users;');
});
describe('GET / ', () => {
  it('Welcome message', async () => {
    const { body } = await request(app).get('/');

    assert.equal(body.message, 'Hello from Quick Credit');
    assert.equal(body.status, 200);
  });
});
describe('GET /<wrong route> ', () => {
  it('Welcome message', async () => {
    const { body } = await request(app).get('/aiol');
    const { status, error } = body;
    assert.equal(error, 'Route not found');
    assert.equal(status, 404);
  });
});

describe('POST /auth/signup', () => {
  it('returns a newly created user', async () => {
    const { body, status } = await request(app).post('/api/v1/auth/signup').send(userPayload);
    const {
      data,
      message,
    } = body;


    assert.equal(status, 201);
    assert.equal(message, 'Sign up successful');
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
    assert.ok(body.error);
  });
  it('POST /auth/signup: signup returns a 422 ', async () => {
    const payload = {};
    const response = await request(app).post('/api/v1/auth/signup').send(payload);
    assert.equal(response.status, 422);
    assert.ok(response.body.error);
  });
  it('POST /auth/signup: email already exists', async () => {
    // eslint-disable-next-line no-unused-vars
    const { user } = await getToken();
    const payload = {
      firstName: 'nanri',
      lastName: 'jri',
      email: 'ladi@gmail.com',
      password: 'hello78090',
      address: 'ikeja Gra',
      bvn: '22307087690',
    };
    const response = await request(app).post('/api/v1/auth/signup').send(payload);
    assert.equal(response.status, 409);
    assert.ok(response.body.error);
    assert.equal(response.body.error, 'Email has already been taken');
  });
  it('invalid password length ', async () => {
    const payload = {};
    const response = await request(app).post('/api/v1/signup').send(payload);
    assert.equal(response.status, 404);
    assert.ok(response.body.error);
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
    assert.ok(body.error);
    assert.equal(status, 422);
  });

  it('POST /auth/signin: returns a 401 ', async () => {
    const payload = {
      email: 'joy6@gmail.com',
      password: 'hello',
    };
    const { body, status } = await request(app).post('/api/v1/auth/signin').send(payload);
    assert.ok(body.error);
    assert.equal(status, 401);
  });
});


describe('GET /loans/:loanId/repayments', () => {
  it('View loan repayment history', async () => {
    const { token } = await getToken();
    const { body } = await request(app)
      .get('/api/v1/loans/5661233/repayments').set('token', token);
    assert.ok(body.data);
    assert.equal(body.status, 200);
  });
});

describe('GET /loans', () => {
  it('Get all loans', async () => {
    const { user, token } = await getToken();
    await userModel.updateAdminStatus(user.email);

    const { body, status } = await request(app).get('/api/v1/loans').set('token', token);
    assert.ok(body.data);
    assert.equal(status, 200);
  });

  it('GET /loans: returns 422', async () => {
    const { user, token } = await getToken();
    await userModel.updateAdminStatus(user.email);
    const { body, status } = await request(app).get('/api/v1/loans?status=approveds').set('token', token);
    assert.ok(body.error);
    assert.equal(status, 422);
    assert.equal(body.error, 'Oops, Invalid query parameter');
  });

  it('GET /loans: returns 422 on invalid querys', async () => {
    const { user, token } = await getToken();
    await userModel.updateAdminStatus(user.email);
    const { body, status } = await request(app).get('/api/v1/loans?status').query({ status: 'approvedy', repaid: 'truei' }).set('token', token);

    assert.equal(status, 422);
    assert.equal(body.error, 'Oops, Invalid query parameter');
  });
  it('GET /loans: returns 422 on invalid status query parmeter', async () => {
    const { user, token } = await getToken();
    await userModel.updateAdminStatus(user.email);
    const { body, status } = await request(app).get('/api/v1/loans?status').query({ status: 'approvedy' }).set('token', token);

    assert.equal(status, 422);
    assert.equal(body.error, 'Oops, Invalid query parameter');
  });
  it('GET /loans: returns 401 on unathorized access', async () => {
    const { body, status } = await request(app).get('/api/v1/loans?status').query({ status: 'approvedy' });
    assert.equal(status, 401);
    assert.equal(body.error, 'Unauthenticated User');
  });
});
describe('GET /users', () => {
  it('Get all loans', async () => {
    const { user, token } = await getToken();
    await userModel.updateAdminStatus(user.email);

    const { body, status } = await request(app).get('/api/v1/users').set('token', token);
    assert.ok(body.data);
    assert.equal(status, 200);
  });


  it('GET /users: returns 401 on unathorized access', async () => {
    const { body, status } = await request(app).get('/api/v1/users');
    assert.equal(status, 401);
    assert.equal(body.error, 'Unauthenticated User');
  });
});
describe('POST /loans', () => {
  it('Create a loan application', async () => {
    const {
      user,
      token,
      userdetails,
      usertoken,
    } = await getToken();
    await userModel.updateAdminStatus(user.email);
    await request(app).patch(`/api/v1/users/${userdetails.email}/verify`).set('token', token);
    const payload = {
      amount: 2000,
      tenor: 6,
      interest: 100,
      loanType: 'SF',
      accountNo: '2048801364',
    };
    const resp = await request(app).post('/api/v1/loans/').send({ ...payload, userId: userdetails.id }).set('token', usertoken);
    assert.ok(resp.body);
    assert.equal(resp.body.status, 201);
  });
  it('POST /loans: Error 401', async () => {
    const payload = {
      amount: 10000,
      tenor: 8,
      loanType: 'SF',
      accountNo: '2048801364',
      bankName: 'Skye',
    };

    const { body, status } = await request(app).post('/api/v1/loans/').send(payload);
    assert.ok(body.error);
    assert.equal(status, 401);
  });
  it('POST /loans: returns 400', async () => {
    const { token } = await getToken();
    const payload = {};
    const { body, status } = await request(app).post('/api/v1/loans/').send(payload).set('token', token);
    assert.ok(body.error);
    assert.equal(status, 422);
  });
  it('POST /loans: returns 400', async () => {
    const { token } = await getToken();
    const payload = {
      amount: 10000,
      tenor: 8,
      loanType: 'SF',
      accountNo: '2048801364',
    };
    const { body, status } = await request(app).post('/api/v1/loans/').send(payload).set('token', token);
    assert.ok(body.error);
    assert.equal(status, 400);
    assert.ok(body.error);
  });
  it('POST /loans: negative amount', async () => {
    const { token } = await getToken();
    const payload = {
      amount: -10000,
      tenor: '',
      loanType: 'SF',
      accountNo: '2048801364',
      bankName: 'Skyebank',
    };
    const { body, status } = await request(app).post('/api/v1/loans/').send(payload).set('token', token);
    assert.ok(body.error);
    assert.equal(status, 422);
    assert.ok(body.error);
  });
});

describe('/GET /loans/<:loan-id>', () => {
  it('Get a specific loan application', async () => {
    const {
      user,
      token,
      userdetails,
    } = await getToken();

    await userModel.updateAdminStatus(user.email);
    const result = await loanModel.create({
      amount: 2000,
      tenor: 6,
      interest: 100,
      loanType: 'SF',
      accountNo: '2048801364',
      userId: userdetails.id,
    });
    const params = result.rows[0];
    const { body, status } = await request(app).get(`/api/v1/loans/${params.id}`).set('token', token);
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
describe('/GET /Users', () => {
  it('Get all users', async () => {
    const { user, token } = await getToken();
    await userModel.updateAdminStatus(user.email);
    const { body, status } = await request(app).get('/api/v1/users').set('token', token);
    assert.ok(body.data);
    assert.equal(status, 200);
  });
});

describe('PATCH /users/<:user-email>/verify', () => {
  it('Mark a user as verified', async () => {
    const {
      user,
      token,
      userdetails,

    } = await getToken();

    const userData = {
      firstName: 'nanri',
      lastName: 'jri',
      email: 'helllen@gmail.com',
      password: 'hellouiu780',
      address: 'ikoyi lagos',
      bvn: '22307087690',
    };
    const details = await userModel.create(userData);
    await userModel.updateAdminStatus(user.email);
    const solution = await request(app).patch(`/api/v1/users/${details.rows[0].email}/verify`).set('token', token);
    assert.ok(solution.body.message);
    assert.equal(solution.status, 200);

  });
  it('Mark a user as verified returns 401`', async () => {
    const params = '827350';
    const { body, status } = await request(app).patch(`/api/v1/users/${params}/verify`);
    assert.ok(body.error);
    assert.equal(status, 401);
  });
  it('Mark a user as verified returns 404', async () => {
    const {
      user,
      token,
    } = await getToken();
    await userModel.updateAdminStatus(user.email);
    const params = 'jiiioy@gmail.com';
    const { body, status } = await request(app).patch(`/api/v1/users/${params}/verify`).set('token', token);
    assert.ok(body.error);
    assert.equal(status, 404);
    assert.equal(body.error, 'User does not exist');
  });
  it('Mark a user as verified fails with 422', async () => {
    const userDataz = {
      firstName: 'j',
      lastName: 'ujuri',
      email: 'joy@gmail.com',
      password: 'hello78090',
      address: 'ikeja Gra',
      bvn: '22307087690',
    };
    const result = await userModel.create(userDataz);
    const newUser = result.rows[0];
    const { user, token } = await getToken();
    await userModel.updateAdminStatus(user.email);
    const resultData = await request(app).patch(`/api/v1/users/${newUser.email}2/verify`).set('token', token);
    assert.ok(resultData.body.error);
  });
});
describe('PATCH /loans/:id', () => {
  it('Approve loan request and request for loan', async () => {
    const {
      user,
      token,
      userdetails,
    } = await getToken();

    await userModel.updateAdminStatus(user.email);
    const loanData = {
      amount: 12000,
      tenor: 3,
      loanType: 'BD',
      accountNo: '2048801364',
      userId: userdetails.id,
    };

    const newLoan = await loanModel.create({ ...loanData, userId: userdetails.id });

    const { body } = await request(app).patch(`/api/v1/loans/${newLoan.rows[0].id}`).set('token', token).send({ status: 'approved' });
    assert.ok(body.data);
    assert.equal(body.status, 200);
  });
  it('Approve or reject a loan application', async () => {
    const {
      user,
      token,
    } = await getToken();
    await userModel.updateAdminStatus(user.email);
    const payload = {
      status: 'rejected',
    };
    const params = '827350';
    const { body, status } = await request(app).patch(`/api/v1/loans/${params}`).send(payload).set('token', token);

    assert.equal(body.error, 'Loan application does not exist');
    assert.equal(status, 404);
  });
});
describe('POST /loans/:id/repayment', () => {
  it('Approve loan request and request for loan', async () => {
    const {
      user,
      token,
      userdetails
    } = await getToken();
    const userData = {
      firstName: 'nanri',
      lastName: 'jri',
      email: 'helon@gmail.com',
      password: 'hello78090',
      address: 'ikoyi lagos',
      bvn: '22307087690',
    };


    const loanData = {
      amount: 12000,
      tenor: 3,
      loanType: 'BD',
      accountNo: '2048801364',
    };

    const newLoan = await loanModel.create({ ...loanData, userId: userdetails.id });
    await userModel.updateAdminStatus(user.email);
    const repaymentData = {
      loanId: newLoan.rows[0].id,
      paidAmount: newLoan.rows[0].paymentinstallment,
    };
    const { body } = await request(app).patch(`/api/v1/loans/${newLoan.rows[0].id}`).set('token', token).send({ status: 'approved' });
    const { respo } = await request(app).post(`/api/v1/loans/${newLoan.rows[0].id}/repayment/`).set('token', token).send(repaymentData);

    assert.ok(body.data);
    assert.equal(body.status, 200);
  });
  it('Approve loan request and request for loan 400', async () => {
    const {
      user,
      token,
      userdetails,
    } = await getToken();

    await userModel.updateAdminStatus(user.email);
    const loanData = {
      amount: 1000,
      tenor: 1,
      loanType: 'BD',
      accountNo: '2048801364',
    };

    const newLoan = await loanModel.create({ ...loanData, userId: userdetails.id });

    const repaymentData = {
      amount: 10000,
      paidAmount: 40,
    };
    const { body } = await request(app).patch(`/api/v1/loans/${newLoan.rows[0].id}`).set('token', token).send({ status: 'approved' });
    await request(app).post(`/api/v1/loans/${newLoan.rows[0].id}/repayment`).set('token', token).send(repaymentData);

    assert.ok(body.data);
    assert.equal(body.status, 200);
  });
  it('Approve loan request and request for loan', async () => {
    const userData = {
      firstName: 'joy',
      lastName: 'ujuri',
      email: 'joy@gmail.com',
      password: 'hello78090',
      address: 'ikeja Gra',
      bvn: '22307087690',
    };

    const result = await userModel.create(userData);
    const newUser = result.rows[0];
    const {
      user,
      token,
    } = await getToken();

    await userModel.updateAdminStatus(user.email);
    const loanData = {
      amount: 12000,
      tenor: 3,
      loanType: 'BD',
      accountNo: '2048801364',
    };

    const newLoan = await loanModel.create({ ...loanData, userId: newUser.id });

    const repaymentData = {
      loanId: newLoan.rows[0].id,
      paidAmount: 2300000,
    };
    const { body } = await request(app).patch(`/api/v1/loans/${newLoan.rows[0].id}`).set('token', token).send({ status: 'approved' });

    await repaymentModel.create(repaymentData);
    assert.ok(body.data);
    assert.equal(body.status, 200);
  });
  it('Approve or reject a loan application', async () => {
    const { user, token } = await getToken();
    await userModel.updateAdminStatus(user.email);
    const payload = {
      status: 'rejected',
    };
    const params = '827350';
    const { body, status } = await request(app).patch(`/api/v1/loans/${params}`).send(payload).set('token', token);

    assert.equal(body.error, 'Loan application does not exist');
    assert.equal(status, 404);
  });
});
