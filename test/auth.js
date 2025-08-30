/* eslint handle-callback-err: "off"*/

process.env.NODE_ENV = 'test'

const User = require('../app/models/user')
const { faker } = require('@faker-js/faker')
const request = require('supertest')
const { expect } = require('chai')
const server = require('../server')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345'
}
let token = ''
const createdID = []
let verification = ''
let verificationForgot = ''
const email = faker.internet.email()
const failedLoginAttempts = 5
const badUser = {
  name: 'Bad user',
  email: 'bad@user.com',
  password: '54321'
}
const badLoginDetails = {
  email: 'bad@user.com',
  password: '12345'
}

describe('*********** AUTH ***********', () => {
  describe('/GET /', () => {
    it('should GET home API url', async () => {
      await request(server).get('/').expect(200)
    })
  })

  describe('/GET /404url', () => {
    it('should GET 404 url', async () => {
      const response = await request(server)
        .get('/404url')
        .expect(404)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
    })
  })

  describe('/POST login', () => {
    it('should GET token', async () => {
      const response = await request(server)
        .post('/login')
        .send(loginDetails)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('token')
      token = response.body.token
    })
  })

  describe('/POST register', () => {
    it('should POST register', async () => {
      const user = {
        name: faker.lorem.words(),
        email,
        password: faker.lorem.words()
      }
      const response = await request(server)
        .post('/register')
        .send(user)
        .expect(201)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.include.keys('token', 'user')
      createdID.push(response.body.user._id)
      verification = response.body.user.verification
    })
    it('should NOT POST a register if email already exists', async () => {
      const user = {
        name: faker.lorem.words(),
        email,
        password: faker.lorem.words()
      }
      const response = await request(server)
        .post('/register')
        .send(user)
        .expect(422)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('errors')
    })
  })

  describe('/POST verify', () => {
    it('should POST verify', async () => {
      const response = await request(server)
        .post('/verify')
        .send({
          id: verification
        })
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.include.keys('email', 'verified')
      expect(response.body.verified).to.equal(true)
    })
  })

  describe('/POST forgot', () => {
    it('should POST forgot', async () => {
      const response = await request(server)
        .post('/forgot')
        .send({
          email
        })
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.include.keys('msg', 'verification')
      verificationForgot = response.body.verification
    })
  })

  describe('/POST reset', () => {
    it('should POST reset password', async () => {
      const response = await request(server)
        .post('/reset')
        .send({
          id: verificationForgot,
          password: '12345'
        })
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('msg', 'PASSWORD_CHANGED')
    })
  })

  describe('/GET token', () => {
    it('should NOT be able to consume the route since no token was sent', async () => {
      await request(server).get('/token').expect(401)
    })
    it('should GET a fresh token', async () => {
      const response = await request(server)
        .get('/token')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('token')
    })
  })

  describe('/POST register', () => {
    it('should POST register', async () => {
      const response = await request(server)
        .post('/register')
        .send(badUser)
        .expect(201)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.include.keys('token', 'user')
      createdID.push(response.body.user._id)
    })
  })

  describe('/POST login', () => {
    for (let x = 1; x < failedLoginAttempts + 1; x++) {
      it(`should NOT POST login after password fail #${x}`, async () => {
        const response = await request(server)
          .post('/login')
          .send(badLoginDetails)
          .expect(409)
          .expect('Content-Type', /json/)

        expect(response.body).to.be.an('object')
        expect(response.body)
          .to.have.property('errors')
          .that.has.property('msg')
        expect(response.body.errors).to.have.property('msg', 'WRONG_PASSWORD')
      })
    }

    it('should NOT POST login after password fail #6 and be blocked', async () => {
      const response = await request(server)
        .post('/login')
        .send(badLoginDetails)
        .expect(409)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('errors').that.has.property('msg')
      expect(response.body.errors).to.have.property('msg', 'BLOCKED_USER')
    })

    it('should NOT POST login after being blocked sending post with correct password', async () => {
      const response = await request(server)
        .post('/login')
        .send({
          email: badUser.email,
          password: badUser.password
        })
        .expect(409)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('errors').that.has.property('msg')
      expect(response.body.errors).to.have.property('msg', 'BLOCKED_USER')
    })
  })
  after(async () => {
    for (const id of createdID) {
      try {
        await User.findByIdAndDelete(id)
      } catch (err) {
        console.log(err)
      }
    }
  })
})
